import { checkSession } from '../features/auth.js';
import { loadProjectDetail, editProject, removeProject } from '../features/projects.js';
import { addProjectMember, loadProjectMembers, handleMemberClick } from '../features/members.js';
import { addTask, loadProjectTasks, editTask, removeTask, handleTaskClick, fillEditTaskForm } from '../features/tasks.js';
import { addComment, loadComments, resetCommentsPanel } from '../features/comments.js';
import { showError } from '../shared/ui.js';
import { elements } from '../shared/dom.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { state } from '../core/state.js';

export async function initProjectDetailPage() {
    if (!elements.projectDetail) {
        return;
    }
    
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const projectId = pathParts[pathParts.length - 1];
    
    if (!projectId) {
        console.error('Project ID not found in URL');
        showError(elements.projectDetailError, 'Project ID is missing. Please try again.');
        return;
    }
    
    const user = await checkSession();
    
    if (!user) {
        window.location.replace(PAGE_ROUTES.home + "#login");
        return;
    }

    if (elements.logoutButton) {
        elements.logoutButton.hidden = false;
    }

    let selectedTaskId = null;
    
    await loadProjectDetail(projectId);
    
    const members = await loadProjectMembers(projectId);

    const currentMember = members.find((member) => {
        return member.username === user.username;
    });

    const canManageMembers = !!currentMember;

    if (elements.showAddMemberFormButton) {
        elements.showAddMemberFormButton.hidden = !canManageMembers;
    }
    await loadProjectTasks(projectId);
    await loadComments(projectId, 'project');
    
    elements.editProjectButton?.addEventListener('click', () => {
        elements.editProjectForm.hidden = false;
    });

    elements.editProjectForm?.addEventListener('submit', (event) => {
        editProject(event, projectId);
    });

    elements.cancelEditButton?.addEventListener('click', () => {
        elements.editProjectForm.hidden = true;
    });

    elements.deleteProjectButton?.addEventListener('click', (event) => {
        removeProject(event, projectId);
    });

    elements.showAddMemberFormButton?.addEventListener('click', () => {
        elements.addMemberForm.hidden = false;
    });

    elements.addMemberForm?.addEventListener('submit', (event) => {
        addProjectMember(event, projectId);
    });

    elements.membersList?.addEventListener('click', (event) => {
        handleMemberClick(event, projectId);
    });

    elements.cancelAddMemberButton?.addEventListener('click', () => {
        elements.addMemberForm.hidden = true;
    });

    elements.showCreateTaskFormButton?.addEventListener('click', () => {
        elements.createTaskForm.hidden = false;

        selectedTaskId = null;
        state.selectedTask = null;

        loadProjectTasks(projectId);

        elements.taskDetailPanel.hidden = true;
    });

    elements.cancelCreateTaskButton?.addEventListener('click', () => {
        elements.createTaskForm.hidden = true;

        state.selectedTask = null;
        selectedTaskId = null;

        loadProjectTasks(projectId);
    });

    elements.createTaskForm?.addEventListener('submit', (event) => {
        addTask(event, projectId);
    });

    elements.tasksList?.addEventListener('click', async (event) => {
        const taskRow = event.target.closest('[data-task-id]');

        if (!taskRow) return;

        const clickedTaskId = taskRow.dataset.taskId;
        const action = event.target.dataset.taskAction;

        if (action === 'delete') {
            await removeTask(projectId, clickedTaskId);
            selectedTaskId = null;
            await loadComments(projectId, 'project');
            return;
        }

        if (action === 'edit') {
            const task = state.tasks.find(t => t.id === clickedTaskId);
            if (task) {
                fillEditTaskForm(task);
                elements.editTaskForm.hidden = false;
            }
            return;
        }

        if (selectedTaskId === clickedTaskId) {
            selectedTaskId = null;

            state.selectedTask = null;

            elements.taskDetailPanel.hidden = true;

            await loadProjectTasks(projectId);

            await loadComments(projectId, 'project');
            
            return;
        }
        
        selectedTaskId = clickedTaskId;

        await handleTaskClick(event, projectId);
        await loadComments(selectedTaskId, 'task');
    });

    elements.editTaskForm?.addEventListener('submit', (event) => {
        if (!selectedTaskId) {
            showError(elements.editTaskError, 'Select a task before editing.');
            return;
        }

        editTask(event, projectId, selectedTaskId);
    });

    elements.cancelEditTaskButton?.addEventListener('click', () => {
        elements.editTaskForm.hidden = true;
    });

    /*elements.deleteTaskButton?.addEventListener('click', async () => {
        if (!selectedTaskId) {
            showError(elements.editTaskError, 'Select a task before deleting.');
            return;
        }

        await removeTask(projectId, selectedTaskId);
        selectedTaskId = null;
        await loadComments(projectId, 'project');
    });*/

    elements.addCommentForm?.addEventListener('submit', (event) => {
        const id = selectedTaskId ? selectedTaskId : projectId;
        addComment(event, id);
    });
}
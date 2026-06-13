import { checkSession } from '../features/auth.js';
import { loadProjectDetail, editProject, removeProject } from '../features/projects.js';
import { addProjectMember, loadProjectMembers, handleMemberClick } from '../features/members.js';
import { addTask, loadProjectTasks, editTask, removeTask, handleTaskClick } from '../features/tasks.js';
import { addComment, loadComments, resetCommentsPanel } from '../features/comments.js';
import { showError } from '../shared/ui.js';
import { elements } from '../shared/dom.js';
import { PAGE_ROUTES } from '../core/routes.js';

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

    let selectedTaskId = null;
    
    await loadProjectDetail(projectId);
    
    const members = await loadProjectMembers(projectId);

    const currentMember = members.find((member) => {
        return member.username === user.username;
    });

    const canManageMembers = currentMember?.role === 'admin';

    if (elements.showAddMemberFormButton) {
        elements.showAddMemberFormButton.hidden = !canManageMembers;
    }
    await loadProjectTasks(projectId);
    resetCommentsPanel();
    
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

    elements.showCreateTaskFormButton?.addEventListener('click', () => {
        elements.createTaskForm.hidden = false;
    });

    elements.createTaskForm?.addEventListener('submit', (event) => {
        addTask(event, projectId);
    });

    elements.tasksList?.addEventListener('click', async (event) => {
        const taskRow = event.target.closest('[data-task-id]');

        if (!taskRow) return;

        selectedTaskId = taskRow.dataset.taskId;
        await handleTaskClick(event, projectId);

        if (event.target.dataset.taskAction === 'delete') {
            selectedTaskId = null;
            resetCommentsPanel();
            return;
        }
        await loadComments(selectedTaskId);
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

    elements.deleteTaskButton?.addEventListener('click', async () => {
        if (!selectedTaskId) {
            showError(elements.editTaskError, 'Select a task before deleting.');
            return;
        }

        await removeTask(projectId, selectedTaskId);
        selectedTaskId = null;
        resetCommentsPanel();
    });

    elements.addCommentForm?.addEventListener('submit', (event) => {
        addComment(event, selectedTaskId);
    });
}
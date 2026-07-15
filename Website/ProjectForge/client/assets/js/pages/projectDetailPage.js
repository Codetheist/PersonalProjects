import { checkSession } from '../features/auth.js';
import {
    loadProjectDetail,
    editProject,
    removeProject
} from '../features/projects.js';
import {
    addProjectMember,
    loadProjectMembers,
    handleMemberClick
} from '../features/members.js';
import {
    addTask,
    loadProjectTasks,
    loadTask,
    editTask,
    removeTask,
    handleTaskClick,
    fillEditTaskForm,
    populateAssigneeOptions
} from '../features/tasks.js';
import {
    addComment,
    loadComments,
    resetCommentsPanel,
    handleCommentActions
} from '../features/comments.js';
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
    let editingTaskId = null;
    
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

    // PROJECT EDIT / DELETE
    elements.editProjectButton?.addEventListener('click', () => {
        if (!elements.editProjectForm.hidden) {
            elements.editProjectForm.hidden = true;
            return;
        }
        elements.editProjectName.value = state.selectedProject.name ?? '';
        elements.editProjectDescription.value = state.selectedProject.description ?? '';
        elements.editProjectStatus.value = state.selectedProject.status ?? 'active';
        elements.editProjectDueDate.value = state.selectedProject.due_date ?? '';
        elements.editProjectForm.hidden = false;
    });

    elements.editProjectForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const updatedData = {
            name: elements.editProjectForm.name.value,
            description: elements.editProjectForm.description.value,
            status: elements.editProjectForm.status.value,
        };
        
        const dueDate = elements.editProjectForm.due_date.value;
        
        if (dueDate) {
            updatedData.due_date = dueDate;
        }

        editProject(projectId, updatedData);
        window.location.href = `${PAGE_ROUTES.projects}/${projectId}`;
    });

    elements.cancelEditButton?.addEventListener('click', () => {
        elements.editProjectForm.hidden = true;
    });

    elements.deleteProjectButton?.addEventListener('click', () => {
        removeProject(projectId);
    });


    // MEMBERS
    elements.showAddMemberFormButton?.addEventListener('click', () => {
        elements.addMemberForm.hidden = false;
    });

    elements.addMemberForm?.addEventListener('submit', (event) => {
        addProjectMember(event, projectId);
    });

    elements.cancelAddMemberButton?.addEventListener('click', () => {
        elements.addMemberForm.hidden = true;
    });

    elements.cancelMemberButton?.addEventListener('click', () => {
        elements.addMemberForm.hidden = true;
    });

    elements.membersList?.addEventListener('click', (event) => {
        handleMemberClick(event, projectId);
    });


    // TASK CREATION
    elements.showCreateTaskFormButton?.addEventListener('click', () => {
        elements.createTaskForm.hidden = false;

        selectedTaskId = null;
        state.selectedTask = null;

        populateAssigneeOptions(elements.createTaskAssignedTo);

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


    // TASK LIST / ACTIONS
    elements.tasksList?.addEventListener('click', async (event) => {
        const taskRow = event.target.closest('[data-task-id]');
        if (!taskRow) return;

        const clickedTaskId = taskRow.dataset.taskId;
        const actionButton = event.target.closest('[data-task-action]');
        
        if (actionButton) {
            event.stopPropagation();
        }

        const action = actionButton?.dataset.taskAction;

        if (action === 'delete') {
            await removeTask(projectId, clickedTaskId);
            selectedTaskId = null;
            await loadComments(projectId, 'project');
            return;
        }

        if (action === 'edit') {
            const task = state.tasks.find(t => String(t.id) === clickedTaskId);

            if (!task) return;

            if (!elements.editTaskForm.hidden) {
                elements.editTaskForm.hidden = true;
                elements.taskDetailPanel.hidden = true;
                elements.taskDetailInfo.hidden = false;
                editingTaskId = null;
                selectedTaskId = null;
                return;
            }

            selectedTaskId = clickedTaskId;
            elements.taskDetailPanel.hidden = false;
            elements.taskDetailInfo.hidden = true;
            fillEditTaskForm(task);
            elements.editTaskForm.hidden = false;
            editingTaskId = clickedTaskId;

            return;
        }

        if (selectedTaskId === clickedTaskId) {
            selectedTaskId = null;
            state.selectedTask = null;

            editingTaskId = null;

            elements.taskDetailPanel.hidden = true;
            elements.editTaskForm.hidden = true;

            await loadProjectTasks(projectId);
            await loadComments(projectId, 'project');
            return;
        }

        selectedTaskId = clickedTaskId;

        await handleTaskClick(event, projectId);

        elements.editTaskForm.hidden = true;

        await loadComments(selectedTaskId, 'task');
    });


    // TASK EDIT
    elements.editTaskForm?.addEventListener('submit', (event) => {
        if (!editingTaskId) {
            showError(elements.editTaskError, 'Select a task before editing.');
            return;
        }

        editTask(event, projectId, editingTaskId);
    });

    elements.cancelEditTaskButton?.addEventListener('click', () => {
        editingTaskId = null;
        selectedTaskId = null;
        elements.editTaskForm.hidden = true;
        elements.taskDetailPanel.hidden = true;
        elements.taskDetailInfo.hidden = false;
    });


    // COMMENTS
    elements.addCommentForm?.addEventListener('submit', (event) => {
        const id = selectedTaskId ? selectedTaskId : projectId;
        addComment(event, id);
    });

    elements.commentsList?.addEventListener('click', (event) => {
        handleCommentActions(event);
    });

    document.title = `Project | ${state.selectedProject.name}`;
}
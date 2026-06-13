// Tasks
import { createTask, listTasks, getTaskDetail, updateTask, deleteTask } from '../api/tasksApi.js';
import { showError, clearError, setSubmitState } from '../shared/ui.js';
import { elements } from '../shared/dom.js';

export async function addTask(event, projectId) {
    event.preventDefault();

    const form = event.target;
    const taskData = {
        title: form.title.value,
        description: form.description.value,
        status: form.status.value,
        priority: form.priority.value,
        due_date: form.due_date.value || null
    };

    setSubmitState(form, true);
    clearError(elements.createTaskError);

    try {
        const result = await createTask(projectId, taskData);

        if (!result.ok) {
            console.error('Task creation failed:', result.data?.message || 'Unknown error');
            showError(elements.createTaskError, 'An error occurred while creating the task. Please try again.');
            return null;
        }

        form.reset();
        form.hidden = true;
        await loadProjectTasks(projectId);
        renderTaskDetail(result.data.task);
        elements.taskDetailPanel.hidden = false;
        return result.data.task;
    } catch (error) {
        console.error('Error creating task:', error);
        showError(elements.createTaskError, 'An error occurred while creating the task. Please try again.');
        return null;
    } finally {
        setSubmitState(form, false);
    }
}

export async function loadProjectTasks(projectId) {
    try {
        const result = await listTasks(projectId);
        if (!result.ok) {
            console.error('Failed to load tasks:', result.data?.message || 'Unknown error');
            showError(elements.projectDetailError, 'An error occurred while loading tasks. Please try again.');
            return;
        }

        const tasks = result.data?.tasks || [];
        renderTaskList(tasks);

        return tasks;
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError(elements.projectDetailError, 'An error occurred while loading tasks. Please try again.');
        return [];
    }
}

export async function loadTask(projectId, taskId) {
    try {
        const result = await getTaskDetail(projectId, taskId);
        if (!result.ok) {
            console.error('Failed to load task:', result.data?.message || 'Unknown error');
            showError(elements.editTaskError, 'An error occurred while loading the task. Please try again.');
            return null;
        }
        renderTaskDetail(result.data.task);
        elements.taskDetailPanel.hidden = false;
        return result.data.task;
    } catch (error) {
        console.error('Error loading task:', error);
        showError(elements.editTaskError, 'An error occurred while loading the task. Please try again.');
        return null;
    }
}

export async function editTask(event, projectId, taskId) {
    event.preventDefault();
    const form = event.target;
    const updates = {
        title: form.title.value,
        description: form.description.value,
        status: form.status.value,
        priority: form.priority.value,
        due_date: form.due_date.value || null
    };

    setSubmitState(form, true);
    clearError(elements.editTaskError);

    try {
        const result = await updateTask(projectId, taskId, updates);

        if (!result.ok) {
            console.error('Task update failed:', result.data?.message || 'Unknown error');
            showError(elements.editTaskError, 'An error occurred while updating the task. Please try again.');
            return;
        }
        
        elements.editTaskForm.hidden = true;
        renderTaskDetail(result.data.task);
        await loadProjectTasks(projectId);
    } catch (error) {
        console.error('Error updating task:', error);
        showError(elements.editTaskError, 'An error occurred while updating the task. Please try again.');
    } finally {
        setSubmitState(form, false);
    }
}

export async function removeTask(projectId, taskId) {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
        return;
    }

    try {
        const result = await deleteTask(projectId, taskId);

        if (!result.ok) {
            console.error('Task deletion failed:', result.data?.message || 'Unknown error');
            showError(elements.createTaskError, 'An error occurred while deleting the task. Please try again.');
            return;
        }

        elements.taskDetailPanel.hidden = true;
        await loadProjectTasks(projectId);
    } catch (error) {
        console.error('Error deleting task:', error);
        showError(elements.createTaskError, 'An error occurred while deleting the task. Please try again.');
    }
}

export async function handleTaskClick(event, projectId) {
    const taskRow = event.target.closest('[data-task-id]');
    
    if (!taskRow) return;
    
    const taskId = taskRow.dataset.taskId;
    const action = event.target.dataset.taskAction || 'view';

    if (!taskId) {
        console.error('Task ID not found on clicked element');
        return;
    }
    if (action === 'delete') {
        await removeTask(projectId, taskId);
        return;
    }
    
    const task = await loadTask(projectId, taskId);
    
    if (action === 'edit' && task) {
        fillEditTaskForm(task);
        elements.editTaskForm.hidden = false;
    }
}

function fillEditTaskForm(task) {
    elements.editTaskTitle.value = task.title || '';
    elements.editTaskDescription.value = task.description || '';
    elements.editTaskStatus.value = task.status || 'todo';
    elements.editTaskPriority.value = task.priority || 'medium';
    elements.editTaskDueDate.value = task.due_date || '';
}

function renderTaskDetail(task) {
    elements.taskDetailTitle.textContent = task.title;
    elements.taskDetailDescription.textContent = task.description;
    elements.taskDetailStatus.textContent = task.status;
    elements.taskDetailPriority.textContent = task.priority;
    elements.taskDetailDueDate.textContent = task.due_date
        ? new Date(task.due_date).toLocaleDateString()
        : 'No due date';
}

function renderTaskList(tasks) {
    if (!elements.tasksList) return;

    elements.tasksList.innerHTML = '';

    if (!tasks.length) {
        elements.tasksList.innerHTML = `
            <p class="empty-state">No tasks yet.</p>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();

    tasks.forEach(task => {
        const taskRow = document.createElement('div');
        taskRow.className = 'data-list-item task-item';
        taskRow.dataset.taskId = task.id;
        taskRow.innerHTML = `
            <div class="item-content">
                <span class="item-title">${task.title}</span>

                <span class="item-meta">
                    Due: ${formatTaskDate(task.due_date)} · Priority: ${task.priority}
                </span>

                <span class="status-pill status-${getTaskStatusClass(task.status)}">
                    ${formatTaskStatus(task.status)}
                </span>
            </div>

            <div class="item-actions" aria-label="Task actions">
                <button type="button" class="buttonLook btn btn-small" data-task-action="view">
                    View
                </button>

                <button type="button" class="buttonLook btn btn-small" data-task-action="edit">
                    Edit
                </button>

                <button type="button" class="buttonLook btn btn-small secondaryButton btn-danger" data-task-action="delete">
                    Delete
                </button>
            </div>
        `;
        fragment.appendChild(taskRow);
    });

    elements.tasksList.appendChild(fragment);
}

function formatTaskDate(dateString) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatTaskStatus(status) {
    const labels = {
        todo: 'To Do',
        doing: 'Doing',
        done: 'Done'
    };
    return labels[status] || status;
}

function getTaskStatusClass(status) {
    const classes = {
        todo: 'pending',
        doing: 'active',
        done: 'complete'
    };
    return classes[status] || 'pending';
}
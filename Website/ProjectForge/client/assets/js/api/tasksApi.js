// API routes for task management
import { readJson } from '../shared/util.js';

const TASK_ROUTES = {
    create: (projectId) => `/api/projects/${projectId}/tasks`,
    list: (projectId) => `/api/projects/${projectId}/tasks`,
    detail: (projectId, taskId) => `/api/projects/${projectId}/tasks/${taskId}`,
    update: (projectId, taskId) => `/api/projects/${projectId}/tasks/${taskId}`,
    delete: (projectId, taskId) => `/api/projects/${projectId}/tasks/${taskId}`
}

// Task API functions
export async function createTask(projectId, taskData) {
    const response = await fetch(TASK_ROUTES.create(projectId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(taskData)
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function listTasks(projectId) {
    const response = await fetch(TASK_ROUTES.list(projectId), {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'same-origin'
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function getTaskDetail(projectId, taskId) {
    const response = await fetch(TASK_ROUTES.detail(projectId, taskId), {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'same-origin'
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function updateTask(projectId, taskId, taskData) {
    const response = await fetch(TASK_ROUTES.update(projectId, taskId), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(taskData)
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function deleteTask(projectId, taskId) {
    const response = await fetch(TASK_ROUTES.delete(projectId, taskId), {
        method: 'DELETE',
        credentials: 'same-origin'
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}
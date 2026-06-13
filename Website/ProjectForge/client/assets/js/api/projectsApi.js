// API routes for project management
import { readJson } from '../shared/util.js';

const PROJECT_ROUTES = {
    create: '/api/projects',
    list: '/api/projects',
    detail: (projectId) => `/api/projects/${projectId}`,
    update: (projectId) => `/api/projects/${projectId}`,
    delete: (projectId) => `/api/projects/${projectId}`
}

// Project API functions
export async function createProject(projectData) {
    const response = await fetch(PROJECT_ROUTES.create, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(projectData)
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function listProjects() {
    const response = await fetch(PROJECT_ROUTES.list, {
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

export async function getProjectDetail(projectId) {
    const response = await fetch(PROJECT_ROUTES.detail(projectId), {
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

export async function updateProject(projectId, projectData) {
    const response = await fetch(PROJECT_ROUTES.update(projectId), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(projectData)
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function deleteProject(projectId) {
    const response = await fetch(PROJECT_ROUTES.delete(projectId), {
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
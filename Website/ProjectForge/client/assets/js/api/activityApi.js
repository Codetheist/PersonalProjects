// API routes for activity logging
import { readJson } from '../shared/util.js';

const ACTIVITY_ROUTES = {
    getByProject: (projectId) => `/api/activity/project/${projectId}`,
    activity: '/api/activity',
}

// Activity API functions
export async function getActivityByProject(projectId) {
    const response = await fetch(ACTIVITY_ROUTES.getByProject(projectId), {
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

export async function getRecentActivity() {
    const response = await fetch(ACTIVITY_ROUTES.activity, {
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


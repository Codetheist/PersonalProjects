// API routes for comment management
import { readJson } from '../shared/util.js';

const COMMENT_ROUTES = {
    create: (taskId) => `/api/tasks/${taskId}/comments`,
    list: (taskId) => `/api/tasks/${taskId}/comments`,
    update: (commentId) => `/api/comments/${commentId}`,
    delete: (commentId) => `/api/comments/${commentId}`
}

// Comment API functions
export async function createComment(taskId, commentData) {
    const response = await fetch(COMMENT_ROUTES.create(taskId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(commentData)
    });

    const data = await readJson(response);
    
    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function listComments(taskId) {
    const response = await fetch(COMMENT_ROUTES.list(taskId), {
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

export async function updateComment(commentId, commentData) {
    const response = await fetch(COMMENT_ROUTES.update(commentId), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(commentData)
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function deleteComment(commentId) {
    const response = await fetch(COMMENT_ROUTES.delete(commentId), {
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
// API routes for member management
import { readJson } from '../shared/util.js';

const MEMBER_ROUTES = {
    create: (projectId) => `/api/projects/${projectId}/members`,
    list: (projectId) => `/api/projects/${projectId}/members`,
    update: (projectId, memberId) => `/api/projects/${projectId}/members/${memberId}`,
    delete: (projectId, memberId) => `/api/projects/${projectId}/members/${memberId}`
}

// Member API functions
export async function addMember(projectId, memberData) {
    const response = await fetch(MEMBER_ROUTES.create(projectId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(memberData)
    });

    const data = await readJson(response);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function listMembers(projectId) {
    const response = await fetch(MEMBER_ROUTES.list(projectId), {
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

export async function updateMember(projectId, memberId, memberData) {
    const response = await fetch(MEMBER_ROUTES.update(projectId, memberId), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(memberData)
    });

    const data = await readJson(response);
    
    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function deleteMember(projectId, memberId) {
    const response = await fetch(MEMBER_ROUTES.delete(projectId, memberId), {
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
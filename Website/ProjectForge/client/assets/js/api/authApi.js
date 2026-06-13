// API routes for authentication
import { readJson } from '../shared/util.js';

const AUTH_ROUTES = {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me'
}

// Authentication API functions
export async function registerUser(userData) {
    const response = await fetch(AUTH_ROUTES.register, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(userData)
    });
    
    const data = await readJson(response);
    
    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function loginUser(loginData) {
    const response = await fetch(AUTH_ROUTES.login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(loginData)
    });

    const data = await readJson(response);
    
    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function logoutUser() {
    const response = await fetch(AUTH_ROUTES.logout, {
        method: 'POST',
        credentials: 'same-origin'
    });

    const data = await readJson(response);
    
    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function currentUser() {
    const response = await fetch(AUTH_ROUTES.me, {
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
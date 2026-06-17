// Authentication
import { registerUser, loginUser, logoutUser, currentUser } from '../api/authApi.js';
import { showError, clearError, setSubmitState } from '../shared/ui.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { elements } from '../shared/dom.js';
import { state } from '../core/state.js';

// Register, Login, Logout, Check Session, Require Auth functions
export async function register(event) {
    event?.preventDefault?.();
    

    clearError(elements.registerError);

    if (!elements.registerUsernameInput || !elements.registerEmailInput || !elements.registerPasswordInput) {
        showError(elements.registerError, 'Registration form is missing required fields');
        return;
    }

    const userData = {
        username: elements.registerUsernameInput.value.trim(),
        email: elements.registerEmailInput.value.trim(),
        password: elements.registerPasswordInput.value
    };

    try {
        setSubmitState(elements.registrationForm, true);

        const result = await registerUser(userData);

        if (!result.ok) {
            showError(elements.registerError, result.data?.message || 'Registration failed');
            return;
        }
        
        window.location.replace(PAGE_ROUTES.dashboard);
    } catch (error) {
        console.error('Error registering user:', error);
        showError(elements.registerError, 'An error occurred during registration. Please try again.');
    } finally {
        setSubmitState(elements.registrationForm, false);
    }
}

export async function login(event) {
    event?.preventDefault?.();
    
    clearError(elements.loginError);
    
    if (!elements.loginIdentifierInput || !elements.loginPasswordInput) {
        showError(elements.loginError, 'Login form is missing required fields');
        return;
    }
    
    const loginData = {
        identifier: elements.loginIdentifierInput.value.trim(),
        password: elements.loginPasswordInput.value
    };

    try {
        setSubmitState(elements.loginForm, true);

        const result = await loginUser(loginData);

        if (!result.ok) {
            showError(elements.loginError, result.data?.message || 'Login failed');
            return;
        }

        state.user = result.data.user;
        
        window.location.replace(PAGE_ROUTES.dashboard);
    } catch (error) {
        console.error('Error logging in user:', error);
        showError(elements.loginError, 'An error occurred during login. Please try again.');
    } finally {
        setSubmitState(elements.loginForm, false);
    }
}

export async function logout(event) {
    event?.preventDefault?.();
    const logoutButton = event?.currentTarget || elements.logoutButton;
    let loggedOut = false;
    
    if (logoutButton) {
        logoutButton.disabled = true;
    }

    try {
        const result = await logoutUser();

        if (!result.ok) {
            console.error('Logout failed:', result.data?.message || 'Unknown error');
            return;
        }

        loggedOut = true;

        state.user = null;

        window.location.replace(PAGE_ROUTES.home);
    } catch (error) {
        console.error('Error logging out user:', error);
    } finally {
        if (logoutButton && !loggedOut) {
            logoutButton.disabled = false;
        }
    }
}

export async function checkSession() {
    try {
        const result = await currentUser();

        if (!result.ok) {
            return null;
        }

        state.user = result.data.user || null;
        
        return state.user;
    } catch (error) {
        console.error('Error checking session:', error);
        return null;
    }
}

async function requireAuth() {
    const user = await checkSession();
    if (!user) {
        window.location.replace(PAGE_ROUTES.home);
        return null;
    }
    return user;
}

async function syncAuthState() {
    
if (!elements.isHomePage) return;

    const user = await checkSession();

    if (user) {
        // hide existing buttons
        elements.signUpButton?.setAttribute('hidden', '');
        elements.loginButton?.setAttribute('hidden', '');

        // create/show dashboard + logout ONLY once
        if (!elements.dashboardButton) {
            const dashboardLink = document.createElement('a');
            dashboardLink.href = PAGE_ROUTES.dashboard;
            dashboardLink.className = 'buttonLook primaryButton';
            dashboardLink.textContent = 'Dashboard';
            dashboardLink.id = 'dashboardButton';

            elements.authButtons.appendChild(dashboardLink);
            elements.dashboardButton = dashboardLink;
        }

        if (!elements.logoutButton) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'buttonLook secondaryButton';
            logoutBtn.textContent = 'Logout';
            logoutBtn.id = 'logoutButton';

            logoutBtn.addEventListener('click', logout);

            elements.authButtons.appendChild(logoutBtn);
            elements.logoutButton = logoutBtn;
        }

        elements.dashboardButton.hidden = false;
        elements.logoutButton.hidden = false;

        return;
    }

    // show original buttons again
    elements.signUpButton?.removeAttribute('hidden');
    elements.loginButton?.removeAttribute('hidden');

    // hide dynamic ones if they exist
    if (elements.dashboardButton) {
        elements.dashboardButton.hidden = true;
    }

    if (elements.logoutButton) {
        elements.logoutButton.hidden = true;
    }

}

// Initialization function to set up event listeners and initial state
export function initAuth() {
    elements.registrationForm?.addEventListener('submit', register);
    elements.loginForm?.addEventListener('submit', login);
    elements.logoutButton?.addEventListener('click', logout);
    
    syncAuthState();
}
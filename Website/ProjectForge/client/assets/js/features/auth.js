// Authentication
import {
    registerUser,
    loginUser,
    logoutUser,
    currentUser,
    changePassword,
    forgotPassword,
    resetPassword
} from '../api/authApi.js';
import {
    showError,
    clearError,
    setSubmitState
} from '../shared/ui.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { elements } from '../shared/dom.js';
import { state } from '../core/state.js';

/*
Authentication:
Register, Login, Logout, Session Management

Password Recovery:
Forgot Password, Reset Password

Account Security:
Change Password
 */
async function register(event) {
    event?.preventDefault?.();
    

    clearError(elements.registerError);

    if (!elements.registerUsername || !elements.registerEmail || !elements.registerPassword) {
        showError(elements.registerError, 'Registration form is missing required fields');
        return;
    }

    const userData = {
        username: elements.registerUsername.value.trim(),
        email: elements.registerEmail.value.trim(),
        password: elements.registerPassword.value
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
        showError(elements.registerError, 'An error occurred during registration. Please try again.');
    } finally {
        setSubmitState(elements.registrationForm, false);
    }
}

async function login(event) {
    event?.preventDefault?.();
    
    clearError(elements.loginError);
    
    if (!elements.loginIdentifier || !elements.loginPassword) {
        showError(elements.loginError, 'Login form is missing required fields');
        return;
    }
    
    const loginData = {
        identifier: elements.loginIdentifier.value.trim(),
        password: elements.loginPassword.value
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
        showError(elements.loginError, 'An error occurred during login. Please try again.');
    } finally {
        setSubmitState(elements.loginForm, false);
    }
}

async function logout(event) {
    event?.preventDefault?.();
    const logoutButton = event?.currentTarget || elements.logoutButton;
    let loggedOut = false;
    
    if (logoutButton) {
        logoutButton.disabled = true;
    }

    try {
        const result = await logoutUser();

        if (!result.ok) {
            return;
        }

        loggedOut = true;

        state.user = null;

        window.location.replace(PAGE_ROUTES.home);
    } catch (error) {
        return null;
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

        /*
        Create the avatar link for the user account settings. This is a placeholder for the actual implementation.
        <div class="nav-actions">
            <a href="/account" class="user-avatar-link" id="userAvatarBtn" aria-label="Account settings"></a>
        </div>
        */

        elements.dashboardButton.hidden = false;
        

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

export async function changeUserPassword(event) {
    event?.preventDefault?.();
    const formData = new FormData(event.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
        showError(elements.changePasswordError, 'Passwords do not match.');
        return;
    }
    
    const result = await changePassword({ currentPassword, newPassword, confirmPassword });
    
    if (!result.ok) {
        showError(elements.changePasswordError, result.data.message || 'Failed to change password.');
        return;
    }

    return result;
}

// Initialization function to set up event listeners and initial state
export function initAuth() {
    elements.registrationForm?.addEventListener('submit', register);
    elements.loginForm?.addEventListener('submit', login);
    elements.logoutButton?.addEventListener('click', logout);
    
    syncAuthState();
}
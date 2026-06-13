// UI
import { elements } from './dom.js';

// Helper functions for UI state management
export function showError(errorElement, message) {
    if (!errorElement) {
        return;
    }
    errorElement.textContent = message;
    errorElement.removeAttribute('hidden');
}

export function clearError(errorElement) {
    if (!errorElement) {
        return;
    }
    errorElement.textContent = '';
    errorElement.setAttribute('hidden', '');
}

// Helper function to disable/enable submit buttons during async operations
export function setSubmitState(form, isSubmitting) {
    if (!form) {
        return;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton) {
        submitButton.disabled = isSubmitting;
    }
}

// Functions to show/hide different UI sections based on authentication state
export function showAuthState(sectionName) {
    elements.landingView?.setAttribute('hidden', '');
    elements.authView?.removeAttribute('hidden');
    elements.registrationSection?.setAttribute('hidden', '');
    elements.loginSection?.setAttribute('hidden', '');

    if (sectionName === 'registration') {
        elements.registrationSection?.removeAttribute('hidden');
        return;
    }

    if (sectionName === 'login') {
        elements.loginSection?.removeAttribute('hidden');
    }
}

// Function to show the landing page view (for unauthenticated users)
export function showLandingState() {
    elements.landingView?.removeAttribute('hidden');
    elements.authView?.setAttribute('hidden', '');
    elements.registrationSection?.setAttribute('hidden', '');
    elements.loginSection?.setAttribute('hidden', '');
    elements.authView?.setAttribute('hidden', '');
    elements.registrationSection?.setAttribute('hidden', '');
    elements.loginSection?.setAttribute('hidden', '');
}
import {
    checkSession,
    changeUserPassword,
    updateUserProfile
} from '../features/auth.js';
import { elements } from '../shared/dom.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { state } from '../core/state.js';
import { showError } from '../shared/ui.js';

export async function initAccountPage() {
    if (!elements.profileSection) return;
    
    // Check if user is logged in, if not redirect to login page
    if (!await checkSession()) {
        window.location.replace(PAGE_ROUTES.home + "#login");
        return;
    }
    
    const user = await checkSession();
    
    // Query selector for all
    const navItems = document.querySelectorAll('.account-nav-item');
    const errorMessages = document.querySelectorAll('[data-error-for]');
    
    // Account — Navigation
    const sections = [
        elements.profileSection,
        elements.securitySection,
        elements.sessionsSection,
        elements.preferencesSection,
        elements.dangerSection
    ];
    
    navItems.forEach((navItem, index) => {
        navItem.addEventListener('click', () => {
            showSection(sections[index]);
            activeNavItem(navItem);
        });
    });
    
    function hideAllSections() {
        sections.forEach(section => section.classList.remove('active'));
    }
    
    function showSection(section) {
        hideAllSections();
        if (section) {
            section.classList.add('active');
        }
    }
    
    function activeNavItem(navItem) {
        navItems.forEach(item => item.classList.remove('active'));
        if (navItem) {
            navItem.classList.add('active');
        }
    }
    
    // Account — Initial State
    showSection(elements.profileSection);
    activeNavItem(navItems[0]);
    
    // Account — Sidebar
    /*
    TODO: Allow user to upload a custom avatar image
    
    let avatar;
    
    if (avatar) {
        elements.userAvatar.textContent = avatar;
        elements.sidebarUsername.textContent = user.username;
        elements.sidebarEmail.textContent = user.email;
    } else {
        elements.userAvatar.textContent = user.username.charAt(0).toUpperCase();
        elements.sidebarUsername.textContent = user.username;
        elements.sidebarEmail.textContent = user.email;
    }
    */
    
    elements.userAvatar.textContent = user.username.charAt(0).toUpperCase();
    elements.sidebarUsername.textContent = user.username;
    elements.sidebarEmail.textContent = user.email;
    
    if (elements.logoutButton) {
        elements.logoutButton.hidden = false;
    }
    
    // Account — Profile
    elements.profileDisplayName.value = user.username;
    elements.profileEmail.value = user.email;
    
    // Profile form submission
    elements.profileForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        
        errorMessages.forEach(errorMessage => errorMessage.textContent = '');
        
        const displayNameError = document.querySelector('[data-error-for="displayName"]');
        const emailError = document.querySelector('[data-error-for="email"]');
        
        let hasError = false;
        
        if (!elements.profileDisplayName.value.trim()) {
            showError(displayNameError, 'Please fill out the display name field.');
            hasError = true;
        }
        
        if (!elements.profileEmail.value.trim()) {
            showError(emailError, 'Please fill out the email field.');
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        const updatedProfile = {
            username: elements.profileDisplayName.value.trim(),
            email: elements.profileEmail.value.trim()
        };

        // Send profile update request
        updateUserProfile(updatedProfile).then(result => {
            if (result && result.ok) {
                elements.sidebarUsername.textContent = result.data.user.username;
                elements.sidebarEmail.textContent = result.data.user.email;
                elements.userAvatar.textContent =
                    result.data.user.username.charAt(0).toUpperCase();
                const successMessage = document.querySelector('[data-success-for="profile"]');
                if (successMessage) {
                    successMessage.textContent = 'Profile updated successfully.';
                }
            } else {
                const issue = result.data?.error?.issues?.[0];
                if (issue?.path === 'username') {
                    showError(displayNameError, issue.message);
                    return;
                }
                if (issue?.path === 'email') {
                    showError(emailError, issue.message);
                    return;
                }
                showError(displayNameError,
                    result.data?.error?.message || 'Failed to update profile.');
            }
        });
    });
    
    // Account — Security
    elements.changePasswordForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const changePasswordSuccess = document.querySelector('[data-success-for="security"]');
        
        if (changePasswordSuccess) {
            changePasswordSuccess.textContent = '';
        }

        errorMessages.forEach(errorMessage => errorMessage.textContent = '');

        const currentPasswordError = document.querySelector('[data-error-for="currentPassword"]');
        const newPasswordError = document.querySelector('[data-error-for="newPassword"]');
        const confirmPasswordError = document.querySelector('[data-error-for="confirmPassword"]');

        let hasError = false;

        const currentPassword = elements.currentPassword.value.trim();
        const newPassword = elements.newPassword.value.trim();
        const confirmPassword = elements.confirmPassword.value.trim();

        if (!currentPassword) {
            showError(currentPasswordError, 'Current password is required.');
            hasError = true;
        }

        if (!newPassword) {
            showError(newPasswordError, 'New password is required.');
            hasError = true;
        }

        if (!confirmPassword) {
            showError(confirmPasswordError, 'Confirm password is required.');
            hasError = true;
        }

        if (confirmPassword && newPassword !== confirmPassword) {
            showError(confirmPasswordError, 'Passwords do not match.');
            hasError = true;
        }

        if (hasError) {
            return;
        }
        
        elements.changePasswordError.textContent = '';

        const changePasswordError = elements.changePasswordError;
        
        // Send password change request
        try {
            await changeUserPassword({currentPassword, newPassword, confirmPassword});
            
            elements.currentPassword.value = '';
            elements.newPassword.value = '';
            elements.confirmPassword.value = '';
            if (changePasswordSuccess) {
                changePasswordSuccess.textContent = 'Password changed successfully.';
            }
        } catch(error) {
            showError(changePasswordError, error.message || 'Failed to change password.');
        }
    });
    
    // TODO: Sessions — list active sessions, log out of all other devices
    /* Account — Sessions
    elements.sessionsList
    elements.logoutAllButton
    --------------------------------
    */
    
    /* Load active sessions
        Request active sessions
        Render session list
    */
    
        /* For each session:
        Create session list item
        Display device information
        Display browser information
        Display location information
        Display last active information
    */
    
        /* When "Log out all other devices" is clicked:
        Confirm action
        Send logout all other sessions request

        If successful:
            Refresh sessions list
            Show success message
        If failed:
            Show error message
    */
    
    // TODO: Preferences — persist toggle state (theme, email notifications)
    /* Account — Preferences
    elements.preferencesButtons
    --------------------------------
    */
    
    /* Load saved preferences
        Apply preference values to all toggles
    */
    
    /* When a toggle is clicked:
        Change toggle state
        Save preference

        If successful:
            Update UI
        If failed:
            Revert toggle state
            Show error message
    */
    
    /* If theme preference changes:
        Apply new theme immediately
    */
    
    // TODO: Danger — confirm username match before enabling delete, handle account deletion
    /* Account — Danger
    elements.deleteAccountForm
    elements.deleteAccountButton
    elements.deleteConfirmUsername
    --------------------------------
    */
    
    /* Danger section:
        When confirmation input changes:
            Compare typed value to current username

            If exact match:
                Enable delete button
            Otherwise:
                Disable delete button
    */
    
                /* When delete button is clicked:
        Prevent default submit
        Verify username matches
        Show final confirmation

        If confirmed:
            Send account deletion request

            If successful:
                Clear session
                Redirect to login page
            If failed:
                Show error message
    */
}
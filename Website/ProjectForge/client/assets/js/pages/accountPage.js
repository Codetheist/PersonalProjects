import {
    checkSession,
    changeUserPassword
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
    
    // TODO: Profile — update display name and email
    // Account — Profile
    elements.profileDisplayName.value = user.username;
    elements.profileEmail.value = user.email;
    
    /* Profile form submission:
        Prevent default submit
        Read display name
        Read email
    
    Validate inputs
        If validation fails:
            Show errors
            Stop
    */
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
        /* Send profile update request
        If successful:
            Update session/user data
            Update sidebar username
            Update sidebar email
            Show success message
        If failed:
            Show error message
        */
    });
    
    
    
    // TODO: Security — handle password change form submission
    /* Account — Security
    elements.changePasswordForm
    elements.currentPassword
    elements.newPassword
    elements.confirmPassword
    elements.changePasswordError
    ----------------------------
    */
    
    /* Password form submission:
        Prevent default submit
        Read current password
        Read new password
        Read confirm password
    */
    
        /* Validate inputs
    If passwords do not match:
        Show error
        Stop
    */
    
    /* Send password change request
    If successful:
        Clear password fields
        Show success message
    If failed:
        Show error message
    */
    
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
import {
    checkSession,
    changeUserPassword
} from '../features/auth.js';
import { elements } from '../shared/dom.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { state } from '../core/state.js';
import { showError } from '../shared/ui.js';

export async function initAccountPage() {
    // TODO: Nav — highlight active section, show/hide sections on sidebar click

    // TODO: Sidebar — populate avatar initial, username, and email from session

    // TODO: Profile — update display name and email

    // TODO: Security — handle password change form submission

    // TODO: Sessions — list active sessions, log out of all other devices

    // TODO: Preferences — persist toggle state (theme, email notifications)

    // TODO: Danger — confirm username match before enabling delete, handle account deletion
}
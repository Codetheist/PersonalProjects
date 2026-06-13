import { checkSession } from '../features/auth.js';
import { elements } from '../shared/dom.js';
import { showAuthState, showLandingState } from '../shared/ui.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { runDemo } from '../features/demo.js';

export function initHomePage() {
    if (!elements.isHomePage) {
        return;
    }
    
    if (window.location.hash === '#login') {
        showAuthState('login');
    } else if (window.location.hash === '#registration') {
        showAuthState('registration');
    } else {
        showLandingState();
    }

    elements.createProjectButton?.addEventListener('click', (event) => {
        protectAccess(event, 'login', PAGE_ROUTES.dashboard + "?create=true");
    });

    elements.loginButton?.addEventListener('click', (event) => {
        protectAccess(event, 'login', PAGE_ROUTES.dashboard);
    });

    elements.signUpButton?.addEventListener('click', (event) => {
        protectAccess(event, 'registration', PAGE_ROUTES.dashboard);
    });

    elements.demoButton?.addEventListener('click', runDemo);

    elements.dashboardButton?.addEventListener('click', (event) => {
        protectAccess(event, 'login', PAGE_ROUTES.dashboard);
    });
}

async function protectAccess(event, authState, redirectUrl) {
    event.preventDefault();

    const user = await checkSession();

    if (!user) {
        showAuthState(authState);
        return;
    }
    window.location.href = redirectUrl;
}
import { checkSession } from '../features/auth.js';
import { addProject } from '../features/projects.js';
import { elements } from '../shared/dom.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { dashboardFeature } from '../features/dashboard.js';
import { getRecentActivity } from '../api/activityApi.js';
import { listProjects } from '../api/projectsApi.js';
import { state } from '../core/state.js';

export async function initDashboardPage() {
    if (!elements.projectsList) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const createMode = params.get('create') === 'true';

    if (createMode) {
        elements.createProjectForm.hidden = false;
        elements.projectsList.hidden = true;
        elements.createProjectButton.hidden = true;
    }
    
    const user = await checkSession();
    
    if (!user) {
        window.location.replace(PAGE_ROUTES.home + "#login");
        return;
    }

    if (elements.dashboardUsername) {
        elements.dashboardUsername.textContent = user.username;
    }

    if (elements.logoutButton) {
        elements.logoutButton.hidden = false;
    }
    
    elements.createProjectForm?.addEventListener('submit', addProject);

    elements.createProjectButton?.addEventListener('click', () => {
        elements.createProjectForm.hidden = false;
        elements.projectsList.hidden = true;
        elements.createProjectButton.hidden = true;
    });

    if (!createMode) {
        const projectsResult = await listProjects();
        const activityResult = await getRecentActivity();
        const projects = projectsResult.data?.projects ?? [];
        const activity = activityResult.data?.activities ?? [];
        dashboardFeature({ projects, activity });
    }

    document.title = `Dashboard | ${user.username}`;
}
// Project
import { createProject, listProjects, getProjectDetail, updateProject, deleteProject } from '../api/projectsApi.js';
import { showError, clearError, setSubmitState } from '../shared/ui.js';
import { elements } from '../shared/dom.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { state } from '../core/state.js';

export async function addProject(event) {
    event.preventDefault();

    clearError(elements.createProjectError);
    setSubmitState(elements.createProjectForm, true);

    const formData = new FormData(elements.createProjectForm);

    const projectData = {
        name: formData.get('name'),
        description: formData.get('description') || null,
        status: formData.get('status'),
        due_date: formData.get('due_date') || null
    };

    try {
        const result = await createProject(projectData);

        if (!result.ok) {
            console.error('Project creation failed:', result.data?.message || 'Unknown error');
            showError(elements.createProjectError, 'An error occurred while creating the project. Please try again.');
            return;
        }
        
        elements.createProjectForm.reset();
        elements.createProjectForm.hidden = true;
        elements.projectsList.hidden = false;
        elements.createProjectButton.hidden = false;

        window.history.replaceState({}, '', PAGE_ROUTES.dashboard);
        
        if (!Array.isArray(state.projects)) {
            state.projects = [];
        }

        state.projects.push(result.data.project);

        renderProjects();
    } catch (error) {
        console.error('Error creating project:', error);
        showError(elements.createProjectError, 'An error occurred while creating the project. Please try again.');
    } finally {
        setSubmitState(elements.createProjectForm, false);
    }
}

export async function loadProjects() {
    try {
        const result = await listProjects();
        if (!result.ok) {
            console.error('Failed to load projects:', result.data?.message || 'Unknown error');
            showError(elements.createProjectError, 'An error occurred while loading projects. Please try again.');
            return;
        }

        state.projects = result.data.projects || [];
        
        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        showError(elements.createProjectError, 'An error occurred while loading projects. Please try again.');
    }
}

export async function loadProjectDetail(projectId) {
    try {
        const result = await getProjectDetail(projectId);
        if (!result.ok) {
            console.error('Failed to load project detail:', result.data?.message || 'Unknown error');
            showError(elements.projectDetailError, 'An error occurred while loading project details. Please try again.');
            return;
        }
        state.selectedProject = result.data.project;

        renderProjectDetail();
    } catch (error) {
        console.error('Error loading project detail:', error);
        showError(elements.projectDetailError, 'An error occurred while loading project details. Please try again.');
    }
}

export async function editProject(projectId, updatedData) {
    try {
        const result = await updateProject(projectId, updatedData);
        
        if (!result.ok) {
            console.error('Failed to update project:', result.data?.message || 'Unknown error');
            showError(elements.editProjectError, 'An error occurred while updating the project. Please try again.');
            return;
        }
        
        const updatedProject = result.data.project;
        state.selectedProject = updatedProject;

        const index = state.projects.findIndex(project => project.id === projectId);
        
        if (index !== -1) {
            state.projects[index] = updatedProject;
        }
        
        elements.editProjectForm.hidden = true;
        
        renderProjectDetail();
        renderProjects();
    } catch (error) {
        console.error('Error updating project:', error);
        showError(elements.editProjectError, 'An error occurred while updating the project. Please try again.');
    }
}

export async function removeProject(projectId) {
    try {
        const result = await deleteProject(projectId);
        if (!result.ok) {
            console.error('Failed to delete project:', result.data?.message || 'Unknown error');
            showError(elements.editProjectError, 'An error occurred while deleting the project. Please try again.');
            return;
        }
        
        window.location.href = PAGE_ROUTES.dashboard;
    } catch (error) {
        console.error('Error deleting project:', error);
        showError(elements.editProjectError, 'An error occurred while deleting the project. Please try again.');
    }
}

function renderProjects() {
    elements.projectsList.innerHTML = '';

    if (state.projects.length === 0) {
        elements.projectsList.innerHTML = '<p>No projects found. Create your first project!</p>';
        return;
    }
    for (const project of state.projects) {
        const projectItem = document.createElement('a');
        projectItem.textContent = project.name;
        projectItem.href = `${PAGE_ROUTES.projects}/${project.id}`;
        elements.projectsList.appendChild(projectItem);
    }
}

function renderProjectDetail() {
    const project = state.selectedProject;

    if (!project) return;

    elements.projectDetailName.textContent = project.name;
    elements.projectDetailDescription.textContent = project.description || '';
    elements.projectDetailStatus.textContent = project.status;
    elements.projectDetailDueDate.textContent = project.due_date
        ? new Date(project.due_date).toLocaleDateString()
        : '';
}
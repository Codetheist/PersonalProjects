// All my HTML Elements
const registrationForm = document.querySelector('.registrationForm');
const loginForm = document.querySelector('.loginForm');

export const elements = {
    // Universal
    dashboardUsername: document.getElementById('dashboardUsername'),
    year: document.getElementById('year'),

    // Auth
    registrationForm,
    loginForm,
    logoutButton: document.getElementById('logoutButton'),
    isHomePage: Boolean(registrationForm && loginForm),
    homeLinks: document.querySelectorAll('a[href="/"], a[href="index.html"]'),
    landingView: document.getElementById('landingView'),
    authView: document.getElementById('authView'),
    registrationSection: document.querySelector('.registration'),
    loginSection: document.querySelector('.login'),
    loginButton: document.querySelector('a[href="#login"]'),
    signUpButton: document.querySelector('a[href="#registration"]'),
    authButtons: document.querySelector('.authButtons'),

    // Register Form
    registerUsernameInput: registrationForm?.querySelector('#username'),
    registerEmailInput: registrationForm?.querySelector('#email'),
    registerPasswordInput: registrationForm?.querySelector('#register-password'),
    registerError: document.getElementById('registerError'),

    // Login Form
    loginIdentifierInput: loginForm?.querySelector('#identifier'),
    loginPasswordInput: loginForm?.querySelector('#login-password'),
    loginError: document.getElementById('loginError'),

    // Dashboard
    projectsList: document.getElementById('projectsList'),
    demoButton: document.getElementById('demoButton'),
    demoPreview: document.querySelector('.heroPreview'),

    // Project Detail Display
    projectDetail: document.getElementById('projectDetail'),
    projectDetailName: document.getElementById('projectName'),
    projectDetailDescription: document.getElementById('projectDescription'),
    projectDetailStatus: document.getElementById('projectStatus'),
    projectDetailDueDate: document.getElementById('projectDueDate'),
    editProjectButton: document.getElementById('editProjectButton'),
    deleteProjectButton: document.getElementById('deleteProjectButton'),
    projectDetailError: document.getElementById('projectDetailError'),

    // Create Project
    createProjectButton: document.getElementById('createProjectButton'),
    createProjectForm: document.getElementById('createProjectForm'),
    createProjectName: document.getElementById('createProjectName'),
    createProjectDescription: document.getElementById('createProjectDescription'),
    createProjectStatus: document.getElementById('createProjectStatus'),
    createProjectDueDate: document.getElementById('createProjectDueDate'),
    createProjectError: document.getElementById('createProjectError'),

    // Edit Project
    editProjectForm: document.getElementById('editProjectForm'),
    editProjectName: document.getElementById('editProjectName'),
    editProjectDescription: document.getElementById('editProjectDescription'),
    editProjectStatus: document.getElementById('editProjectStatus'),
    editProjectDueDate: document.getElementById('editProjectDueDate'),
    cancelEditButton: document.getElementById('cancelEditButton'),
    editProjectError: document.getElementById('editProjectError'),

    // Members
    membersList: document.getElementById('membersList'),
    showAddMemberFormButton: document.getElementById('showAddMemberFormButton'),
    addMemberForm: document.getElementById('addMemberForm'),
    memberUsername: document.getElementById('memberUsername'),
    memberRole: document.getElementById('memberRole'),
    addMemberError: document.getElementById('addMemberError'),

    // Task Display
    tasksList: document.getElementById('tasksList'),
    taskDetailPanel: document.getElementById('taskDetailPanel'),
    taskDetailTitle: document.getElementById('taskDetailTitle'),
    taskDetailDescription: document.getElementById('taskDetailDescription'),
    taskDetailStatus: document.getElementById('taskDetailStatus'),
    taskDetailPriority: document.getElementById('taskDetailPriority'),
    taskDetailDueDate: document.getElementById('taskDetailDueDate'),
    editTaskButton: document.getElementById('editTaskButton'),
    deleteTaskButton: document.getElementById('deleteTaskButton'),

    // Create Task
    showCreateTaskFormButton: document.getElementById('showCreateTaskFormButton'),
    createTaskForm: document.getElementById('createTaskForm'),
    createTaskTitle: document.getElementById('taskTitle'),
    createTaskDescription: document.getElementById('taskDescription'),
    createTaskStatus: document.getElementById('taskStatus'),
    createTaskPriority: document.getElementById('taskPriority'),
    createTaskDueDate: document.getElementById('taskDueDate'),
    createTaskError: document.getElementById('createTaskError'),
    cancelCreateTaskButton: document.getElementById('cancelCreateTaskButton'),

    // Edit Task
    editTaskForm: document.getElementById('editTaskForm'),
    editTaskTitle: document.getElementById('editTaskTitle'),
    editTaskDescription: document.getElementById('editTaskDescription'),
    editTaskStatus: document.getElementById('editTaskStatus'),
    editTaskPriority: document.getElementById('editTaskPriority'),
    editTaskDueDate: document.getElementById('editTaskDueDate'),
    cancelEditTaskButton: document.getElementById('cancelEditTaskButton'),
    editTaskError: document.getElementById('editTaskError'),

    // Comments
    commentsList: document.getElementById('commentsList'),
    addCommentForm: document.getElementById('addCommentForm'),
    commentContent: document.getElementById('commentContent'),
    addCommentError: document.getElementById('addCommentError'),
    commentHeader: document.getElementById('commentsTitle'),
};
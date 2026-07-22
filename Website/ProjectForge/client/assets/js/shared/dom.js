// All my HTML Elements
const registrationForm = document.querySelector('.registrationForm');
const loginForm = document.querySelector('.loginForm');

export const elements = {
    // Universal
    year: document.getElementById('year'),

    // Homepage / Landing
    demoButton: document.getElementById('demoButton'),
    demoPreview: document.querySelector('.heroPreview'),
    landingView: document.getElementById('landingView'),
    authView: document.getElementById('authView'),
    homeLinks: document.querySelectorAll('a[href="/"], a[href="index.html"]'),
    isHomePage: Boolean(registrationForm && loginForm),

    // Auth
    registrationForm,
    loginForm,
    registrationSection: document.querySelector('.registration'),
    loginSection: document.querySelector('.login'),
    loginButton: document.querySelector('a[href="#login"]'),
    signUpButton: document.querySelector('a[href="#registration"]'),
    authButtons: document.querySelector('.authButtons'),
    logoutButton: document.getElementById('logoutButton'),

    // Register Form
    registerUsername: registrationForm?.querySelector('#username'),
    registerEmail: registrationForm?.querySelector('#email'),
    registerPassword: registrationForm?.querySelector('#register-password'),
    registerError: document.getElementById('registerError'),

    // Login Form
    loginIdentifier: loginForm?.querySelector('#identifier'),
    loginPassword: loginForm?.querySelector('#login-password'),
    loginError: document.getElementById('loginError'),

    // Dashboard
    dashboardUsername: document.getElementById('dashboardUsername'),
    userAvatarBtn: document.getElementById('userAvatarBtn'),
    statusCounts: document.getElementById('statusCounts'),
    projectSearch: document.getElementById('projectSearch'),
    projectSort: document.getElementById('projectSort'),
    projectCount: document.getElementById('projectCount'),
    activityFeed: document.getElementById('activityFeed'),

    // Create Project
    createProjectButton: document.getElementById('createProjectButton'),
    createProjectForm: document.getElementById('createProjectForm'),
    createProjectName: document.getElementById('createProjectName'),
    createProjectDescription: document.getElementById('createProjectDescription'),
    createProjectStatus: document.getElementById('createProjectStatus'),
    createProjectDueDate: document.getElementById('createProjectDueDate'),
    createProjectError: document.getElementById('createProjectError'),
    cancelCreateProject: document.getElementById('cancelCreateProject'),

    // Project List
    projectsList: document.getElementById('projectsList'),

    // Project Detail
    projectDetail: document.getElementById('projectDetail'),
    projectDetailName: document.getElementById('projectName'),
    projectDetailDescription: document.getElementById('projectDescription'),
    projectDetailStatus: document.getElementById('projectStatus'),
    projectDetailDueDate: document.getElementById('projectDueDate'),
    editProjectButton: document.getElementById('editProjectButton'),
    deleteProjectButton: document.getElementById('deleteProjectButton'),
    projectDetailError: document.getElementById('projectDetailError'),

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
    cancelMemberButton: document.getElementById('cancelAddMemberButton'),

    // Task List
    tasksList: document.getElementById('tasksList'),

    // Task Detail
    taskDetailPanel: document.getElementById('taskDetailPanel'),
    taskDetailInfo: document.getElementById('taskDetailInfo'),
    taskDetailTitle: document.getElementById('taskDetailTitle'),
    taskDetailDescription: document.getElementById('taskDetailDescription'),
    taskDetailStatus: document.getElementById('taskDetailStatus'),
    taskDetailPriority: document.getElementById('taskDetailPriority'),
    taskDetailDueDate: document.getElementById('taskDetailDueDate'),
    taskDetailAssignedTo: document.getElementById('taskDetailAssignedTo'),
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
    createTaskAssignedTo: document.getElementById('taskAssignedTo'),
    createTaskError: document.getElementById('createTaskError'),
    cancelCreateTaskButton: document.getElementById('cancelCreateTaskButton'),

    // Edit Task
    editTaskForm: document.getElementById('editTaskForm'),
    editTaskTitle: document.getElementById('editTaskTitle'),
    editTaskDescription: document.getElementById('editTaskDescription'),
    editTaskStatus: document.getElementById('editTaskStatus'),
    editTaskPriority: document.getElementById('editTaskPriority'),
    editTaskDueDate: document.getElementById('editTaskDueDate'),
    editTaskAssignedTo: document.getElementById('editTaskAssignedTo'),
    cancelEditTaskButton: document.getElementById('cancelEditTaskButton'),
    editTaskError: document.getElementById('editTaskError'),

    // Comments
    commentsList: document.getElementById('commentsList'),
    addCommentForm: document.getElementById('addCommentForm'),
    commentContent: document.getElementById('commentContent'),
    addCommentError: document.getElementById('addCommentError'),
    commentHeader: document.getElementById('commentsTitle'),

    // Account — Section
    profileSection: document.getElementById('profileSection'),
    securitySection: document.getElementById('securitySection'),
    sessionsSection: document.getElementById('sessionsSection'),
    preferencesSection: document.getElementById('preferencesSection'),
    dangerSection: document.getElementById('dangerSection'),

    // Account — Sidebar
    userAvatar: document.getElementById('userAvatar'),
    sidebarUsername: document.getElementById('sidebarUsername'),
    sidebarEmail: document.getElementById('sidebarEmail'),

    // Account — Profile
    profileForm: document.querySelector('[data-form="profile"]'),
    profileDisplayName: document.getElementById('displayName'),
    profileEmail: document.getElementById('email'),

    // Account — Security
    changePasswordForm: document.getElementById('changePasswordForm'),
    currentPassword: document.getElementById('currentPassword'),
    newPassword: document.getElementById('newPassword'),
    confirmPassword: document.getElementById('confirmPassword'),
    changePasswordError: document.getElementById('changePasswordError'),

    // Account — Sessions
    sessionsList: document.getElementById('sessionsList'),
    logoutAllButton: document.getElementById('logoutAllButton'),

    // Account — Danger
    deleteAccountForm: document.getElementById('deleteAccountForm'),
    deleteAccountButton: document.getElementById('deleteAccountButton'),
    deleteConfirmUsername: document.getElementById('deleteConfirmUsername'),
    confirmName: document.getElementById('confirmName'),
};

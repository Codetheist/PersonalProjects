// Import
const { httpError } = require('../utils/httpError');
const { ProjectsRepo } = require('../repos/projects.repo');
const { TasksRepo } = require('../repos/tasks.repo');
const { CommentsRepo } = require('../repos/comments.repo');

// Create repo instances
const projectsRepo = new ProjectsRepo();
const tasksRepo = new TasksRepo();
const commentsRepo = new CommentsRepo();

// Load project
async function loadProject(req, res, next) {
    try {
        const project = await projectsRepo.getProjectById(req.projectId);
        
        if (!project) {
            return next(httpError(404, "Project not found"));
        }
        
        req.project = project;
        next();
    } catch (err) {
        next(err);
    }
}

async function loadTask(req, res, next) {
    try {
        const task = await tasksRepo.getTaskById(req.taskId);
        
        if (!task) {
            return next(httpError(404, "Task not found"));
        }
        
        req.task = task;
        next();
    } catch (err) {
        next(err);
    }
}

async function loadProjectFromTask(req, res, next) {
    try {
        const project = await projectsRepo.getProjectById(req.task.project_id);
        if (!project) {
            return next(httpError(404, "Project not found"));
        }
        req.project = project;
        next();
    } catch (err) {
        next(err);
    }
}

async function loadComment(req, res, next) {
    try {
        const comment = await commentsRepo.getCommentById(req.commentId);
        
        if (!comment) {
            return next(httpError(404, "Comment not found"));
        }
        
        req.comment = comment;
        next();
    } catch (err) {
        next(err);
    }
}

async function loadTaskFromComment(req, res, next) {
    try {
        const task = await tasksRepo.getTaskById(req.comment.task_id);
        if (!task) {
            return next(httpError(404, "Task not found"));
        }
        req.task = task;
        next();
    } catch (err) {
        next(err);
    }
}

// Export
module.exports = {
    loadProject,
    loadTask,
    loadProjectFromTask,
    loadComment,
    loadTaskFromComment,
}
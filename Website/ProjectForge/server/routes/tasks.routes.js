// Imports
const { taskCreateSchema, taskUpdateSchema } = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate, validateProjectId, validateProjectTaskParams } = require('../validation/validate');
const express = require('express');
const { TasksRepo } = require('../repos/tasks.repo');
const { requireAuth, requireProjectMembership, requireTaskAccess } = require('../middleware/auth');
const { loadProject, loadTask, loadProjectFromTask } = require('../middleware/loader');

// Create router and repo instances
const router = express.Router();
const tasksRepo = new TasksRepo();

// Create task
router.post('/:project_id/tasks', 
    requireAuth, 
    validateProjectId,
    loadProject,
    requireProjectMembership,
    asyncHandler(async (req, res) => {
        const taskData = validate(taskCreateSchema, req.body);

        const { task, message } = await tasksRepo.createTask({
            project_id: req.project.id,
            ...taskData
        });

        res.status(201).json({ task, message });
    })
);

// Read all tasks for a project
router.get('/:project_id/tasks',
    requireAuth,
    validateProjectId,
    loadProject,
    requireProjectMembership,
    asyncHandler(async (req, res) => {
        const tasks = tasksRepo.getTasksByProjectId(req.project.id);
        res.json({ tasks });
    })
);

// Read task
router.get('/:project_id/tasks/:task_id',
    requireAuth,
    validateProjectTaskParams,
    loadTask,
    loadProjectFromTask,
    requireProjectMembership,
    requireTaskAccess,
    asyncHandler(async (req, res) => {
        res.json({ task: req.task });
    })
);

// Update task
router.patch('/:project_id/tasks/:task_id',
    requireAuth,
    validateProjectTaskParams,
    loadTask,
    loadProjectFromTask,
    requireProjectMembership,
    requireTaskAccess,
    asyncHandler(async (req, res) => {
        const taskData = validate(taskUpdateSchema, req.body);

        const { task, message } = await tasksRepo.updateTask(req.task.id, taskData);

        res.json({ task, message });
    })
);

// Delete task
router.delete('/:project_id/tasks/:task_id',
    requireAuth,
    validateProjectTaskParams,
    loadTask,
    loadProjectFromTask,
    requireProjectMembership,
    requireTaskAccess,
    asyncHandler(async (req, res) => {
        const { message } = await tasksRepo.deleteTask(req.task.id);

        res.json({ message });
    })
);

// Export
module.exports = router;
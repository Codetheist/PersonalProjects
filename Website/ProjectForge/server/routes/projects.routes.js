// Imports
const { projectCreateSchema, projectUpdateSchema, projectIdParamSchema } = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate, validateProjectId } = require('../validation/validate');
const express = require('express');
const { ProjectsRepo } = require('../repos/projects.repo');
const { requireAuth, requireProjectOwner, requireProjectMembership } = require('../middleware/auth');
const { loadProject } = require('../middleware/loader');

// Create router and repo instances
const router = express.Router();
const projectsRepo = new ProjectsRepo();

// Create project
router.post("/", requireAuth, asyncHandler(async (req, res) => {
    const projectData = validate(projectCreateSchema, req.body);

    const { project, message } = await projectsRepo.createProject({
        owner_id: req.user.id,
        ...projectData
    });

    res.status(201).json({ project, message });
}));

// Read projects
router.get("/", requireAuth, asyncHandler(async (req, res) => {
    const projects = await projectsRepo.getProjectsByMembership(req.user.id);
    
    res.json({ projects });
}));

router.get("/:project_id", requireAuth, validateProjectId, loadProject, requireProjectMembership, asyncHandler(async (req, res) => {
    res.json({ project: req.project });
}));

// Update project
router.patch("/:project_id", requireAuth, validateProjectId, loadProject, requireProjectOwner, asyncHandler(async (req, res) => {
    const projectData = validate(projectUpdateSchema, req.body);
    
    const { project, message } = await projectsRepo.updateProject(req.projectId, projectData);
    
    res.json({ project, message });
}));

// Delete project
router.delete("/:project_id", requireAuth, validateProjectId, loadProject, requireProjectOwner, asyncHandler(async (req, res) => {
    const { message } = await projectsRepo.deleteProject(req.projectId);
    
    res.json({ message });
}));

// Export
module.exports = router;
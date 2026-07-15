// Imports
const { asyncHandler } = require('../utils/asyncHandler');
const express = require('express');
const { ActivityRepo } = require('../repos/activity.repo');
const { requireAuth } = require('../middleware/auth');

// Create router and repo instances
const router = express.Router();
const activityRepo = new ActivityRepo();

// Get activities by project
router.get('/project/:project_id', requireAuth, asyncHandler(async (req, res) => {
    const project_id = req.params.project_id;
    const activities = activityRepo.getActivityByProject(project_id);
    res.json({ activities });
}));

// Get activities by user
router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const activities = activityRepo.getRecentActivity(user_id);
    res.json({ activities });
}));

module.exports = router;
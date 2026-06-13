// Imports
const { projectMemberAddSchema, projectMemberUpdateSchema, projectMemberParamsSchema } = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../utils/httpError');
const { validate, validateProjectId, validateProjectMemberParams } = require('../validation/validate');
const express = require('express');
const { MembersRepo } = require('../repos/members.repo');
const { requireAuth, requireProjectOwner, requireProjectMembership } = require('../middleware/auth');
const { loadProject } = require('../middleware/loader');


// Instances
const router = express.Router();
const membersRepo = new MembersRepo();

// Create member
router.post("/:project_id/members",
    requireAuth,
    validateProjectId,
    loadProject,
    requireProjectOwner,
    asyncHandler(async (req, res, next) => {
        const memberData = validate(projectMemberAddSchema, req.body);
        const member = await membersRepo.addMember(req.projectId, memberData.user_id, memberData.role);
        res.status(201).json({ member });
    })
);

// Read members
router.get("/:project_id/members",
    requireAuth,
    validateProjectId,
    loadProject,
    requireProjectMembership,
    asyncHandler(async (req, res) => {
        const members = await membersRepo.getMembersByProjectId(req.projectId);
        res.json({ members });
    })
);

// Update member
router.patch("/:project_id/members/:user_id",
    requireAuth,
    validateProjectMemberParams,
    loadProject,
    requireProjectOwner,
    asyncHandler(async (req, res, next) => {
        const memberData = validate(projectMemberUpdateSchema, req.body);
        const member = await membersRepo.updateMemberRole(req.projectId, req.userId, memberData.role);
        if (!member) {
            return next(httpError(404, "Membership not found"));
        }
        res.json({ member });
    })
);

// Delete member
router.delete("/:project_id/members/:user_id",
    requireAuth,
    validateProjectMemberParams,
    loadProject,
    requireProjectOwner,
    asyncHandler(async (req, res) => {
        await membersRepo.removeMember(req.projectId, req.userId);
        res.status(204).end();
    })
);

// Export
module.exports = router;

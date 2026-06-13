// Imports
const { commentCreateSchema, commentUpdateSchema, commentIdParamSchema, taskIdParamSchema } = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../utils/httpError');
const { validate, validateTaskId, validateCommentId, validateBody } = require('../validation/validate');
const { requireAuth, requireProjectMembership, requireTaskAccess, requireCommentAccess } = require('../middleware/auth');
const { loadProjectFromTask, loadTask, loadComment, loadTaskFromComment } = require('../middleware/loader');
const express = require('express');
const { CommentsRepo } = require('../repos/comments.repo');

// Instances
const router = express.Router();
const commentsRepo = new CommentsRepo();

// Create comment
router.post("/tasks/:task_id/comments",
    requireAuth,
    validateTaskId,
    loadTask,
    loadProjectFromTask,
    requireProjectMembership,
    requireTaskAccess,
    validateBody(commentCreateSchema),
    asyncHandler(async (req, res) => {
        const {comment, message } = await commentsRepo.createComment({
            task_id: req.task.id,
            created_by_user_id: req.user.id,
            created_by_username: req.user.username,
            body: req.body.body
        });
        res.status(201).json({ comment, message });
    })
);

// Get comments by task
router.get("/tasks/:task_id/comments",
    requireAuth,
    validateTaskId,
    loadTask,
    loadProjectFromTask,
    requireProjectMembership,
    requireTaskAccess,
    asyncHandler(async (req, res) => {
        const comments = await commentsRepo.getCommentsByTaskId(req.task.id);
        res.json({ comments });
    })
);

// Update comment
router.patch("/comments/:comment_id",
    requireAuth,
    validateCommentId,
    loadComment,
    loadTaskFromComment,
    loadProjectFromTask,
    requireProjectMembership,
    requireTaskAccess,
    requireCommentAccess,
    asyncHandler(async (req, res) => {
        const commentData = validate(commentUpdateSchema, req.body);
        const { comment, message } = await commentsRepo.updateComment(req.comment.id, commentData);
        res.json({ comment, message });
    })
);

// Delete comment
router.delete("/comments/:comment_id",
    requireAuth,
    validateCommentId,
    loadComment,
    loadTaskFromComment,
    loadProjectFromTask,
    requireProjectMembership,
    requireTaskAccess,
    requireCommentAccess,
    asyncHandler(async (req, res) => {
        const { comment, message } = await commentsRepo.deleteComment(req.comment.id);
        res.status(204).end();
    })
);

// Export
module.exports = router;
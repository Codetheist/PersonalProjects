// imports
const { uid } = require("../utils/ids");
const { createError } = require("../utils/httpError");
const { dbConnection } = require("../db/db");

class CommentsRepo {
    constructor() {
        this.db = dbConnection;
    }
    
    // Create
    createComment({ task_id, created_by_user_id, created_by_username, body }) { 
        const id = uid();
        task_id = (task_id ?? "").trim();
        created_by_user_id = (created_by_user_id ?? "").trim();
        created_by_username = (created_by_username ?? "").trim();
        body = (body ?? "").trim();
        
        if (!task_id) {
            throw createError.BadRequest("Task ID is required");
        }
        
        if (!created_by_user_id) {
            throw createError.BadRequest("Created by user ID is required");
        }
        
        if (!created_by_username) {
            throw createError.BadRequest("Created by username is required");
        }
        
        if (body.length < 1 || body.length > 5000) {
            throw createError.BadRequest("Comment body must be between 1 and 5000 characters long");
        }

        this.db.prepare(`
            INSERT INTO comments (id, task_id, created_by_user_id, created_by_username, body)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, task_id, created_by_user_id, created_by_username, body);
        
        return { 
            comment: this.getCommentById(id),
            message: "Comment created",
        };
    }
    
    // Read
    getCommentById(id) {
        const comment = this.db.prepare(`
            SELECT *
            FROM comments
            WHERE id = ?
        `).get(id);
        
        if (!comment) {
            throw createError.NotFound("Comment not found");
        }
        
        return comment;
    }
    
    getCommentsByTaskId(task_id) {
        const comments = this.db.prepare(`
            SELECT *
            FROM comments
            WHERE task_id = ?
        `).all(task_id);
        
        return comments;

    }
    
    // Update
    updateComment(id, updates = {}) {
        const comment = this.db.prepare(`
            SELECT *
            FROM comments
            WHERE id = ?
        `).get(id);
        
        if (!comment) {
            throw createError.NotFound("Comment not found");
        }
        
        const { body } = updates;
        
        if (body !== undefined) {
            if (typeof body !== "string" || body.trim().length < 1 || body.trim().length > 5000) {
                throw createError.BadRequest("Comment body must be between 1 and 5000 characters long");
            }
            this.db.prepare(`
                UPDATE comments
                SET body = ?
                WHERE id = ?
            `).run(body.trim(), id);
        }
        
        return {
            comment: this.getCommentById(id),
            message: "Comment updated",
        };
    }
    
    // Delete
    deleteComment(id) {
        const comment = this.db.prepare(`
            SELECT *
            FROM comments
            WHERE id = ?
        `).get(id);
        
        if (!comment) {
            throw createError.NotFound("Comment not found");
        }
        
        this.db.prepare(`
            DELETE FROM comments
            WHERE id = ?
        `).run(id);
        
        return { 
            comment: comment,
            message: "Comment deleted" 
        };
    }
}

module.exports = {
    CommentsRepo,
}
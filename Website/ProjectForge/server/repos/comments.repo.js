// imports
const { uid } = require("../utils/ids");
const { httpError } = require('../utils/httpError');
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
            throw httpError(400, "Task ID is required");
        }
        
        if (!created_by_user_id) {
            throw httpError(400, "Created by user ID is required");
        }
        
        if (!created_by_username) {
            throw httpError(400, "Created by username is required");
        }
        
        if (body.length < 1 || body.length > 5000) {
            throw httpError(400, "Comment body must be between 1 and 5000 characters long");
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

    createProjectComment({ project_id, created_by_user_id, created_by_username, body }) {
        const id = uid();
        project_id = (project_id ?? "").trim();
        created_by_user_id = (created_by_user_id ?? "").trim();
        created_by_username = (created_by_username ?? "").trim();
        body = (body ?? "").trim();
        if (!project_id) {
            throw httpError(400, "Project ID is required");
        }
        if (!created_by_user_id) {
            throw httpError(400, "Created by user ID is required");
        }
        if (!created_by_username) {
            throw httpError(400, "Created by username is required");
        }
        if (body.length < 1 || body.length > 5000) {
            throw httpError(400, "Comment body must be between 1 and 5000 characters long");
        }
        this.db.prepare(`
            INSERT INTO comments (id, project_id, created_by_user_id, created_by_username, body)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, project_id, created_by_user_id, created_by_username, body);
        
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
        
        return comment;
    }
    
    getCommentsByTaskId(task_id) {
        const comments = this.db.prepare(`
            SELECT *
            FROM comments
            WHERE task_id = ?
            ORDER BY created_at ASC
        `).all(task_id);
        
        return comments;

    }

    getCommentsByProjectId(project_id) {
        const comments = this.db.prepare(`
            SELECT *
            FROM comments
            WHERE project_id = ?
            ORDER BY created_at ASC
        `).all(project_id);
        
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
            throw httpError(404, "Comment not found");
        }
        
        const { body } = updates;
        
        if (body !== undefined) {
            if (typeof body !== "string" || body.trim().length < 1 || body.trim().length > 5000) {
                throw httpError(400, "Comment body must be between 1 and 5000 characters long");
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
            throw httpError(404, "Comment not found");
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
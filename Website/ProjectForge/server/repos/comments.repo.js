// imports
const { uid } = require("../utils/ids");
const { httpError } = require('../utils/httpError');
const { dbConnection } = require("../db/db");
const { ActivityRepo } = require("./activity.repo");

class CommentsRepo {
    constructor() {
        this.db = dbConnection;
        this.activityRepo = new ActivityRepo();
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

        const task = this.db.prepare(`
            SELECT id, title, project_id
            FROM tasks
            WHERE id = ?
        `).get(task_id);

        if (!task) {
            throw httpError(404, "Task not found");
        }

        this.db.prepare(`
            INSERT INTO comments (id, task_id, created_by_user_id, created_by_username, body)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, task_id, created_by_user_id, created_by_username, body);

        this.activityRepo.logActivity({
            project_id: task.project_id,
            actor_user_id: created_by_user_id,
            action: "added comment on",
            target_label: task.title,
            target_type: "task",
            target_id: task.id,
        });
        
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

        const project = this.db.prepare(`
            SELECT id, name
            FROM projects
            WHERE id = ?
        `).get(project_id);
        
        if (!project) {
            throw httpError(404, "Project not found");
        }
        
        this.db.prepare(`
            INSERT INTO comments (id, project_id, created_by_user_id, created_by_username, body)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, project_id, created_by_user_id, created_by_username, body);

        this.activityRepo.logActivity({
            project_id: project.id,
            actor_user_id: created_by_user_id,
            action: "added comment on",
            target_label: project.name,
            target_type: "project",
            target_id: project.id,
        });

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

        if (comment.task_id) {
            const task = this.db.prepare(`
                SELECT id, title, project_id
                FROM tasks
                WHERE id = ?
            `).get(comment.task_id);

            if (task) {
                this.activityRepo.logActivity({
                    project_id: task.project_id,
                    actor_user_id: comment.created_by_user_id,
                    action: "deleted comment on",
                    target_label: task.title,
                    target_type: "task",
                    target_id: task.id,
                });
            }
        } else if (comment.project_id) {
            const project = this.db.prepare(`
                SELECT id, name
                FROM projects
                WHERE id = ?
            `).get(comment.project_id);

            if (project) {
                this.activityRepo.logActivity({
                    project_id: project.id,
                    actor_user_id: comment.created_by_user_id,
                    action: "deleted comment on",
                    target_label: project.name,
                    target_type: "project",
                    target_id: project.id,
                });
            }
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
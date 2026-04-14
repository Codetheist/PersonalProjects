const { uid } = require("../utils/ids");
const { createError, httpError } = require("../utils/errors");

class CommentsRepo {
    constructor(db) {
        this.db = db;
    }
    
    // Create
    async createComment({ task_id, created_by_user_id, created_by_username, body }) { 
        const id = uid();
        task_id = (task_id ?? "").trim();
        created_by_user_id = (created_by_user_id ?? "").trim();
        created_by_username = (created_by_username ?? "").trim();
        body = (body ?? "").trim();
        
        if (!task_id) {
            throw createError(httpError.BAD_REQUEST, "Task ID is required");
        }
        
        if (!created_by_user_id) {
            throw createError(httpError.BAD_REQUEST, "Created by user ID is required");
        }
        
        if (!created_by_username) {
            throw createError(httpError.BAD_REQUEST, "Created by username is required");
        }
        
        if (body.length < 1 || body.length > 5000) {
            throw createError(httpError.BAD_REQUEST, "Comment body must be between 1 and 5000 characters long");
        }

        await this.db("comments").insert({ id, task_id, created_by_user_id, created_by_username, body });
        
        return  { success: true, message: "Comment created", comment: { id, task_id, created_by_user_id, created_by_username, body } };
    }
    
    // Read
    async getCommentById(id) {
        const comment = await this.db("comments").where({ id }).first();
        
        if (!comment) {
            throw createError(httpError.NOT_FOUND, "Comment not found");
        }
        
        return comment;
    }
    
    async getCommentsByTaskId(task_id) {
        const comments = await this.db("comments").where({ task_id });
        
        return comments;

    }
    
    // Update
    async updateComment(id, updates = {}) {
        const comment = await this.db("comments").where({ id }).first();
        
        if (!comment) {
            throw createError(httpError.NOT_FOUND, "Comment not found");
        }
        
        const { body } = updates;
        
        if (body !== undefined) {
            if (typeof body !== "string" || body.trim().length < 1 || body.trim().length > 5000) {
                throw createError(httpError.BAD_REQUEST, "Comment body must be between 1 and 5000 characters long");
            }
            await this.db("comments").where({ id }).update({ body: body.trim() });
        }
        
        return { success: true, message: "Comment updated" };
    }
    
    // Delete
    async deleteComment(id) {
        const comment = await this.db("comments").where({ id }).first();
        
        if (!comment) {
            throw createError(httpError.NOT_FOUND, "Comment not found");
        }
        
        await this.db("comments").where({ id }).del();
        
        return { success: true, message: "Comment deleted" };
    }
}

module.exports = {
    CommentsRepo,
}
// imports
const { uid } = require("../utils/ids");
const { httpError } = require('../utils/httpError');
const { dbConnection } = require("../db/db");

class ActivityRepo {
    constructor() {
        this.db = dbConnection;
    }

    // Insert
    logActivity({ project_id, actor_user_id, action, target_label, target_type = null, target_id = null }) {
        const id = uid();
        project_id = (project_id ?? "").trim();
        actor_user_id = (actor_user_id ?? "").trim();
        action = (action ?? "").trim();
        target_label = (target_label ?? "").trim();
        target_type = target_type?.trim() || null;
        target_id = target_id?.trim() || null;
        if (!project_id) {
            throw httpError(400, "Project ID is required");
        }
        if (!actor_user_id) {
            throw httpError(400, "Actor User ID is required");
        }
        if (!action) {
            throw httpError(400, "Action is required");
        }
        if (!target_label) {
            throw httpError(400, "Target Label is required");
        }
        const result = this.db.prepare(`
            INSERT INTO activity (id, project_id, actor_user_id, action, target_label, target_type, target_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, project_id, actor_user_id, action, target_label, target_type, target_id);
        return { id, ...result };
    }

    // Read
    getRecentActivity(user_id) {
        user_id = (user_id ?? "").trim();
        if (!user_id) {
            throw httpError(400, "User ID is required");
        }
        const activities = this.db.prepare(`
            SELECT activity.*, users.username AS actor_username
            FROM activity
            JOIN users ON users.id = activity.actor_user_id
            WHERE project_id IN (
                SELECT id
                FROM projects
                WHERE owner_id = ?
                UNION
                SELECT project_id
                FROM project_members
                WHERE user_id = ?
            )
            ORDER BY created_at DESC
            LIMIT 15
        `).all(user_id, user_id);
        return activities;
    }

    getActivityByProject(project_id) {
        project_id = (project_id ?? "").trim();
        if (!project_id) {
            throw httpError(400, "Project ID is required");
        }
        const activities = this.db.prepare(`
            SELECT * FROM activity
            WHERE project_id = ?
            ORDER BY created_at DESC
        `).all(project_id);
        return activities;
    }
}

module.exports = {
    ActivityRepo,
}
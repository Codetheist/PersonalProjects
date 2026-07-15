// Imports
const { httpError } = require('../utils/httpError');
const { dbConnection } = require("../db/db");
const { ActivityRepo } = require("./activity.repo");

class MembersRepo {
    constructor() {
        this.db = dbConnection;
        this.activityRepo = new ActivityRepo();
    }
    
    // Create
    addMember(project_id, username, role = 'member') {
        if (role !== 'admin' && role !== 'member') {
            throw httpError(400, "Invalid role");
        }

        const user = this.db.prepare(`
            SELECT *
            FROM users
            WHERE username = ?
            `).get(username);

        if (!user) {
            throw httpError(404, "User not found");
        }

        try {
            this.db.prepare(`
                INSERT INTO project_members (project_id, user_id, role)
                VALUES (?, ?, ?)
            `).run(project_id, user.id, role);
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
                err.message.includes('UNIQUE constraint failed')) {
                throw httpError(409, "User is already a member of this project");
            }
            throw err;
        }

        const project = this.db.prepare(`
            SELECT name
            FROM projects
            WHERE id = ?
        `).get(project_id);

        const label = project?.name ?? '';

        this.activityRepo.logActivity({
            project_id: project_id,
            actor_user_id: user.id,
            action: "joined project",
            target_label: label
        });

        return this.getMembership(project_id, user.id);
    }
    
    // Read
    getMembership(project_id, user_id) {
        const membership = this.db.prepare(`
            SELECT pm.*, u.username
            FROM project_members pm
            JOIN users u ON pm.user_id = u.id
            WHERE pm.project_id = ? AND pm.user_id = ?
        `).get(project_id, user_id);
        
        return membership;
    }
    
    getMembersByProjectId(project_id) {
        return this.db.prepare(`
            SELECT
                pm.project_id,
                pm.user_id,
                pm.role,
                u.username
            FROM project_members pm
            JOIN users u ON pm.user_id = u.id
            WHERE pm.project_id = ?
        `).all(project_id);
    }
    
    getProjectsByUserId(user_id) {
        return this.db.prepare(`
            SELECT *
            FROM project_members
            WHERE user_id = ?
        `).all(user_id);
    }
    
    // Update
    updateMemberRole(project_id, user_id, newRole) {
        if (newRole !== 'admin' && newRole !== 'member') {
            throw httpError(400, "Invalid role");
        }
        this.db.prepare(`
            UPDATE project_members
            SET role = ?
            WHERE project_id = ? AND user_id = ?
        `).run(newRole, project_id, user_id);
        
        const updatedMembership = this.getMembership(project_id, user_id);
        if (!updatedMembership) {
            throw httpError(404, "Membership not found");
        }
        return updatedMembership;
    }
    
    // Delete
    removeMember(project_id, user_id, requester_id) {
        const membership = this.getMembership(project_id, user_id);
        if (!membership) {
            throw httpError(404, "Membership not found");
        }
        this.db.prepare(`
            DELETE FROM project_members
            WHERE project_id = ? AND user_id = ?
        `).run(project_id, user_id);

        const project = this.db.prepare(`
            SELECT name
            FROM projects
            WHERE id = ?
        `).get(project_id);

        this.activityRepo.logActivity({
            project_id: project_id,
            actor_user_id: requester_id,
            action: `removed member ${membership.username} from`,
            target_label: project?.name ?? ''
        });

        return { success: true, message: "Member removed", membership };
    }
}

module.exports = {
    MembersRepo,
}
// imports
const { createError } = require("../utils/httpError");
const { dbConnection } = require("../db/db");

class MembersRepo {
    constructor() {
        this.db = dbConnection;
    }
    
    // Create
    addMember(project_id, user_id, role = 'member') {
        if (role !== 'admin' && role !== 'member') {
            throw createError.BadRequest("Invalid role");
        }

        try {
            this.db.prepare(`
                INSERT INTO project_members (project_id, user_id, role)
                VALUES (?, ?, ?)
            `).run(project_id, user_id, role);
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
                err.message.includes('UNIQUE constraint failed')) {
                throw createError.Conflict("User is already a member of this project");
            }
            throw err;
        }

        return this.getMembership(project_id, user_id);
    }
    
    // Read
    getMembership(project_id, user_id) {
        const membership = this.db.prepare(`
            SELECT *
            FROM project_members
            WHERE project_id = ? AND user_id = ?
        `).get(project_id, user_id);
        if (!membership) {
            throw createError.NotFound("Membership not found");
        }
        return membership;
    }
    
    getMembersByProjectId(project_id) {
        return this.db.prepare(`
            SELECT *
            FROM project_members
            WHERE project_id = ?
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
            throw createError.BadRequest("Invalid role");
        }
        this.db.prepare(`
            UPDATE project_members
            SET role = ?
            WHERE project_id = ? AND user_id = ?
        `).run(newRole, project_id, user_id);
        
        const updatedMembership = this.getMembership(project_id, user_id);
        return updatedMembership;
    }
    
    // Delete
    removeMember(project_id, user_id) {
        const membership = this.getMembership(project_id, user_id);
        this.db.prepare(`
            DELETE FROM project_members
            WHERE project_id = ? AND user_id = ?
        `).run(project_id, user_id);
        return { success: true, message: "Member removed", membership };
    }
}

module.exports = {
    MembersRepo,
}
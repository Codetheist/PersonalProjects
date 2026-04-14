const { createError, httpError } = require("../utils/errors");

class MembersRepo {
    constructor(db) {
        this.db = db;
    }
    
    // Create
    async addMember(project_id, user_id, role = 'member') {
        if (role !== 'admin' && role !== 'member') {
            throw createError(httpError.BAD_REQUEST, "Invalid role");
        }

        await this.db("project_members").insert({ project_id, user_id, role });
    }

    
    // Read
    async getMembership(project_id, user_id) {
        const membership = await this.db("project_members")
            .where({ project_id, user_id })
            .first();
        if (!membership) {
            throw createError(httpError.NOT_FOUND, "Membership not found");
        }
        return membership;
    }
    async getMembersByProjectId(project_id) {
        return await this.db("project_members")
            .where({ project_id });
    }
    async getProjectsByUserId(user_id) {
        return await this.db("project_members")
            .where({ user_id });
    }
    
    // Update
    async updateMemberRole(project_id, user_id, newRole) {
        if (newRole !== 'admin' && newRole !== 'member') {
            throw createError(httpError.BAD_REQUEST, "Invalid role");
        }
        await this.db("project_members")
            .where({ project_id, user_id })
            .update({ role: newRole });
        
        const updatedMembership = await this.getMembership(project_id, user_id);
        return updatedMembership;

    }
    
    // Delete
    async removeMember(project_id, user_id) {
        const membership = await this.getMembership(project_id, user_id);
        await this.db("project_members")
            .where({ project_id, user_id })
            .del();
        return { success: true, message: "Member removed", membership };
    }
}

module.exports = {
    MembersRepo,
}
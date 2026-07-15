// Imports
const { uid } = require("../utils/ids");
const { httpError } = require('../utils/httpError');
const { dbConnection } = require("../db/db");
const { isValidDate } = require("../utils/date");
const { ActivityRepo } = require("./activity.repo");

class ProjectsRepo {
    constructor() {
        this.db = dbConnection;
        this.activityRepo = new ActivityRepo();
    }
    
    // Create
    createProject({owner_id, name, description, status, due_date}) {
        const id = uid();
        owner_id = (owner_id ?? "").trim();
        name = (name ?? "").trim();
        description = (description ?? "").trim() || null;
        status = (status ?? "active").trim();
        due_date = (due_date ?? "").trim() || null;

        if (!name || name.length < 3) {
            throw httpError(400, "Project name must be at least 3 characters long");
        }

        if (!isValidDate(due_date)) {
            throw httpError(400, "Invalid due date format (YYYY-MM-DD)");
        }

        if (!["active", "completed", "archived"].includes(status)) {
            throw httpError(400, "Invalid project status");
        }

        const user = this.db.prepare(`
            SELECT id
            FROM users
            WHERE id = ?
        `).get(owner_id);

        if (!user) {
            throw httpError(404, "Owner user not found");
        }

        const result = this.db.prepare(`
            INSERT INTO projects (id, owner_id, name, description, due_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *
        `).get(id, owner_id, name, description, due_date, status);

        this.activityRepo.logActivity({
            project_id: id,
            actor_user_id: owner_id,
            action: "created project",
            target_label: name
        });
        
        return { project: result, message: "Project created successfully" };
    }
    
    // Read
    getProjectById(id) {
        const project = this.db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(id);

        return project;
    }

    getProjectsByMembership(user_id) {
        const projects = this.db.prepare(`
            SELECT p.*, (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) AS members_count
            FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.owner_id = ? OR pm.user_id = ?
            GROUP BY p.id
        `).all(user_id, user_id);
        
        return projects;
    }
    
    // Update
    updateProject(id, updates = {}, user_id) {
        id = (id ?? "").trim();
        
        if (!id) {
            throw httpError(400, "Project ID is required");
        }
        
        const project = this.db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(id);

        if (!project) {
            throw httpError(404, "Project not found");
        }

        const updatedProject = {};

        if (updates.name !== undefined) {
            const name = (updates.name ?? "").trim();
            if (!name || name.length < 3) {
                throw httpError(400, "Project name must be at least 3 characters long");
            }
            updatedProject.name = name;
        }

        if (updates.description !== undefined) {
            updatedProject.description = (updates.description ?? "").trim() || null;
        }

        if (updates.status !== undefined) {
            const status = (updates.status ?? "").trim();
            if (!["active", "completed", "archived"].includes(status)) {
                throw httpError(400, "Invalid project status");
            }   
            updatedProject.status = status;
        }

        if (updates.due_date !== undefined) {
            const due_date = (updates.due_date ?? "").trim() || null;
            if (!isValidDate(due_date)) {
                throw httpError(400, "Invalid due date format (YYYY-MM-DD)");
            }
            updatedProject.due_date = due_date;
        }

        if (Object.keys(updatedProject).length === 0) {
            throw httpError(400, "No valid fields provided for update");
        }

        const nextName = "name" in updatedProject ? updatedProject.name : project.name;
        const nextDescription = "description" in updatedProject ? updatedProject.description : project.description;
        const nextStatus = "status" in updatedProject ? updatedProject.status : project.status;
        const nextDueDate = "due_date" in updatedProject ? updatedProject.due_date : project.due_date;
        const result = this.db.prepare(`
            UPDATE projects
            SET name = ?, description = ?, status = ?, due_date = ?
            WHERE id = ?
            RETURNING *
        `).get(
            nextName,
            nextDescription,
            nextStatus,
            nextDueDate,
            id
        );

        const changes = [];
        if ("name" in updatedProject && updatedProject.name !== project.name) 
            changes.push(`name from "${project.name}" to "${nextName}"`);
        if ("description" in updatedProject && updatedProject.description !== project.description) 
            changes.push(`description to "${updatedProject.description?.slice(0, 50) ?? ''}"`)
        if ("status" in updatedProject && nextStatus !== 'archived' && nextStatus !== project.status) 
            changes.push(`status to "${nextStatus}"`);
        if ("due_date" in updatedProject && nextDueDate !== project.due_date) 
            changes.push(`due date to "${nextDueDate ?? 'none'}"`);
        const changeLabel = changes.length ? `updated ${changes.join(', ')} on` : "updated";


        if (nextStatus === 'archived' && project.status !== 'archived') {
            this.activityRepo.logActivity({
                project_id: id,
                actor_user_id: user_id,
                action: "archived project",
                target_label: nextName
            });
        } else if (nextStatus !== 'archived' && project.status === 'archived') {
            this.activityRepo.logActivity({
            project_id: id,
                actor_user_id: user_id,
                action: "restored project",
                target_label: nextName
            });
        } else if (changes.length > 0) {
            this.activityRepo.logActivity({
                project_id: id,
                actor_user_id: user_id,
                action: "updated project",
                target_label: nextName
            });
        }

        return { project: result, message: "Project updated successfully" };
    }
    
    // Delete
    deleteProject(id) {
        id = (id ?? "").trim();
        
        if (!id) {
            throw httpError(400, "Project ID is required");
        }

        const project = this.db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(id);

        if (!project) {
            throw httpError(404, "Project not found");
        }

        this.db.prepare(`
            DELETE FROM projects
            WHERE id = ?
        `).run(id);
        
        return { project, message: "Project deleted successfully" };
    }
}

module.exports = {
    ProjectsRepo,
}
// imports
const { uid } = require("../utils/ids");
const { createError } = require("../utils/httpError");
const { dbConnection } = require("../db/db");
const { isValidDate } = require("../utils/date");

class ProjectsRepo {
    constructor() {
        this.db = dbConnection;
    }
    
    // Create
    createProject({owner_id, name, description, status, due_date}) {
        const id = uid();
        owner_id = (owner_id ?? "").trim();
        name = (name ?? "").trim();
        description = (description ?? "").trim() || null;
        status = (status ?? "active").trim();
        due_date = (due_date ?? "").trim() || null;

        if (!owner_id) {
            throw createError.BadRequest("Owner ID is required");
        }

        if (!name || name.length < 3) {
            throw createError.BadRequest("Project name must be at least 3 characters long");
        }

        if (!isValidDate(due_date)) {
            throw createError.BadRequest("Invalid due date format (YYYY-MM-DD)");
        }

        if (!["active", "completed", "archived"].includes(status)) {
            throw createError.BadRequest("Invalid project status");
        }

        const user = this.db.prepare(`
            SELECT id
            FROM users
            WHERE id = ?
        `).get(owner_id);
        
        if (!user) {
            throw createError.NotFound("Owner user not found");
        }
        
        const result = this.db.prepare(`
            INSERT INTO projects (id, owner_id, name, description, due_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *
        `).get(id, owner_id, name, description, due_date, status);
        
        return { project: result, message: "Project created successfully" };
    }
    
    // Read
    getProjectById(id) {
        const project = this.db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(id);
        if (!project) {
            throw createError.NotFound("Project not found");
        }
        return project;
    }

    getProjectsByOwnerId(owner_id) {
        const projects = this.db.prepare(`
            SELECT *
            FROM projects
            WHERE owner_id = ?
        `).all(owner_id);
        
        return projects;
    }
    
    // Update
    updateProject(id, updates = {}) {
        id = (id ?? "").trim();
        
        if (!id) {
            throw createError.BadRequest("Project ID is required");
        }
        
        const project = this.db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(id);
        
        if (!project) {
            throw createError.NotFound("Project not found");
        }

        const updatedProject = {};

        if (updates.name !== undefined) {
            const name = (updates.name ?? "").trim();
            if (!name || name.length < 3) {
                throw createError.BadRequest("Project name must be at least 3 characters long");
            }
            updatedProject.name = name;
        }

        if (updates.description !== undefined) {
            updatedProject.description = (updates.description ?? "").trim() || null;
        }

        if (updates.status !== undefined) {
            const status = (updates.status ?? "").trim();
            if (!["active", "completed", "archived"].includes(status)) {
                throw createError.BadRequest("Invalid project status");
            }   
            updatedProject.status = status;
        }

        if (updates.due_date !== undefined) {
            const due_date = (updates.due_date ?? "").trim() || null;
            if (!isValidDate(due_date)) {
                throw createError.BadRequest("Invalid due date format (YYYY-MM-DD)");
            }
            updatedProject.due_date = due_date;
        }

        if (Object.keys(updatedProject).length === 0) {
            throw createError.BadRequest("No valid fields provided for update");
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
        return { project: result, message: "Project updated successfully" };
    }
    
    // Delete
    deleteProject(id) {
        id = (id ?? "").trim();
        
        if (!id) {
            throw createError.BadRequest("Project ID is required");
        }

        const project = this.db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(id);
        
        if (!project) {
            throw createError.NotFound("Project not found");
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
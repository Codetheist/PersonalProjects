const { uid } = require("../utils/ids");
const { createError, httpError } = require("../utils/errors");

class ProjectsRepo {
    constructor(db) {
        this.db = db;
    }
    
    // Create
    async createProject({owner_id, name, description, status, due_date}) {
        const id = uid();
        owner_id = (owner_id ?? "").trim();
        name = (name ?? "").trim();
        description = (description ?? "").trim() || null;
        status = (status ?? "active").trim();
        due_date = (due_date ?? "").trim() || null;

        if (!owner_id) {
            throw createError(httpError.BAD_REQUEST, "Owner ID is required");
        }

        if (!name || name.length < 3) {
            throw createError(httpError.BAD_REQUEST, "Project name must be at least 3 characters long");
        }

        if (!isValidDate(due_date)) {
            throw createError(httpError.BAD_REQUEST, "Invalid due date format (YYYY-MM-DD)");
        }

        if (!["active", "completed", "archived"].includes(status)) {
            throw createError(httpError.BAD_REQUEST, "Invalid project status");
        }

        const user = await this.db("users")
            .select("id")
            .where({ id: owner_id })
            .first();
        
        if (!user) {
            throw createError(httpError.NOT_FOUND, "Owner user not found");
        }
        
        const project = {
            id,
            owner_id,
            name,
            description,
            due_date,
            status
        };
        
        const result = await this.db("projects").insert(project).returning("*");
        return { project: result[0], message: "Project created successfully" };

    }
    
    // Read
    async getProjectById(id) {
        const project = await this.db("projects")
            .select("*")
            .where({ id })
            .first();
        if (!project) {
            throw createError(httpError.NOT_FOUND, "Project not found");
        }
        return project;
    }

    async getProjectsByOwnerId(owner_id) {
        const projects = await this.db("projects")
            .select("*")
            .where({ owner_id });
        if (!projects || projects.length === 0) {
            throw createError(httpError.NOT_FOUND, "No projects found for this owner");
        }
        return projects;
    }
    
    // Update
    async updateProject(id, updates = {}) {
        id = (id ?? "").trim();
        
        if (!id) {
            throw createError(httpError.BAD_REQUEST, "Project ID is required");
        }
        
        const project = await this.db("projects")
            .select("*")
            .where({ id })
            .first();
        
        if (!project) {
            throw createError(httpError.NOT_FOUND, "Project not found");
        }

        const updatedProject = {};

        if (updates.name !== undefined) {
            const name = (updates.name ?? "").trim();
            if (!name || name.length < 3) {
                throw createError(httpError.BAD_REQUEST, "Project name must be at least 3 characters long");
            }
            updatedProject.name = name;
        }

        if (updates.description !== undefined) {
            updatedProject.description = (updates.description ?? "").trim() || null;
        }

        if (updates.status !== undefined) {
            const status = (updates.status ?? "").trim();
            if (!["active", "completed", "archived"].includes(status)) {
                throw createError(httpError.BAD_REQUEST, "Invalid project status");
            }   
            updatedProject.status = status;
        }

        if (updates.due_date !== undefined) {
            const due_date = (updates.due_date ?? "").trim() || null;
            if (!isValidDate(due_date)) {
                throw createError(httpError.BAD_REQUEST, "Invalid due date format (YYYY-MM-DD)");
            }
            updatedProject.due_date = due_date;
        }

        if (Object.keys(updatedProject).length === 0) {
            throw createError(httpError.BAD_REQUEST, "No valid fields provided for update");
        }

        const result = await this.db("projects")
            .update(updatedProject)
            .where({ id })
            .returning("*");
        return { project: result[0], message: "Project updated successfully" };
    }
    
    // Delete
    async deleteProject(id) {
        id = (id ?? "").trim();
        
        if (!id) {
            throw createError(httpError.BAD_REQUEST, "Project ID is required");
        }

        const project = await this.db("projects")
            .select("*")
            .where({ id })
            .first();
        
        if (!project) {
            throw createError(httpError.NOT_FOUND, "Project not found");
        }

        await this.db("projects")
            .where({ id })
            .del();
        
        return { message: "Project deleted successfully" };
    }
}

function isValidDate(date) {
    if (date == null) return true;
    if (!/^[1-2]\d{3}-\d{2}-\d{2}$/.test(date)) return false;
    
    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return (
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day
    );
}

module.exports = {
    ProjectsRepo,
}
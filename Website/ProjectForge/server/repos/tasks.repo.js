const { uid } = require("../utils/ids");
const { createError, httpError } = require("../utils/errors");

class TasksRepo {
    constructor(db) {
        this.db = db;
    }
    
    // Create
    async createTask({project_id, title, description, status, priority, due_date }) {
        const id = uid();
        project_id = (project_id ?? "").trim();
        title = (title ?? "").trim();
        description = (description ?? "").trim() || null;
        status = (status ?? "todo").trim().toLowerCase();
        priority = (priority ?? "medium").trim().toLowerCase();
        due_date = (due_date ?? "").trim() || null;

        if (!project_id) {
            throw createError(httpError.BAD_REQUEST, "Project ID is required");
        }

        if (title.length < 3) {
            throw createError(httpError.BAD_REQUEST, "Title must be at least 3 characters long");
        }

        if (!["todo", "doing", "done"].includes(status)) {
            throw createError(httpError.BAD_REQUEST, "Invalid status value");
        }

        if (!["low", "medium", "high"].includes(priority)) {
            throw createError(httpError.BAD_REQUEST, "Invalid priority value");
        }

        if (!isValidDate(due_date)) {
            throw createError(httpError.BAD_REQUEST, "Invalid due date format (YYYY-MM-DD)");
        }

        const project = await this.db("projects")
            .select("id")
            .where({ id: project_id })
            .first();
        
        if (!project) {
            throw createError(httpError.NOT_FOUND, "Project not found");
        }

        const task = {
            id,
            project_id,
            title,
            description,
            status,
            priority,
            due_date
        };

        await this.db("tasks").insert(task);

        return { task: await this.getTaskById(id), message: "Task created successfully" };
    }
	
	// Read	
    async getTaskById(id) {
        const task = await this.db("tasks")
            .select("*")
            .where({ id })
            .first();
        if (!task) {
            throw createError(httpError.NOT_FOUND, "Task not found");
        }
        return task;
    }
	
    async getAllTasks() {
        return await this.db("tasks").select("*");
    }
    
    // Update
    async updateTask(id, updates = {}) {
        id = (id ?? "").trim();
        if (!id) {
            throw createError(httpError.BAD_REQUEST, "Task ID is required");
        }

        const task = await this.db("tasks")
            .select("*")
            .where({ id })
            .first();
        
        if (!task) {
            throw createError(httpError.NOT_FOUND, "Task not found");
        }

        const updatedTask = {};

        if (updates.title !== undefined) {
            const title = (updates.title ?? "").trim();
            
            if (title.length < 3) {
                throw createError(httpError.BAD_REQUEST, "Title must be at least 3 characters long");
            }
            
            updatedTask.title = title;
        }
        
        if (updates.description !== undefined) {
            updatedTask.description = (updates.description ?? "").trim() || null;
        }
        
        if (updates.status !== undefined) {
            const status = (updates.status ?? "").trim().toLowerCase();
            
            if (!["todo", "doing", "done"].includes(status)) {
                throw createError(httpError.BAD_REQUEST, "Invalid status value");
            }
            
            updatedTask.status = status;
        }

        if (updates.priority !== undefined) {
            const priority = (updates.priority ?? "").trim().toLowerCase();

            if (!["low", "medium", "high"].includes(priority)) {
                throw createError(httpError.BAD_REQUEST, "Invalid priority value");
            }
            
            updatedTask.priority = priority;
        }

        if (updates.due_date !== undefined) {
            const due_date = (updates.due_date ?? "").trim() || null;

            if (!isValidDate(due_date)) {
                throw createError(httpError.BAD_REQUEST, "Invalid due date format (YYYY-MM-DD)");
            }
            
            updatedTask.due_date = due_date;
        }

        if (Object.keys(updatedTask).length === 0) {
            throw createError(httpError.BAD_REQUEST, "No valid fields to update");
        }

        await this.db("tasks")
            .where({ id })
            .update(updatedTask);
        
        return { task: await this.getTaskById(id), message: "Task updated successfully" };

    }
    
    // Delete
    async deleteTask(id) {
        
        const task = await this.db("tasks")
            .select("*")
            .where({ id })
            .first();
        
        if (!task) {
            throw createError(httpError.NOT_FOUND, "Task not found");
        }

        await this.db("tasks")
            .where({ id })
            .delete();
        
        return { task, message: "Task deleted successfully" };
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
    TasksRepo
};
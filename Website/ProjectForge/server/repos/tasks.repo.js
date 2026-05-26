// imports
const { uid } = require("../utils/ids");
const { createError } = require("../utils/httpError");
const { dbConnection } = require("../db/db");
const { isValidDate } = require("../utils/date");

class TasksRepo {
    constructor() {
        this.db = dbConnection;
    }
    
    // Create
    createTask({project_id, title, description, status, priority, due_date }) {
        const id = uid();
        project_id = (project_id ?? "").trim();
        title = (title ?? "").trim();
        description = (description ?? "").trim() || null;
        status = (status ?? "todo").trim().toLowerCase();
        priority = (priority ?? "medium").trim().toLowerCase();
        due_date = (due_date ?? "").trim() || null;

        if (!project_id) {
            throw createError.BadRequest("Project ID is required");
        }

        if (title.length < 3) {
            throw createError.BadRequest("Title must be at least 3 characters long");
        }

        if (!["todo", "doing", "done"].includes(status)) {
            throw createError.BadRequest("Invalid status value");
        }

        if (!["low", "medium", "high"].includes(priority)) {
            throw createError.BadRequest("Invalid priority value");
        }

        if (!isValidDate(due_date)) {
            throw createError.BadRequest("Invalid due date format (YYYY-MM-DD)");
        }

        const project = this.db.prepare(`
            SELECT id
            FROM projects
            WHERE id = ?
        `).get(project_id);
        
        if (!project) {
            throw createError.NotFound("Project not found");
        }
        
        this.db.prepare(`
            INSERT INTO tasks (id, project_id, title, description, status, priority, due_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, project_id, title, description, status, priority, due_date);

        return { task: this.getTaskById(id), message: "Task created successfully" };
    }
	
	// Read	
    getTaskById(id) {
        const task = this.db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);
        if (!task) {
            throw createError.NotFound("Task not found");
        }
        return task;
    }

    getTasksByProjectId(project_id) {
        const tasks = this.db.prepare(`
            SELECT *
            FROM tasks
            WHERE project_id = ?
        `).all(project_id);
        
        return tasks;
    }
	
    getAllTasks() {
        const tasks = this.db.prepare(`
            SELECT *
            FROM tasks
        `).all();

        return tasks;
    }
    
    // Update
    updateTask(id, updates = {}) {
        id = (id ?? "").trim();
        if (!id) {
            throw createError.BadRequest("Task ID is required");
        }

        const task = this.db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);
        
        if (!task) {
            throw createError.NotFound("Task not found");
        }

        const updatedTask = {};

        if (updates.title !== undefined) {
            const title = (updates.title ?? "").trim();
            
            if (title.length < 3) {
                throw createError.BadRequest("Title must be at least 3 characters long");
            }
            
            updatedTask.title = title;
        }
        
        if (updates.description !== undefined) {
            updatedTask.description = (updates.description ?? "").trim() || null;
        }
        
        if (updates.status !== undefined) {
            const status = (updates.status ?? "").trim().toLowerCase();
            
            if (!["todo", "doing", "done"].includes(status)) {
                throw createError.BadRequest("Invalid status value");
            }
            
            updatedTask.status = status;
        }

        if (updates.priority !== undefined) {
            const priority = (updates.priority ?? "").trim().toLowerCase();

            if (!["low", "medium", "high"].includes(priority)) {
                throw createError.BadRequest("Invalid priority value");
            }
            
            updatedTask.priority = priority;
        }

        if (updates.due_date !== undefined) {
            const due_date = (updates.due_date ?? "").trim() || null;

            if (!isValidDate(due_date)) {
                throw createError.BadRequest("Invalid due date format (YYYY-MM-DD)");
            }
            
            updatedTask.due_date = due_date;
        }

        if (Object.keys(updatedTask).length === 0) {
            throw createError.BadRequest("No valid fields to update");
        }

        const nextTitle = "title" in updatedTask ? updatedTask.title : task.title;
        const nextDescription = "description" in updatedTask ? updatedTask.description : task.description;
        const nextStatus = "status" in updatedTask ? updatedTask.status : task.status;
        const nextPriority = "priority" in updatedTask ? updatedTask.priority : task.priority;
        const nextDueDate = "due_date" in updatedTask ? updatedTask.due_date : task.due_date;

        this.db.prepare(`
            UPDATE tasks
            SET title = ?, description = ?, status = ?, priority = ?, due_date = ?
            WHERE id = ?
        `).run(
            nextTitle,
            nextDescription,
            nextStatus,
            nextPriority,
            nextDueDate,
            id
        );
        
        return { task: this.getTaskById(id), message: "Task updated successfully" };

    }
    
    // Delete
    deleteTask(id) {
        id = (id ?? "").trim();
        if (!id) {
            throw createError.BadRequest("Task ID is required");
        }

        const task = this.db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);
        
        if (!task) {
            throw createError.NotFound("Task not found");
        }

        this.db.prepare(`
            DELETE FROM tasks
            WHERE id = ?
        `).run(id);
        
        return { task, message: "Task deleted successfully" };
    }
}

module.exports = {
    TasksRepo
};
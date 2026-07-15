// Imports
const { uid } = require("../utils/ids");
const { httpError } = require('../utils/httpError');
const { dbConnection } = require("../db/db");
const { isValidDate } = require("../utils/date");
const { ActivityRepo } = require("./activity.repo");

class TasksRepo {
    constructor() {
        this.db = dbConnection;
        this.activityRepo = new ActivityRepo();
    }
    
    // Create
    createTask({ project_id, title, description, status, priority, due_date, assigned_to, user_id }) {
        const id = uid();
        project_id = (project_id ?? "").trim();
        title = (title ?? "").trim();
        description = (description ?? "").trim() || null;
        status = (status ?? "todo").trim().toLowerCase();
        priority = (priority ?? "medium").trim().toLowerCase();
        due_date = (due_date ?? "").trim() || null;
        assigned_to = (assigned_to ?? "").trim() || null;

        if (!project_id) {
            throw httpError(400, "Project ID is required");
        }

        if (title.length < 3) {
            throw httpError(400, "Title must be at least 3 characters long");
        }

        if (!["todo", "doing", "done"].includes(status)) {
            throw httpError(400, "Invalid status value");
        }

        if (!["low", "medium", "high"].includes(priority)) {
            throw httpError(400, "Invalid priority value");
        }

        if (!isValidDate(due_date)) {
            throw httpError(400, "Invalid due date format (YYYY-MM-DD)");
        }

        const project = this.db.prepare(`
            SELECT id
            FROM projects
            WHERE id = ?
        `).get(project_id);

        if (!project) {
            throw httpError(404, "Project not found");
        }

        if (assigned_to) {
            this.assertProjectMember(project_id, assigned_to);
        }
        
        this.db.prepare(`
            INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assigned_to)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, project_id, title, description, status, priority, due_date, assigned_to);

        this.activityRepo.logActivity({
            project_id: project_id,
            actor_user_id: user_id,
            action: "created task",
            target_label: title
        });

        return { task: this.getTaskById(id), message: "Task created successfully" };
    }
	
    // Read	
    getTaskById(id) {
        const task = this.db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);
        
        return task;
    }

    getTasksByProjectId(project_id) {
        const tasks = this.db.prepare(`
            SELECT *
            FROM tasks
            WHERE project_id = ?
            ORDER BY 
                due_date IS NULL,
                due_date ASC,
                created_at DESC
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
    updateTask(id, updates = {}, user_id) {
        id = (id ?? "").trim();
        if (!id) {
            throw httpError(400, "Task ID is required");
        }

        const task = this.db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);

        if (!task) {
            throw httpError(404, "Task not found");
        }

        const updatedTask = {};

        if (updates.title !== undefined) {
            const title = (updates.title ?? "").trim();
            
            if (title.length < 3) {
                throw httpError(400, "Title must be at least 3 characters long");
            }
            
            updatedTask.title = title;
        }
        
        if (updates.description !== undefined) {
            updatedTask.description = (updates.description ?? "").trim() || null;
        }
        
        if (updates.status !== undefined) {
            const status = (updates.status ?? "").trim().toLowerCase();
            
            if (!["todo", "doing", "done"].includes(status)) {
                throw httpError(400, "Invalid status value");
            }
            
            updatedTask.status = status;
        }

        if (updates.priority !== undefined) {
            const priority = (updates.priority ?? "").trim().toLowerCase();

            if (!["low", "medium", "high"].includes(priority)) {
                throw httpError(400, "Invalid priority value");
            }
            
            updatedTask.priority = priority;
        }

        if (updates.due_date !== undefined) {
            const due_date = (updates.due_date ?? "").trim() || null;

            if (!isValidDate(due_date)) {
                throw httpError(400, "Invalid due date format (YYYY-MM-DD)");
            }
            
            updatedTask.due_date = due_date;
        }

        if (updates.assigned_to !== undefined) {
            const assigned_to = (updates.assigned_to ?? "").trim() || null;

            if (assigned_to) {
                this.assertProjectMember(task.project_id, assigned_to);
            }
        }

        if (Object.keys(updatedTask).length === 0) {
            throw httpError(400, "No valid fields to update");
        }

        const nextTitle = "title" in updatedTask ? updatedTask.title : task.title;
        const nextDescription = "description" in updatedTask ? updatedTask.description : task.description;
        const nextStatus = "status" in updatedTask ? updatedTask.status : task.status;
        const nextPriority = "priority" in updatedTask ? updatedTask.priority : task.priority;
        const nextDueDate = "due_date" in updatedTask ? updatedTask.due_date : task.due_date;
        const nextAssignedTo = "assigned_to" in updatedTask ? updatedTask.assigned_to : task.assigned_to;

        this.db.prepare(`
            UPDATE tasks
            SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, assigned_to = ?
            WHERE id = ?
        `).run(
            nextTitle,
            nextDescription,
            nextStatus,
            nextPriority,
            nextDueDate,
            nextAssignedTo,
            id
        );
        
        if (nextStatus === 'done' && task.status !== 'done') {
            this.activityRepo.logActivity({
                project_id: task.project_id,
                actor_user_id: user_id,
                action: "completed task",
                target_label: nextTitle
            });
        }

        return { task: this.getTaskById(id), message: "Task updated successfully" };

    }
    
    // Delete
    deleteTask(id) {
        id = (id ?? "").trim();
        if (!id) {
            throw httpError(400, "Task ID is required");
        }

        const task = this.db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);

        if (!task) {
            throw httpError(404, "Task not found");
        }

        this.db.prepare(`
            DELETE FROM tasks
            WHERE id = ?
        `).run(id);
        
        return { task, message: "Task deleted successfully" };
    }

    assertProjectMember(project_id, user_id) {
        const member = this.db.prepare(`
            SELECT user_id
            FROM project_members
            WHERE project_id = ? AND user_id = ?
        `).get(project_id, user_id);
        if (!member) {
            throw httpError(403, "User is not a member of the project");
        }
    }
}

module.exports = {
    TasksRepo
};
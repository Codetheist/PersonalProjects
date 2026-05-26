// imports
const { uid } = require("../utils/ids");
const { createError } = require("../utils/httpError");
const argon2 = require("argon2");
const { dbConnection } = require("../db/db");

class UsersRepo {
    constructor() {
        this.db = dbConnection;
    }
    
    async createUser({ username, email, password }) {
        username = (username ?? "").trim();
        email = (email ?? "").trim();

        if (typeof password !== "string" || password.length < 8 || password !== password.trim()) {
            throw createError.BadRequest("Password must be at least 8 characters long and cannot have leading or trailing whitespace.");
        }

        const id = uid();
        const password_hash = await argon2.hash(password);

        try {
            this.db.prepare(`
                INSERT INTO users (id, username, email, password_hash)
                VALUES (?, ?, ?, ?)
            `).run(id, username, email, password_hash);
        } catch (databaseError) {
            if (databaseError.message.includes("UNIQUE constraint failed: users.username")) {
                throw createError.BadRequest("Username already exists.");
            }
            if (databaseError.message.includes("UNIQUE constraint failed: users.email")) {
                throw createError.BadRequest("Email already exists.");
            }
            throw createError.InternalServerError("Database error.");
        }

        return this.db.prepare(`
            SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE id = ?
        `).get(id);
        

    }

    async authenticate(identifier, password) {
        identifier = (identifier ?? "").trim();
        if (!identifier) {
            return null;
        }
        const user = this.db.prepare(`
            SELECT id, username, email, password_hash, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE (email = ? OR username = ?)
            AND is_active = 1
        `).get(identifier, identifier);
        if (!user) {
            return null;
        }
        if (typeof password !== "string") {
            return null;
        }
        const isValid = await argon2.verify(user.password_hash, password);
        if (!isValid) {
            return null;
        }
        
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    deactivateUser(userId) {
        this.db.prepare(`
            UPDATE users
            SET is_active = 0,
                deleted_at = unixepoch()
            WHERE id = ?
        `).run(userId);

        return this.db.prepare(`
            SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE id = ?
        `).get(userId);
    }

    restoreUser(userId) {
        this.db.prepare(`
            UPDATE users
            SET is_active = 1,
                deleted_at = NULL
            WHERE id = ?
        `).run(userId);

        return this.db.prepare(`
            SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE id = ?
        `).get(userId);
    }

    findUserById(userId) {
        return this.db.prepare(`
            SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE id = ?
        `).get(userId);
    }

    findUserByEmail(email) {
        email = (email ?? "").trim();
        
        if (!email) {
            return null;
        }
        
        return this.db.prepare(`
            SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE email = ?
        `).get(email);
    }

    findUserByUsername(username) {
        username = (username ?? "").trim();
        
        if (!username) {
            return null;
        }

        return this.db.prepare(`
            SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE username = ?
        `).get(username);
    }
}

module.exports = {
    UsersRepo
};
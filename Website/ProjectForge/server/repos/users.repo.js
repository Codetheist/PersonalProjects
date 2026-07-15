// Imports
const { uid } = require("../utils/ids");
const { httpError } = require('../utils/httpError');
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
            throw httpError(400, "Password must be at least 8 characters long and cannot have leading or trailing whitespace.");
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
                throw httpError(400, "Username already exists.");
            }
            if (databaseError.message.includes("UNIQUE constraint failed: users.email")) {
                throw httpError(400, "Email already exists.");
            }
            throw httpError(500, "Database error.");
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
        
        const { ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    deactivateUser(userId) {
        const user = this.findUserById(userId);
        
        if (!user) {
            throw httpError(404, "User not found");
        }

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
        const user = this.findUserById(userId);
        
        if (!user) {
            throw httpError(404, "User not found");
        }

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

    async verifyPassword(userId, password) {
        const user = this.db.prepare(`
            SELECT id, username, email, password_hash, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE id = ?
        `).get(userId);

        if (!user) {
            throw httpError(404, "User not found");
        }

        return argon2.verify(user.password_hash, password);
    }

    async updatePassword(userId, newPassword) {
        if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword !== newPassword.trim()) {
            throw httpError(400, "Password must be at least 8 characters long and cannot have leading or trailing whitespace.");
        }

        const user = this.findUserById(userId);
        if (!user) {
            throw httpError(404, "User not found");
        }

        const newPasswordHash = await argon2.hash(newPassword);

        this.db.prepare(`
            UPDATE users
            SET password_hash = ?, updated_at = unixepoch()
            WHERE id = ?
        `).run(newPasswordHash, userId);
        
        return this.findUserById(userId);
    }

    async savePasswordResetToken(userId, token, expiresAt) {
        this.db.prepare(`
            UPDATE users
            SET password_reset_token = ?, password_reset_expires_at = ?
            WHERE id = ?
        `).run(token, expiresAt, userId);
    }

    async findUserByResetToken(hashedToken) {
        return this.db.prepare(`
            SELECT id, username, email, created_at, updated_at, is_active, deleted_at, password_reset_expires_at AS passwordResetExpiresAt
            FROM users
            WHERE password_reset_token = ?
        `).get(hashedToken);
    }

    async clearPasswordResetToken(userId) {
        this.db.prepare(`
            UPDATE users
            SET password_reset_token = NULL, password_reset_expires_at = NULL
            WHERE id = ?
        `).run(userId);
    }
}

module.exports = {
    UsersRepo
};
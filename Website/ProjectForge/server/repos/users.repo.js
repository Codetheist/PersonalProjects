const { uid } = require("../utils/ids");
const { createError, httpError } = require("../utils/errors");
const argon2 = require("argon2");

class UsersRepo {
    constructor(db) {
        this.db = db;
    }
    
    async createUser({ username, email, password }) {
        username = (username ?? "").trim();
        email = (email ?? "").trim();

        if (typeof password !== "string" || password.length < 8 || password !== password.trim()) {
            throw createError.NotFound("Password must be at least 8 characters long and cannot have leading or trailing whitespace.");
        }

        const id = uid();
        const password_hash = await argon2.hash(password);

        try {
            await this.db.run(
                `INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)`,
                [id, username, email, password_hash]
            );
        } catch (databaseError) {
            if (databaseError.message.includes("UNIQUE constraint failed: users.username")) {
                throw httpErrors(400,"Username already exists.");
            }
            if (databaseError.message.includes("UNIQUE constraint failed: users.email")) {
                throw httpErrors(400,"Email already exists.");
            }
            throw httpErrors(500,"Database error.");
        }

        return this.db.get(
            `SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users WHERE id = ?`, [id]
        );
        

    }

    async authenticate(identifier, password) {
        identifier = (identifier ?? "").trim();
        if (!identifier) {
            return null;
        }
        const user = await this.db.get(
            `SELECT id, username, email, password_hash, created_at, updated_at, is_active, deleted_at
            FROM users
            WHERE (email = ? OR username = ?)
            AND is_active = 1`,
            [identifier, identifier]
        );
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

    async deactivateUser(userId) {
        await this.db.run(
            `UPDATE users
            SET is_active = 0,
                deleted_at = unixepoch()
            WHERE id = ?`,
            [userId]
        );

        return this.db.get(
            `SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users WHERE id = ?`, [userId]
        );
    }

    async restoreUser(userId) {
        await this.db.run(
            `UPDATE users
            SET is_active = 1,
                deleted_at = NULL
            WHERE id = ?`,
            [userId]
        );

        return this.db.get(
            `SELECT id, username, email, created_at, updated_at, is_active, deleted_at
            FROM users WHERE id = ?`, [userId]
        );
    }
}

module.exports = {
    UsersRepo
};
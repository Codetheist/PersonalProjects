// import db dependency
const Database = require('better-sqlite3');

// import path if needed
const path = require('path');

// import fs if needed
const fs = require('fs');

// database file path
const dbFilePath = path.join(__dirname, "..", 'data', 'app.db');

// migrations folder path if needed
const migrationsPath = path.join(__dirname, 'migrations');

// create database connection
const dbConnection = new Database(dbFilePath);

// enable sqlite settings
function enableSqliteSettings() {
    dbConnection.pragma("foreign_keys = ON");
    // any other PRAGMA settings you want
    dbConnection.pragma("recursive_triggers = OFF");
}

// helper to read sql files if needed
function readSqlFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

// helper to create migrations tracking table
function createMigrationsTable() {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    dbConnection.exec(createTableSql);
}

// helper to get applied migrations if using migration system
function getAppliedMigrations() {
    const rows = dbConnection.prepare("SELECT name FROM schema_migrations").all();
    return rows.map(row => row.name);
}

// helper to run a single migration
function runSingleMigration(file, sql) {
    const transaction = dbConnection.transaction(() => {
        dbConnection.exec(sql);
        dbConnection
            .prepare("INSERT INTO schema_migrations (name) VALUES (?)")
            .run(file);
    });
    transaction();
}

// helper to run pending migrations in order
function runMigrations() {
    const appliedMigrations = getAppliedMigrations();
    
    const migrationFiles = fs
        .readdirSync(migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();
    
    for (const file of migrationFiles) {
        if (!appliedMigrations.includes(file)) {
            const sql = readSqlFile(path.join(migrationsPath, file));
            runSingleMigration(file, sql);
        }
    }
}

// initialize database function
function initDb() {
    try {
        enableSqliteSettings();
        createMigrationsTable();
        runMigrations();
        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Error initializing database:", err);
        throw err;
    }
}

// export
module.exports = {
    dbConnection,
    initDb,
};
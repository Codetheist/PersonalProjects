// import
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { config } = require("../config");

// database file path
const dbFilePath = path.resolve(__dirname, "..", config.dbPath);

// ensure data directory exists
fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });

// migrations folder path if needed
const migrationsPath = path.resolve(__dirname, 'migrations');

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
    if (!fs.existsSync(migrationsPath)) {
        throw new Error(`Migrations directory not found at ${migrationsPath}`);
    }
    
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
        return dbConnection;
    } catch (err) {
        throw err;
    }
}

// export
module.exports = {
    dbConnection,
    initDb,
};
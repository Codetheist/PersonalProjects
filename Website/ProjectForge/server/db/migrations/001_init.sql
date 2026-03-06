PRAGMA foreign_keys = ON;
PRAGMA recursive_triggers = OFF;

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
    deleted_at INTEGER,

    -- Validation checks
    CHECK (length(trim(email)) > 0),
    CHECK (length(trim(username)) > 0),
    CHECK (length(trim(password_hash)) > 0),
    CHECK (updated_at >= created_at),
    CHECK (
        (is_active = 1 AND deleted_at IS NULL)
        OR (is_active = 0 AND deleted_at IS NOT NULL)
    )
);

-- Trigger to update the updated_at timestamp on user updates
DROP TRIGGER IF EXISTS trg_users_updated_at;
CREATE TRIGGER trg_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE users
    SET updated_at = unixepoch()
    WHERE id = OLD.id;
END;
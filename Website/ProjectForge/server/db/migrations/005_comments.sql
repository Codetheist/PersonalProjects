PRAGMA foreign_keys = ON;
PRAGMA recursive_triggers = OFF;

CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    created_by_user_id TEXT NOT NULL,
    created_by_username TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),

    -- Validation checks
    CHECK (length(trim(body)) > 0),
    CHECK (length(body) <= 5000),
    CHECK (updated_at >= created_at),

    -- Foreign key constraints
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_comments_task_created ON comments(task_id, created_at);

-- Trigger to update the updated_at timestamp on comment updates
DROP TRIGGER IF EXISTS trg_comments_set_updated_at;
CREATE TRIGGER trg_comments_set_updated_at
AFTER UPDATE ON comments
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE comments
    SET updated_at = unixepoch()
    WHERE id = NEW.id;
END;
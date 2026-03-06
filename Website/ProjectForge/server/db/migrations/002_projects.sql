PRAGMA foreign_keys = ON;
PRAGMA recursive_triggers = OFF;

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    due_date TEXT
    CHECK (
        due_date IS NULL OR (
            due_date GLOB '[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'
            AND substr(due_date, 6, 2) BETWEEN '01' AND '12'
            AND substr(due_date, 9, 2) BETWEEN '01' AND '31'
            AND strftime('%Y-%m-%d', date(due_date)) = due_date
        )
    ),
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    
    -- Validation checks
    CHECK (length(trim(name)) >= 3),
    CHECK (updated_at >= created_at),

    -- Foreign key constraints
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Trigger to update the updated_at timestamp on project updates
DROP TRIGGER IF EXISTS trg_projects_set_updated_at;
CREATE TRIGGER trg_projects_set_updated_at
AFTER UPDATE ON projects
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE projects
    SET updated_at = unixepoch()
    WHERE id = NEW.id;
END;
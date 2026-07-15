PRAGMA foreign_keys = ON;
PRAGMA recursive_triggers = OFF;

CREATE TABLE IF NOT EXISTS activity (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    project_id TEXT,
    actor_user_id TEXT NOT NULL,
    action TEXT,
    target_label TEXT,

    -- Validation checks
    CHECK (length(trim(action)) > 0),
    CHECK (length(action) <= 1000),
    CHECK (length(trim(target_label)) > 0),
    CHECK (length(target_label) <= 1000),
    
    -- Foreign key constraints
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_activity_project_created ON activity(project_id, created_at);
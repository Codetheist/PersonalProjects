PRAGMA foreign_keys = ON;

ALTER TABLE tasks
    ADD COLUMN assigned_to TEXT NULL REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
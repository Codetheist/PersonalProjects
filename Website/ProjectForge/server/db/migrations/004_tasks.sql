PRAGMA foreign_keys = ON;
PRAGMA recursive_triggers = OFF;

CREATE TABLE IF NOT EXISTS tasks (
	id TEXT PRIMARY KEY,
	project_id TEXT NOT NULL,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
	priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
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
	CHECK (length(trim(title)) >= 3),
    CHECK (updated_at >= created_at),

	-- Foreign key constraints
	FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Trigger to update the updated_at timestamp on task updates
DROP TRIGGER IF EXISTS trg_tasks_set_updated_at;
CREATE TRIGGER trg_tasks_set_updated_at
AFTER UPDATE ON tasks
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE tasks
    SET updated_at = unixepoch()
    WHERE id = NEW.id;
END;
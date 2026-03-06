PRAGMA foreign_keys = ON;
PRAGMA recursive_triggers = OFF;

CREATE TABLE IF NOT EXISTS project_members (
    project_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),

    -- Composite primary key to prevent duplicate memberships
    PRIMARY KEY (project_id, user_id),
    
    -- Foreign keys to ensure referential integrity
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);

-- Automatically add the project owner as a member with the 'admin' role when a new project is created
DROP TRIGGER IF EXISTS trg_projects_add_owner_as_member;
CREATE TRIGGER trg_projects_add_owner_as_member
AFTER INSERT ON projects
FOR EACH ROW
BEGIN
    INSERT INTO project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'admin')
    ON CONFLICT(project_id, user_id) DO UPDATE SET role='admin';
END;

-- If the project owner changes, update the project_members table to reflect the new owner
DROP TRIGGER IF EXISTS trg_projects_owner_change_add_member;
CREATE TRIGGER trg_projects_owner_change_add_member
AFTER UPDATE OF owner_id ON projects
FOR EACH ROW
BEGIN
    INSERT INTO project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'admin')
    ON CONFLICT(project_id, user_id) DO UPDATE SET role='admin';

    -- demote old owner to member if they are still a member of the project
    UPDATE project_members
    SET role = 'member'
    WHERE project_id = NEW.id AND user_id = OLD.owner_id;
END;

DROP TABLE IF EXISTS issue_tags;
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS project_user_role;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS Users;


CREATE TABLE Users (
    username VARCHAR(255) PRIMARY KEY NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    can_create_project BOOLEAN NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE projects (
    project_id VARCHAR PRIMARY KEY NOT NULL,
    project_name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    owner_username VARCHAR NOT NULL DEFAULT 'admin',
    FOREIGN KEY (owner_username) REFERENCES Users(username) ON DELETE SET DEFAULT
);

CREATE TABLE Roles (
    role_name VARCHAR NOT NULL,
    project_id VARCHAR NOT NULL,
    create_issue BOOLEAN NOT NULL,
    edit_issue BOOLEAN NOT NULL,
    transition_issue BOOLEAN NOT NULL,
    close_issue BOOLEAN NOT NULL,
    delete_issue BOOLEAN NOT NULL,
    assignable BOOLEAN NOT NULL,
    PRIMARY KEY (role_name, project_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE TABLE project_user_role (
    project_id VARCHAR NOT NULL,
    role_name VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    PRIMARY KEY (project_id, username),
    FOREIGN KEY (project_id, role_name) REFERENCES roles(project_id, role_name) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);

CREATE TABLE issues (
    issue_id VARCHAR PRIMARY KEY NOT NULL,
    project_id VARCHAR NOT NULL,
    reported_by VARCHAR NOT NULL DEFAULT 'admin',
    summary VARCHAR NOT NULL,
    description TEXT NOT NULL,
    assignee VARCHAR NOT NULL DEFAULT 'admin',
    status VARCHAR CHECK (status IN ('opened', 'in progress', 'completed', 'closed')) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) on DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES Users(username) ON DELETE SET DEFAULT,
    FOREIGN KEY (assignee) REFERENCES Users(username) ON DELETE SET DEFAULT
);

CREATE TABLE issue_tags (
    issue_id VARCHAR NOT NULL,
    tag VARCHAR NOT NULL,
    PRIMARY KEY (issue_id, tag),
    FOREIGN KEY (issue_id) REFERENCES issues(issue_id) ON DELETE CASCADE
);
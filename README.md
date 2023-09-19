# Task Management System

Welcome to the Task Management System!

An admin account is created by default when this application is run for the first time.

**Admin Credentials:**
- Username: admin
- Password: admin

## Getting Started

To get started, log in as an admin to create new users and manage projects.

## Navigation

The navigation bar contains four sections:

1. **Home Page:** A brief introduction to the Task Management System.

2. **Projects:** Lists all the projects to which the user has access. The admin has access to all projects.

    - If the user has permission to create projects, the 'Create Project' button will be enabled.

    - Each project contains a list of issues.

3. **People:** Information about all active users (excluding deactivated users). Admins can delete and deactivate users.

    - If a user is deleted, all projects created by them will also be deleted.

    - If a user is deactivated, they will not appear in searches, cannot log in, and cannot be assigned any issues.

4. **Profile:** Users can edit personal information and log out.

## Project Details

When a project is opened, the following sections appear in the sidebar:

- **Details:** Information about the project.

- **Issues:** Lists all issues created within the project.

    - If the user has 'create issue' permission, 'Create issue' and 'Bulk Create issues' buttons will be enabled.

    - When bulk uploading issues using a CSV file, ensure that the header of the file follows this format:

        ```
        ReportedBy,Summary,Description,Assignee,Status,Tags
        ```

- **People:** Lists all active users with access to the project and their roles in the project.

- **Roles:** Roles determine the permissions a user has in the project, including:

    - Create issue
    - Edit issue (requires transition issue permission to change status)
    - Transition issue (change status to opened, in progress, or completed)
    - Delete issue
    - Assignable (can be assigned issues)

    When a project is created, a special role 'Owner' is created by default. Admin and the project creator have 'Owner' roles.

    'Owner' role has exclusive access to:

    - Add people to the project
    - Remove people from the project (excluding admin)
    - Delete the project

This README provides an overview of the Task Management System. Use this information to manage projects, users, and roles effectively.

---

**Note:** For CSV file formats and samples (users.csv and issues.csv), please refer to the project files.
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/M4NvrXuV)

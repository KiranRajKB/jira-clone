# Task Management System

Welcome to the Task Management System!

An admin account is automatically created when you run this application for the first time. You can use the following credentials to access the admin account:

**Admin Credentials:**
- Username: admin
- Password: admin

## Getting Started

To get started, log in as an admin to create new users and manage projects.

## Navigation

The navigation bar is divided into four essential sections, making it easy to navigate through the system:

1. **Home Page:** Get acquainted with the Task Management System through a brief introduction.

2. **Projects:** This section lists all the projects you have access to. Notably, the admin has access to all projects.

    - If you have permission to create projects, you'll find the 'Create Project' button enabled.

    - Within each project, you'll discover a comprehensive list of issues.

3. **People:** Access information about all active users, excluding those who are deactivated. Admins have the ability to delete and deactivate users.

    - When a user is deleted, all projects they created are also removed.

    - Deactivated users remain in existing projects but are hidden from searches. They cannot log in or be assigned any issues.

4. **Profile:** In this section, users can edit their personal information and log out.

## Project Details

When you open a project, you'll find the following sections in the sidebar:

- **Details:** This section provides essential information about the project.

- **Issues:** Here, you'll find a comprehensive list of all issues created within the project.

    - If you possess 'create issue' permission, you'll have access to the 'Create issue' and 'Bulk Create issues' buttons.

    - When bulk uploading issues using a CSV file, ensure that the header of the file adheres to this format:

        ```
        ReportedBy,Summary,Description,Assignee,Status,Tags
        ```

- **People:** This section lists all active users who have access to the project and details their roles within the project.

- **Roles:** Roles play a pivotal role in defining user permissions within a project. These permissions include:

    - Create issue
    - Edit issue (note: changing the status requires 'transition issue' permission)
    - Transition issue (ability to change status to opened, in progress, or completed; changing status to 'closed' requires 'close issue' permission)
    - Close issue
    - Delete issue
    - Assignable (can be assigned issues)

    When a project is created, a special role called 'Owner' is automatically assigned to the admin and the project creator.

    The 'Owner' role enjoys exclusive privileges, such as:

    - Adding people to the project
    - Removing people from the project (excluding admin)
    - Deleting the entire project

This README provides a comprehensive overview of the Task Management System. Use this information to effectively manage projects, users, and roles within the system.

---


**Note:** For CSV file formats and samples (users.csv and issues.csv), please refer to the project files.
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/M4NvrXuV)

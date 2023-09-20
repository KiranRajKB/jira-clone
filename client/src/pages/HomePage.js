import React from "react";

function HomePage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Task Management System</h1>
      <p>Welcome to the Task Management System!</p>

      <div style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Admin Credentials</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>
            <strong>Username:</strong> admin
          </li>
          <li>
            <strong>Password:</strong> admin
          </li>
        </ul>
      </div>

      <h2 style={{ fontSize: "24px", marginTop: "20px", marginBottom: "10px" }}>Getting Started</h2>
      <p>To get started, log in as an admin to create new users and manage projects.</p>

      <h2 style={{ fontSize: "24px", marginTop: "20px", marginBottom: "10px" }}>Navigation</h2>
      <p>The navigation bar is divided into four essential sections, making it easy to navigate through the system:</p>
      <ol style={{ paddingInlineStart: "20px" }}>
        <li>
          <strong>Home Page:</strong> Get acquainted with the Task Management System through a brief introduction.
        </li>
        <li>
          <strong>Projects:</strong> This section lists all the projects you have access to. Notably, the admin has access to all projects.
          <ul style={{ paddingInlineStart: "20px" }}>
            <li>
              If you have permission to create projects, you'll find the 'Create Project' button enabled.
            </li>
            <li>
              Within each project, you'll discover a comprehensive list of issues.
            </li>
          </ul>
        </li>
        <li>
          <strong>People:</strong> Access information about all active users, excluding those who are deactivated. Admins have the ability to delete and deactivate users.
          <ul style={{ paddingInlineStart: "20px" }}>
            <li>
              When a user is deleted, all projects they created are also removed.
            </li>
            <li>
              Deactivated users remain in existing projects but are hidden from searches. They cannot log in or be assigned any issues.
            </li>
          </ul>
        </li>
        <li>
          <strong>Profile:</strong> In this section, users can edit their personal information and log out.
        </li>
      </ol>

      <h2 style={{ fontSize: "24px", marginTop: "20px", marginBottom: "10px" }}>Project Details</h2>
      <p>When you open a project, you'll find the following sections in the sidebar:</p>
      <ol style={{ paddingInlineStart: "20px" }}>
        <li>
          <strong>Details:</strong> This section provides essential information about the project.
        </li>
        <li>
          <strong>Issues:</strong> Here, you'll find a comprehensive list of all issues created within the project.
          <ul style={{ paddingInlineStart: "20px" }}>
            <li>
              If you possess 'create issue' permission, you'll have access to the 'Create issue' and 'Bulk Create issues' buttons.
            </li>
            <li>
              When bulk uploading issues using a CSV file, ensure that the header of the file adheres to this format:
              <br />
              ReportedBy,Summary,Description,Assignee,Status,Tags
            </li>
          </ul>
        </li>
        <li>
          <strong>People:</strong> This section lists all active users who have access to the project and details their roles within the project.
        </li>
        <li>
          <strong>Roles:</strong> Roles play a pivotal role in defining user permissions within a project. These permissions include:
          <ul style={{ paddingInlineStart: "20px" }}>
            <li>Create issue</li>
            <li>Edit issue (note: changing the status requires 'transition issue' permission)</li>
            <li>Transition issue (ability to change status to opened, in progress, or completed; changing status to 'closed' requires 'close issue' permission)</li>
            <li>Close issue</li>
            <li>Delete issue</li>
            <li>Assignable (can be assigned issues)</li>
          </ul>
          <p>
            When a project is created, a special role called 'Owner' is automatically assigned to the admin and the project creator.
          </p>
          <p>
            The 'Owner' role enjoys exclusive privileges, such as:
          </p>
          <ul style={{ paddingInlineStart: "20px" }}>
            <li>Adding people to the project</li>
            <li>Removing people from the project (excluding admin)</li>
            <li>Deleting the entire project</li>
          </ul>
        </li>
      </ol>
    </div>
  );
}

export default HomePage;

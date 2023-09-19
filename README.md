Welcome to TASK MANAGEMENT SYSTEM!!!

An admin account is created by default when this application is run for the first time.
USERNAME : admin
PASSWORD : admin
Login as admin to create new users.

The navigation bar contains 4 sections.
1) Home Page - a brief introduction
2) Projects - list of projects to which the user has access ( admin has access to all the projects )
When the user is created, admin has the option to choose if the user has the permission to create projects.
If the user has permission, 'Create Project' button will be enabled. ( admin has permission to create projects )

Each project contains a list of issues.
When a project is opened, the following sections appear in the sidebar:
a) Details about the project
b) Issues - all the issues created within the project
If the user has 'create issue' permission in this project, 'Create issue' and 'Bulk Create issues' button will be enabled.
When bulk uploading issues using a csv file, please make sure the header of the file is in the format mentioned below:
ReportedBy,Summary,Description,Assignee,Status,Tags
A sample csv file (issues.csv) is attached.
c) People - all the active users who have access to this project, along with the role the user is assigned in this project.
d) Role - role determines the permissions a user has in the project.
There are total of 6 permissions: 
    i) Create issue
    ii) Edit issue - 
        NOTE : With only edit issue permission, you cannot change the status of the issue.
        You also need transition issue permission to change status.
    iii) Transition issue - 
        each issue can be in any of the following states:
            opened
            in progress
            completed
            closed
        When an issue is created, the status is 'opened'.
        Later the status of the issue can be changed (transitioned) by users who have 'Transition issue' permission in the project.
        NOTE : With transition permission, you can only change the status to any of the following:
            opened, in progress, completed
            To change the status to 'closed', you would required 'Close issue' permission in the project.
    iv) Delete issue
    v) Assignable - only users who have assignable permission in the project can be assigned any issues.

    When a project is created, a special role 'Owner' is created by default.
    The admin and the user who created the project have that role in the project.

    'Owner' role has exclusive access to the following:
        1) Add people to the project
        2) Remove people from the project (cannot remove admin)
        3) Delete project

3) People - information about all the active users (ie does not include users who are deactivated) - admin has the permissions to delete and deactivate users.
If a user is deleted, all the projects created by them will also be deleted.
If a user is deactivated, the user will not appear in any searches. The user will continue to be a part of the projects that they are part of. The user cannot login when their account is deactivated. The user cannot be assigned any issues.
When logged in as admin, the page also displays 2 buttons - create user & bulk upload.
When creating a user, make sure the username and email are unique.
When bulk uploading using a csv file, please make sure the header of the file is in the format mentioned below:
username,name,email,password,canCreateProject
You can find a sample csv file in the project ( users.csv )

4) Profile - the user can edit personal info, and log out of the system.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/M4NvrXuV)

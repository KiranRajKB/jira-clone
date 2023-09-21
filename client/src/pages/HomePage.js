import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  section: {
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: "24px",
    marginBottom: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    padding: "10px",
  },
  subHeader: {
    fontSize: "20px",
    marginTop: "20px",
  },
  list: {
    paddingLeft: "20px",
  },
  code: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "10px",
  },
}));

function HomePage() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h4" style={{ marginBottom: "10px" }}>
          Task Management System
        </Typography>
        <Typography>Welcome to the Task Management System!</Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper elevation={3} className={classes.section}>
          <Typography variant="h5" className={classes.header}>
            Admin Credentials
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Username: admin" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Password: admin" />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" className={classes.header}>
          Getting Started
        </Typography>
        <Typography>
          To get started, log in as an admin to create new users and manage
          projects.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} className={classes.section}>
          <Typography variant="h5" className={classes.header}>
            Navigation
          </Typography>
          <Typography>
            The navigation bar is divided into four essential sections, making
            it easy to navigate through the system:
          </Typography>
          <List className={classes.list}>
            <ListItem>
              <ListItemText
                primary="Home Page: Get acquainted with the Task Management System through a brief introduction."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Projects: This section lists all the projects you have access to. Notably, the admin has access to all projects."
                secondary={
                  <List className={classes.list}>
                    <ListItem>
                      <ListItemText
                        primary="If you have permission to create projects, you'll find the 'Create Project' button enabled."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Within each project, you'll discover a comprehensive list of issues."
                      />
                    </ListItem>
                  </List>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="People: Access information about all active users, excluding those who are deactivated. Admins have the ability to delete and deactivate users."
                secondary={
                  <List className={classes.list}>
                    <ListItem>
                      <ListItemText
                        primary="When a user is deleted, all projects they created are also removed."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Deactivated users remain in existing projects but are hidden from searches. They cannot log in or be assigned any issues."
                      />
                    </ListItem>
                  </List>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Profile: In this section, users can edit their personal information and log out."
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" className={classes.header}>
          Project Details
        </Typography>
        <Typography>
          When you open a project, you'll find the following sections in the
          sidebar:
        </Typography>
        <Paper elevation={3} className={classes.section}>
          <List className={classes.list}>
            <ListItem>
              <ListItemText
                primary="Details: This section provides essential information about the project."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Issues: Here, you'll find a comprehensive list of all issues created within the project."
                secondary={
                  <List className={classes.list}>
                    <ListItem>
                      <ListItemText
                        primary="If you possess 'create issue' permission, you'll have access to the 'Create issue' and 'Bulk Create issues' buttons."
                      />
                    </ListItem>
                    <ListItem>
                      <div className={classes.code}>
                        When bulk uploading issues using a CSV file, ensure that
                        the header of the file adheres to this format:
                        <br />
                        <code>
                          ReportedBy,Summary,Description,Assignee,Status,Tags
                        </code>
                        <br />
                        The status can be any one of the following:
                        <code>
                          'opened', 'in progress', 'completed', 'closed'
                        </code>
                      </div>
                    </ListItem>
                  </List>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="People: This section lists all active users who have access to the project and details their roles within the project."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Roles: Roles play a pivotal role in defining user permissions within a project. These permissions include:"
                secondary={
                  <List className={classes.list}>
                    <ListItem>Create issue</ListItem>
                    <ListItem>
                      Edit issue (note: changing the status requires 'transition
                      issue' permission)
                    </ListItem>
                    <ListItem>
                      Transition issue (ability to change status to 'opened',
                      'in progress', or 'completed'; changing status to 'closed'
                      requires 'close issue' permission)
                    </ListItem>
                    <ListItem>Close issue</ListItem>
                    <ListItem>Delete issue</ListItem>
                    <ListItem>Assignable (can be assigned issues)</ListItem>
                  </List>
                }
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" className={classes.header}>
          Special Role: 'Owner'
        </Typography>
        <Typography>
          When a project is created, a special role called 'Owner' is
          automatically assigned to the admin and the project creator.
        </Typography>
        <Typography>
          The 'Owner' role enjoys exclusive privileges, such as:
        </Typography>
        <Paper elevation={3} className={classes.section}>
          <List className={classes.list}>
            <ListItem>
              <ListItemText primary="Adding people to the project" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Removing people from the project (excluding admin)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Creating custom roles in the project" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Deleting the entire project" />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default HomePage;

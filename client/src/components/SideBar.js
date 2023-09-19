import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles((theme) => ({
    sidebar: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        width: '18vw',
        minHeight: '90vh',
        position: 'fixed', // Make the sidebar fixed
        top: '10vh', // Stick it to the top of the viewport
        zindex: 1000
    },
    projectTitle: {
        fontWeight: 'bold',
        padding: '16px',
    },
    listItem: {
        textDecoration: 'none',
        color: theme.palette.primary.contrastText,
        padding: '8px',
    },
    activeListItem: {
        fontWeight: 'bold',
        backgroundColor: theme.palette.secondary.main,
    },
    listItemContent: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: '8px',
    },
    disabledLink: {
        pointerEvents: 'none', // Disable pointer events
        opacity: 0.5, // Reduce opacity to indicate it's disabled
        textDecoration: 'none', // Remove underline
        color: theme.palette.text.disabled, // Use disabled text color
    },
}));

const Sidebar = ({ project_id, project_name }) => {
    const [canDeleteProject, setCanDeleteProject] = useState(true);
    const location = useLocation();
    const classes = useStyles();

    useEffect(() => {
        if (!project_id) return;
        axios
            .get(`http://localhost:8081/project/${project_id}/is_project_owner`)
            .then((response) => {
                console.log(response);
                const canDelete = response.data.isProjectOwner;
                setCanDeleteProject(canDelete);
            })
            .catch((error) => {
                console.error('Error checking if project can be deleted:', error);
            });
    }, [project_id]);

    return (
        <div className={classes.sidebar}>
            <Typography variant="h6" className={classes.projectTitle}>
                {project_id}
            </Typography>
            <Typography variant="h6" className={classes.projectTitle}>
                {project_name}
            </Typography>
            <List>
                <ListItem
                    component="div"
                    className={`${classes.listItem} ${location.pathname === `/project/${project_id}/details`
                        ? classes.activeListItem
                        : ''
                        }`}
                >
                    <NavLink
                        to={`/project/${project_id}/details`}
                        className={classes.listItemContent}
                    >
                        <div className={classes.icon}>
                            <HomeIcon />
                        </div>
                        <ListItemText primary="Details" />
                    </NavLink>
                </ListItem>
                <ListItem
                    component="div"
                    className={`${classes.listItem} ${location.pathname === `/project/${project_id}/issues`
                        ? classes.activeListItem
                        : ''
                        }`}
                >
                    <NavLink
                        to={`/project/${project_id}/issues`}
                        className={classes.listItemContent}
                    >
                        <div className={classes.icon}>
                            <ReportIcon />
                        </div>
                        <ListItemText primary="Issues" />
                    </NavLink>
                </ListItem>
                <ListItem
                    component="div"
                    className={`${classes.listItem} ${location.pathname === `/project/${project_id}/people`
                        ? classes.activeListItem
                        : ''
                        }`}
                >
                    <NavLink
                        to={`/project/${project_id}/people`}
                        className={classes.listItemContent}
                    >
                        <div className={classes.icon}>
                            <PeopleIcon />
                        </div>
                        <ListItemText primary="People" />
                    </NavLink>
                </ListItem>
                <ListItem
                    component="div"
                    className={`${classes.listItem} ${location.pathname === `/project/${project_id}/roles`
                        ? classes.activeListItem
                        : ''
                        }`}
                >
                    <NavLink
                        to={`/project/${project_id}/roles`}
                        className={classes.listItemContent}
                    >
                        <div className={classes.icon}>
                            <SupervisorAccountIcon />
                        </div>
                        <ListItemText primary="Roles" />
                    </NavLink>
                </ListItem>
                <ListItem
                    component="div"
                    className={`${classes.listItem} ${location.pathname === `/project/${project_id}/delete_project`
                        ? classes.activeListItem
                        : ''
                        }`}
                >
                    <NavLink
                        to={`/project/${project_id}/delete_project`}
                        className={`${classes.listItemContent} ${!canDeleteProject && classes.disabledLink}`}
                    >
                        <div className={classes.icon}>
                            <DeleteIcon />
                        </div>
                        <ListItemText primary="Delete Project" />
                    </NavLink>
                </ListItem>
            </List>
        </div>
    );
};

export default Sidebar;

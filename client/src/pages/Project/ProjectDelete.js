import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/NavBar';
import Sidebar from '../../components/SideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Typography,
    Button,
    Container,
    Grid,
    Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(3),
        textAlign: 'center',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(2),
    },
}));

const ProjectDelete = () => {
    const classes = useStyles();
    const { project_id } = useParams();
    const nav = useNavigate();

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8081/project/${project_id}/delete_project`);

            if (response.status === 200) {
                toast.success('Project deleted successfully!');
                nav('/');
            } else {
                toast.error('Failed to delete project.');
            }
        } catch (error) {
            toast.error('Failed to delete project.');
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div className={classes.container}>
            <Navbar />
            <Grid container className={classes.container}>
                <Grid item xs={3}>
                    <Sidebar project_id={project_id} />
                </Grid>
                <main className={classes.content}>
                    <Container maxWidth="md">

                        <Paper elevation={3} className={classes.paper}>
                            <Typography variant="h4" gutterBottom>
                                Delete Project
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Are you sure you want to delete this project?
                            </Typography>
                            <div className={classes.buttons}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleDelete}
                                    className={classes.button}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => nav(`/project/${project_id}/details`)}
                                    className={classes.button}
                                >
                                    No
                                </Button>
                            </div>
                        </Paper>
                    </Container>
                </main>
            </Grid>
            <ToastContainer />
        </div>
    );
};

export default ProjectDelete;

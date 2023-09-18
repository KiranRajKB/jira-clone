import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Typography,
    Button,
    Container,
    Grid,
    Paper,
} from '@mui/material';

const ProjectDelete = () => {
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
        <div style={{height: "90vh"}}>
            <Grid container>
                <main style={{ flexGrow: 1, padding: '16px' }}>
                    <Container maxWidth="md">
                        <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
                            <Typography variant="h4" gutterBottom>
                                Delete Project
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Are you sure you want to delete this project?
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleDelete}
                                    style={{ margin: '8px' }}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => nav(`/project/${project_id}/details`)}
                                    style={{ margin: '8px' }}
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

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/SideBar';
import Navbar from '../../components/NavBar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    card: {
        margin: theme.spacing(1),
        flexGrow: 1,
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    infoText: {
        marginBottom: theme.spacing(10),
        padding: '10px',
    },
    headersBox: {
        fontWeight: 'bold',
        fontSize: 'large',
        padding: theme.spacing(1),
    },
    valuesBox: {
        background: '#EFEFEF',
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
    },
}));

const ProjectDetails = () => {
    const classes = useStyles();
    const { project_id } = useParams();
    const [projectInfo, setProjectInfo] = useState(null);

    const fetchProjectDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/project/${project_id}/details`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch project details');
            }
            const data = response.data;
            setProjectInfo(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [project_id]);

    return (
        <div className={classes.container}>
                <Grid item xs={true}>
                    <Card className={classes.card} elevation={3}>
                        <CardContent>
                            <Typography variant="h4" className={classes.title} gutterBottom>
                                Project Details
                            </Typography>
                            {projectInfo ? (
                                <div>
                                    <Typography className={classes.infoText}>
                                        <Box component="span" className={classes.headersBox}>Project ID:</Box>
                                        <Box component="span" className={classes.valuesBox}> {project_id}</Box>
                                    </Typography>
                                    <Typography className={classes.infoText}>
                                        <Box component="span" className={classes.headersBox}>Project Name:</Box>
                                        <Box component="span" className={classes.valuesBox}> {projectInfo.project_name}</Box>
                                    </Typography>
                                    <Typography className={classes.infoText}>
                                        <Box component="span" className={classes.headersBox}>Description:</Box>
                                        <Box component="span" className={classes.valuesBox}> {projectInfo.description}</Box>
                                    </Typography>
                                    <Typography className={classes.infoText}>
                                        <Box component="span" className={classes.headersBox}>Created By:</Box>
                                        <Box component="span" className={classes.valuesBox}> {projectInfo.owner_username}</Box>
                                    </Typography>
                                </div>
                            ) : (
                                <Typography>Loading project details...</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
        </div>
    );
};

export default ProjectDetails;

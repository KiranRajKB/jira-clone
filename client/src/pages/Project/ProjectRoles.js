import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/SideBar';
import Navbar from '../../components/NavBar';
import CreateRoleModal from './CreateRoleModal';
import {
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    tableHeaderCell: {
        fontWeight: 'bold',
        fontSize: '1.2rem',
    },
    projectRolesTypography: {
        textAlign: 'center',
        backgroundColor: '#f2f2f2',
        padding: '10px',
        fontWeight: 'bold',
        fontSize: '2.0rem',
        margin: '10px',
        borderRadius: '10px',
    },
}));

const ProjectRoles = () => {
    const classes = useStyles();

    const { project_id } = useParams();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
    const [canAddRole, setCanAddRole] = useState(false);

    useEffect(() => {
        const fetchProjectRoles = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/project/${project_id}/roles`);
                if (response.status !== 200) {
                    throw new Error('Failed to fetch project roles');
                }
                let data = response.data.roles;
                if (data === null) {
                    data = [];
                }
                setRoles(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProjectRoles();

        axios
            .get(`http://localhost:8081/project/${project_id}/is_project_owner`)
            .then((response) => {
                setCanAddRole(response.data.isProjectOwner);
            })
            .catch((error) => {
                console.error('Error checking if a role can be added:', error);
            });
    }, [project_id]);

    const handleCreateRoleClick = () => {
        setIsCreateRoleModalOpen(true);
    };

    const handleCloseCreateRoleModal = () => {
        setIsCreateRoleModalOpen(false);
    };

    return (
        <Grid container className={classes.container}>
            <Navbar />
            <Grid container item xs={3} className={classes.container}>
                <Sidebar project_id={project_id} />
            </Grid>
            <Grid item xs={9} marginLeft={'-50px'}>
                <div className="project-roles-content">
                    <Typography variant="h4" className={classes.projectRolesTypography}>
                        Project Roles
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateRoleClick}
                        disabled={!canAddRole}
                        style={{ marginBottom: '20px' }}
                    >
                        Add Role
                    </Button>
                    {loading ? (
                        <Typography>Loading project roles...</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableHeaderCell}>Role Name</TableCell>
                                        <TableCell className={classes.tableHeaderCell}>Create Issue</TableCell>
                                        <TableCell className={classes.tableHeaderCell}>Edit Issue</TableCell>
                                        <TableCell className={classes.tableHeaderCell}>Transition Issue</TableCell>
                                        <TableCell className={classes.tableHeaderCell}>Close Issue</TableCell>
                                        <TableCell className={classes.tableHeaderCell}>Delete Issue</TableCell>
                                        <TableCell className={classes.tableHeaderCell}>Assignable</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roles.map((role, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{role.role_name}</TableCell>
                                            <TableCell>
                                                {role.create_issue ? (
                                                    <IconButton>
                                                        <CheckCircleOutline color="primary" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton>
                                                        <CancelOutlined color="error" />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {role.edit_issue ? (
                                                    <IconButton>
                                                        <CheckCircleOutline color="primary" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton>
                                                        <CancelOutlined color="error" />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {role.transition_issue ? (
                                                    <IconButton>
                                                        <CheckCircleOutline color="primary" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton>
                                                        <CancelOutlined color="error" />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {role.close_issue ? (
                                                    <IconButton>
                                                        <CheckCircleOutline color="primary" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton>
                                                        <CancelOutlined color="error" />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {role.delete_issue ? (
                                                    <IconButton>
                                                        <CheckCircleOutline color="primary" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton>
                                                        <CancelOutlined color="error" />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {role.assignable ? (
                                                    <IconButton>
                                                        <CheckCircleOutline color="primary" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton>
                                                        <CancelOutlined color="error" />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <CreateRoleModal
                        project_id={project_id}
                        isOpen={isCreateRoleModalOpen}
                        onClose={handleCloseCreateRoleModal}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

export default ProjectRoles;

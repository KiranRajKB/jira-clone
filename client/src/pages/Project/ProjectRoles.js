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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
            <Typography variant="h4" style={{marginBottom: "20px"}}>
                    Project Roles
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreateRoleClick}
                    disabled={!canAddRole}
                    style={{ margin: '20px' }}
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
                                    <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Role Name</TableCell>
                                    <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Create Issue</TableCell>
                                    <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Edit Issue</TableCell>
                                    <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Transition Issue</TableCell>
                                    <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Close Issue</TableCell>
                                    <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Delete Issue</TableCell>
                                    <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Assignable</TableCell>
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
        </div>
    );
};

export default ProjectRoles;

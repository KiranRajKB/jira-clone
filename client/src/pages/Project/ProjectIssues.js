import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from '@mui/styles';
import IssueCard from '../../components/IssueCard';
import NavigationBar from '../../components/NavBar';
import Sidebar from '../../components/SideBar';
import CreateIssueModal from './CreateIssueModal';
import BulkCreateIssueModal from './BulkCreateIssueModal';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    searchContainer: {
        marginBottom: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    createButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    tableCell: {
        fontSize: '1rem',
    },
    icon: {
        fontSize: '1.2rem',
        marginRight: theme.spacing(1),
    },
}));

const ProjectIssues = () => {
    const classes = useStyles();
    const { project_id } = useParams();

    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAssignedToMe, setShowAssignedToMe] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
    const [canCreateIssue, setCanCreateIssue] = useState(false);
    const [isBulkCreateModalOpen, setIsBulkCreateModalOpen] = useState(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        axios.get(`http://localhost:8081/project/${project_id}/role_permissions`)
            .then((response) => {
                if (response.status === 200) {
                    const createIssuePermission = response.data.create_issue;
                    setCanCreateIssue(createIssuePermission);
                }
            })
            .catch((error) => {
                console.error('Error fetching role permissions:', error);
            });

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/project/${project_id}/issues`);
                if (response.data.issues === null) {
                    response.data.issues = [];
                }
                setIssues(response.data.issues);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching issues:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [project_id]);

    const handleIssueClick = (issue) => {
        issue.project_id = project_id;
        setSelectedIssue(issue);
    };

    const closeModal = () => {
        setSelectedIssue(null);
    };

    const handleOpenCreateIssueModal = () => {
        setIsCreateIssueModalOpen(true);
    };

    const handleCloseCreateIssueModal = () => {
        setIsCreateIssueModalOpen(false);
    };

    const handleBulkCreateClick = () => {
        setIsBulkCreateModalOpen(true);
    };

    const handleCloseBulkCreateModal = () => {
        setIsBulkCreateModalOpen(false);
    };

    const filteredIssues = issues.filter((issue) => {
        if (!issue.tags) issue.tags = [];
        const searchFields = [
            issue.summary,
            issue.status,
            issue.reported_by,
            issue.assignee,
            ...issue.tags,
        ];

        const matchesSearchTerm = searchFields.some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (showAssignedToMe) {
            return matchesSearchTerm && issue.assignee === username;
        } else {
            return matchesSearchTerm;
        }
    });

    return (
        <div className={classes.container}>
            <NavigationBar />
            <Grid container className={classes.container}>
                <Grid item xs={2} style={{ marginRight: "40px" }}>
                    <Sidebar project_id={project_id} />
                </Grid>
                <Grid item xs="auto">
                    <Typography variant="h4" >Project Issues</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.createButton}
                        startIcon={<AddIcon className={classes.icon} />}
                        onClick={handleOpenCreateIssueModal}
                        disabled={!canCreateIssue}
                    >
                        Create Issue
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.createButton}
                        startIcon={<AddIcon className={classes.icon} />}
                        onClick={handleBulkCreateClick}
                        disabled={!canCreateIssue}
                    >
                        Bulk Create Issues
                    </Button>
                    <div className={classes.searchContainer}>
                        <TextField
                            label="Search by Keyword"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Checkbox
                            icon={<CheckBoxOutlineBlankIcon />}
                            checkedIcon={<CheckBoxIcon />}
                            checked={showAssignedToMe}
                            onChange={() => setShowAssignedToMe(!showAssignedToMe)}
                        />
                        <Typography>Show Assigned to Me</Typography>
                    </div>

                    {loading ? (
                        <p>Loading project issues...</p>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "bold", fontSize: "large" }}>ID</TableCell>
                                        <TableCell style={{ fontWeight: "bold", fontSize: "large" }}>Summary</TableCell>
                                        <TableCell style={{ fontWeight: "bold", fontSize: "large" }}>Status</TableCell>
                                        <TableCell style={{ fontWeight: "bold", fontSize: "large" }}>Reported By</TableCell>
                                        <TableCell style={{ fontWeight: "bold", fontSize: "large" }}>Assignee</TableCell>
                                        <TableCell style={{ fontWeight: "bold", fontSize: "large" }}>Tags</TableCell>
                                        <TableCell style={{ fontWeight: "bold", fontSize: "large" }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredIssues.map((issue) => (
                                        <TableRow key={issue.issue_id}>
                                            <TableCell className={classes.tableCell}>{issue.issue_id}</TableCell>
                                            <TableCell className={classes.tableCell}>{issue.summary}</TableCell>
                                            <TableCell className={classes.tableCell}>{issue.status}</TableCell>
                                            <TableCell className={classes.tableCell}>{issue.reported_by}</TableCell>
                                            <TableCell className={classes.tableCell}>{issue.assignee}</TableCell>
                                            <TableCell className={classes.tableCell}>{issue.tags?.join(', ')}</TableCell>
                                            <TableCell className={classes.tableCell}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => handleIssueClick(issue)}
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {selectedIssue && (
                        <IssueCard selectedIssue={selectedIssue} closeModal={closeModal} />
                    )}

                    <CreateIssueModal
                        isOpen={isCreateIssueModalOpen}
                        projectID={project_id}
                        onClose={handleCloseCreateIssueModal}
                    />
                    <BulkCreateIssueModal
                        isOpen={isBulkCreateModalOpen}
                        projectID={project_id}
                        onClose={handleCloseBulkCreateModal}
                    />

                </Grid>
            </Grid>

        </div>
    );
};

export default ProjectIssues;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Sidebar from '../../components/SideBar';
import Navbar from '../../components/NavBar';
import AddPeopleModal from './AddPeopleModal';
import RemovePeopleModal from './RemovePeopleModal';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import AddIcon from '@mui/icons-material/Add'; // Import the Add icon from Material-UI icons

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    card: {
        margin: theme.spacing(2),
        flexGrow: 1,
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: theme.spacing(2),
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Align items and push button to the right
        marginBottom: theme.spacing(2),
    },
    searchBar: {
        marginRight: theme.spacing(2),
    },
    addButton: {
        // Align the button to the right
    },
    table: {
        marginTop: theme.spacing(2),
    },
}));

const ProjectPeople = () => {
    const classes = useStyles();

    const { project_id } = useParams();
    const [people, setPeople] = useState([]);
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddPeopleModalOpen, setIsAddPeopleModalOpen] = useState(false);
    const [isProjectOwner, setIsProjectOwner] = useState(false);
    const [isRemovePeopleModalOpen, setIsRemovePeopleModalOpen] = useState(false);
    const [selectedUsername, setSelectedUsername] = useState('');

    useEffect(() => {
        const fetchProjectPeople = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/project/${project_id}/people`);
                if (response.status !== 200) {
                    throw new Error('Failed to fetch project people');
                }
                const data = response.data.people || [];
                setPeople(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProjectPeople();
    }, [project_id]);

    useEffect(() => {
        const filtered = people.filter((person) =>
            person.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.role_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPeople(filtered);
    }, [people, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOpenAddPeopleModal = () => {
        setIsAddPeopleModalOpen(true);
    };

    const handleCloseAddPeopleModal = () => {
        setIsAddPeopleModalOpen(false);
    };

    const handleOpenRemovePeopleModal = (username) => {
        setSelectedUsername(username);
        setIsRemovePeopleModalOpen(true);
    };

    const handleCloseRemovePeopleModal = () => {
        setIsRemovePeopleModalOpen(false);
        setSelectedUsername('');
    };

    useEffect(() => {
        axios.get(`http://localhost:8081/project/${project_id}/is_project_owner`)
            .then((response) => {
                if (response.status === 200) {
                    setIsProjectOwner(response.data.isProjectOwner);
                }
            })
            .catch((error) => {
                console.error('Error checking project owner:', error);
            });
    }, [project_id]);

    return (
        <div className={classes.container}>
            <Navbar />
            <Grid container className={classes.container}>
                <Grid item xs={3}>
                    <Sidebar project_id={project_id} />
                </Grid>
                <Grid item xs={9}>
                    <Container>
                        <Typography variant="h4" className={classes.title}>
                            Project People
                        </Typography>
                        <div className={classes.searchContainer}>
                            <TextField
                                className={classes.searchBar}
                                label="Search..."
                                variant="outlined"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.addButton}
                                onClick={handleOpenAddPeopleModal}
                                disabled={!isProjectOwner}
                            >
                                <AddIcon /> ADD PEOPLE
                            </Button>
                        </div>
                        {loading ? (
                            <p>Loading project people...</p>
                        ) : (
                            <TableContainer className={classes.table}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role Name</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredPeople.map((person, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{person.username}</TableCell>
                                                <TableCell>{person.name}</TableCell>
                                                <TableCell>{person.email}</TableCell>
                                                <TableCell>{person.role_name}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleOpenRemovePeopleModal(person.username)}
                                                        disabled={!isProjectOwner || person.username === 'admin'}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Container>
                </Grid>
                <AddPeopleModal
                    isOpen={isAddPeopleModalOpen}
                    onClose={handleCloseAddPeopleModal}
                    projectID={project_id}
                />
                <RemovePeopleModal
                    isOpen={isRemovePeopleModalOpen}
                    onClose={handleCloseRemovePeopleModal}
                    projectID={project_id}
                    username={selectedUsername}
                />
            </Grid>
        </div>
    );
};

export default ProjectPeople;

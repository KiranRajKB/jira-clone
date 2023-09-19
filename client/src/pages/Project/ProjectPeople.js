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


const ProjectPeople = () => {

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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                <Typography variant="h4" style={{marginBottom: "20px"}}>
                    Project People
                </Typography>
                <Container>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <TextField
                            label="Search..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenAddPeopleModal}
                            disabled={!isProjectOwner}
                            style={{marginLeft: "100px"}}
                        >
                            <AddIcon /> ADD PEOPLE
                        </Button>
                    </div>
                    {loading ? (
                        <p>Loading project people...</p>
                    ) : (
                        <TableContainer  style={{marginTop: "20px"}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Username</TableCell>
                                        <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Name</TableCell>
                                        <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Email</TableCell>
                                        <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Role Name</TableCell>
                                        <TableCell style={{fontWeight: "bold", fontSize: "large"}}>Actions</TableCell>
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
                <AddPeopleModal
                    isOpen={isAddPeopleModalOpen}
                    onClose={handleCloseAddPeopleModal}
                    projectID={project_id}
                    projectPeople={people.map(people=>people.username)}
                />
                <RemovePeopleModal
                    isOpen={isRemovePeopleModalOpen}
                    onClose={handleCloseRemovePeopleModal}
                    projectID={project_id}
                    username={selectedUsername}
                />
            </div>
        </div>
    );
};

export default ProjectPeople;
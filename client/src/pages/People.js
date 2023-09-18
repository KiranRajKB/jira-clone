import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from '../components/NavBar';
import {
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    InputAdornment,
    Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateUserModal from './CreateUserModal';
import BulkUploadUsers from './BulkCreateUsersModal';


const People = () => {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPeople, setFilteredPeople] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await axios.get('http://localhost:8081/people');
                if (response.status === 200) {
                    setPeople(response.data.people);
                    console.log(response.data.people);
                    setLoading(false);
                } else {
                    console.error('Failed to fetch people data');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPeople();
    }, []);

    useEffect(() => {
        // Filter people when searchTerm changes
        const filtered = people.filter(
            (person) =>
                person.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                person.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPeople(filtered);
    }, [searchTerm, people]);

    const handleDeleteUser = (username) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the user "${username}"?`);
        if (confirmDelete) {
            axios.delete(`http://localhost:8081/delete_user/${username}`)
                .then((response) => {
                    if (response.status === 200) {
                        const updatedPeople = people.filter(person => person.username !== username);
                        setPeople(updatedPeople);
                    }
                })
                .catch((error) => {
                    console.error(`Error deleting user "${username}":`, error);
                });
        }
    };

    const handleDeactivateUser = (username) => {
        const confirmDeactivate = window.confirm(`Are you sure you want to deactivate the user "${username}"?`);
        if (confirmDeactivate) {
            axios.put(`http://localhost:8081/deactivate_user/${username}`)
                .then((response) => {
                    if (response.status === 200) {
                        const updatedPeople = people.map(person => {
                            if (person.username === username) {
                                return { ...person, active: false };
                            }
                            return person;
                        });
                        setPeople(updatedPeople);
                    }
                })
                .catch((error) => {
                    console.error(`Error deactivating user "${username}":`, error);
                    // Handle error
                });
        }
    };

    const handleActivateUser = (username) => {
        const confirmActivate = window.confirm(`Are you sure you want to activate the user "${username}"?`);
        if (confirmActivate) {
            axios.put(`http://localhost:8081/activate_user/${username}`)
                .then((response) => {
                    if (response.status === 200) {
                        const updatedPeople = people.map(person => {
                            if (person.username === username) {
                                return { ...person, active: true };
                            }
                            return person;
                        });
                        setPeople(updatedPeople);
                    }
                })
                .catch((error) => {
                    console.error(`Error activating user "${username}":`, error);
                });
        }
    };

    return (
        <div className="people-container">
            <NavigationBar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <TextField
                    variant="outlined"
                    placeholder="Enter any keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    style={{ width: '70%' }}
                />
                {username === 'admin' && (
                    <>
                        <Button variant="contained" color="primary" onClick={() => setIsCreateUserModalOpen(true)}>
                            Create User
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => setIsBulkUploadModalOpen(true)}>
                            Bulk Upload
                        </Button>

                        {/* User Creation Modal */}
                        <CreateUserModal
                            isOpen={isCreateUserModalOpen}
                            onClose={() => setIsCreateUserModalOpen(false)}
                        />

                        {/* Bulk Upload Modal */}
                        <BulkUploadUsers
                            isOpen={isBulkUploadModalOpen}
                            onClose={() => setIsBulkUploadModalOpen(false)}
                        />
                    </>

                )}
            </div>
            {loading ? (
                <Typography variant="body1">Loading people data...</Typography>
            ) : (
                <TableContainer component={Paper} style={{ margin: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow className="table-header">
                                <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Username</TableCell>
                                <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Email</TableCell>
                                {username === 'admin' && (
                                    <>
                                        <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Create Project Permission</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Actions</TableCell>

                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPeople.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No results found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPeople.map((person, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{person.username}</TableCell>
                                        <TableCell>{person.name}</TableCell>
                                        <TableCell>{person.email}</TableCell>
                                        {username === 'admin' && (
                                            <>
                                                <TableCell>{person.canCreateProject? "yes" : "no"}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(person.username)} disabled={person.username == "admin"}>
                                                        Delete
                                                    </Button>
                                                    {
                                                        person.active ?
                                                            <Button variant="contained" color="warning" onClick={() => handleDeactivateUser(person.username)} disabled={person.username == "admin"}>
                                                                Deactivate
                                                            </Button> :
                                                            <Button variant="contained" color="primary" onClick={() => handleActivateUser(person.username)} >
                                                                Activate
                                                            </Button>
                                                    }

                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default People;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const modalStyle = {
    position: 'absolute',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const AddPeopleModal = ({ isOpen, onClose, projectID, projectPeople }) => {
    const [peopleOptions, setPeopleOptions] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);
    const [formData, setFormData] = useState({
        PersonUsername: '',
        PersonRole: '',
    });

    useEffect(() => {
        // Fetch the list of people
        axios
            .get('http://localhost:8081/people')
            .then((response) => {
                if (response.status === 200) {
                    setPeopleOptions(response.data.people.filter(person => person.active));
                }
            })
            .catch((error) => {
                console.error('Failed to fetch people:', error);
            });


        // Fetch the list of roles for the project
        axios
            .get(`http://localhost:8081/project/${projectID}/roles`)
            .then((response) => {
                if (response.status === 200) {
                    setRolesOptions(response.data.roles);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch project roles:', error);
            });
    }, [isOpen, projectID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to add people to the project
            const response = await axios.post(`http://localhost:8081/project/${projectID}/add_project_people`, formData);
            if (response.status === 200) {
                onClose();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error adding people:', error);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h4" gutterBottom>
                    Add People
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Select
                            id="username"
                            name="PersonUsername"
                            value={formData.PersonUsername}
                            onChange={(e) => setFormData({ ...formData, PersonUsername: e.target.value })}
                            required
                        >
                            <MenuItem value="">Select Username</MenuItem>
                            {peopleOptions.map((person) => (
                                <MenuItem key={person.username} value={person.username} disabled={projectPeople.includes(person.username)}>
                                    {person.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel htmlFor="role">Role</InputLabel>
                        <Select
                            id="role"
                            name="PersonRole"
                            value={formData.PersonRole}
                            onChange={(e) => setFormData({ ...formData, PersonRole: e.target.value })}
                            required
                        >
                            <MenuItem value="">Select Role</MenuItem>
                            {rolesOptions.map((role) => (
                                <MenuItem key={role.role_name} value={role.role_name}>
                                    {role.role_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Add
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default AddPeopleModal;

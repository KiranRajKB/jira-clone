import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { TextField, Button, FormControlLabel, Box, Typography, Checkbox } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const customStyles = {
    modalContainer: {
        position: 'absolute',
        width: 490,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButton: {
        marginTop: '16px',
    },
};

const CreateUserModal = ({ isOpen, onClose, setPeople }) => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        canCreateProject: false,
    });

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData({ ...formData, [name]: name === 'canCreateProject' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/create_user', formData);

            if (response.status === 201) {
                console.log('User created successfully');
                onClose();
                setPeople(oldPeople => [...oldPeople, {...formData, active: true}]);
                setFormData({
                    username: '',
                    name: '',
                    email: '',
                    password: '',
                    canCreateProject: false,
                });
                toast.success('User created successfully', {
                    autoClose: 1000,
                });
            } else {
                console.error('Failed to create user:', response.statusText);
                toast.error('Username or email already exists', {
                    autoClose: 1000,
                });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Username or email already exists', {
                autoClose: 1000,
            });
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="create-user-modal"
            aria-describedby="create-user-description"
        >
            <Box sx={customStyles.modalContainer}>
                <Typography variant="h6" id="create-user-modal" gutterBottom>
                    Create User
                </Typography>
                <form onSubmit={handleSubmit} style={customStyles.formContainer}>
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="canCreateProject"
                                checked={formData.canCreateProject}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label="Permission to create projects"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={customStyles.submitButton}
                    >
                        Create User
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateUserModal;

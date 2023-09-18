import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear'; // Different icons
import axios from 'axios';

const CreateRoleModal = ({ project_id, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        role_name: '',
        create_issue: false,
        edit_issue: false,
        transition_issue: false,
        close_issue: false,
        delete_issue: false,
        assignable: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        const newFormData = {
            ...formData,
            [name]: newValue,
        };
        newFormData["transition_issue"] ||= newFormData["close_issue"];
        newFormData["edit_issue"] ||= newFormData["transition_issue"];
        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(`http://localhost:8081/project/${project_id}/add_project_role`, formData)
            .then((response) => {
                onClose();
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error creating role:', error);
            });
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="create-role-modal"
            aria-describedby="create-role-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                    minWidth: 300,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5">Create Role</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Role Name"
                        type="text"
                        id="role_name"
                        name="role_name"
                        value={formData.role_name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="create_issue"
                                name="create_issue"
                                checked={formData.create_issue}
                                onChange={handleChange}
                                icon={<ClearIcon />} // Different icons
                                checkedIcon={<CheckIcon color="primary" />} // Different icons
                            />
                        }
                        label="Create Issue"
                        style={{ margin: '8px 0' }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="edit_issue"
                                name="edit_issue"
                                checked={formData.edit_issue}
                                onChange={handleChange}
                                icon={<ClearIcon />} // Different icons
                                checkedIcon={<CheckIcon color="primary" />} // Different icons
                                disabled={formData.transition_issue}
                            />
                        }
                        label="Edit Issue"
                        style={{ margin: '8px 0' }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="transition_issue"
                                name="transition_issue"
                                checked={formData.transition_issue}
                                onChange={handleChange}
                                icon={<ClearIcon />} // Different icons
                                checkedIcon={<CheckIcon color="primary" />} // Different icons
                                disabled={formData.close_issue  }
                            />
                        }
                        label="Transition Issue"
                        style={{ margin: '8px 0' }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="close_issue"
                                name="close_issue"
                                checked={formData.close_issue}
                                onChange={handleChange}
                                icon={<ClearIcon />} // Different icons
                                checkedIcon={<CheckIcon color="primary" />} // Different icons
                            />
                        }
                        label="Close Issue"
                        style={{ margin: '8px 0' }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="delete_issue"
                                name="delete_issue"
                                checked={formData.delete_issue}
                                onChange={handleChange}
                                icon={<ClearIcon />} // Different icons
                                checkedIcon={<CheckIcon color="primary" />} // Different icons
                            />
                        }
                        label="Delete Issue"
                        style={{ margin: '8px 0' }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="assignable"
                                name="assignable"
                                checked={formData.assignable}
                                onChange={handleChange}
                                icon={<ClearIcon />} // Different icons
                                checkedIcon={<CheckIcon color="primary" />} // Different icons
                            />
                        }
                        label="Assignable"
                        style={{ margin: '8px 0' }}
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Create
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateRoleModal;

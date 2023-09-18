import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import {
    Typography,
    TextField,
    TextareaAutosize,
    Button,
    Container,
} from '@mui/material';

const modalStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    outline: 'none',
    minWidth: '300px',
    maxWidth: '400px',
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: '8px',
};

const titleStyle = {
    fontSize: '24px',
    marginBottom: '16px',
};

const formFieldStyle = {
    marginBottom: '16px',
};

const formTextareaStyle = {
    marginBottom: '16px',
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    resize: 'vertical',
};

const submitButtonStyle = {
    backgroundColor: '#1976D2',
    color: 'white',
    '&:hover': {
        backgroundColor: '#135BA6',
    },
};

const CreateProjectModal = ({ isOpen, onClose }) => {
    const generateRandomProjectID = () => {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 10000);
        const projectID = `PROJECT-${timestamp}-${randomNum}`;
        return projectID;
    };

    const defaultProjectLead = localStorage.getItem('username');

    const [formData, setFormData] = useState({
        projectId: generateRandomProjectID(),
        projectName: '',
        description: '',
        projectLead: defaultProjectLead,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/create_project', formData);
            console.log('Project created:', response.data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Project Modal"
        >
            <Container style={modalStyle}>
                <Typography variant="h4" style={titleStyle}>
                    Create Project
                </Typography>
                <form onSubmit={handleSubmit}>
                    <div style={formFieldStyle}>
                        <TextField
                            type="text"
                            label="Project ID"
                            id="projectId"
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            disabled
                            required
                            fullWidth
                        />
                    </div>
                    <div style={formFieldStyle}>
                        <TextField
                            type="text"
                            label="Project Name"
                            id="projectName"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </div>
                    <div style={formFieldStyle}>
                        <TextareaAutosize
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            style={formTextareaStyle}
                            rowsMin={4}
                            placeholder="Description"
                        />
                    </div>
                    <div style={formFieldStyle}>
                        <TextField
                            type="text"
                            label="Project Lead"
                            id="projectLead"
                            name="projectLead"
                            value={formData.projectLead}
                            onChange={handleChange}
                            disabled
                            fullWidth
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        style={submitButtonStyle}
                        fullWidth
                    >
                        Create
                    </Button>
                </form>
            </Container>
        </Modal>
    );
};

export default CreateProjectModal;

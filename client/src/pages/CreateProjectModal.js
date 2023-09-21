import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
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
    width: '500px',
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginTop: '100px',
};

const titleStyle = {
    fontSize: '30px',
    marginBottom: '16px',
    fontWeight: "bold"
};

const formFieldStyle = {
    marginBottom: '16px',
    width: '400px'
};

// const formTextareaStyle = {
//     marginBottom: '16px',
//     width: '100%',
//     padding: '8px',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//     fontSize: '16px',
//     resize: 'vertical',
// };

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
            open={isOpen}
            onClose={onClose}
            aria-labelledby="create-project-modal"
            aria-describedby="create-project-description"
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
                        <TextField //resolve
                            label="Description"
                            variant="outlined"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={formFieldStyle}>
                        <TextField
                            type="text"
                            label="Created By"
                            id="projectLead"
                            name="projectLead"
                            value={formData.projectLead}
                            onChange={handleChange}
                            disabled
                            fullWidth
                            required
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

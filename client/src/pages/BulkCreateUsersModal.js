import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import Papa from 'papaparse';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

const BulkUploadUsers = ({ isOpen, onClose, setPeople }) => {
    const [csvFile, setCsvFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCsvFile(file);
    };

    const handleUpload = async () => {
        if (!csvFile) {
            alert('Please select a CSV file.');
            return;
        }

        const parseConfig = {
            header: true,
            dynamicTyping: true,
        };

        Papa.parse(csvFile, {
            ...parseConfig,
            complete: async (result) => {
                try {
                    console.log(result)
                    const response = await axios.post('http://localhost:8081/bulk_create_users', { users: result.data });
                    if (response.status === 200) {
                        toast.success("Users created successfully", {
                            autoClose: 1000,
                        });
                        result.data = result.data.map(user => { return { ...user, active: true } });
                        setPeople((oldPeople) => [...oldPeople, ...result.data]);
                        onClose();
                        setCsvFile(null);
                    } else {
                        toast.error("Some username or email already exists", {
                            autoClose: 1000,
                        });
                    }
                } catch (error) {
                    console.error('Error uploading CSV:', error);
                    toast.error("Some username or email already exists", {
                        autoClose: 1000,
                    });
                }
            },
        });
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="bulk-create-user-modal"
            aria-describedby="bulk-create-user-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    borderRadius: '4px',
                    boxShadow: '24px',
                    padding: '16px',
                    minWidth: '300px',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6" id="bulk-create-user-modal" gutterBottom>
                    Bulk Create Users from CSV
                </Typography>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUpload}
                >
                    Upload
                </Button>
                <IconButton
                    color="default"
                    onClick={onClose}
                    sx={{ marginLeft: '8px' }}
                >
                    <CancelIcon />
                </IconButton>
            </Box>
        </Modal>
    );
};

export default BulkUploadUsers;

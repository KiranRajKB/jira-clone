import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Material-UI CloudUploadIcon
import CancelIcon from '@mui/icons-material/Cancel'; // Material-UI CancelIcon
import axios from 'axios';
import Papa from 'papaparse';

const BulkCreateIssueModal = ({ isOpen, onClose, projectID }) => {
    const [csvFile, setCsvFile] = useState(null);

    const generateRandomIssueID = () => {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 10000);
        const issueID = `ISSUE-${timestamp}-${randomNum}`;
        return issueID;
      };

    const handleCsvFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCsvFile(file);
        }
    };

    const handleUploadCsv = async () => {
        if (csvFile) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const csvText = e.target.result;

                Papa.parse(csvText, {
                    header: true,
                    complete: async (results) => {
                        try {
                            const parsedData = results.data.map((row) => ({
                                ...row,
                                Tags: row.Tags.split(' '),
                                IssueID: generateRandomIssueID()
                            }));

                            console.log(parsedData);

                            const response = await axios.post(
                                `http://localhost:8081/project/${projectID}/bulk_add_issues`,
                                { issues: parsedData },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );

                            if (response.status === 200) {
                                console.log('Bulk create issues successful');
                                onClose();
                                window.location.reload();
                            }
                        } catch (error) {
                            console.error('Error uploading JSON data:', error);
                        }
                    },
                });
            };

            reader.readAsText(csvFile);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="bulk-create-issue-modal"
            aria-describedby="bulk-create-issue-description"
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
                <Typography variant="h6" id="bulk-create-issue-modal" gutterBottom>
                    Bulk Create Issues from CSV
                </Typography>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUploadIcon />} // Add CloudUploadIcon as the start icon
                    onClick={handleUploadCsv}
                >
                    Upload
                </Button>
                <IconButton
                    color="default"
                    onClick={onClose}
                    sx={{ marginLeft: '8px' }}
                >
                    <CancelIcon /> {/* Add CancelIcon as an IconButton */}
                </IconButton>
                {/* <Typography variant="caption" sx={{ marginLeft: '8px' }}>
                    Cancel
                </Typography> */}
            </Box>
        </Modal>
    );
};

export default BulkCreateIssueModal;

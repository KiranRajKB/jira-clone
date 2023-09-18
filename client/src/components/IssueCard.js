import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const IssueModal = ({ selectedIssue, isOpen, closeModal }) => {
    const { project_id } = useParams();

    const [isEditing, setIsEditing] = useState(false);
    const [issueData, setIssueData] = useState({
        issue_id: selectedIssue.issue_id,
        summary: selectedIssue.summary,
        description: selectedIssue.description,
        assignee: selectedIssue.assignee,
        reported_by: selectedIssue.reported_by,
        status: selectedIssue.status,
        tags: selectedIssue.tags,
    });
    const [newTag, setNewTag] = useState('');
    const [permissions, setPermissions] = useState({
        close_issue: false,
        edit_issue: false,
        delete_issue: false,
        transition_issue: false,
    });
    const [assignees, setAssignees] = useState([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/project/${project_id}/role_permissions`);
                setPermissions(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, [project_id]);

    useEffect(() => {
        const fetchAssignees = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/project/${project_id}/assignees`);
                setAssignees(response.data.assignees);
            } catch (error) {
                console.error('Error fetching assignees:', error);
            }
        };

        fetchAssignees();
    }, [project_id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`http://localhost:8081/project/${project_id}/edit_issue`, issueData);
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating issue:', error);
        }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await axios.delete(`http://localhost:8081/project/${project_id}/delete_issue/${issueData.issue_id}`);
            console.log('Issue deleted successfully', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error updating issue:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIssueData({
            ...issueData,
            [name]: value,
        });
    };

    const handleAddTagClick = () => {
        if (newTag.trim() !== '') {
            // Add the new tag to the tags array
            const updatedTags = [...issueData.tags, newTag.trim()];
            setIssueData({
                ...issueData,
                tags: updatedTags,
            });
            setNewTag(''); // Clear the new tag input
        }
    };

    const handleTagDelete = (index) => {
        // Remove the tag at the specified index
        const updatedTags = [...issueData.tags];
        updatedTags.splice(index, 1);
        setIssueData({
            ...issueData,
            tags: updatedTags,
        });
    };

    return (
        <Modal
            open={isOpen}
            onClose={closeModal}
            aria-labelledby="issue-modal"
            aria-describedby="issue-details"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'white',
                boxShadow: 24,
                p: 4,
                minWidth: 400,
                maxWidth: 600,
            }}>
                <Typography variant="h5" gutterBottom>
                    Issue Details
                </Typography>
                <TextField
                    label="Issue ID"
                    name="issue_id"
                    value={issueData.issue_id}
                    fullWidth
                    disabled
                />
                <TextField
                    label="Summary"
                    name="summary"
                    value={issueData.summary}
                    fullWidth
                    disabled={!isEditing}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Status"
                    name="status"
                    select
                    value={issueData.status}
                    fullWidth
                    disabled={!isEditing || !permissions.transition_issue}
                    onChange={handleInputChange}
                >
                    <MenuItem value="opened">Opened</MenuItem>
                    <MenuItem value="in progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="closed" disabled={!permissions.close_issue}>Closed</MenuItem>
                </TextField>
                <TextField
                    label="Reported By"
                    name="reported_by"
                    value={issueData.reported_by}
                    fullWidth
                    disabled
                    onChange={handleInputChange}
                />
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Assignee</InputLabel>
                    <Select
                        label="Assignee"
                        name="assignee"
                        value={issueData.assignee}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    >
                        <MenuItem value="">Select Assignee</MenuItem>
                        {assignees.map((assignee) => (
                            <MenuItem
                                key={assignee.username}
                                value={assignee.username}
                            >
                                {assignee.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={issueData.description}
                    fullWidth
                    disabled={!isEditing}
                    onChange={handleInputChange}
                />
                <div>
                    <Typography>Tags:</Typography>
                    {issueData.tags.map((tag, index) => (
                        <div key={index} className="tag">
                            {tag}
                            {isEditing && permissions.edit_issue && (
                                <span
                                    className="tag-delete"
                                    onClick={() => handleTagDelete(index)}
                                >
                                    &times;
                                </span>
                            )}
                        </div>
                    ))}
                    {isEditing && permissions.edit_issue && (
                        <div className="tag-input">
                            <TextField
                                label="New Tag"
                                name="newTag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddTagClick}
                            >
                                Add
                            </Button>
                        </div>
                    )}
                </div>
                <div>
                    {permissions.edit_issue && (
                        <Button
                            variant="outlined"
                            onClick={handleEditClick}
                            sx={{ mr: 2 }}
                        >
                            Edit
                        </Button>
                    )}
                    {permissions.delete_issue && (
                        <Button
                            variant="outlined"
                            onClick={handleDeleteClick}
                            sx={{ mr: 2 }}
                        >
                            Delete
                        </Button>
                    )}
                    {permissions.edit_issue && isEditing && (
                        <Button
                            variant="contained"
                            onClick={handleSaveClick}
                        >
                            Save
                        </Button>
                    )}
                </div>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={closeModal}
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                    }}
                >
                    <CloseIcon />
                </Button>
            </Box>
        </Modal>
    );
};

export default IssueModal;

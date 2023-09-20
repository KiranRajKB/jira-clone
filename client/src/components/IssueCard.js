import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';

const IssueDialog = ({ selectedIssue, isOpen, closeModal }) => {
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

    const handleCancelClick = () => {
        setIsEditing(false);
        // Reset issueData to the original values when cancelling
        setIssueData({
            issue_id: selectedIssue.issue_id,
            summary: selectedIssue.summary,
            description: selectedIssue.description,
            assignee: selectedIssue.assignee,
            reported_by: selectedIssue.reported_by,
            status: selectedIssue.status,
            tags: selectedIssue.tags,
        });
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
            if (issueData.tags.includes(newTag.trim())) {
                toast.error("Tag already exists", {
                    autoClose: 1000,
                });
                return;
            }
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
        <Dialog
            open={isOpen}
            onClose={closeModal}
            // fullWidth
            // maxWidth="md"
            style={{ alignContent: "center", justifyContent: "center", alignItems: "center" }}
        >
            <DialogTitle>
                <Typography variant="h5">
                    Issue Details
                </Typography>
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
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Issue ID"
                    name="issue_id"
                    value={issueData.issue_id}
                    fullWidth
                    disabled
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Summary"
                    name="summary"
                    value={issueData.summary}
                    fullWidth
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Status"
                    name="status"
                    select
                    value={issueData.status}
                    fullWidth
                    disabled={!isEditing || !permissions.transition_issue}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
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
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
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
                                disabled={!assignee.assignable}
                            >
                                {assignee.username}
                            </MenuItem>
                        ))}
                        {(!assignees.map(assignee => assignee.username).includes(issueData.assignee) || true) &&
                            <MenuItem
                                key={issueData.assignee}
                                value={issueData.assignee}
                                disabled={true}
                            >
                                {issueData.assignee}
                            </MenuItem>}
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
                    sx={{ mb: 2 }}
                />
                <div>
                    <Typography>Tags:</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {issueData.tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                onDelete={() => handleTagDelete(index)}
                                variant="outlined"
                                disabled={!isEditing}
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </Box>
                    {isEditing && permissions.edit_issue && (
                        <div style={{ display: "flex" }}>
                            <TextField
                                label="New Tag"
                                name="newTag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleAddTagClick}>
                                Add
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
                {!isEditing && permissions.edit_issue && (
                    <Button
                        variant="contained"
                        onClick={() => setIsEditing(true)}
                        sx={{ mr: 2 }}
                    >
                        Edit
                    </Button>
                )}
                {isEditing && permissions.edit_issue && (
                    <Button
                        variant="contained"
                        onClick={handleCancelClick}
                        color="error"
                        sx={{ mr: 2 }}
                    >
                        Cancel
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
                        color="primary"
                    >
                        Save
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default IssueDialog;

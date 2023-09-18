import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IssueCard = ({ selectedIssue, closeModal }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [issueData, setIssueData] = useState({
        issue_id: selectedIssue.issue_id,
        summary: selectedIssue.summary,
        description: selectedIssue.description,
        assignee: selectedIssue.assignee,
        reported_by: selectedIssue.reported_by,
        status: selectedIssue.status,
        tags: selectedIssue.tags, // Tags as an array
    });
    const [newTag, setNewTag] = useState(''); // Store the new tag
    const [permissions, setPermissions] = useState({
        close_issue: false,
        edit_issue: false,
        delete_issue: false,
        transition_issue: false,
        // Add other permissions here
    });

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/project/${selectedIssue.project_id}/role_permissions`);
                setPermissions(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, [selectedIssue.project_id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put("http://localhost:8081/update-issue", issueData);
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating issue:', error);
        }
    };


    const handleDeleteClick = async () => {
        try {
            const response = await axios.delete(`http://localhost:8081/delete_issue/${issueData.issue_id}`);
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
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <form>
                    <div className="form-group">
                        <label htmlFor="issue_id">Issue ID:</label>
                        <input
                            type="text"
                            id="issue_id"
                            name="issue_id"
                            value={issueData.issue_id}
                            onChange={handleInputChange}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="summary">Summary:</label>
                        <input
                            type="text"
                            id="summary"
                            name="summary"
                            value={issueData.summary}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={issueData.status}
                            onChange={handleInputChange}
                            disabled={!isEditing || !permissions.transition_issue}
                        >
                            <option value="opened">Opened</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="closed" disabled={!permissions.close_issue}>Closed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reported_by">Reported By:</label>
                        <input
                            type="text"
                            id="reported_by"
                            name="reported_by"
                            value={issueData.reported_by}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="assignee">Assignee:</label>
                        <input
                            type="text"
                            id="assignee"
                            name="assignee"
                            value={issueData.assignee}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={issueData.description}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>                    <div className="form-group">
                        <label htmlFor="tags">Tags:</label>
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
                                <input
                                    type="text"
                                    id="newTag"
                                    name="newTag"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTagClick}
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Other form fields */}
                </form>

                {/* Buttons */}
                <div className="button-container">
                    <button onClick={handleEditClick} disabled={!permissions.edit_issue}>Edit</button>
                    <button onClick={handleDeleteClick} disabled={!permissions.delete_issue}>Delete</button>
                    {permissions.edit_issue && isEditing && (
                        <button onClick={handleSaveClick}>Save</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IssueCard;

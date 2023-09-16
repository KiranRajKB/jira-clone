import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CreateIssueModal = ({ isOpen, onClose, projectID }) => {
    const [formData, setFormData] = useState({
        issue_id: '', // You may want to generate this dynamically
        reported_by: localStorage.getItem('username'),
        summary: '',
        description: '',
        assignee: '',
        status: 'opened',
        tags: [], // Array to store tags
    });

    const [assignees, setAssignees] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8081/project/${projectID}/assignees`)
            .then((response) => {
                if (response.status === 200) {
                    setAssignees(response.data.assignees);
                }
            })
            .catch((error) => {
                console.error('Error fetching assignees:', error);
            });
    }, [projectID]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8081/project/${projectID}/add_issue`, formData)
            .then((response) => {
                if (response.status === 200) {
                    onClose();
                }
            })
            .catch((error) => {
                console.error('Error creating issue:', error);
            });
    };

    const handleAddTag = () => {
        const { tags, newTag } = formData;
        if (newTag && !tags.includes(newTag)) {
            setFormData({ ...formData, tags: [...tags, newTag], newTag: '' });
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = formData.tags.filter((tag) => tag !== tagToRemove);
        setFormData({ ...formData, tags: updatedTags });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Issue Modal"
            className="create-issue-modal"
        >
            <h2>Create Issue</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Issue ID:
                    <input
                        type="text"
                        name="issue_id"
                        value={formData.issue_id}
                        onChange={(e) => setFormData({ ...formData, issue_id: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Summary:
                    <input
                        type="text"
                        name="summary"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </label>
                <label>
                    Assignee:
                    <select
                        name="assignee"
                        value={formData.assignee}
                        onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                        required
                    >
                        <option value="">Select Assignee</option>
                        {assignees?.map((assignee) => (
                            <option
                                key={assignee.username}
                                value={assignee.username}
                                disabled={!assignee.assignable}
                            >
                                {assignee.username}
                            </option>
                        ))}
                    </select>
                </label>
                <div>
                    <label>Tags:</label>
                    <div className="tags-input">
                        {formData.tags.map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="tag-remove"
                                >
                                    X
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            name="newTag"
                            value={formData.newTag || ''}
                            onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                            placeholder="Add tag and press Enter"
                        />
                    </div>
                </div>
                <button type="submit">Create</button>
            </form>
            <button onClick={onClose}>Cancel</button>
        </Modal>
    );
};

export default CreateIssueModal;

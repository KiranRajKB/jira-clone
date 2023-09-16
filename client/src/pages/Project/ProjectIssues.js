import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import IssueCard from '../../components/IssueCard';
import NavigationBar from '../../components/NavBar';
import Sidebar from '../../components/SideBar';
import CreateIssueModal from './CreateIssueModal';

const ProjectIssues = () => {
    const { project_id } = useParams();

    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAssignedToMe, setShowAssignedToMe] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
    const [canCreateIssue, setCanCreateIssue] = useState(false); // State to store whether the user can create an issue

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        // Fetch role permissions for the current user
        axios.get(`http://localhost:8081/project/${project_id}/role_permissions`)
            .then((response) => {
                if (response.status === 200) {
                    // Check if the 'create_issue' field is true
                    const createIssuePermission = response.data.create_issue;
                    console.log(response);
                    setCanCreateIssue(createIssuePermission);
                }
            })
            .catch((error) => {
                console.error('Error fetching role permissions:', error);
            });

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/project/${project_id}/issues`);
                if (response.data.issues === null) {
                    response.data.issues = [];
                }
                setIssues(response.data.issues);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching issues:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [project_id]);

    const handleIssueClick = (issue) => {
        issue.project_id = project_id;
        setSelectedIssue(issue);
    };

    const closeModal = () => {
        setSelectedIssue(null);
    };

    const handleOpenCreateIssueModal = () => {
        setIsCreateIssueModalOpen(true);
    };

    const handleCloseCreateIssueModal = () => {
        setIsCreateIssueModalOpen(false);
    };

    const filteredIssues = issues.filter((issue) => {
        if (!issue.tags)
            issue.tags = []
        const searchFields = [
            issue.summary,
            issue.status,
            issue.reported_by,
            issue.assignee,
            ...issue.tags,
        ];

        const matchesSearchTerm = searchFields.some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (showAssignedToMe) {
            return matchesSearchTerm && issue.assignee === username;
        } else {
            return matchesSearchTerm;
        }
    });

    return (
        <div>
            <Sidebar project_id={project_id} />
            <NavigationBar />
            <h2>Project Issues</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={showAssignedToMe}
                        onChange={() => setShowAssignedToMe(!showAssignedToMe)}
                    />
                    Only issues assigned to me
                </label>
            </div>
            {loading ? (
                <p>Loading project issues...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Summary</th>
                            <th>Status</th>
                            <th>Reported By</th>
                            <th>Assignee</th>
                            <th>Tags</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIssues.map((issue) => (
                            <tr key={issue.issue_id}>
                                <td>{issue.issue_id}</td>
                                <td>{issue.summary}</td>
                                <td>{issue.status}</td>
                                <td>{issue.reported_by}</td>
                                <td>{issue.assignee}</td>
                                <td>{issue.tags?.join(', ')}</td>
                                <td>
                                    <button onClick={() => handleIssueClick(issue)}>View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}


            <button onClick={handleOpenCreateIssueModal} disabled={!canCreateIssue}>Create Issue</button>

            {selectedIssue && (
                <IssueCard selectedIssue={selectedIssue} closeModal={closeModal} />
            )}

            <CreateIssueModal
                isOpen={isCreateIssueModalOpen}
                onClose={handleCloseCreateIssueModal}
                projectID={project_id}
            />
        </div>
    );
};

export default ProjectIssues;

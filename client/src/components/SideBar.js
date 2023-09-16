import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Sidebar = ({ project_id, project_name }) => {
    const [canDeleteProject, setCanDeleteProject] = useState(true); // Default to true

    useEffect(() => {
        if (!project_id) return;
        axios.get(`http://localhost:8081/project/${project_id}/can_delete_project`)
            .then(response => {
                const canDelete = response.data.can_delete_project;
                setCanDeleteProject(canDelete);
            })
            .catch(error => {
                console.error('Error checking if project can be deleted:', error);
            });
    }, [project_id]);

    return (
        <div className="sidebar">
            <div className="project-details">
                <h2>Project Details</h2>
                <p>Project ID: {project_id}</p>
                <p>Project Name: {project_name}</p>
            </div>
            <div className="navigation">
                <h2>Navigation</h2>
                <ul>
                    <li>
                        <Link to={`/project/${project_id}/details`}>Details</Link>
                    </li>
                    <li>
                        <Link to={`/project/${project_id}/issues`}>Issues</Link>
                    </li>
                    <li>
                        <Link to={`/project/${project_id}/people`}>People</Link>
                    </li>
                    <li>
                        <Link to={`/project/${project_id}/roles`}>Roles</Link>
                    </li>
                    <li>
                        {/* Disable the "Delete Project" link if canDeleteProject is false */}
                        {canDeleteProject ? (
                            <Link to={`/project/${project_id}/delete_project`}>Delete Project</Link>
                        ) : (
                            <span>Delete Project (Not Allowed)</span>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;

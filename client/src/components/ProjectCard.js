import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project_id, project_name, description, owner_username }) => {
    const nav = useNavigate();
    return (
        <div onClick={() => nav(`/project/${project_id}/details`)}>
            <p><strong>Project ID:</strong> {project_id}</p>
            <p><strong>Project Name:</strong> {project_name}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Owner Username:</strong> {owner_username}</p>
        </div>
    );
}

export default ProjectCard;

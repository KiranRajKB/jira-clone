import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/NavBar';
import Sidebar from '../../components/SideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectDelete = () => {
    const { project_id } = useParams();
    const nav = useNavigate(); // Use useNavigate instead of useHistory

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8081/project/${project_id}/delete_project`);
            
            if (response.status === 200) {
                toast.success('Project deleted successfully!');
                nav('/');
            } else {
                toast.error('Failed to delete project.');
            }
        } catch (error) {
            toast.error('Failed to delete project.');
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div className="project-delete-container">
            <Navbar />
            <Sidebar project_id={project_id} />
            <div className="project-delete-content">
                <h2>Delete Project</h2>
                <p>Are you sure you want to delete this project?</p>
                <div className="confirmation-buttons">
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={() => nav(`/project/${project_id}/details`)}>No</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ProjectDelete;

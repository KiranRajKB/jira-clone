import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from './CreateProjectModal';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const Projects = () => {
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [canCreateProject, setCanCreateProject] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const openCreateProjectModal = () => {
    setIsCreateProjectModalOpen(true);
  };

  const closeCreateProjectModal = () => {
    setIsCreateProjectModalOpen(false);
  };

  const handleCreateProject = (formData) => {
    // Handle project creation here, e.g., make an API request.
    console.log('Creating project with data:', formData);
    // Close the modal after successful project creation.
    closeCreateProjectModal();
  };

  useEffect(() => {
    // Fetch the list of projects
    axios
      .get('http://localhost:8081/projects')
      .then((response) => {
        if (response.data.projects) setProjects(response.data.projects);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });

    // Check if the user can create a project
    axios
      .get('http://localhost:8081/can_create_project')
      .then((response) => {
        setCanCreateProject(response.data.canCreateProject);
      })
      .catch((error) => {
        console.error('Error checking permission to create project:', error);
      });
  }, []);

  const handleViewDetails = (projectId) => {
    nav(`/project/${projectId}/details`);
  };

  return (
    <div>
      {/* <Navbar /> */}
      <Button
        disabled={!canCreateProject}
        variant="contained"
        onClick={openCreateProjectModal}
        style={{ marginTop: '16px', marginBottom: '16px' }}
      >
        Create Project
      </Button>
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={closeCreateProjectModal}
        onCreateProject={handleCreateProject}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Project ID</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Project Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Description</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Created By</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: 'large' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.project_id} hover>
                <TableCell>{project.project_id}</TableCell>
                <TableCell>{project.project_name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.owner_username}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewDetails(project.project_id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Projects;

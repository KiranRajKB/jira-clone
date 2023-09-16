import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/SideBar';
import Navbar from '../../components/NavBar';

const ProjectDetails = () => {
  const { project_id } = useParams();
  const [projectInfo, setProjectInfo] = useState(null);

  // Define an async function to fetch project details from the API
  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/project/${project_id}/details`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch project details');
      }
      const data = response.data;
      console.log(data);
      setProjectInfo(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [project_id]);

  return (
    <div className="project-details-container">
      <Sidebar project_id={project_id} project_name={projectInfo?.project_name} />
      <div className="project-details-content">
        <Navbar />
        <h2>Project Details</h2>
        {projectInfo ? (
          <div>
            <p>Project ID: {project_id}</p>
            <p>Project Name: {projectInfo.project_name}</p>
            <p>Description: {projectInfo.description}</p>
            <p>Owner Username: {projectInfo.owner_username}</p>
          </div>
        ) : (
          <p>Loading project details...</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;

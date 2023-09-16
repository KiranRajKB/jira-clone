import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from './CreateProjectModal';


// const Projects = () => {
//     const nav = useNavigate();
//     const [projects, setProjects] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:8081/projects')
//             .then(response => {
//                 setProjects(response.data.projects);
//             })
//             .catch(error => {
//                 console.error('Error fetching projects:', error);
//             });
//     }, []);

//     const handleRowClick = (project_id) => {
//         // Handle the click event for a specific project
//         console.log(`Clicked on project with ID: ${project_id}`);
//         // You can perform any desired action here, such as navigating to a project details page.
//     };

//     return (
//         <div>
//             <Navbar />
//             <h1>Projects</h1>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Project ID</th>
//                         <th>Project Name</th>
//                         <th>Description</th>
//                         <th>Owner Username</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {projects.map(project => (
//                         <tr key={project.project_id}>
//                             <td>{project.project_id}</td>
//                             <td>{project.project_name}</td>
//                             <td>{project.description}</td>
//                             <td>{project.owner_username}</td>
//                             <td>
//                                 <button onClick={() => nav(`/project/${project.project_id}/details`)}>View Details</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Projects;

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
        axios.get('http://localhost:8081/projects')
            .then(response => {
                if (response.data.projects)
                    setProjects(response.data.projects);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });

        // Check if the user can create a project
        axios.get('http://localhost:8081/can_create_project')
            .then(response => {
                setCanCreateProject(response.data.canCreateProject);
            })
            .catch(error => {
                console.error('Error checking permission to create project:', error);
            });
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Projects</h1>
            {canCreateProject ? (
                <button onClick={openCreateProjectModal}>Create Project</button>
            ) : (
                <button disabled>Create Project</button>
            )}
                    <CreateProjectModal
          isOpen={isCreateProjectModalOpen}
          onClose={closeCreateProjectModal}
          onCreateProject={handleCreateProject}
        />
            <table>
                <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>Project Name</th>
                        <th>Description</th>
                        <th>Owner Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.project_id}>
                            <td>{project.project_id}</td>
                            <td>{project.project_name}</td>
                            <td>{project.description}</td>
                            <td>{project.owner_username}</td>
                            <td>
                                <button onClick={() => nav(`/project/${project.project_id}/details`)}>View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Projects;

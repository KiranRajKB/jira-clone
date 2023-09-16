// // import React, { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import Sidebar from '../../components/SideBar';
// // import Navbar from '../../components/NavBar';

// // const ProjectRoles = () => {
// //   const { project_id } = useParams();
// //   const [roles, setRoles] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     // Define an async function to fetch project role information
// //     const fetchProjectRoles = async () => {
// //       try {
// //         const response = await axios.get(`http://localhost:8081/project/${project_id}/roles`);
// //         if (response.status !== 200) {
// //           throw new Error('Failed to fetch project roles');
// //         }
// //         const data = response.data.roles;
// //         setRoles(data);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error(error);
// //       }
// //     };

// //     // Fetch project roles when the component mounts
// //     fetchProjectRoles();
// //   }, [project_id]);

// //   return (
// //     <div className="project-roles-container">
// //       <Sidebar project_id={project_id} />
// //       <div className="project-roles-content">
// //         <Navbar />
// //         <h2>Project Roles</h2>
// //         {loading ? (
// //           <p>Loading project roles...</p>
// //         ) : (
// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>Role Name</th>
// //                 <th>Create Issue</th>
// //                 <th>Edit Issue</th>
// //                 <th>Transition Issue</th>
// //                 <th>Close Issue</th>
// //                 <th>Delete Issue</th>
// //                 <th>Assignable</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {roles.map((role, index) => (
// //                 <tr key={index}>
// //                   <td>{role.role_name}</td>
// //                   <td>{role.create_issue ? 'Yes' : 'No'}</td>
// //                   <td>{role.edit_issue ? 'Yes' : 'No'}</td>
// //                   <td>{role.transition_issue ? 'Yes' : 'No'}</td>
// //                   <td>{role.close_issue ? 'Yes' : 'No'}</td>
// //                   <td>{role.delete_issue ? 'Yes' : 'No'}</td>
// //                   <td>{role.assignable ? 'Yes' : 'No'}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProjectRoles;


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Sidebar from '../../components/SideBar';
// import Navbar from '../../components/NavBar';
// import CreateRoleModal from './CreateRoleModal'

// const ProjectRoles = () => {
//   const { project_id } = useParams();
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false); // Control the modal visibility

//   useEffect(() => {
//     // Define an async function to fetch project role information
//     const fetchProjectRoles = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8081/project/${project_id}/roles`);
//         if (response.status !== 200) {
//           throw new Error('Failed to fetch project roles');
//         }
//         const data = response.data.roles;
//         setRoles(data);
//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     // Fetch project roles when the component mounts
//     fetchProjectRoles();
//   }, [project_id]);

//   const handleCreateRoleClick = () => {
//     setIsCreateRoleModalOpen(true); // Open the modal when the button is clicked
//   };

//   const handleCloseCreateRoleModal = () => {
//     setIsCreateRoleModalOpen(false); // Close the modal
//   };

//   // Callback function to handle role creation
//   const handleCreateRole = (formData) => {
//     // Make a POST request to create the role using formData
//     axios
//       .post(`http://localhost:8081/project/${project_id}/add_project_role`, formData)
//       .then((response) => {
//         // Handle success, e.g., close the modal and refresh the roles list
//         handleCloseCreateRoleModal();
//         // You may want to refresh the roles list here, similar to how you did it in useEffect.
//       })
//       .catch((error) => {
//         // Handle error
//         console.error('Error creating role:', error);
//       });
//   };

//   return (
//     <div className="project-roles-container">
//       <Sidebar project_id={project_id} />
//       <div className="project-roles-content">
//         <Navbar />
//         <h2>Project Roles</h2>
//         <button onClick={handleCreateRoleClick}>Create Role</button> {/* Button to open the modal */}
//         {loading ? (
//           <p>Loading project roles...</p>
//         ) : (
//                           <table>
//                             <thead>
//                               <tr>
//                                 <th>Role Name</th>
//                                 <th>Create Issue</th>
//                                 <th>Edit Issue</th>
//                                 <th>Transition Issue</th>
//                                 <th>Close Issue</th>
//                                 <th>Delete Issue</th>
//                                 <th>Assignable</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {roles.map((role, index) => (
//                                 <tr key={index}>
//                                   <td>{role.role_name}</td>
//                                   <td>{role.create_issue ? 'Yes' : 'No'}</td>
//                                   <td>{role.edit_issue ? 'Yes' : 'No'}</td>
//                                   <td>{role.transition_issue ? 'Yes' : 'No'}</td>
//                                   <td>{role.close_issue ? 'Yes' : 'No'}</td>
//                                   <td>{role.delete_issue ? 'Yes' : 'No'}</td>
//                                   <td>{role.assignable ? 'Yes' : 'No'}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//         )}

//         {/* CreateRoleModal component */}
//         <CreateRoleModal
//           isOpen={isCreateRoleModalOpen}
//           onClose={handleCloseCreateRoleModal}
//           onCreateRole={handleCreateRole}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProjectRoles;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/SideBar';
import Navbar from '../../components/NavBar';
import CreateRoleModal from './CreateRoleModal';

const ProjectRoles = () => {
  const { project_id } = useParams();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false); // Control the modal visibility
  const [canAddRole, setCanAddRole] = useState(false); // State to track whether a role can be added

  useEffect(() => {
    // Define an async function to fetch project role information
    const fetchProjectRoles = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/project/${project_id}/roles`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch project roles');
        }
        let data = response.data.roles;
        if (data === null) {
            data = [];
        }
        setRoles(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch project roles when the component mounts
    fetchProjectRoles();

    // Check if a role can be added
    axios
      .get(`http://localhost:8081/project/${project_id}/is_project_owner`)
      .then((response) => {
        // Set the canAddRole state based on the response
        console.log(response.data);
        setCanAddRole(response.data.isProjectOwner);
      })
      .catch((error) => {
        console.error('Error checking if a role can be added:', error);
      });
  }, [project_id]);

  const handleCreateRoleClick = () => {
    setIsCreateRoleModalOpen(true); // Open the modal when the button is clicked
  };

  const handleCloseCreateRoleModal = () => {
    setIsCreateRoleModalOpen(false); // Close the modal
  };

  // Callback function to handle role creation
  const handleCreateRole = (formData) => {
    // Make a POST request to create the role using formData
    axios
      .post(`http://localhost:8081/project/${project_id}/add_project_role`, formData)
      .then((response) => {
        // Handle success, e.g., close the modal and refresh the roles list
        handleCloseCreateRoleModal();
        // You may want to refresh the roles list here, similar to how you did it in useEffect.
      })
      .catch((error) => {
        // Handle error
        console.error('Error creating role:', error);
      });
  };

  return (
    <div className="project-roles-container">
      <Sidebar project_id={project_id} />
      <div className="project-roles-content">
        <Navbar />
        <h2>Project Roles</h2>
        <button
          onClick={handleCreateRoleClick}
          disabled={!canAddRole} // Disable the button if canAddRole is false
        >
          Add Role
        </button>
        {loading ? (
          <p>Loading project roles...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Create Issue</th>
                <th>Edit Issue</th>
                <th>Transition Issue</th>
                <th>Close Issue</th>
                <th>Delete Issue</th>
                <th>Assignable</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={index}>
                  <td>{role.role_name}</td>
                  <td>{role.create_issue ? 'Yes' : 'No'}</td>
                  <td>{role.edit_issue ? 'Yes' : 'No'}</td>
                  <td>{role.transition_issue ? 'Yes' : 'No'}</td>
                  <td>{role.close_issue ? 'Yes' : 'No'}</td>
                  <td>{role.delete_issue ? 'Yes' : 'No'}</td>
                  <td>{role.assignable ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* CreateRoleModal component */}
        <CreateRoleModal
          isOpen={isCreateRoleModalOpen}
          onClose={handleCloseCreateRoleModal}
          onCreateRole={handleCreateRole}
        />
      </div>
    </div>
  );
};

export default ProjectRoles;

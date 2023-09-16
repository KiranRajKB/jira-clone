import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'; // Import axios

const CreateProjectModal = ({ isOpen, onClose }) => {
  const defaultProjectLead = localStorage.getItem('username');

  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    description: '',
    projectLead: defaultProjectLead,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make an HTTP POST request with form data
      const response = await axios.post('http://localhost:8081/create_project', formData);

      // Handle the response as needed (e.g., close the modal)
      console.log('Project created:', response.data);
      onClose();
    } catch (error) {
      // Handle errors here
      console.error('Error creating project:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Project Modal"
    >
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectId">Project ID:</label>
          <input
            type="text"
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="projectLead">Project Lead:</label>
          <input
            type="text"
            id="projectLead"
            name="projectLead"
            value={formData.projectLead}
            onChange={handleChange}
            disabled
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;

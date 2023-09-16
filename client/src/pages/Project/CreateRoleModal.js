// CreateRoleModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';

const CreateRoleModal = ({ isOpen, onClose, onCreateRole }) => {
  const [formData, setFormData] = useState({
    role_name: '',
    create_issue: false,
    edit_issue: false,
    transition_issue: false,
    close_issue: false,
    delete_issue: false,
    assignable: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the create role function with the form data
    onCreateRole(formData);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Create Role Modal">
      <h2>Create Role</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role_name">Role Name:</label>
          <input
            type="text"
            id="role_name"
            name="role_name"
            value={formData.role_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="create_issue">Create Issue:</label>
          <input
            type="checkbox"
            id="create_issue"
            name="create_issue"
            checked={formData.create_issue}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="edit_issue">Edit Issue:</label>
          <input
            type="checkbox"
            id="edit_issue"
            name="edit_issue"
            checked={formData.edit_issue}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="transition_issue">Transition Issue:</label>
          <input
            type="checkbox"
            id="transition_issue"
            name="transition_issue"
            checked={formData.transition_issue}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="close_issue">Close Issue:</label>
          <input
            type="checkbox"
            id="close_issue"
            name="close_issue"
            checked={formData.close_issue}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="delete_issue">Delete Issue:</label>
          <input
            type="checkbox"
            id="delete_issue"
            name="delete_issue"
            checked={formData.delete_issue}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="assignable">Assignable:</label>
          <input
            type="checkbox"
            id="assignable"
            name="assignable"
            checked={formData.assignable}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </Modal>
  );
};

export default CreateRoleModal;

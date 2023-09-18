import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

const CreateUserModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    canCreateProject: false,
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({ ...formData, [name]: name === 'canCreateProject' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/create_user', formData);

      if (response.status === 201) {
        console.log('User created successfully');
        onClose();
        window.location.reload();
      } else {
        console.error('Failed to create user:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Create User Modal">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="canCreateProject"
              checked={formData.canCreateProject}
              onChange={handleChange}
            />
          }
          label="Permission to create projects"
        />
        <Button type="submit" variant="contained" color="primary">
          Create User
        </Button>
      </form>
    </Modal>
  );
};

export default CreateUserModal;

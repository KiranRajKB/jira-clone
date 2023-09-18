import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'; // Material-UI DeleteIcon
import CancelIcon from '@mui/icons-material/Cancel'; // Material-UI CancelIcon
import axios from 'axios';

const RemovePeopleModal = ({ isOpen, onClose, projectID, username }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemovePerson = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8081/project/${projectID}/remove_project_people`, {
        username: username,
      });

      if (response.status === 200) {
        console.log('Person removed successfully');
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error removing person:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="remove-person-modal"
      aria-describedby="remove-person-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '4px',
          boxShadow: '24px',
          padding: '16px',
          minWidth: '300px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" id="remove-person-modal" gutterBottom>
          Remove Person
        </Typography>
        <Typography id="remove-person-description" paragraph>
          Are you sure you want to remove <strong>{username}</strong> from the project?
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />} // Add DeleteIcon as the start icon
            onClick={handleRemovePerson}
            disabled={isLoading}
          >
            {isLoading ? 'Removing...' : 'Remove'}
          </Button>
          <IconButton
            color="default"
            onClick={onClose}
            disabled={isLoading}
            sx={{ marginLeft: '8px' }}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default RemovePeopleModal;

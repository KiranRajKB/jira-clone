import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import Papa from 'papaparse';

const BulkUploadUsers = ({ isOpen, onClose }) => {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file.');
      return;
    }
  
    const parseConfig = {
      header: true,
      dynamicTyping: true,
    };
  
    Papa.parse(csvFile, {
      ...parseConfig,
      complete: async (result) => {
        try {
            console.log(result)
          const response = await axios.post('http://localhost:8081/bulk_create_users', {users: result.data});
          if (response.status === 200) {
            alert('Bulk upload successful!');
            // You can perform additional actions after a successful upload
          } else {
            alert('Bulk upload failed.');
            // Handle the error case
          }
        } catch (error) {
          console.error('Error uploading CSV:', error);
          alert('An error occurred during bulk upload.');
          // Handle the error case
        }
      },
    });
  };
  
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Bulk Upload Modal">
      <h2>Bulk Upload Users</h2>
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
      <Button onClick={handleUpload} variant="contained" color="primary">
        Upload
      </Button>
    </Modal>
  );
};

export default BulkUploadUsers;

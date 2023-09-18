import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../components/NavBar';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Grid,
  ListItemSecondaryAction,
  TextField,
} from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Fetch user information when the component mounts
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8081/person");
        setUser(response.data.person);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = () => {
    // Enable editing mode and initialize updatedUser with the current user data
    setIsEditing(true);
    setUpdatedUser({ ...user });
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:8081/edit_profile`, updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancelClick = () => {
    // Cancel editing and reset the updatedUser to the original user data
    setIsEditing(false);
    setUpdatedUser({ ...user });
  };

  const handleLogoutClick = () => {
    // Clear the token from local storage
    localStorage.removeItem('jwt_token');
    // Redirect to the login page
    window.location.href = '/login';
  };

  const handleInputChange = (e) => {
    // Update the updatedUser state when the input fields change
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

  return (
    <div className="profile-container">
      <NavigationBar />
      <Paper elevation={3} style={{ margin: 'auto', marginTop: '20px', padding: '20px', maxWidth: '400px' }}>
        <List>
          <ListItem>
            {isEditing ? (
              <TextField
                name="username"
                value={updatedUser.username}
                onChange={handleInputChange}
                label="Username"
                fullWidth
                disabled
              />
            ) : (
              <ListItemText primary="Username" secondary={user.username} />
            )}
          </ListItem>
          {isEditing ? (
            <ListItem>
              <TextField
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
                label="Name"
                fullWidth
              />
            </ListItem>
          ) : (
            <ListItem>
              <ListItemText primary="Name" secondary={user.name} />
            </ListItem>
          )}
          {isEditing ? (
            <ListItem>
              <TextField
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                label="Email"
                fullWidth
              />
            </ListItem>
          ) : (
            <ListItem>
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
          )}
        </List>
        <div style={{ marginTop: '20px' }}>
          <Grid container justifyContent="center" spacing={2}>
            {isEditing ? (
              <>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleSaveClick}>
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleEditClick}>
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleLogoutClick}>
                    Logout
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </div>
      </Paper>
    </div>
  );
};

export default Profile;

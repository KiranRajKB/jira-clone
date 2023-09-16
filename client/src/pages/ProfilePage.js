import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            <h2>Profile</h2>
            <div className="profile-info">
                <div>
                    <strong>Username:</strong> {user.username}
                </div>
                {isEditing ? (
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={updatedUser.name}
                            onChange={handleInputChange}
                        />
                    </div>
                ) : (
                    <div>
                        <strong>Name:</strong> {user.name}
                    </div>
                )}
                {isEditing ? (
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={updatedUser.email}
                            onChange={handleInputChange}
                        />
                    </div>
                ) : (
                    <div>
                        <strong>Email:</strong> {user.email}
                    </div>
                )}
            </div>
            <div className="profile-actions">
                {isEditing ? (
                    <button onClick={handleSaveClick}>Save</button>
                ) : (
                    <button onClick={handleEditClick}>Edit</button>
                )}
                <button onClick={handleLogoutClick}>Logout</button>
            </div>
        </div>
    );
};

export default Profile;

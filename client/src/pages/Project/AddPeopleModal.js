import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const AddPeopleModal = ({ isOpen, onClose, projectID }) => {
    const [peopleOptions, setPeopleOptions] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);
    const [formData, setFormData] = useState({
        PersonUsername: '',
        PersonRole: '',
    });

    useEffect(() => {
        // Fetch the list of people
        axios.get('http://localhost:8081/people')
            .then((response) => {
                if (response.status === 200) {
                    setPeopleOptions(response.data.people);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch people:', error);
            });

        // Fetch the list of roles for the project
        axios.get(`http://localhost:8081/project/${projectID}/roles`)
            .then((response) => {
                if (response.status === 200) {
                    setRolesOptions(response.data.roles);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch project roles:', error);
            });
    }, [isOpen, projectID]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Make a POST request to add people to the project
        axios.post(`http://localhost:8081/project/${projectID}/add_project_people`, formData)
            .then((response) => {
                if (response.status === 200) {
                    onClose();
                }
            })
            .catch((error) => {
                console.error('Error adding people:', error);
            });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Add People Modal">
            <h2>Add People</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <select
                        id="username"
                        name="PersonUsername"
                        value={formData.PersonUsername}
                        onChange={(e) => setFormData({ ...formData, PersonUsername: e.target.value })}
                    >
                        <option value="">Select Username</option>
                        {peopleOptions.map((person) => (
                            <option key={person.username} value={person.username}>
                                {person.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        name="PersonRole"
                        value={formData.PersonRole}
                        onChange={(e) => setFormData({ ...formData, PersonRole: e.target.value })}
                    >
                        <option value="">Select Role</option>
                        {rolesOptions.map((role) => (
                            <option key={role.role_name} value={role.role_name}>
                                {role.role_name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" >Add</button>
            </form>
        </Modal>
    );
};

export default AddPeopleModal;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/SideBar';
import Navbar from '../../components/NavBar';
import AddPeopleModal from './AddPeopleModal';

const ProjectPeople = () => {
    const { project_id } = useParams();
    const [people, setPeople] = useState([]);
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddPeopleModalOpen, setIsAddPeopleModalOpen] = useState(false);
    const [isProjectOwner, setIsProjectOwner] = useState(false); // State to track if user is project owner

    useEffect(() => {
        const fetchProjectPeople = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/project/${project_id}/people`);
                if (response.status !== 200) {
                    throw new Error('Failed to fetch project people');
                }
                const data = response.data.people || [];
                setPeople(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProjectPeople();
    }, [project_id]);

    useEffect(() => {
        const filtered = people.filter((person) =>
            person.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.role_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPeople(filtered);
    }, [people, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOpenAddPeopleModal = () => {
        setIsAddPeopleModalOpen(true);
    };

    const handleCloseAddPeopleModal = () => {
        setIsAddPeopleModalOpen(false);
    };

    useEffect(() => {
        // Make an API call to check if the user is the project owner
        axios.get(`http://localhost:8081/project/${project_id}/is_project_owner`)
            .then((response) => {
                if (response.status === 200) {
                    setIsProjectOwner(response.data.isProjectOwner);
                }
            })
            .catch((error) => {
                console.error('Error checking project owner:', error);
            });
    }, [project_id]);

    return (
        <div className="project-people-container">
            <Sidebar project_id={project_id} />
            <div className="project-people-content">
                <Navbar />
                <h2>Project People</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button
                        onClick={handleOpenAddPeopleModal}
                        disabled={!isProjectOwner} // Disable the button if not project owner
                    >
                        Add People
                    </button>
                </div>
                {loading ? (
                    <p>Loading project people...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPeople.map((person, index) => (
                                <tr key={index}>
                                    <td>{person.username}</td>
                                    <td>{person.name}</td>
                                    <td>{person.email}</td>
                                    <td>{person.role_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <AddPeopleModal
                    isOpen={isAddPeopleModalOpen}
                    onClose={handleCloseAddPeopleModal}
                    projectID={project_id}
                />
            </div>
        </div>
    );
};

export default ProjectPeople;

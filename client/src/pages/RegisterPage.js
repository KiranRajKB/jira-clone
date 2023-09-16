import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
    const nav = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        canCreateProject: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        console.log(formData)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);

        try {
            const response = await axios.post("http://localhost:8081/register", formData);
            // Handle success, e.g., redirect to a success page or show a success message
            console.log("Registration successful", response.data);
            nav("/login")
        } catch (error) {
            // Handle errors, e.g., display error messages
            console.error("Registration error", error);
            nav("/register")
        }

    };


    return (
        <div>
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Create Project:
                    <input
                        type="checkbox"
                        name="canCreateProject"
                        checked={formData.canCreateProject}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
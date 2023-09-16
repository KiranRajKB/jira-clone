import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post("http://localhost:8081/login", {
            username: formData.username,
            password: formData.password,
          });
          
          if (response.status === 200) {
            const { token } = response.data;
    
            // Store the token securely in localStorage
            localStorage.setItem("jwt_token", token);
            localStorage.setItem("username", formData.username);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            toast.error("Logged in successfully");
            navigate("/");
        } else {
            // Handle login error and display toast notification
            toast.error("Login failed. Please check your credentials.");
            console.log("ERROR")
          }
        } catch (error) {
          // Handle network or other errors and display toast notification
          toast.error("Login failed. Please check your credentials.");
          console.log("ERROR", error)

        }
      };

    return (
        <div>
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
            <p>
                New user? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default LoginPage;
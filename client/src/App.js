import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Projects from "./pages/ProjectsPage";
import Home from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ProjectDetails from "./pages/Project/ProjectDetails";
import ProjectRoles from "./pages/Project/ProjectRoles";
import ProjectPeople from "./pages/Project/ProjectPeople";
import People from "./pages/People";
import ProjectDelete from "./pages/Project/ProjectDelete";
import ProjectIssues from "./pages/Project/ProjectIssues";
import Profile from "./pages/ProfilePage";

function App() {
    const accessToken = localStorage.getItem("jwt_token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    // const nav = useNavigate();
    // const [accessToken, setAccessToken] = useState(localStorage.getItem("jwt_token"));

    // useEffect(() => {
        // Axios interceptor for request
        // axios.interceptors.request.use(
        //     (config) => {
        //         // Add the access token to the request headers
        //         config.headers.Authorization = `Bearer ${accessToken}`;
        //         return config;
        //     },
        //     (error) => {
        //         return Promise.reject(error);
        //     }
        // );


        // Axios interceptor for response
    //     axios.interceptors.response.use(
    //         (response) => {
    //             return response;
    //         },
    //         (error) => {
    //             console.log("ERROR : ", error.response);
    //             // Check if the error is due to an expired token
    //             if (error.response.status === 401 && (1 || error.response.data.error.toLowerCase().contains("token"))) {
    //                 // Clear the expired token from localStorage
    //                 localStorage.removeItem("jwt_token");
    //                 setAccessToken(null);

    //                 // Use Navigate to redirect to the Login page
    //                 // return nav("/login");
    //                 window.location.href = '/login';
    //             }

    //             // Handle other types of errors
    //             return Promise.reject(error);
    //         }
    //     );
    // }, [accessToken]);

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            console.log("ERROR : ", error.response);
            // Check if the error is due to an expired token
            if (error.response.status === 401 && (1 || error.response.data.error.toLowerCase().contains("token"))) {
                // Clear the expired token from localStorage
                // localStorage.removeItem("jwt_token");
                // setAccessToken(null);

                // Use Navigate to redirect to the Login page
                // return nav("/login");
                // window.location.href = '/login';
            }

            // Handle other types of errors
            return Promise.reject(error);
        }
    );

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/people" element={<People />} />
                    <Route path="/profile" element={<Profile />} />

                    <Route path="/project/:project_id/details" element={<ProjectDetails />} />
                    <Route path="/project/:project_id/roles" element={<ProjectRoles />} />
                    <Route path="/project/:project_id/people" element={<ProjectPeople />} />
                    <Route path="/project/:project_id/issues" element={<ProjectIssues />} />

                    <Route path="/project/:project_id/delete_project" element={<ProjectDelete />} />



                    {/* <Route path="/people" element={<People />} />
                    <Route path="/profile" element={<Profile />} /> */}
                    <Route path="/" element={<Home />} />

                    {/* <Route path="/home" element={<HomePage /> } /> */}
                    {/* <Route path="/" element={<LoginPage />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

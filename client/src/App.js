import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Projects from "./pages/ProjectsPage";
import Home from "./pages/HomePage";
import ProjectDetails from "./pages/Project/ProjectDetails";
import ProjectRoles from "./pages/Project/ProjectRoles";
import ProjectPeople from "./pages/Project/ProjectPeople";
import People from "./pages/People";
import ProjectDelete from "./pages/Project/ProjectDelete";
import ProjectIssues from "./pages/Project/ProjectIssues";
import Profile from "./pages/ProfilePage";
import NavigationBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { Container, Grid } from "@mui/material";

// function TempProject() {
//     const { project_id } = useParams("project_id");
//     return (
//         <div sytle={{display: "flex", direction: "row"}}>
//         {/* // <Container style={{ display: "flex", flexDirection: "row", width: "100%", margin: 0, padding: 0 }}> */}
//             {/* <Grid item xs={2} style={{flex: "1 1"}}> */}
//                 <SideBar project_id={project_id} />
//             {/* </Grid> */}
//                 <Routes>
//                     <Route path="details" element={<ProjectDetails />} />
//                     <Route path="roles" element={<ProjectRoles />} />
//                     <Route path="people" element={<ProjectPeople />} />
//                     <Route path="issues" element={<ProjectIssues />} />
//                     <Route path="delete_project" element={<ProjectDelete />} />
//                 </Routes>
//         {/* // </Container> */}
//         </div>
//     )
// }

function TempProject() {
    const { project_id } = useParams("project_id");
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <SideBar project_id={project_id} />
            <div style={{ flex: "1 1 auto", overflow: "auto", marginLeft: "20vw", marginTop: "10vh" }}>
                <Routes>
                    <Route path="details" element={<ProjectDetails />} />
                    <Route path="roles" element={<ProjectRoles />} />
                    <Route path="people" element={<ProjectPeople />} />
                    <Route path="issues" element={<ProjectIssues />} />
                    <Route path="delete_project" element={<ProjectDelete />} />
                </Routes>
            </div>
        </div>
    )
}


function TempHome() {

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <NavigationBar />
            {/* <div> */}
            <div style={{  marginTop: "10vh" }}>
                <Routes>
                    <Route path="/project/:project_id/*" element={<TempProject />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/people" element={<People />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </div>
    );
    
}

function App() {
    const accessToken = localStorage.getItem("jwt_token");
    if (!accessToken && window.location.pathname != "/login") window.location.assign("/login");
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
            // Check if the error is due to an expired token
            if ((error.response.status === 401 || error.response.status === 400) && (error.response.data.error.toLowerCase().includes("token"))) {
                window.alert("Session expired, please login again")
                localStorage.removeItem("jwt_token");
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
    );

    return (
        <Router >
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<TempHome />} />
            </Routes>
        </Router>
    );
}

export default App;
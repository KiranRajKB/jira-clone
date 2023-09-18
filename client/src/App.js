import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from "react-router-dom";
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
import NavigationBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { Container, Grid } from "@mui/material";

function TempProject() {
    const { project_id } = useParams("project_id");
    return (
        <Container style={{ display: "flex", flexDirection: "row", width: "100%", margin: 0, padding: 0 }}>
            <Grid item xs={"auto"} style={{ flex: "0 0 auto" }}>
                <SideBar project_id={project_id} />
            </Grid>
            <Grid item xs={"auto"} style={{ flex: "1 1 auto" }}>
                <Routes>
                    <Route path="details" element={<ProjectDetails />} />
                    <Route path="roles" element={<ProjectRoles />} />
                    <Route path="people" element={<ProjectPeople />} />
                    <Route path="issues" element={<ProjectIssues />} />
                    <Route path="delete_project" element={<ProjectDelete />} />
                </Routes>
            </Grid>
        </Container>

    )
}

function TempHome() {

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", margin: 0, padding: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", margin: 0, padding: 0 }}>
                <NavigationBar />
            </div>
            <div style={{ flex: "1", display: "flex" }}>
                <Routes>
                    {/* <Route path="/project/:project_id/details" element={<ProjectDetails />} />
                    <Route path="/project/:project_id/roles" element={<ProjectRoles />} />
                    <Route path="/project/:project_id/people" element={<ProjectPeople />} />
                    <Route path="/project/:project_id/issues" element={<ProjectIssues />} />
                    <Route path="/project/:project_id/delete_project" element={<ProjectDelete />} /> */}
                    <Route path="/project/:project_id/*" element={<TempProject />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/people" element={<People />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </div>
        // <Container style={{ display: "flex", flexDirection: "column", margin: 0, padding: 0 }}>
        //     <NavigationBar />
        //     <Routes>
        //         {/* <Route path="/project/:project_id/details" element={<ProjectDetails />} />
        //         <Route path="/project/:project_id/roles" element={<ProjectRoles />} />
        //         <Route path="/project/:project_id/people" element={<ProjectPeople />} />
        //         <Route path="/project/:project_id/issues" element={<ProjectIssues />} />
        //         <Route path="/project/:project_id/delete_project" element={<ProjectDelete />} /> */}
        //         <Route path="/project/:project_id/*" element={<TempProject />} />
        //         <Route path="/projects" element={<Projects />} />
        //         <Route path="/people" element={<People />} />
        //         <Route path="/profile" element={<Profile />} />
        //     </Routes>
        // </Container>
    )
}

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
        <Router >
            <Container style={{ padding: 0, margin: 0 }}>

                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/*" element={<TempHome />} />

                    {/* <Route path="/projects" element={<Projects />} />
                    <Route path="/people" element={<People />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/project/:project_id/details" element={<ProjectDetails />} />
                    <Route path="/project/:project_id/roles" element={<ProjectRoles />} />
                    <Route path="/project/:project_id/people" element={<ProjectPeople />} />
                    <Route path="/project/:project_id/issues" element={<ProjectIssues />} />
                    <Route path="/project/:project_id/delete_project" element={<ProjectDelete />} />
                    <Route path="/" exact element={<Home />} /> */}
                </Routes>
            </Container>
        </Router>
    );
}

export default App;


// import React, { useEffect } from "react";
// import axios from "axios";
// import {
//     BrowserRouter as Router,
//     Route,
//     Routes,
//     useNavigate,
//     useParams
// } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import Projects from "./pages/ProjectsPage";
// import Home from "./pages/HomePage";
// import RegisterPage from "./pages/RegisterPage";
// import ProjectDetails from "./pages/Project/ProjectDetails";
// import ProjectRoles from "./pages/Project/ProjectRoles";
// import ProjectPeople from "./pages/Project/ProjectPeople";
// import People from "./pages/People";
// import ProjectDelete from "./pages/Project/ProjectDelete";
// import ProjectIssues from "./pages/Project/ProjectIssues";
// import Profile from "./pages/ProfilePage";
// import NavigationBar from "./components/NavBar";
// import SideBar from "./components/SideBar";
// import { Container, Grid } from "@mui/material";

// // Layout component with NavigationBar at the top
// function Layout({ children }) {
//     return (
//         <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//             <NavigationBar />
//             <div style={{ flex: "1", display: "flex" }}>{children}</div>
//         </div>
//     );
// }

// // Content component with SideBar on the left
// function ContentWithSidebar({ children }) {
//     const project_id = useParams("project_id");
//     return (
//         <Container
//             style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 width: "100%",
//                 padding: 0, // Remove padding
//                 margin: 0, // Remove margin
//             }}
//         >
//             <Grid item xs={"auto"} style={{ flex: "0 0 auto" }}>
//                 <SideBar project_id={project_id} />
//             </Grid>
//             <Grid item xs={"auto"} style={{ flex: "1 1 auto" }}>
//                 {children}
//             </Grid>
//         </Container>
//     );
// }

// function App() {
//     const accessToken = localStorage.getItem("jwt_token");
//     axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

//     axios.interceptors.response.use(
//         (response) => {
//             return response;
//         },
//         (error) => {
//             console.log("ERROR : ", error.response);
//             if (
//                 error.response.status === 401 &&
//                 (1 || error.response.data.error.toLowerCase().contains("token"))
//             ) {
//                 // Handle token expiration or unauthorized access
//             }
//             return Promise.reject(error);
//         }
//     );

//     return (
//         <Router style={{ minWidth: "100%" }}>
//             <Routes>
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />
//                 {/* Routes with Sidebar */}
//                 <Route
//                     path="/project/:project_id/*"
//                     element={
//                         <Layout>
//                             <ContentWithSidebar>
//                                 <Routes>
//                                     <Route path="details" element={<ProjectDetails />} />
//                                     <Route path="roles" element={<ProjectRoles />} />
//                                     <Route path="people" element={<ProjectPeople />} />
//                                     <Route path="issues" element={<ProjectIssues />} />
//                                     <Route path="delete_project" element={<ProjectDelete />} />
//                                 </Routes>
//                             </ContentWithSidebar>
//                         </Layout>
//                     }
//                 />
//                 {/* Routes without Sidebar */}
//                 <Route path="/*" element={<Layout />}>
//                     <Route path="projects" element={<Projects />} />
//                     <Route path="people" element={<People />} />
//                     <Route path="profile" element={<Profile />} />
//                     <Route path="" element={<Home />} />
//                 </Route>
//             </Routes>
//         </Router>
//     );
// }

// export default App;

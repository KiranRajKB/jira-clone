// NavigationBar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function NavigationBar() {
    const location = useLocation();

    const activeLinkClass = {
        fontWeight: "bold",
        color: "white",
        backgroundColor: "blue",
    };

    const linkStyle = {
        paddingRight: "20px",
    };

    return (
        <AppBar color="primary" style={{
            height: "10vh", zindex: 1000
        }}>
            <Toolbar>
                <ul style={{ display: "flex", listStyle: "none", paddingLeft: 0 }}>
                    <li>
                        <Button
                            component={Link}
                            to="/"
                            exact="true"
                            style={{
                                ...(location.pathname === "/" ? activeLinkClass : {}),
                                ...linkStyle, // Apply padding
                            }}
                            startIcon={<HomeIcon />}
                            color="inherit"
                        >
                            Home
                        </Button>
                    </li>
                    <li>
                        <Button
                            component={Link}
                            to="/projects"
                            style={{
                                ...(location.pathname === "/projects" ? activeLinkClass : {}),
                                ...linkStyle, // Apply padding
                            }}
                            startIcon={<AssignmentIcon />}
                            color="inherit"
                        >
                            Projects
                        </Button>
                    </li>
                    <li>
                        <Button
                            component={Link}
                            to="/people"
                            style={{
                                ...(location.pathname === "/people" ? activeLinkClass : {}),
                                ...linkStyle, // Apply padding
                            }}
                            startIcon={<PeopleIcon />}
                            color="inherit"
                        >
                            People
                        </Button>
                    </li>
                </ul>
                <div style={{ flex: 1 }}></div> {/* Add a flex spacer */}
                <Button
                    component={Link}
                    to="/profile"
                    style={{
                        ...(location.pathname === "/profile" ? activeLinkClass : {}),
                    }}
                    startIcon={<AccountCircleIcon />}
                    color="inherit"
                >
                    Profile
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavigationBar;

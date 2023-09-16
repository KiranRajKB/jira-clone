import React from "react";
import { Link, useLocation } from "react-router-dom";

function NavigationBar() {
    const location = useLocation();

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/projects"
                        className={location.pathname === "/projects" ? "active" : ""}
                    >
                        Projects
                    </Link>
                </li>
                <li>
                    <Link
                        to="/people"
                        className={location.pathname === "/people" ? "active" : ""}
                    >
                        People
                    </Link>
                </li>
            </ul>
            <Link
                to="/profile"
                className={location.pathname === "/profile" ? "active" : ""}
            >
                Profile
            </Link>
        </nav>
    );
}

export default NavigationBar;

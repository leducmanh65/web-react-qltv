import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Assuming you have a CSS file for styling

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="logo">Blog Management</div>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" exact activeClassName="active">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/create" activeClassName="active">Create Post</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
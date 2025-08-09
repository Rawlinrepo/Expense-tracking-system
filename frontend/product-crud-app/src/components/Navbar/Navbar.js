import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/image.png';

const Navbar = ({ token, handleLogout, username, avatarUrl }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{ backgroundColor: '#273f7' }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="Expense Tracker Logo" className="logo" />
                    <span style={{ fontWeight: 'bold', fontSize: '35px' }}>Expense Tracking System</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav ms-auto" style={{ marginRight: '250px' }}>
                        {token ? (
                            <>
                                <Link to="/" className="nav-link">Home</Link>
                                <Link to="/add" className="nav-link">Add Expense</Link>
                                <Link to="#" onClick={handleLogout} className="nav-link">Logout</Link>
                            </>
                        ) : (
                            <>
                            
                                <Link to="/login" className="nav-link view-toggle-buttons mb-3" style={{fontSize:'30px'}}>Login</Link>
                                <Link to="/register" className="nav-link" style={{fontSize:'30px'}}>Register</Link>
                            </>
                        )}
                    </div>
                    {token && (
                        <div className="d-flex align-items-center ms-auto">
                            {avatarUrl && (
                                <img src={avatarUrl} alt="Profile Avatar" className="profile-avatar" />
                            )}
                            <span className="text">{username.toUpperCase()}</span>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
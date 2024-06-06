import React from 'react';
import MyAgGrid from './MyAgGrid';
import CustomStatusBar from './CustomStatusBar';
import './index.css'; // Ensure your CSS file is imported

const Dashboard = () => {
    return (
        <div>
            <header>
                <div className="header-top">
                    <div className="header-links">
                        <a href="#help">Knowledge and Self Help</a>
                        <a href="#services">Additional Services</a>
                    </div>
                </div>
                <div className="header-content">
                    <img src="./logo.png" alt="Company Logo" className="logo" /> {/* Ensure you have a logo image in your public folder */}
                    <nav>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#profile">Profile</a></li>
                            <li><a href="#requests">Requests</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main>
                
                
                <div className="dashboard">
                    <MyAgGrid />
                </div>
            </main>
            <footer>
                <p>© 2024 Company, Inc.</p>
            </footer>
        </div>
    );
};

export default Dashboard;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/SideBar.css';

function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button onClick={toggleSidebar} className="close-btn">X</button>
            <ul>
                <li><Link to="/" onClick={toggleSidebar} className={location.pathname === '/' ? 'active-link' : ''}>Home</Link></li>
                <li><Link to="/main-test" onClick={toggleSidebar} className={location.pathname === '/main-test' ? 'active-link' : ''}>Main page</Link></li>
                <li><Link to="/linssen-yachts" onClick={toggleSidebar} className={location.pathname === '/linssen-yachts' ? 'active-link' : ''}>Linssen Yachts</Link></li>
                <li><Link to="/ship-of-thesis" onClick={toggleSidebar} className={location.pathname === '/ship-of-thesis' ? 'active-link' : ''}>Ship of Thesis</Link></li>
                <li><Link to="/lasering-process" onClick={toggleSidebar} className={location.pathname === '/lasering-process' ? 'active-link' : ''}>Lasering Process</Link></li>
                <li><Link to="/contact" onClick={toggleSidebar}className={location.pathname === '/contact' ? 'active-link' : ''} >Contact</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
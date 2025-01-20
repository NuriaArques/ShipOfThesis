import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './styles/SideBar.css';


function Sidebar({ isOpen, toggleSidebar }) {
    // Get current location and navigation function from React Router
    const location = useLocation();
    const navigate = useNavigate();

    // State to control the visibility of the submenu under "Yachts"
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    
    const yachtSeries = [
        { name: 'Grand Sturdy series', seriesId: 'grand-sturdy' },
        { name: 'SL series', seriesId: 'sl' },
        { name: 'Variotop series', seriesId: 'variotop' },
        { name: 'Variodeck series', seriesId: 'variodeck' }
    ];

    // Function to handle click on "Yachts" menu item
    const handleYachtsClick = () => {
        if(location.pathname !== '/yachts'){
            navigate('/yachts');
        }
        setIsSubmenuOpen((prev) => !prev); // Toggle submenu visibility
    };

    // Check if the current route starts with "/yachts" to highlight the menu item
    const isYachtsActive = location.pathname.startsWith('/yachts');

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Close button to toggle sidebar visibility */}
            <button onClick={toggleSidebar} className="close-btn">X</button>
            <ul>
                {/* Navigation link to "Ship of Thesis" */}
                <li><Link to="/" onClick={toggleSidebar} className={location.pathname === '/ship-of-thesis' ? 'active-link' : ''}>Ship of Thesis</Link></li>
                
                {/* "Yachts" menu item with expandable submenu */}
                <li>
                    <Link to="/yachts" onClick={(e) => {e.preventDefault(); handleYachtsClick();}} className={isYachtsActive ? 'active-link' : ''}>Yachts</Link>
                    {/* Render submenu when "Yachts" is clicked */}
                    {isSubmenuOpen && (
                        <ul className="submenu">
                            {yachtSeries.map(series => (
                                <li key={series.seriesId}>
                                    <Link 
                                        to={`/yachts/${series.seriesId}`} 
                                        onClick={toggleSidebar} 
                                        className={location.pathname === `/yachts/${series.seriesId}` ? 'active-link' : ''}
                                    >
                                        {series.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
                
                {/* Navigation link to "Lasering Process" */}
                <li><Link to="/lasering-process" onClick={toggleSidebar} className={location.pathname === '/lasering-process' ? 'active-link' : ''}>Lasering Process</Link></li>
                
                {/* Navigation link to "Contact" page */}
                <li><Link to="/contact" onClick={toggleSidebar}className={location.pathname === '/contact' ? 'active-link' : ''} >Contact</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './styles/SideBar.css';


function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false); // Ccontrol submenu visibility
    
    const yachtSeries = [
        { name: 'Grand Sturdy series', seriesId: 'grand-sturdy' },
        { name: 'SL series', seriesId: 'sl' },
        { name: 'Variotop series', seriesId: 'variotop' },
        { name: 'Variodeck series', seriesId: 'variodeck' }
    ];

    const handleYachtsClick = () => {
        if(location.pathname !== '/yachts'){
            navigate('/yachts');
        }
        setIsSubmenuOpen((prev) => !prev); // Toggle submenu visibility
    };

    const isYachtsActive = location.pathname.startsWith('/yachts');

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button onClick={toggleSidebar} className="close-btn">X</button>
            <ul>
                
                <li><Link to="/" onClick={toggleSidebar} className={location.pathname === '/ship-of-thesis' ? 'active-link' : ''}>Ship of Thesis</Link></li>
                <li><Link to="/linssen-yachts" onClick={toggleSidebar} className={location.pathname === '/linssen-yachts' ? 'active-link' : ''}>Linssen Yachts</Link></li>
                <li>
                    <Link to="/yachts" onClick={(e) => {e.preventDefault(); handleYachtsClick();}} className={isYachtsActive ? 'active-link' : ''}>Yachts</Link>
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
                <li><Link to="/lasering-process" onClick={toggleSidebar} className={location.pathname === '/lasering-process' ? 'active-link' : ''}>Lasering Process</Link></li>
                <li><Link to="/contact" onClick={toggleSidebar}className={location.pathname === '/contact' ? 'active-link' : ''} >Contact</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importing components
import Header from './components/Header';
import Sidebar from './components/SideBar';
import YachtSeries from './components/pages/YachtSeries';
import YachtModels from './components/pages/YachtModels';
import MainContent from './components/MainContent';
import Contact from './components/pages/Contact';
import LaseringProcess from './components/pages/LaseringProcess';
import ShipOfThesis from './components/pages/ShipOfThesis';
import './App.css';

function App() {
    // State to manage sidebar open/close state
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <div className="App">
                {/* Header section with a button to toggle sidebar */}
                <header className="header">
                    <button onClick={toggleSidebar} className="sidebar-toggle-btn">
                        ☰
                    </button>
                    <Header />
                </header>

                {/* Sidebar component with toggle functionality */}
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                
                {/* Main content area that shifts when sidebar is open */}
                <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
                    {/* Route definitions for different pages */}
                    <Routes>
                        <Route path="/yachts" element={<YachtSeries />} />
                        <Route path="/yachts/:seriesId" element={<YachtModels />} />
                        <Route path="/yachts/:seriesId/:modelID" element={<MainContent />} />
                        <Route path="/" element={<ShipOfThesis />} />
                        <Route path="/lasering-process" element={<LaseringProcess />} />
                        <Route path="/contact" element={<Contact />} />


                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

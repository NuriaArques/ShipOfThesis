import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Header from './components/Header';
import Sidebar from './components/SideBar';
import YachtSeries from './components/YachtSeries';
import YachtModels from './components/YachtModels';

import MainContent from './components/MainContent';

import Contact from './components/pages/Contact';
import LaseringProcess from './components/pages/LaseringProcess';
import LinssenYachts from './components/pages/LinssenYachts';
import ShipOfThesis from './components/pages/ShipOfThesis';
import './App.css';



/*

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
function MyComponent() {
    const gltf = useLoader(GLTFLoader, '/path/to/your/model.gltf');

    return (
        <primitive object={gltf.scene} />
    );
}
// can display 2d and 3d scenes
// renders the model to a canvas
<Canvas>
    <MyComponent />
</Canvas>
*/

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
        <div className="App">
            <header className="header">
                <button onClick={toggleSidebar} className="sidebar-toggle-btn">
                    ☰
                </button>
                <Header />
            </header>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
                <Routes>
                    <Route path="/yachts" element={<YachtSeries />} />
                    <Route path="/yachts/:seriesId" element={<YachtModels />} />
                    <Route path="/yachts/:seriesId/:modelID" element={<MainContent />} />
                    <Route path="/linssen-yachts" element={<LinssenYachts />} />
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

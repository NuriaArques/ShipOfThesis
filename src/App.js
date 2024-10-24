import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  return (
    <div className="App">
            <header className="header">
                <Header/>
            </header>
            <div className="content">
                {/* Your main content goes here */}
                <MainContent />
                {/* Add more content or components as needed */}
            </div>
        </div>
  );
}

export default App;

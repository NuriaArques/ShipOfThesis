import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/MainContent.css';


function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const location = useLocation();
    const model  = location.state?.yacht.name;

    useEffect(() => {
        const introMessage = [
            "Welcome! How can I assist you today?",
            `You can ask me any question regarding the quality control and cleaning process of ${model}.`
        ];
        setMessages([{ type: "bot", text: introMessage }]);
    }, [model]);

    const handleSend = () => {
        if (input.trim() !== "") {
            // User question
            setMessages([...messages, { type: "user", text: input }]);
            
            // CONSTANT RESPONSE!!!!!
            const response = "This is a fixed response.";
            setMessages(prevMessages => [...prevMessages, { type: "bot", text: response }]);

            setInput("");
        }
    };

    // Trigger send on Enter key
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}`}>
                        {Array.isArray(msg.text)
                            ? msg.text.map((line, idx) => (
                                <div key={idx}>{line}<br /></div>
                              ))
                            : msg.text
                        }
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    placeholder="Type your question here..." 
                />
                <button onClick={handleSend}>➤</button>
            </div>
        </div>
    );
}

function MainContent() {

    const location = useLocation();
    const ymodel  = location.state?.yacht;

    const report = ymodel?.report
    // Function to extract the report name from the URL
    const getReportName = (url) => {
        const lastSlashIndex = url.lastIndexOf('/');
        return url.substring(lastSlashIndex + 1);
    };
    
    return (
        <div className="main-content">
        
        {/* Left Panel */}
        <div className="left-panel">
            
            {/* Info + 3D Section */}
            <div className="info-3d-container">
                {/* Boat Information (Upper Side) */}
                <div className="boat-info">
            
                    {/* Boat Characteristics (Right Side) */}
                    <div className="boat-characteristics">
                        <h1 style={{fontFamily: "Segoe UI"}}>{ymodel.name}</h1>
                        
                        <p>{ymodel.dimensions}</p>
                        <p>{ymodel.beds}</p>
                        <p>{ymodel.releaseDate}</p>
                    </div>
                
                    {/* Boat Image (Left Side) */}
                    <div className="boat-image">
                        <img src={ymodel.image} alt='yacht image' />
                    </div>

                </div>


                {/* 3D Viewer Section (Below Info and Image) */}
                <div className="three-d-visualization">
                    <img src='/img/3Dexample.jpg' alt="3D structure" />

                </div>
            </div>

            {/* Report Download Section */}
            <div className="pdf-report">
                <div className="pdf-report-header">
                    <span>{getReportName(report)}</span>
                    <div className="pdf-report-buttons">
                    {/* Button to download the PDF */}
                        <a href={report} download title="Download Report">
                            <span style={{ cursor: 'pointer', marginRight: '10px' }}>⤓</span>
                        </a>
                        {/* Button to open the PDF in a new tab */}
                        <a href={report} target="_blank" rel="noopener noreferrer" title="Open Report">
                            <span style={{ cursor: 'pointer' }}>⤢</span>
                        </a>
                    </div>
                </div>
                <iframe
                    src={report}
                    title="Report Preview"
                />
            </div>
        </div>

        {/* Right Panel: chat */}
        <div className="right-panel">
            <Chat />
        </div>

        </div>
    );
}

export default MainContent;

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './styles/MainContent.css';


// Custom Hook for Managing Local Storage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            // If item is null or not valid JSON, return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error parsing localStorage item:", error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error("Error setting localStorage item:", error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

function Chat() {
    const { seriesId, modelID } = useParams();  // Access URL params
    
    const [messages, setMessages] = useLocalStorage(`messages-${modelID}`, []);
    const [input, setInput] = useLocalStorage(`input-${modelID}`, "");
    
    const messagesEndRef = useRef(null); // Create a ref for the messages container

    useEffect(() => {
        const introMessage = [
            "Welcome! How can I assist you today?",
            `You can ask me any question regarding the quality control and cleaning process of ${modelID}.`
        ];
        setMessages([{ type: "bot", text: introMessage }]);
    }, [setMessages, seriesId, modelID]);

    useEffect(() => {
        // Save the messages and input in localStorage whenever they change
        // localStorage.setItem(`messages-${modelID}`, JSON.stringify(messages));
        // localStorage.setItem(`input-${modelID}`, input);

        // Scroll to the bottom of the chat messages
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() !== "") {
            // User question
            setMessages([...messages, { type: "user", text: input }]);
            setInput(""); // Clear the input field
            
            // Send the message to the backend API
            try {
                const apiURL = process.env.REACT_APP_API_CHAT_URL

                const response = await fetch(`${apiURL}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ message: input })
                });

                if (!response.ok) {
                    throw new Error(`Failed to get response from the server. Status ${response.status}`);
                }

                const data = await response.json();
                const botResponse = data.response;

                // Add the bot's response to the chat
                setMessages(prevMessages => [...prevMessages, { type: "bot", text: botResponse }]);
            } catch (error) {
                setMessages(prevMessages => [...prevMessages, { type: "bot", text: "An error occurred. Please try again." }]);
                console.error("Error:", error);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { type: "bot", text: "Error: Unable to fetch response from server." },
                ]);
            } 
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
                        
                        {msg.type === "bot" ? (
                            <img className="chat-icon" src='/logo_SoT_background.png' alt='llm-icon'/> // Bot Icon
                        ) : (
                            <div className="user-icon">👤</div> // User Icon
                        )}
                        {Array.isArray(msg.text)
                            ? msg.text.map((line, idx) => (
                                <div key={idx}>{line}<br /></div>
                              ))
                            : msg.text
                        }
                    </div>
                ))}
                {/* Acts as the scroll target */}
                <div ref={messagesEndRef} /> 
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
    const { seriesId, modelID } = useParams();
    const [ymodel, setYmodel] = useState(null);
    
    useEffect(() => {
        // Fetch yacht data when the component mounts or parameters change
        async function fetchYmodelData() {
            try {
                const response = await fetch(`/yachts/${seriesId}/${modelID}/general-info.json`);
                if (!response.ok) {
                    throw new Error("Failed to fetch yacht data");
                }
                const data = await response.json();
                setYmodel(data);
            } catch (error) {
                console.error("Error fetching yacht data:", error);
            }
        };

        fetchYmodelData();
    }, [seriesId, modelID]);  // Rerun when seriesId or modelID changes
    
    
    // Function to extract the report name from the URL
    const getReportName = (url) => {
        const lastSlashIndex = url.lastIndexOf('/');
        return url.substring(lastSlashIndex + 1);
    };


    useEffect(() => {
        if (ymodel && ymodel.report) {
            // Function to upload PDF
            async function uploadPDF(reportPath) {
                try {
                    const apipdfURL = process.env.REACT_APP_API_PDF_URL; 
                    const response = await fetch(reportPath);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch PDF from ${reportPath}. ${response.statusText}`);
                    }

                    try{
                        const uploadResponse = await fetch(apipdfURL, {
                            method: "POST",
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ path: reportPath })
                        });
                        console.log("Upload Response:", uploadResponse);
                        if (!uploadResponse.ok) {
                            throw new Error(`Failed to upload PDF: ${uploadResponse.statusText}`);
                        }
                        const data = await uploadResponse.json();
                        console.log(data.message); 
                    } catch (error) {
                        console.error("Error sending PDF:", error);
                    }
                
                } catch (error) {
                    console.error("Error full PDF process:", error);
                }
            }
            uploadPDF(`/yachts/${seriesId}/${modelID}${ymodel.report}`);
        }
    }, [seriesId, modelID, ymodel]);

    return (
        <div className="main-content">
        
            {/* Left Panel */}
            <div className="left-panel">
                
                {/* Info + 3D Section */}
                <div className="info-3d-container">
                    {/* Boat Information (Upper Side) */}
                    <div className="boat-info">
                
                        {/* Boat Characteristics */}
                        <div className="boat-characteristics">
                            {ymodel ? (
                                <>
                                    <h1 style={{ fontFamily: "Segoe UI" }}>{ymodel.name}</h1>
                                    <p>{ymodel.dimensions}</p>
                                    <p>{ymodel.beds}</p>
                                    <p>{ymodel.releaseDate}</p>
                                </>
                            ) : (
                                <p>Loading yacht data...</p>
                            )}
                        </div>
                        <div className="boat-image">
                            {ymodel && ymodel.image ? (
                                <img src={`/yachts/${seriesId}/${modelID}/${ymodel.image}`} alt={`${seriesId}/${modelID}`} />
                            ) : (
                                <p>Loading image...</p>
                            )}
                        </div>
                    </div>


                    {/* 3D Viewer Section (Below Info and Image) */}
                    <div className="three-d-visualization">
                        <img src='/3Dexample.jpg' alt="3D structure" />
                    </div>
                </div>

                {/* Report Download Section */}
                {ymodel && ymodel.report ? (
                    <div className="pdf-report">
                        <div className="pdf-report-header">
                            <span>{getReportName(ymodel.report)}</span>

                            <div className="pdf-report-buttons">
                                {/* Button to download the PDF */}
                                <a href={`/yachts/${seriesId}/${modelID}/${ymodel.report}`} download title="Download Report">
                                    <span style={{ cursor: 'pointer', marginRight: '10px' }}>⤓</span>
                                </a>
                                {/* Button to open the PDF in a new tab */}
                                <a href={`/yachts/${seriesId}/${modelID}/${ymodel.report}`} target="_blank" rel="noopener noreferrer" title="Open Report">
                                    <span style={{ cursor: 'pointer' }}>⤢</span>
                                </a>
                            </div>
                        </div>
                        <iframe src={`/yachts/${seriesId}/${modelID}/${ymodel.report}`} title="Report Preview" />
                    </div>
                ) : (
                    <p>Loading report...</p>
                )}
            </div>

            {/* Right Panel: chat */}
            <div className="right-panel">
                <div className="background_img">
                    <img src="/logo_SoT_background.png" alt="Background" />
                </div>
                <Chat />
            </div>

        </div>
    );
}

export default MainContent;

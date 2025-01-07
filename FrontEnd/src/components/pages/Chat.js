import React, { useState, useEffect, useRef } from 'react';
import '../styles/MainContent.css';


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

function Chat({ seriesId, modelID }) {
    
    const [messages, setMessages] = useLocalStorage(`messages-${modelID}`, []);
    const [input, setInput] = useLocalStorage(`input-${modelID}`, "");
    const [contextReady, setContextReady] = useState(false);
    const [loading, setLoading] = useState(true); // For showing a loading spinner or message
    
    const messagesEndRef = useRef(null); // Create a ref for the messages container

    useEffect(() => {
        const introMessage = [
            "Welcome! How can I assist you today?",
            `You can ask me any question regarding the quality control and cleaning process of ${modelID}.`
        ];
        setMessages([{ type: "bot", text: introMessage }]);
    }, [setMessages, seriesId, modelID]);

    useEffect(() => {
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
                            // <div className="user-icon">👤</div>
                            <img className="chat-icon" src='/img/logo_SoT_background.png' alt='llm-icon'/> // Bot Icon
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
};


export default Chat;
import React, { useState, useEffect, useRef } from 'react';
import '../styles/MainContent.css';


// Custom Hook for Managing Local Storage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            // If item is found in localStorage, parse it; otherwise, return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error parsing localStorage item:", error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            // Store the value in localStorage whenever it changes
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error("Error setting localStorage item:", error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}


// Chat Component
function Chat({ seriesId, modelID }) {
    // State to store messages and user input using localStorage
    const [messages, setMessages] = useLocalStorage(`messages-${modelID}`, []);
    const [input, setInput] = useLocalStorage(`input-${modelID}`, "");
    
    const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

    // Initialize chat with an introduction message when component mounts
    useEffect(() => {
        const introMessage = [
            "Welcome! How can I assist you today?",
            `You can ask me any question regarding the quality control and cleaning process of ${modelID}.`
        ];
        setMessages([{ type: "bot", text: introMessage }]);
    }, [setMessages, seriesId, modelID]);

    // Auto-scroll to the latest message whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle message send action
    const handleSend = async () => {
        if (input.trim() !== "") {
            // Add user question to chat
            setMessages([...messages, { type: "user", text: input }]);
            setInput(""); // Clear the input field
            
            // Fetch response from the backend API
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

                // Add bot response to chat
                setMessages(prevMessages => [...prevMessages, { type: "bot", text: botResponse }]);
            
            } catch (error) {
                // Display error message in chat if API call fails
                setMessages(prevMessages => [...prevMessages, { type: "bot", text: "An error occurred. Please try again." }]);
                console.error("Error:", error);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { type: "bot", text: "Error: Unable to fetch response from server." },
                ]);
            } 
        }
    };

    // Handle Enter key press to send message
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
                            <img className="chat-icon" src='/img/logo_SoT_background.png' alt='llm-icon'/> // Bot Icon
                        ) : (
                            <div className="user-icon">👤</div> // User Icon
                        )}
                        {/* Handle multi-line messages */}
                        {Array.isArray(msg.text)
                            ? msg.text.map((line, idx) => (
                                <div key={idx}>{line}<br /></div>
                              ))
                            : msg.text
                        }
                    </div>
                ))}
                {/* Scroll anchor for auto-scrolling */}
                <div ref={messagesEndRef} /> 
            </div>

            {/* Chat Input Field */}
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={handleKeyDown} // Send message on Enter key press
                    placeholder="Type your question here..." 
                />
                <button onClick={handleSend}>➤</button>
            </div>
        </div>
    );
};

export default Chat;
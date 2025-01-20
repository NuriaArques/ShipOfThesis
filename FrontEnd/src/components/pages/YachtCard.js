import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/YachtCard.css';

function YachtCard({ yacht, basePath }) {
    // State to control whether main content is shown
    const [showMainContent, setShowMainContent] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    // Determine header tag and text alignment based on basePath
    const HeaderTag = basePath !== "/yachts" ? 'h2' : 'h1';
    const textAlignClass = basePath !== "/yachts" ? 'left-align' : '';

    // Function to handle review button click
    const handleReviewClick = () => {
        setShowMainContent(true); 
        // Navigate to yacht details page with yacht data as state
        navigate(`${basePath}/${yacht.id}`, { state: { yacht } });
    };
    
    return (
        <div className="yacht-card">
            <img src={yacht.image} alt={yacht.name} className="yacht-image" />
            {/* Yacht information section */}
            <div className='yacht-info'>
                {/* Container for yacht details */}
                <div className="yacht-characteristics">
                    {/* Render yacht name dynamically using the determined header tag */}
                    <HeaderTag style={{fontFamily: "Segoe UI"}} dangerouslySetInnerHTML={{ __html: yacht.name }} />
                    <div className={textAlignClass}>
                        <p>{basePath !== "/yachts" ? "Dimensions: " : ""}{yacht.dimensions}</p>
                        {yacht.beds && <p>Beds: {yacht.beds} </p>}
                        {yacht.releaseDate && <p>Release date: {yacht.releaseDate} </p>}
                    </div>
                    {/* Button to navigate to yacht review page */}
                    <button className="review-button" onClick={handleReviewClick}>REVIEW</button>
                </div>

            </div>
        </div>
    );
}

export default YachtCard;

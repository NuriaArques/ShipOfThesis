import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/YachtCard.css';

function YachtCard({ yacht, basePath }) {

    const [showMainContent, setShowMainContent] = useState(false); // State to show MainContent
    const navigate = useNavigate();
    const HeaderTag = basePath !== "/yachts" ? 'h2' : 'h1';
    const textAlignClass = basePath !== "/yachts" ? 'left-align' : '';

    const handleReviewClick = () => {
        setShowMainContent(true); 
        navigate(`${basePath}/${yacht.id}`, { state: { yacht } });
    };
    
    return (
        <div className="yacht-card">
            <img src={yacht.image} alt={yacht.name} className="yacht-image" />
            <div className='yacht-info'>
                <div className="yacht-characteristics">
                    <HeaderTag style={{fontFamily: "Segoe UI"}} dangerouslySetInnerHTML={{ __html: yacht.name }} />
                    <div className={textAlignClass}>
                        <p>{basePath !== "/yachts" ? "Dimensions: " : ""}{yacht.dimensions}</p>
                        {yacht.beds && <p>Beds: {yacht.beds} </p>}
                        {yacht.releaseDate && <p>Release date: {yacht.releaseDate} </p>}
                    </div>
                </div>
                
                {basePath === "/yachts" ? (
                    <Link to={`${basePath}/${yacht.id}`} className="review-button">REVIEW</Link>
                ) : (
                    <button className="review-button" onClick={handleReviewClick}>REVIEW</button>
                )}
            </div>
        </div>
    );
}

export default YachtCard;

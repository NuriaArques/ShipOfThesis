import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/YachtCard.css';

function YachtCard({ yacht }) {
    const navigate = useNavigate();

    const handleReviewClick = () => {
        navigate(yacht.path);
    };

    return (
        <div className="yacht-card">
            <img src={yacht.image} alt={yacht.name} className="yacht-image" />
            <div className='yacht-info'>
                <div className='yacht-characteristics'>
                    <h2>{yacht.name}</h2>
                    <p>{yacht.dimensions}</p>
                </div>
                <button onClick={handleReviewClick} className="review-button">
                    REVIEW
                </button>
            </div>
        </div>
    );
}

export default YachtCard;

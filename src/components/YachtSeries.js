import React, { useEffect, useState } from 'react';
import YachtCard from './YachtCard';
import './styles/YachtCard.css';

function YachtSeries() {
    const [yachts, setYachts] = useState([]);
    useEffect(() => {
        fetch('/yachts.json')
            .then(response => response.json())
            .then(data => setYachts(data))
            .catch(error => console.error("Error loading yacht data:", error));
    }, []);

    return (
        <div className="yacht-series">
            <h1 style={{ fontSize: 'xx-large', fontStyle: 'bold', marginRight: '10px' }}>Lassering Yachts</h1>
            <h3 style={{ fontSize: 'x-large', fontStyle: 'normal', marginRight: '10px' }}>4 yacht series</h3>
            <div className="yacht-cards-container">
                {yachts.map((yacht) => (
                    <YachtCard key={yacht.id} yacht={yacht} basePath="/yachts" />
                ))}
            </div>
        </div>
    );
}

export default YachtSeries;

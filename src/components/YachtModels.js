import React, { useEffect, useState } from 'react';
import YachtCard from './YachtCard';
import { useParams } from 'react-router-dom';
import './styles/YachtCard.css';

function YachtReviewPage() {
    const { seriesId } = useParams(); // Get yacht series ID from the URL
    const [series, setSeries] = useState(null);

    useEffect(() => {
        fetch('/yachts.json')
            .then(response => response.json())
            .then(data => {
                const selectedSeries = data.find(series => series.id === seriesId);
                setSeries(selectedSeries);
            })
            .catch(error => console.error("Error loading yacht series data:", error));
    }, [seriesId]);

    if (!series) {
        return <div>Loading...</div>;
    }

    const cleanedName = series.name.replace(/<br\s*\/?>/gi, '');

    return (
        <div className="yacht-series">
            <div className='yacht-serie-name'>
                <div className='yacht-series-info'>
                    <h1>{cleanedName}</h1>
                    <p>{series.dimensions}</p>
                </div>
                <div className='right-image-container'>
                    <img src={series.image} alt={series.name} className="yacht-image" />
                </div>
            </div>
            <div className="yacht-cards-models-container">
                {series.models.map((model) => (
                    <YachtCard key={model.id} yacht={model} basePath={`/yachts/${series.id}`} />
                ))}
            </div>
        </div>
    );
}

export default YachtReviewPage;

import React, { useEffect, useState } from 'react';
import YachtCard from './YachtCard';
import './styles/YachtCard.css';

function YachtSeries() {

    const [seriesList, setSeriesList] = useState([]);

    useEffect(() => {
        async function fetchSeries() {
            try {
                // Fetch the list of series directories
                const seriesFolders = ['grand-sturdy', 'sl', 'variodeck', 'variotop']; // Replace fetch('/yachts') if needed
            
                const seriesData = await Promise.all(
                    seriesFolders.map(async (folder) => {
                        const path = `/yachts/${folder}`;
;                       const infoResponse = await fetch(`${path}/general-info.json`);
                        const seriesInfo = await infoResponse.json();

                        return {
                            ...seriesInfo,
                            image: `${path}/linssen-${folder}.webp`,
                            id: folder, // Use the folder name as the ID
                        };
                    })
                );

                setSeriesList(seriesData);
            } catch (error) {
                console.error("Error loading yacht series:", error);
            }
        }

        fetchSeries();
    }, []);

    return (
        <div className="yacht-series">
            <h1 style={{ fontSize: 'xx-large', fontStyle: 'bold', marginRight: '10px' }}>Lassering Yachts</h1>
            <h3 style={{ fontSize: 'x-large', fontStyle: 'normal', marginRight: '10px' }}>4 yacht series</h3>
            <div className="yacht-cards-container">
                {seriesList.map((YachtSerie) => (
                    <YachtCard key={YachtSerie.id} yacht={YachtSerie} basePath={`/yachts`} />
                ))}
            </div>
        </div>
    );
}

export default YachtSeries;

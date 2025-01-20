import React, { useEffect, useState } from 'react';
import YachtCard from './YachtCard';
import '../styles/YachtCard.css';

function YachtSeries() {
    const [seriesList, setSeriesList] = useState([]); // State to store the list of yacht series

    useEffect(() => {
        async function fetchSeries() {
            try {
                // List of yacht series folders
                const seriesFolders = ['grand-sturdy', 'sl', 'variodeck', 'variotop'];
            
                // Fetch general information for each yacht series
                const seriesData = await Promise.all(
                    seriesFolders.map(async (folder) => {
                        const path = `/yachts/${folder}`;
;                       const infoResponse = await fetch(`${path}/general-info.json`);
                        const seriesInfo = await infoResponse.json();

                        return {
                            ...seriesInfo,
                            image: `${path}/linssen-${folder}.webp`, // Full image path
                            id: folder, // Folder name as series ID
                        };
                    })
                );

                setSeriesList(seriesData); // Update state with the fetched series data
            } catch (error) {
                console.error("Error loading yacht series:", error);
            }
        }

        fetchSeries();
    }, []); // Empty dependency array ensures useEffect runs only once on mount

    return (
        <div className="yacht-series">
            <h1 style={{ fontSize: 'xx-large', fontStyle: 'bold', marginLeft: '3vw' }}>Lassering Yachts</h1>
            <h3 style={{ fontSize: 'x-large', fontStyle: 'normal', marginLeft: '3vw' }}>4 yacht series</h3>
            <div className="yacht-cards-container" style={{ margin: '2vh'}}>
                {seriesList.map((YachtSerie) => (
                    // Render YachtCard component for each yacht series
                    <YachtCard key={YachtSerie.id} yacht={YachtSerie} basePath={`/yachts`} />
                ))}
            </div>
        </div>
    );
}

export default YachtSeries;

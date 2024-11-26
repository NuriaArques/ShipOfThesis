import React, { useEffect, useState } from 'react';
import YachtCard from './YachtCard';
import '../styles/YachtCard.css';

function YachtSeries() {

    const [seriesList, setSeriesList] = useState([]);

    useEffect(() => {
        async function fetchSeries() {
            try {
                // Fetch the list of series directories
                const seriesFolders = ['grand-sturdy', 'sl', 'variodeck', 'variotop'];
            
                const seriesData = await Promise.all(
                    seriesFolders.map(async (folder) => {
                        const path = `/yachts/${folder}`;
;                       const infoResponse = await fetch(`${path}/general-info.json`);
                        const seriesInfo = await infoResponse.json();

                        return {
                            ...seriesInfo,
                            image: `${path}/linssen-${folder}.webp`,
                            id: folder, // Folder name as the ID
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
            <h1 style={{ fontSize: 'xx-large', fontStyle: 'bold', marginLeft: '3vw' }}>Lassering Yachts</h1>
            <h3 style={{ fontSize: 'x-large', fontStyle: 'normal', marginLeft: '3vw' }}>4 yacht series</h3>
            <div className="yacht-cards-container" style={{ margin: '2vh'}}>
                {seriesList.map((YachtSerie) => (
                    <YachtCard key={YachtSerie.id} yacht={YachtSerie} basePath={`/yachts`} />
                ))}
            </div>
        </div>
    );
}

export default YachtSeries;

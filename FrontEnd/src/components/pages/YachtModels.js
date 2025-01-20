import React, { useEffect, useState } from 'react';
import YachtCard from './YachtCard';
import { useParams } from 'react-router-dom';
import '../styles/YachtCard.css';

function YachtReviewPage() {
    const { seriesId } = useParams(); // Get yacht series ID from the URL parameters
    const [series, setSeries] = useState(null); // State to store series data

    useEffect(() => {
        async function fetchSeriesWithModels() {
            try {
                const seriesPath = `/yachts/${seriesId}`; // Path to series data

                // Fetch general series information
                const seriesInfoResponse = await fetch(`${seriesPath}/general-info.json`);
                const seriesInfo = await seriesInfoResponse.json();

                // Get model folders from the series directory
                const modelFolders = seriesInfo.models || [];

                // Fetch details for each model in the series
                const models = await Promise.all(
                    modelFolders.map(async (folder) => {
                        const modelPath = `${seriesPath}/${folder}`;
                        const modelInfoResponse = await fetch(`${modelPath}/general-info.json`);
                        const modelInfo = await modelInfoResponse.json();

                        return {
                            ...modelInfo,
                            image: `${modelPath}${modelInfo.image}`, // Full image path
                            report: `${modelPath}${modelInfo.report}`, // Full report path
                            id: folder, // Folder name as model ID
                        };
                    })
                );

                // Update state with series and models data
                setSeries({
                    ...seriesInfo,
                    image: `${seriesPath}/linssen-${seriesId}.webp`, // Series image path
                    models,
                });
            } catch (error) {
                console.error("Error loading yacht series with models:", error);
            }
        }

        fetchSeriesWithModels();
    }, [seriesId]); // Re-run effect when seriesId changes

    // Show loading message while data is being fetched
    if (!series) {
        return <div>Loading...</div>;
    }

    // Remove any HTML line breaks from the series name
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
            {/* Render a YachtCard for each model in the series */}
                {series.models.map((model) => (
                    <YachtCard key={model.id} yacht={model} basePath={`/yachts/${series.id}`} />
                ))}
            </div>
        </div>
    );
}

export default YachtReviewPage;

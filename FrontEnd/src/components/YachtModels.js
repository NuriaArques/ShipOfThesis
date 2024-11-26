import React, { useEffect, useState } from 'react';
import YachtCard from './YachtCard';
import { useParams } from 'react-router-dom';
import '../styles/YachtCard.css';

function YachtReviewPage() {
    const { seriesId } = useParams(); // Get yacht series ID from the URL
    const [series, setSeries] = useState(null);

    useEffect(() => {
        async function fetchSeriesWithModels() {
            try {
                const seriesPath = `/yachts/${seriesId}`;

                // Fetch the series info
                const seriesInfoResponse = await fetch(`${seriesPath}/general-info.json`);
                const seriesInfo = await seriesInfoResponse.json();

                // Fetch model folders inside the series directory
                const modelFolders = seriesInfo.models || [];

                const models = await Promise.all(
                    modelFolders.map(async (folder) => {
                        const modelPath = `${seriesPath}/${folder}`;
                        const modelInfoResponse = await fetch(`${modelPath}/general-info.json`);
                        const modelInfo = await modelInfoResponse.json();

                        return {
                            ...modelInfo,
                            image: `${modelPath}${modelInfo.image}`,
                            report: `${modelPath}${modelInfo.report}`,
                            id: folder, // Folder name as ID
                        };
                    })
                );

                setSeries({
                    ...seriesInfo,
                    image: `${seriesPath}/linssen-${seriesId}.webp`,
                    models,
                });
            } catch (error) {
                console.error("Error loading yacht series with models:", error);
            }
        }

        fetchSeriesWithModels();
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

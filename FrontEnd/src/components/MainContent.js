import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/MainContent.css';
import Chat from './pages/Chat';
import Boat from './pages/boat';

function MainContent() {
    const { seriesId, modelID } = useParams();
    const [ymodel, setYmodel] = useState(null);
    
    useEffect(() => {
        // Fetch yacht data when the component mounts or parameters change
        async function fetchYmodelData() {
            try {
                const response = await fetch(`/yachts/${seriesId}/${modelID}/general-info.json`);
                if (!response.ok) {
                    throw new Error("Failed to fetch yacht data");
                }
                const data = await response.json();
                setYmodel(data);
            } catch (error) {
                console.error("Error fetching yacht data:", error);
            }
        };

        fetchYmodelData();
    }, [seriesId, modelID]);  // Rerun when seriesId or modelID changes
    
    
    // Function to extract the report name from the URL
    const getReportName = (url) => {
        const lastSlashIndex = url.lastIndexOf('/');
        return url.substring(lastSlashIndex + 1);
    };


    useEffect(() => {
        if (ymodel && ymodel.report) {
            // Function to upload PDF
            async function uploadPDF(reportPath) {
                try {
                    const apipdfURL = process.env.REACT_APP_API_PDF_URL; 
                    const response = await fetch(reportPath);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch PDF from ${reportPath}. ${response.statusText}`);
                    }

                    try{
                        const uploadResponse = await fetch(apipdfURL, {
                            method: "POST",
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ path: reportPath })
                        });
                        
                        if (!uploadResponse.ok) {
                            throw new Error(`Failed to upload PDF: ${uploadResponse.statusText}`);
                        }
                        const data = await uploadResponse.json();
                         
                    } catch (error) {
                        console.error("Error sending PDF:", error);
                    }
                
                } catch (error) {
                    console.error("Error full PDF process:", error);
                }
            }
            uploadPDF(`/yachts/${seriesId}/${modelID}${ymodel.report}`);
        }
    }, [seriesId, modelID, ymodel]);


    return (
        <div className="main-content">
        
            {/* Left Panel */}
            <div className="left-panel">
                
                {/* Info + 3D Section */}
                <div className="info-3d-container">

                    {/* Boat Information (Upper Side) */}
                    <div className="boat-info">
                        <div className="boat-characteristics">
                            {ymodel ? (
                                <>
                                    <h1 style={{ fontFamily: "Segoe UI" }}>{ymodel.name}</h1>
                                    <p>{ymodel.dimensions}</p>
                                    <p>{ymodel.beds}</p>
                                    <p>{ymodel.releaseDate}</p>
                                </>
                            ) : (
                                <p>Loading yacht data...</p>
                            )}
                        </div>
                        <div className="boat-image">
                            {ymodel && ymodel.image ? (
                                <img src={`/yachts/${seriesId}/${modelID}/${ymodel.image}`} alt={`${seriesId}/${modelID}`} />
                            ) : (
                                <p>Loading image...</p>
                            )}
                        </div>
                    </div>


                    {/* 3D Viewer Section (Below Info and Image) */}
                    <div className="three-d-visualization">
                        <Boat />
                    </div>
                </div>

                {/* Report Download Section */}
                {ymodel && ymodel.report ? (
                    <div className="pdf-report">
                        <div className="pdf-report-header">
                            <span>{getReportName(ymodel.report)}</span>

                            <div className="pdf-report-buttons">
                                {/* Button to download the PDF */}
                                <a href={`/yachts/${seriesId}/${modelID}/${ymodel.report}`} download title="Download Report">
                                    <span style={{ cursor: 'pointer', marginRight: '10px' }}>⤓</span>
                                </a>
                                {/* Button to open the PDF in a new tab */}
                                <a href={`/yachts/${seriesId}/${modelID}/${ymodel.report}`} target="_blank" rel="noopener noreferrer" title="Open Report">
                                    <span style={{ cursor: 'pointer' }}>⤢</span>
                                </a>
                            </div>
                        </div>
                        <iframe src={`/yachts/${seriesId}/${modelID}/${ymodel.report}`} title="Report Preview" />
                    </div>
                ) : (
                    <p>Loading report...</p>
                )}
            </div>

            {/* Right Panel: chat */}
            <div className="right-panel">
                <div className="background_img">
                    <img src="/img/logo_SoT_background.png" alt="Background" />
                </div>
                {ymodel ? (
                    <>
                    <Chat key={ymodel.id} seriesId = {seriesId} modelID = {modelID}/>
                    </>
                ) : (
                    <p>Loading chat...</p>
                )}
            </div>

        </div>
    );
}

export default MainContent;

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './styles/MainContent.css';
import Chat from './pages/Chat';
import Boat from './pages/boat';

function MainContent() {
    const { seriesId, modelID } = useParams(); // Extract parameters from the URL

    // State variables to store fetched yacht data
    const [ymodel, setYmodel] = useState(null);
    const [ymodelResults, setYmodelResults] = useState(null);
    const [ymodelReport, setYmodelReport] = useState(null);

    const visualizerRef = useRef(null); // Reference for the 3D visualizer container
    
    useEffect(() => {
        // Fetch general yacht data when the component mounts or parameters change
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
        // Fetch additional yacht data related to launch (lasering) information
        async function fetchYmodelDataResults() {
            try {
                const response = await fetch(`/yachts/${seriesId}/${modelID}/lasering-info.json`);
                if (!response.ok) {
                    throw new Error("Failed to fetch yacht lasering data");
                }
                const data = await response.json();
                setYmodelResults(data);
            } catch (error) {
                console.error("Error fetching yacht lasering data:", error);
            }
        };

        fetchYmodelDataResults();
    }, [seriesId, modelID]);  // Rerun when seriesId or modelID changes

    // Function to toggle fullscreen mode for the 3D visualizer
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            visualizerRef.current.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        if (ymodel && ymodel.report) {
            // Function to upload the PDF report
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
                        setYmodelReport(data);
                         
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
            {/* Left Panel: Yacht information + 3D visualizer + report */}
            <div className="left-panel">
                <div className="info-3d-container">
                    {/* Yacht Information Section */}
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

                    {/* 3D Visualizer Section */}
                    <div className="three-d-visualization" ref={visualizerRef}>
                        <button 
                            className="fullscreen-button"
                            onClick={toggleFullscreen}
                            title="Toggle Fullscreen">
                            <span>⤢</span>
                        </button>
                        {/* Boat Component for 3D visualization */}
                        <Boat />
                    </div>
                </div>

                {/* Report Section */}
                {ymodel && ymodel.report ? (
                    <div className="pdf-report">
                        <div className="pdf-report-header">
                            <span>{getReportName(ymodel.report)}</span>

                            {/* Download and Open PDF buttons */}
                            <div className="pdf-report-buttons">
                                <a href={`/yachts/${seriesId}/${modelID}/${ymodel.report}`} download title="Download Report">
                                    <span style={{ cursor: 'pointer', marginRight: '10px' }}>⤓</span>
                                </a>
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

            {/* Middle Panel: Yachts quality standard evaluation results */}
            <div className="middle-panel">
                <h2>STANDARD ACHIEVED</h2>
                {ymodelResults ? (
                    <>
                    {/* Display the evaluation result */}
                    <div className='color-panel' style={{ backgroundColor: ymodelResults.color }}> 
                        <h1> {ymodelResults.readyToPaint} </h1>
                    </div>
                    <p> {ymodelResults.text} </p> 

                    {/* Display required corrections if applicable */}
                    {ymodelResults.corrections && Array.isArray(ymodelResults.corrections) ? (
                        <>
                            <p style={{textAlign: "left"}}> The yacht requires improvement in: </p>
                            <ul>
                                {ymodelResults.corrections.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </>
                    ) : null}  
                    </>
                ) : (
                    <p>Loading results...</p>
                )}
            </div>

            {/* Right Panel: Chat functionality */}
            <div className="right-panel">
                <div className="background_img">
                    <img src="/img/logo_SoT_background.png" alt="Background" />
                </div>
                {ymodel && ymodelReport ? (
                    <>
                    {/* Chat Component: Loads chat when yacht model and report are available */}
                    <Chat key={ymodel.id} seriesId={seriesId} modelID={modelID}/>
                    </>
                ) : (
                    <p>Loading chat...</p>
                )}
            </div>
        </div>
    );
}

export default MainContent;
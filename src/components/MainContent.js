import React from 'react';
import './styles/MainContent.css';

function MainContent() {

    const report = "/reports/Report_GS30AC_12-2024.pdf"
    // Function to extract the report name from the URL
    const getReportName = (url) => {
        const lastSlashIndex = url.lastIndexOf('/');
        return url.substring(lastSlashIndex + 1); // Extract the name between last "/" and ".pdf"
    };
    
    return (
        <div className="main-content">
        
        {/* Left Panel */}
        <div className="left-panel">
            
            {/* Info + 3D Section */}
            <div className="info-3d-container">
                {/* Boat Information (Upper Side) */}
                <div className="boat-info">
            
                    {/* Boat Characteristics (Right Side) */}
                    <div className="boat-characteristics">
                        <h1>Grand Sturdy 30.0 AC</h1>
                        <p>
                            9.70 x 3.35 x 1.00 m<br /> 
                            4 (+2) beds<br /> 
                            December 2024
                        </p>
                    </div>
                
                    {/* Boat Image (Left Side) */}
                    <div className="boat-image">
                        <img src='/img/GrandSturdy.png' alt="Grand Sturdy Boat" />
                    </div>

                </div>


                {/* 3D Viewer Section (Below Info and Image) */}
                <div className="three-d-visualization">
                    {/* Placeholder for 3D viewer component */}
                    {/* Uncomment the line below to include actual 3D viewer component */}
                    {/* <BoatModelViewer /> */}
                    
                    <img src='/img/3Dexample.jpg' alt="3D structure" />

                </div>
            </div>

            {/* Report Download Section */}
            <div className="pdf-report">
            <div className="pdf-report-header">
                <span>{getReportName(report)}</span>
                <div className="pdf-report-buttons">
                {/* Button to download the PDF */}
                    <a href={report} download title="Download Report">
                        <span style={{ cursor: 'pointer', marginRight: '10px' }}>⤓</span> {/* Download symbol */}
                    </a>
                    {/* Button to open the PDF in a new tab */}
                    <a href={report} target="_blank" rel="noopener noreferrer" title="Open Report">
                        <span style={{ cursor: 'pointer' }}>⤢</span> {/* Open symbol */}
                    </a>
                </div>
            </div>
            <iframe
                src={report}
                title="Report Preview"
            />
            </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
            {/* Grey Rectangle Placeholder */}
            <div className="right-panel-placeholder">
            {/* Placeholder content for right panel */}
            <p>Chat</p>
            </div>
        </div>

        </div>
    );
}

export default MainContent;

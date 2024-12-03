import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ShipOfThesis.css'

function ShipOfThesis() {
    return (
        <div className="container">
            
            {/* Linssen Yachts */}
            <div className="left-side">
                <img src="/img/LY_wallpaper.jpeg" alt="Linssen Yachts Logo" className='left-side-background'/>
                <div className="left-side-info">
                    <img src="/img/logo_LY.svg" alt="Linssen Yachts Logo" className="logo" />
                    <div className='text' style={{fontWeight: 'bold'}}> 
                        Linssen Yachts builds luxury steel motor yachts in the 9-16 metre segment and has grown into a market leader in steel yacht building.
                    </div>
                    <div className='text'>
                        Linssen Yachts stands for steel motor yachts - cabin cruisers displacement yachts - with superior quality and for continuous innovative product and process development. 
                        Since the company was founded in 1949, Linssen Yachts has been the driving force behind innovative improvements in yacht building.
                    </div>
                    <a href="https://www.linssenyachts.com" className="button" target="_blank" rel="noopener noreferrer">Visit Linssen Yachts</a>
                </div>
            </div>
            
            {/* Ship of Thesis */}
            <div className="right-side">
                <div className="upper-right">
                    <div className='upper-right-info'>
                        <img src="/img/logo_SoT.png" alt="Ship of Thesis Logo" className="logo" />
                        <div className='text' style={{fontWeight: 'bold', marginTop: '3vh'}}> 
                            At Ship Of Thesis, we specialize in the visualization of scan data and the use of advanced Large Language Models (LLMs) to provide clear, accessible explanations for both technical and non-technical users. 
                        </div>
                        <div className='text'>
                            Our goal is to create intuitive, user-friendly interfaces that allow operators to easily interact with 3D models, access detailed technical reports, and receive natural-language insights into scanned data and quality control metrics. 
                            By combining cutting-edge visualization and AI technologies, we streamline operations, enhance worker training, and support informed decision-making, even for those without technical expertise.
                        </div>
                    </div>
                </div>
                <div className="lower-right">
                    <img src="/img/ocean.jpg" alt="Ship of Thesis Logo" />
                    <Link to="/yachts" className="button">View Yacht Catalog</Link>
                </div>
            </div>
        </div>
    );
}

export default ShipOfThesis;
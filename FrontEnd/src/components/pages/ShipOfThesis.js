import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ShipOfThesis.css'

function ShipOfThesis() {
    return (
        <div className="container">
            <div className="left-side">
                <img src="/img/LY_wallpaper.jpeg" alt="Linssen Yachts Logo" className='left-side-background'/>
                <div className="left-side-info">
                    <img src="/img/logo_LY.svg" alt="Linssen Yachts Logo" className="logo" />
                    <h1>Linssen Yachts</h1>
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
            <div className="right-side">
                <div className="upper-right">
                    <div className='upper-right-info'>
                        <img src="/img/logo_SoT.png" alt="Ship of Thesis Logo" className="logo" />
                        <h1>Ship of Thesis</h1>
                        <p>We specialize in ....</p>
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
import React from 'react';
import '../styles/ShipOfThesis.css'

function ShipOfThesis() {
    return (
        <div className="container">
            <div className="left-side">
                <img src="logo_LY.svg" alt="Linssen Yachts Logo" className="logo" />
                <h1>Linssen Yachts</h1>
                <p>Linssen Yachts is a renowned manufacturer of luxury motor yachts.</p>
                <a href="https://www.linssenyachts.com" className="button" target="_blank" rel="noopener noreferrer">Visit Linssen Yachts</a>
            </div>
            <div className="right-side">
                <div className="upper-right">
                    <img src="/logo_SoT.png" alt="Ship of Thesis Logo" className="logo" />
                    <h1>Ship of Thesis</h1>
                    <p>We specialize in ....</p>
                </div>
                <div className="lower-right">
                    <img src="/logo_SoT.png" alt="Ship of Thesis Logo" className="background_img" />
                    <a href="/catalog" className="button">View Yacht Catalog</a>
                </div>
            </div>
        </div>
        // <div className="page">
        //     <h1>Ship of Thesis</h1>
        //     <p>This is the Ship of Thesis page.</p>
        //     <img className='backgroung_img' src="/logo_SoT.png" alt="SOF_logo" />
        // </div>
    );
}

export default ShipOfThesis;
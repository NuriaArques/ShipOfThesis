import React from 'react';
import './styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="triangle-container"> {/* Added class for the triangle */}
        <img src='/img/logo_SoT.png' alt="Ship of Thesis Logo"/>
      </div>
      <div className="rectangle-container">
        <img src='/img/logo_LY.svg' alt="Linssen Yachts Logo" />
      </div>
    </header>
  );
}

export default Header;

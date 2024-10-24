import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="triangle-container"> {/* Added class for the triangle */}
        <img src='/img/logo_SoT.png' alt="Ship of Thesis Logo" className="triangle-logo" />
      </div>
      <div className="header-logo rectangle-container">
        <img src='/img/logo_LY.svg' alt="Linssen Yachts Logo" />
      </div>
    </header>
  );
}

export default Header;

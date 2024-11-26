import React from "react";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-content">
        <div className="content-intro">
            <div className="contact-info">
                <h1>Contact Us</h1>
                <p style={{ margin: 1.5 }}>We'd love to hear from you! </p>
                <p style={{ margin: 0 }}>Please reach out to us using the details below.</p>
            </div>
            <img src="/logo_SoT.png" alt="Ship of Thesis Logo" className="logo"/>
        </div>

        <div className="contact-cards">
            <div className="contact-card">
                <div className="card-info">
                    <div className="contact-info">
                        <h2>Phone</h2>
                        <p>+31 123 456 789</p>
                    </div>
                    <div className="info-icon">📞</div>
                </div>
            </div>
            <div className="contact-card">
                <div className="card-info">
                    <div className="contact-info">
                        <h2>Email</h2>
                        <p>info@shipofthesis.com</p>
                    </div>
                    <div className="info-icon">✉️</div>
                </div>
            </div>
            <div className="contact-card">
                <div className="card-info">
                    <div className="contact-info">
                        <h2>Address</h2>
                        <p>Maastricht, Netherlands</p>
                    </div>
                    <div className="info-icon">📍</div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Contact;

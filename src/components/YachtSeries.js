import React from 'react';
import YachtCard from './YachtCard';
import './styles/YachtSeries.css';

function YachtSeries() {
    const yachts = [
        {
            name: 'Linssen Grand Sturdy series',
            image: '/img/linssen-grand-sturdy.webp',
            dimensions: '9-14 m / 30\'- 45\' ft',
            path: '/review/grand-sturdy'
        },
        {
            name: 'Linssen SL series',
            image: '/img/linssen-sl.webp',
            dimensions: '9-14 m / 30\'- 45\' ft',
            path: '/review/sl'
        },
        {
            name: 'Linssen Variotop series',
            image: '/img/linssen-variotop.webp',
            dimensions: '14-16.5 m / 45\'- 55\' ft',
            path: '/review/variotop'
        },
        {
            name: 'Linssen Variodeck series',
            image: '/img/linssen-variodeck.webp',
            dimensions: '15.50 m / 50\' ft',
            path: '/review/variodeck'
        },
    ];

    return (
        <div className="yacht-series">
            <h1 style={{ fontSize: 'xx-large', fontStyle: 'bold', marginRight: '10px' }}>Lassering Yachts</h1>
            <h3 style={{ fontSize: 'x-large', fontStyle: 'normal', marginRight: '10px' }}>4 yacht series</h3>
            <div className="yacht-cards-container">
                {yachts.map((yacht, index) => (
                    <YachtCard key={index} yacht={yacht} />
                ))}
            </div>
        </div>
    );
}

export default YachtSeries;

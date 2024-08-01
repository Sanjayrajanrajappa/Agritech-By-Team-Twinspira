import React from 'react';
import './ScanPage.css';

function ScanPage() {
    const handleButtonClick = () => {
        window.location.href = '/index1.html';  // Accessing the HTML file from the public directory
    };

    return (
        <div className="scan-page">
            <div className="scan-content-container">
                <h1>Scan Page</h1>
                <div className="buttons-container">
                    <button onClick={handleButtonClick} type="button">
                        Go to HTML Page
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ScanPage;

import React, { useState, useEffect } from 'react';

const Popup = ({ isOpen, onClose, title, message, attempts }) => {
    const overlayStyle = isOpen ? { display: 'block' } : { display: 'none' };

  
    return (
        <div className="result" style={overlayStyle}>
        <div className="result-content">
          <div className="message">
             <h2>{title}</h2>
             <p>{message}</p>
              <p>Attempts: <strong>{attempts}</strong></p>
          </div>
         
          <button id="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

export default Popup;
// PopupModal.js

import React from 'react';
import './styles.css';

const PopupModal = ({ imageUrl, closeModal }) => {
  return (
    <div className="popup-modal-overlay" onClick={closeModal}>
      <div className="popup-modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="BO Image"
          className="popup-modal-image"
        />
      </div>
    </div>
  );
};

export default PopupModal;
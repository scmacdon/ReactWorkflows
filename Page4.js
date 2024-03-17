// Page4.js

import React, { useState } from 'react';
import './styles.css';
import BoImage from './diagram.png';
import PopupModal from './PopupModal'; // Import the new component

const Page4 = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleToggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="main-content">
      <p>Hello</p>
      <img
        src={BoImage}
        alt="Bo Image"
        className="bo-image"
        onClick={handleToggleModal}
      />

      {isModalOpen && (
        <PopupModal imageUrl={BoImage} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Page4;


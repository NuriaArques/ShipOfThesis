import React, { useState } from 'react';
import Modal from 'react-modal';
import Popup3D from 'C:/Users/Fred/OneDrive/Documents/GitHub/ShipOfThesis/src/Popup3D';

Modal.setAppElement('#root');

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '500px', // Adjust the width as needed
            height: '400px', // Adjust the height as needed
          }
        }}
      >
        <Popup3D />
      </Modal>
    </div>
  );
}

export default MyComponent;
import React, { useState } from 'react';
import './styles.css';

const PageUpdate = () => {
  const [itemId, setItemId] = useState('');
  const [itemData, setItemData] = useState({});
  const [formErrors, setFormErrors] = useState({ itemId: '' });
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setItemId(value);
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      itemId: '',
    }));
  };

  const handleGetItem = async (e) => {
    e.preventDefault();
  
    if (!itemId) {
      setFormErrors({
        itemId: 'Please enter an ID',
      });
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/items/${itemId}`);
  
      if (!response.ok) {
        throw new Error('Failed to retrieve item data');
      }
  
      const responseData = await response.json();
      
      // Log responseData to check its structure
      console.log(responseData);
  
      // Update the itemData state directly with the response data
      setItemData(responseData);
  
      // Show the modal with the returned data
      setShowModal(true);
    } catch (error) {
      console.error('Error retrieving item data:', error.message);
      setShowModal(true);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    try {
      // Example: Use fetch to send a PUT request
      // const response = await fetch(`http://localhost:8080/api/items/${itemId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(itemData),
      // });

      // Handle the response accordingly

      // Update state with the response
      // setModalContent(responseData);
      // setShowModal(true);
    } catch (error) {
      console.error('Error updating item:', error.message);
      setShowModal(true);
    }
  };

  return (
    <div>
      <h1>Update Workflow Item</h1>
      <p>You can view or update a research document item by entering the Id value of the item. </p>
      <form>
        <div>
          <label htmlFor="itemId">Enter Item ID:</label>
          <input type="text" id="itemId" name="itemId" value={itemId} onChange={handleInputChange} />
          <span className="error-message">{formErrors.itemId}</span>
        </div>

        <div>
          <button type="button" onClick={handleGetItem}>
            Get Item Data
          </button>
        </div>
      </form>

      {Object.keys(itemData).length > 0 && (
      <form onSubmit={handleUpdateItem}>
      {Object.keys(itemData).map((key) => (
      <div key={key}>
        <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
        {key === 'id' ? (
          <input
            type="text"
            id={key}
            name={key}
            value={itemData[key]}
            readOnly
          />
        ) : (
          <input
            type="text"
            id={key}
            name={key}
            value={itemData[key]}
            onChange={(e) => setItemData({ ...itemData, [key]: e.target.value })}
          />
        )}
      </div>
    ))}

    <div>
      <button type="submit">Update Item</button>
    </div>
  </form>
)}

     
      {/* Modal */}
      {showModal && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={handleModalClose}>
        &times;
      </span>
      {Object.keys(itemData).length > 0 ? (
        <div>
          <h2>Item Details</h2>
          {Object.keys(itemData).map((key) => (
            <p key={key}>
              {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${itemData[key]}`}
            </p>
          ))}
        </div>
      ) : (
        <div>
          <h2>Error</h2>
          <p>Error retrieving or updating item data</p>
        </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageUpdate;


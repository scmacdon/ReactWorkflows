import React, { useState } from 'react';
import './styles.css';

const Page1 = () => {
  const [formData, setFormData] = useState({
    title: '',
    engineer: '',
    summary: '',
    service: '',
    service2: '',
    sme: '',
    language: '',
    guide: '',
    url: '',
    isIncludedInSOS: false,
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    engineer: '',
    summary: '',
    service: '',
    service2: '',
    sme: '',
    language: '',
    guide: '',
    url: '',
    isIncludedInSOS: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleModalClose = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue =
      type === 'checkbox' ? checked : type === 'radio' ? JSON.parse(value) : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }));
  };

  const validateUrl = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
  
    const newFormErrors = {};
  
    Object.entries(formData).forEach(([key, value]) => {
      // Check for undefined for boolean values
      if (typeof value === 'string' && value === '') {
        newFormErrors[key] = 'Please enter a value';
      }
    });
  
    if (!validateUrl(formData.url)) {
      newFormErrors.url = 'Please enter a valid URL';
    }
  
    if (Object.keys(newFormErrors).length > 0) {
      setFormErrors(newFormErrors);
      console.log("ERROR -", newFormErrors); // Log the detailed errors
      return;
    }
  
    console.log("About to make FETCH CALL");
    try {
      const response = await fetch('http://localhost:8080/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }
  
      // Assuming the response is plain text
      const responseData = await response.text();
      
  // Open the modal with the server value
  setModalContent(responseData);
  setShowModal(true);
  console.log('Response from server:', responseData);
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setModalContent({ error: error.message });
      setShowModal(true);
    }
  };
  
  
  return (
    <div>
      <h1>Workflow Candidate Research</h1>  
      <p>Fill in this Form to create your workflow candidate research document</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} />
          <span className="error-message">{formErrors.title}</span>
        </div>

        <div>
          <label htmlFor="engineer">Engineer:</label>
          <input type="text" id="engineer" name="engineer" value={formData.engineer} onChange={handleInputChange} />
          <span className="error-message">{formErrors.engineer}</span>
        </div>

        <div>
          <label htmlFor="summary">Summary:</label>
          <input type="text" id="summary" name="summary" value={formData.summary} onChange={handleInputChange} />
          <span className="error-message">{formErrors.summary}</span>
        </div>

        <div>
          <label htmlFor="service">Main Service:</label>
          <input type="text" id="service" name="service" value={formData.service} onChange={handleInputChange} />
          <span className="error-message">{formErrors.service}</span>
        </div>

        <div>
          <label htmlFor="service2">Additional Service (enter N/A if there are none):</label>
          <input type="text" id="service2" name="service2" value={formData.service2} onChange={handleInputChange} />
          <span className="error-message">{formErrors.service2}</span>
        </div>

        <div>
          <label htmlFor="sme">Subject Matter Expert:</label>
          <input type="text" id="sme" name="sme" value={formData.sme} onChange={handleInputChange} />
          <span className="error-message">{formErrors.sme}</span>
        </div>

        <div>
          <label htmlFor="language">Programming Language:</label>
          <input type="text" id="language" name="language" value={formData.language} onChange={handleInputChange} />
          <span className="error-message">{formErrors.language}</span>
        </div>

        <div>
          <label htmlFor="language">Guide Name:</label>
          <input type="text" id="guide" name="guide" value={formData.guide} onChange={handleInputChange} />
          <span className="error-message">{formErrors.guide}</span>
        </div>

        <div>
          <label htmlFor="url">Service URL:</label>
          <input type="text" id="url" name="url" value={formData.url} onChange={handleInputChange} />
          <span className="error-message">{formErrors.url}</span>
        </div>

        <div className="radio-container">
          <p>Is Guide included in SOS</p>
          <label className="radio-label">
            <input
              type="radio"
              name="isIncludedInSOS"
              value={true}
              checked={formData.isIncludedInSOS === true}
              onChange={handleInputChange}
            />
            Yes
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="isIncludedInSOS"
              value={false}
              checked={formData.isIncludedInSOS === false}
              onChange={handleInputChange}
            />
            No
          </label>
          <span className="error-message">{formErrors.isIncludedInSOS}</span>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            {modalContent && !modalContent.error ? (
              <div>
                <h2>Workflow Submission Successful</h2>
                <p>Your new workflow item is:</p>
                <pre>{JSON.stringify(modalContent, null, 2)}</pre>
              </div>
            ) : (
              <div>
                <h2>Error</h2>
                <p>{modalContent && modalContent.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page1;








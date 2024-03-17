import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PageResearch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [emptyFields, setEmptyFields] = useState([]);
  const [serverResponse, setServerResponse] = useState({
    statusCode: null,
    responseBody: null,
  });

  const fields = [
    'Item Id',
    'Redshift Query',
    'Redshift Data',
    'New Service',
    'Internal Team Request',
    'Github Issue',
    'Repost',
    'Sim Ticket',
    'Stackoverflow',
    'Content Wave',
    'Pageview Results',
    'Github Metrics',
    'Complexity Summary',
    'Multi Language Summary',
  ];

  const fieldMappings = {
    'Item Id': 'itemId',
    'Redshift Query': 'redshiftQuery',
    'Redshift Data': 'redshiftData',
    'New Service': 'newService',
    'Internal Team Request': 'internalTeamRequest',
    'Github Issue': 'githubIssue',
    'Repost': 'repost',
    'Sim Ticket': 'simTicket',
    'Stackoverflow': 'stackoverflow',
    'Content Wave': 'contentWave',
    'Pageview Results': 'pageviewResults',
    'Github Metrics': 'githubMetrics',
    'Complexity Summary': 'complexitySummary',
    'Multi Language Summary': 'multiLanguageSummary',
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [fieldMappings[name]]: value });
  };

  const openModal = () => {
    // Check for empty fields before opening the modal
    const emptyFieldsList = fields.filter((field) => !formData[fieldMappings[field]]);
    setEmptyFields(emptyFieldsList);

    if (emptyFieldsList.length === 0) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEmptyFields([]);
  };

  const renderFormFields = () => {
    return fields.map((field) => (
      <div key={field} style={{ marginBottom: '10px' }}>
        <label>{field}:</label>
        <input
          type="text"
          name={field}
          value={formData[fieldMappings[field]] || ''}
          onChange={handleFieldChange}
        />
      </div>
    ));
  };

  const handleSave = async () => {
    try {
      // Check for any empty fields in the form data
      const emptyFieldsList = fields.filter((field) => !formData[fieldMappings[field]]);

      if (emptyFieldsList.length > 0) {
        // Display an alert or handle the case where there are empty fields
        alert(`Please fill out the following fields: ${emptyFieldsList.join(', ')}`);
        return;
      }

      // Display a confirmation dialog
      const shouldSubmit = window.confirm('Are you sure you want to submit the data?');

      if (!shouldSubmit) {
        // If the user clicks "Cancel," do not submit data
        return;
      }

      const response = await fetch('http://localhost:8080/api/items/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setServerResponse({
        statusCode: response.status,
        responseBody: await response.text(),
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error submitting form data:', error);
      // Handle any unexpected errors
    }
  };

  return (
    <div>
      <h1>Research Details Form</h1>
      <p>
        Supply a detailed description for each field, outlining the source that justifies the necessity of this workflow.
        In cases where there is an absence of data for a particular category (e.g., no Stackoverflow thread), explicitly state "<b>No Data</b>".
        Additionally, ensure the inclusion of a valid item id; otherwise, the form data will be deemed invalid.
      </p>
      <div>{renderFormFields()}</div>
      <button onClick={handleSave}>Submit</button>

      {emptyFields.length > 0 && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Please fill out all fields: {emptyFields.join(', ')}
        </p>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel={`Submit Confirmation`}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              width: '60%',
              margin: 'auto',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          <button onClick={closeModal} style={{ float: 'right', margin: '10px', padding: '5px' }}>
            Close
          </button>
          <div style={{ padding: '20px' }}>
            <h2>Server Response</h2>
            <div style={{ marginBottom: '10px' }}>
              <strong>Status Code:</strong> {serverResponse.statusCode}
            </div>
            <div>
              <strong>Response Body:</strong> {serverResponse.responseBody}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PageResearch;




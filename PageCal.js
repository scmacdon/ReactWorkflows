import React, { useState, useMemo, useEffect } from 'react';
import { useTable } from 'react-table';
import './styles.css';
import Modal from 'react-modal';

const PageCal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [data, setData] = useState([]); // Initialize data state

  const [redshiftData, setRedshiftData] = useState('0');
  const [newService, setNewService] = useState('0');
  const [teamRequest, setTeamRequest] = useState('0');
  const [repost, setRepost] = useState('0');
  const [stackoverflow, setStackoverflow] = useState('0');
  const [simTicket, setSimTicket] = useState('0');

  const columns = useMemo(
    () => [
      { Header: 'Research Doc Id', accessor: 'id' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Title', accessor: 'title' },
      { Header: 'Engineer', accessor: 'engineer' },
      { Header: 'Summary', accessor: 'summary' },
      { Header: 'Service', accessor: 'service' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const fetchData = async () => {
    try {
      setFetchingData(true);

      // Include the status parameter in the API call
      const response = await fetch('http://localhost:8080/api/items?status=Research');
      const jsonData = await response.json();

      setData(jsonData);
      setSelectedRowData(null);
      setSelectedRow(null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowDoubleClick = (row) => {
    setSelectedRowData(row.original);
    setIsModalOpen(true);
    setSelectedRow(row.id); // Add this line to update the selectedRow state
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleReseach = async () => {
    if (selectedRowData) {
      try {
        const response = await fetch('http://localhost:8080/api/items/update', {
          method: 'Put', // Use POST for updating
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedRowData.id,
            status: 'Research',
          }),
        });

        if (response.ok) {
          console.log('Research successful');
          fetchData();
        } else {
          console.error('Research failed:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error approving item:', error);
      }
    }
  };

  const handleRejection = async () => {
    if (selectedRowData) {
      try {
        const response = await fetch('http://localhost:8080/api/items/update', {
          method: 'PUT', // Use POST for updating
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedRowData.id,
            status: 'Rejected',
          }),
        });

        if (response.ok) {
          console.log('Rejection successful');
          fetchData();
        } else {
          console.error('Rejection failed:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error rejecting item:', error);
      }
    }
  };

  // New handler function for submit button
  // New handler function for submit button
const handleSubmit = () => {
    if (selectedRowData) {
      // Customize this logic as needed
      console.log('Selected Row ID:', selectedRow);
      console.log('Status:', selectedRowData.status);
      console.log('Item ID:', selectedRowData.id);
      console.log('Form submitted. RedShift Data:', redshiftData);
      console.log('New Service:', newService);
      console.log('Team Request:', teamRequest);
      console.log('Re-Post:', repost);
      console.log('Stackoverflow:', stackoverflow);
      console.log('Sim ticket:', simTicket);
    }
  };
  

  return (
    <div>
        <h1>Calculate Score</h1>
      <p>
        Before a Candidate Detail item can be set to In-progress, the item score must meet the
        value 80 or higher. Only items with status of <b>Research</b> are displayed. To calculate the score, double click the item and fill in the form and submit. 
      </p>
      <p>To view Weighting information, see <a href="https://quip-amazon.com/dO7JAX0be5v1/Workflow-Candidate-Backlog#temp:C:PePfae50b6547e5410f8b60b681a" target="_blank">Weighting information</a>
.  </p>
      <button onClick={fetchData} disabled={fetchingData}>
        {fetchingData ? 'Fetching Data...' : 'Fetch Data'}
      </button>
      <table {...getTableProps()} style={{ borderSpacing: '0', width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onDoubleClick={() => handleRowDoubleClick(row)}
                onClick={() => setSelectedRow(row.id)}
                style={{
                  cursor: 'pointer',
                  background: row.id === selectedRow ? '#f2f2f2' : 'white',
                }}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Row Details Modal"
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

  {/* Add input fields for RedShift data, New Service, Team Request, Re-Post, Stackoverflow, and Sim ticket */}
  <label htmlFor="redshiftInput">RedShift data:</label>
  <input
    type="text"
    id="redshiftInput"
    placeholder="Enter RedShift data"
    value={redshiftData}
    onChange={(e) => setRedshiftData(e.target.value)}
  />

  <label htmlFor="newServiceInput">New Service:</label>
  <input
    type="text"
    id="newServiceInput"
    placeholder="Enter New Service"
    value={newService}
    onChange={(e) => setNewService(e.target.value)}
  />

  <label htmlFor="teamRequestInput">Team Request:</label>
  <input
    type="text"
    id="teamRequestInput"
    placeholder="Enter Team Request"
    value={teamRequest}
    onChange={(e) => setTeamRequest(e.target.value)}
  />

  <label htmlFor="repostInput">Re-Post:</label>
  <input
    type="text"
    id="repostInput"
    placeholder="Enter Re-Post"
    value={repost}
    onChange={(e) => setRepost(e.target.value)}
  />

  <label htmlFor="stackoverflowInput">Stackoverflow:</label>
  <input
    type="text"
    id="stackoverflowInput"
    placeholder="Enter Stackoverflow"
    value={stackoverflow}
    onChange={(e) => setStackoverflow(e.target.value)}
  />

  <label htmlFor="simTicketInput">Sim ticket:</label>
  <input
    type="text"
    id="simTicketInput"
    placeholder="Enter Sim ticket"
    value={simTicket}
    onChange={(e) => setSimTicket(e.target.value)}
  />

  {/* Submit button */}
  <button onClick={handleSubmit} style={{ margin: '10px', padding: '5px' }}>
    Submit
  </button>
</Modal>

    </div>
  );
};

export default PageCal;


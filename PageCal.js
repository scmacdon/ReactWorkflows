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

  // State variables for form fields
  const [redshiftData, setRedshiftData] = useState('0');
  const [newService, setNewService] = useState('0');
  const [internalTeamRequest, setInternalTeamRequest] = useState('0');
  const [githubIssue, setGithubIssue] = useState('0');
  const [repost, setRepost] = useState('0');
  const [stackoverflow, setStackoverflow] = useState('0');
  const [simTicket, setSimTicket] = useState('0');
  const [contentWave, setContentWave] = useState('0');
  const [pageviewResults, setPageviewResults] = useState('0');
  const [githubMetrics, setGithubMetrics] = useState('0');
  const [complexitySummary, setComplexitySummary] = useState('0');
  const [multiLanguageSummary, setMultiLanguageSummary] = useState('0');
  const [redshiftQuery, setRedshiftQuery] = useState('0');

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
    setSelectedRow(row.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleReseach = async () => {
    if (selectedRowData) {
      try {
        const response = await fetch('http://localhost:8080/api/items/update', {
          method: 'Put',
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
          method: 'PUT',
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
  const handleSubmit = () => {
    if (selectedRowData) {
      // Customize this logic as needed
      console.log('Selected Row ID:', selectedRow);
      console.log('Status:', selectedRowData.status);
      console.log('Item ID:', selectedRowData.id);
      console.log('RedShift Query:', redshiftQuery);
      console.log('RedShift Data:', redshiftData);
      console.log('New Service:', newService);
      console.log('Internal Team Request:', internalTeamRequest);
      console.log('Github Issue:', githubIssue);
      console.log('Re-Post:', repost);
      console.log('Stackoverflow:', stackoverflow);
      console.log('Sim ticket:', simTicket);
      console.log('Content Wave:', contentWave);
      console.log('Pageview Results:', pageviewResults);
      console.log('Github Metrics:', githubMetrics);
      console.log('Complexity Summary:', complexitySummary);
      console.log('Multi Language Summary:', multiLanguageSummary);
    }
  };

  return (
    <div>
      <h1>Calculate Score</h1>
      <p>
        Before a Candidate Detail item can be set to In-progress, the item score must meet the
        value 80 or higher. Only items with status of <b>Research</b> are displayed. To calculate the score, double click the item and fill in the form and submit. 
      </p>
      <p>To view Weighting information, see <a href="https://quip-amazon.com/dO7JAX0be5v1/Workflow-Candidate-Backlog#temp:C:PePfae50b6547e5410f8b60b681a" target="_blank">Weighting information</a>.
      </p>
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
        <label htmlFor="redshiftQueryInput">RedShift Query:</label>
        <input
          type="text"
          id="redshiftQueryInput"
          placeholder="Enter RedShift Query"
          value={redshiftQuery}
          onChange={(e) => setRedshiftQuery(e.target.value)}
        />

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

        <label htmlFor="internalTeamRequestInput">Internal Team Request:</label>
        <input
          type="text"
          id="internalTeamRequestInput"
          placeholder="Enter Internal Team Request"
          value={internalTeamRequest}
          onChange={(e) => setInternalTeamRequest(e.target.value)}
        />

        <label htmlFor="githubIssueInput">Github Issue:</label>
        <input
          type="text"
          id="githubIssueInput"
          placeholder="Enter Github Issue"
          value={githubIssue}
          onChange={(e) => setGithubIssue(e.target.value)}
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

        <label htmlFor="contentWaveInput">Content Wave:</label>
        <input
          type="text"
          id="contentWaveInput"
          placeholder="Enter Content Wave"
          value={contentWave}
          onChange={(e) => setContentWave(e.target.value)}
        />

        <label htmlFor="pageviewResultsInput">Pageview Results:</label>
        <input
          type="text"
          id="pageviewResultsInput"
          placeholder="Enter Pageview Results"
          value={pageviewResults}
          onChange={(e) => setPageviewResults(e.target.value)}
        />

        <label htmlFor="githubMetricsInput">Github Metrics:</label>
        <input
          type="text"
          id="githubMetricsInput"
          placeholder="Enter Github Metrics"
          value={githubMetrics}
          onChange={(e) => setGithubMetrics(e.target.value)}
        />

        <label htmlFor="complexitySummaryInput">Complexity Summary:</label>
        <input
          type="text"
          id="complexitySummaryInput"
          placeholder="Enter Complexity Summary"
          value={complexitySummary}
          onChange={(e) => setComplexitySummary(e.target.value)}
        />

        <label htmlFor="multiLanguageSummaryInput">Multi Language Summary:</label>
        <input
          type="text"
          id="multiLanguageSummaryInput"
          placeholder="Enter Multi Language Summary"
          value={multiLanguageSummary}
          onChange={(e) => setMultiLanguageSummary(e.target.value)}
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

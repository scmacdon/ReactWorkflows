import React, { useState, useMemo, useEffect } from 'react';
import { useTable } from 'react-table';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import DynamicForm from './DynamicForm'; // Import the DynamicForm component

Modal.setAppElement('#root');

const PageCandidate = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [data, setData] = useState([]);
  const [researchDocHTML, setResearchDocHTML] = useState('');

  const columns = useMemo(
    () => [
      { Header: 'Research Doc Id', accessor: 'id' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Title', accessor: 'title' },
      { Header: 'Engineer', accessor: 'engineer' },
      { Header: 'Summary', accessor: 'summary' },
      { Header: 'Service', accessor: 'service' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <span onClick={() => handleViewDocument(row.original.id)} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faFileAlt} />
          </span>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  const fetchData = async () => {
    try {
      setFetchingData(true);
      const response = await fetch('http://localhost:8080/api/items');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDocument = async (docId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/items/getHtmlForm/${docId}`);
      const html = await response.text();
      setResearchDocHTML(html);
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Error fetching research doc:', error);
    }
  };

  const handleApprove = async () => {
    const fid = document.getElementById('fid').value;
    // Handle approve action
    console.log('Item Approved');
    console.log('Item ID:', fid);

    try {
      const response = await fetch('http://localhost:8080/api/items/update', {
        method: 'Put', // Use POST for updating
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: fid,
          status: 'Approved',
        }),
      });

      if (response.ok) {
        console.log('Approval successful');
        fetchData();
      } else {
        console.error('Approval failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };
  
  const handleReject = async () => {
    // Handle reject action
    console.log('Item Rejected');
  };
  

  return (
    <div>
      <h1>Draft Candidates</h1>
      <p>At this stage, only items with the status of <b>Draft</b> are displayed and can be either accepted or rejected.</p>
      <p>The AWS Code Example team is responsible for discussing draft candidate items and granting approval for further progression.</p>
      <p>Once approved, you can modify the status of an item by double-clicking on it.</p>
      <p>You cannot change the status of the item to <b>Approved</b> if you have not filled out research items. To enter research items, click <b>Research Details</b> in the Side Navigation.</p>
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
                style={{
                  cursor: 'pointer',
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
        isOpen={isFormModalOpen}
        onRequestClose={() => setIsFormModalOpen(false)}
        contentLabel="Research Doc Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '80%',
            margin: 'auto',
            borderRadius: '0',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            background: '#f3f3f3',
          },
        }}
      >
        <button
          onClick={() => setIsFormModalOpen(false)}
          style={{
            float: 'right',
            margin: '10px',
            padding: '5px',
            background: '#f3f3f3',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
        <div style={{ padding: '20px' }}>
          <DynamicForm htmlContent={researchDocHTML} />
          <button className="ui-btn ui-btn-a" onClick={handleApprove}>Approve</button>
          <button className="ui-btn ui-btn-a" onClick={handleReject}>Reject</button>
        </div>
      </Modal>
    </div>
  );
};

export default PageCandidate;



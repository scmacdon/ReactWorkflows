import React, { useState, useMemo, useEffect } from 'react';
import { useTable } from 'react-table';
import './styles.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Page2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [data, setData] = useState([]); // Initialize data state

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
      const response = await fetch('http://localhost:8080/api/items');
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
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleApproval = async () => {
    if (selectedRowData) {
      try {
        const response = await fetch('http://localhost:8080/api/items/update', {
          method: 'Put', // Use POST for updating
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedRowData.id,
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
  

  return (
    <div>
      <h1>Draft Candidates</h1>
      <p>At this stage, only items with status of <b>Draft</b> are displayed and can be either accepted or rejected.</p>
      <p>The AWS Code Example team is responsible for discussing draft candidate items and granting approval for further progression.</p>
      <p>Once approved, you can modify the status of an item by double-clicking on it.</p>
      <button onClick={fetchData} disabled={fetchingData}>
        {fetchingData ? 'Fetching Data...' : 'Fetch Data'}
      </button>
      <table {...getTableProps()} style={{ borderSpacing: '0', width: '100%' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
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
                {row.cells.map(cell => (
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
        <div style={{ padding: '20px' }}>
          {selectedRowData && (
            <div>
              {Object.entries(selectedRowData).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '10px' }}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
              <button onClick={handleApproval}>Approved</button>
              <button onClick={handleRejection}>Rejected</button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Page2;







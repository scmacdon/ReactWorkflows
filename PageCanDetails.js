import React, { useState, useMemo, useEffect } from 'react';
import { useTable } from 'react-table';
import './styles.css';
import Modal from 'react-modal';

const Page3 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [data, setData] = useState([]); // Initialize data state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  } = useTable({ columns, data: data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) });

  const fetchData = async () => {
    try {
      setFetchingData(true);

      // Include the status parameter in the API call
      const response = await fetch('http://localhost:8080/api/items?status=Approved');
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

  const handlePaginationClick = (newPage) => {
    setCurrentPage(newPage);
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

  const handleProgress = async () => {
    if (selectedRowData) {
      try {
        const response = await fetch('http://localhost:8080/api/items/progress', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedRowData.id,
            status: 'Progress',
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

  const handleCalculateItemClick = () => {
    // Your logic for handling Calculate Item click
    console.log('Calculate Item clicked');
  };

  return (
    <div>
      <h1>Candidate Details</h1>
      <p>At this stage, the status of all items can be <b>Approved</b>, <b>Research</b>, <b>InProgress</b>, or <b>Done</b>.</p>
      <p>You can modify the status of an item by double-clicking on it.</p>
      <p>You can set the status from <b>Approved</b> to <b>Research</b> which means the item is still in the research mode. 
      However, before an item can be set from <b>Research</b> to <b>InProgress</b>, 
      the item score must be 80 or higher. You can calculate an item in the <b>Calculate Score</b> view. 
      </p>
      {/* Fetch Data button added back */}
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
      <div>
        <button onClick={() => handlePaginationClick(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button
          onClick={() => handlePaginationClick(currentPage + 1)}
          disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
        >
          Next
        </button>
      </div>

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
        <button
          onClick={closeModal}
          style={{ float: 'right', margin: '10px', padding: '5px' }}
        >
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
              <button onClick={handleReseach}>Research</button>
              <button onClick={handleProgress}>In-Progress</button>
              <button onClick={handleReseach}>Done</button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Page3;




import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // ✅ Import useLocation
import Sidebar from '../components/Sidebar'; // ✅ Ensuring Sidebar is included only once
import { FaUserCircle, FaBell, FaChartPie, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  console.log('✅ Dashboard component is rendering!');

  const location = useLocation();

  // ✅ Function to Generate More Sample Transactions Dynamically
  const generateTransactions = (count, startIndex = 1) => {
    const newTransactions = [];
    for (let i = startIndex; i < startIndex + count; i++) {
      newTransactions.push({
        receiptNo: `${100 + i}`, // Unique receipt number
        date: `0${(i % 9) + 1}/03/2024`, // Sample Date
        vehicleNo: `DL 0${(i % 9) + 1} AB ${1000 + i}`,
        grossWt: `${(18 + (i % 5)) * 1000} kg`,
        tareWt: `${(4 + (i % 3)) * 1000} kg`,
        netWt: `${(14 + (i % 4)) * 1000} kg`,
      });
    }
    return newTransactions;
  };

  const [employeeData, setEmployeeData] = useState(() => {
    // ✅ Load from Local Storage FIRST on Mount
    const storedData = localStorage.getItem('dashboardUserData');
    return storedData ? JSON.parse(storedData) : location.state || {};
  });

  console.log('🚀 Dashboard Loaded! Received Data:', employeeData);

  useEffect(() => {
    const storedData = localStorage.getItem('dashboardUserData');
    const parsedStoredData = storedData ? JSON.parse(storedData) : null;

    if (location.state && Object.keys(location.state).length > 0) {
      if (
        !parsedStoredData ||
        JSON.stringify(location.state) !== JSON.stringify(parsedStoredData)
      ) {
        console.log('📝 Saving Dashboard Data to Local Storage...');
        localStorage.setItem(
          'dashboardUserData',
          JSON.stringify(location.state)
        );
        setEmployeeData(location.state); // ✅ Update ONLY when new data is received
      }
    } else if (parsedStoredData) {
      setEmployeeData(parsedStoredData); // ✅ Use stored data if no new state
    }
  }, [location.state]); // ✅ Only update when location.state changes

  // ✅ Extract Employee Details
  const employeeName = employeeData?.employeeName || 'Unknown User';
  const employeeID = employeeData?.employeeID || '123456';
  const designation = employeeData?.designation || 'Operator';
  const userLat = employeeData?.lat ?? 'Unknown';
  const userLng = employeeData?.lng ?? 'Unknown';
  const employeePhoto =
    employeeData?.employeePhoto || '/assets/default-user.png';

  const [currentTime, setCurrentTime] = useState(new Date());

  const [rowCount, setRowCount] = useState(10); // Initial row count

  const [transactions, setTransactions] = useState(() => {
    const savedDrafts =
      JSON.parse(localStorage.getItem('draftTransactions')) || [];
    return generateTransactions(10).concat(savedDrafts);
  });

  const [searchQuery, setSearchQuery] = useState(''); // ✅ Search Input

  // ✅ Load Initial Transactions
  useEffect(() => {
    setTransactions((prevTransactions) => {
      if (prevTransactions.length === 0) {
        return generateTransactions(10);
      }
      return prevTransactions;
    });
  }, []);

  // ✅ Function to Load More Transactions
  const loadMoreRows = () => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      ...generateTransactions(10, prevTransactions.length + 1), // Add 10 more
    ]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const saveAsDraft = () => {
    // ✅ Retrieve stored values safely
    const receiptNumber =
      localStorage.getItem('receiptNumber') || 'Not Generated';
    const vehicleNumber =
      localStorage.getItem('vehicleNumber') || 'Not Entered';
    const basicInfo = JSON.parse(localStorage.getItem('basicInfo')) || {};
    const deviationDetected =
      JSON.parse(localStorage.getItem('deviationDetected')) || false;
    const deviationReport = localStorage.getItem('deviationReport') || '';
    const deviationImages =
      JSON.parse(localStorage.getItem('deviationImages')) || [];
    const checklist = JSON.parse(localStorage.getItem('checklist')) || [];

    // ✅ Gather all relevant data
    const draftData = {
      receiptNumber,
      vehicleNumber,
      basicInfo,
      deviationDetected,
      deviationReport,
      deviationImages,
      checklist,
      timestamp: new Date().toISOString(), // ✅ Store timestamp for sorting in Activity Log
    };

    // ✅ Retrieve existing drafts from localStorage
    const existingDrafts =
      JSON.parse(localStorage.getItem('draftTransactions')) || [];

    // ✅ Append the new draft
    const updatedDrafts = [...existingDrafts, draftData];

    // ✅ Save updated drafts back to localStorage
    localStorage.setItem('draftTransactions', JSON.stringify(updatedDrafts));

    // ✅ Clear form fields before redirection
    localStorage.removeItem('vehicleNumber');
    localStorage.removeItem('receiptNumber');

    // ✅ Redirect user to Weighment Page
    navigate('/dashboard/weighment');
  };

  return (
    <div className='flex flex-col min-h-screen bg-white-100'>
      <div className='flex-grow p-4'>
        {/* ✅ Main Content */}
        <div className='flex-1 p-4'>
          {/* ✅ Header Section */}
          <header className='bg-white shadow-md p-4 flex justify-between items-center'>
            <div>
              <h1 className='text-xl text-orange-500 font-bold'>Dashboard</h1>
              <p className='text-sm text-gray-600'>
                Test Private Limited - 📍Location: {userLat}, {userLng}
              </p>
              <p className='text-sm text-gray-600'>
                Date & Time: {currentTime.toLocaleString()}
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <FaBell className='text-orange-500 text-xl cursor-pointer' />
              <div className='flex items-center space-x-2'>
                <img
                  src={employeePhoto}
                  alt='User'
                  className='w-10 h-10 rounded-full border-2 border-orange-500 object-cover'
                />
                <div>
                  <p className='text-orange-500'>{employeeName}</p>
                  <p className='text-gray-600 text-sm'>
                    {designation} - {employeeID}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* ✅ Statistics Boxes (Now only 4) */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
            {[
              {
                title1: 'Weighbridge Type',
                value1: 'Pitless since 25/02/2023',
                title2: 'Weighbridge Capacity (In Tons)',
                value2: '100',
              },
              {
                title1: 'Vehicles Weighed (MTD No.)',
                value1: '324',
                title2: 'Overweight Vehicles (MTD No.)',
                value2: '15',
              },
              {
                title1: 'Date of Stamping',
                value1: '25/02/2025',
                title2: 'Next Stamping Due In',
                value2: '52 days',
              },
              {
                title1: 'AMC Visits - Promised',
                value1: '10',
                title2: 'AMC Visits - Done',
                value2: '7',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='bg-gray-100 p-4 rounded-lg shadow-md'>
                <p className='text-orange-500 text-sm'>{item.title1}</p>
                <p className='text-sm text-gray-600'>{item.value1}</p>
                <hr className='my-2 border-orange-500' />
                <p className='text-orange-500 text-sm'>{item.title2}</p>
                <p className='text-sm text-gray-600'>{item.value2}</p>
              </div>
            ))}
          </div>

          {/* ✅ Charts Section */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <FaChartPie className='text-orange-500 text-4xl mx-auto' />
              <p className='text-center mt-2'>Pie Chart 1</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <FaChartPie className='text-orange-500 text-4xl mx-auto' />
              <p className='text-center mt-2'>Pie Chart 2</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <FaChartBar className='text-orange-500 text-4xl mx-auto' />
              <p className='text-center mt-2'>Bar Graph</p>
            </div>
          </div>

          {/* ✅ Scrollable Table Container */}
          <div className='mt-6 bg-white p-6 rounded-lg shadow-md'>
            {/* ✅ Search Bar for Filtering */}
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg text-orange-500 font-bold'>
                Activity Log
              </h2>
              <input
                type='text'
                placeholder='Search by Receipt / Vehicle No.'
                className='p-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-orange-500'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // ✅ Update Search Query
              />
            </div>

            {/* ✅ Table Wrapper for Scrollability */}
            <div className='max-h-64 overflow-y-auto border border-gray-300 rounded-lg'>
              <table className='w-full min-w-max border-collapse'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='p-2 border'>Receipt No.</th>
                    <th className='p-2 border'>Date</th>
                    <th className='p-2 border'>Vehicle Number</th>
                    <th className='p-2 border'>Gross Weight</th>
                    <th className='p-2 border'>Tare Weight</th>
                    <th className='p-2 border'>Net Weight</th>
                  </tr>
                </thead>

                {/* ✅ Table Data - Shows Filtered Transactions */}
                <tbody>
                  {transactions
                    .filter(
                      (transaction) =>
                        transaction.receiptNo?.includes(searchQuery) ||
                        transaction.vehicleNo
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map((transaction, i) => (
                      <tr
                        key={i}
                        className='border'>
                        <td className='p-2 border text-center'>
                          {transaction.receiptNumber ? (
                            <span className='text-orange-500 font-semibold'>
                              Draft
                            </span>
                          ) : (
                            <a
                              href={`/receipts/receipt-${transaction.receiptNo}.pdf`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-600 underline'>
                              {transaction.receiptNo}
                            </a>
                          )}
                        </td>
                        <td className='p-2 border text-center'>
                          {transaction.date ||
                            new Date(
                              transaction.timestamp
                            ).toLocaleDateString()}
                        </td>
                        <td className='p-2 border text-center'>
                          {transaction.vehicleNo || transaction.vehicleNumber}
                        </td>
                        <td className='p-2 border text-center'>
                          {transaction.grossWt || 'N/A'}
                        </td>
                        <td className='p-2 border text-center'>
                          {transaction.tareWt || 'N/A'}
                        </td>
                        <td className='p-2 border text-center'>
                          {transaction.netWt || 'N/A'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Load More Button */}
            <button
              onClick={loadMoreRows}
              className='mt-6 w-full px-6 py-3 text-lg font-semibold text-white bg-orange-300 rounded-md shadow-md
  transition-all duration-300 hover:bg-orange-600 hover:shadow-lg active:scale-95 focus:outline-none'>
              Load More
            </button>
          </div>
        </div>

        {/* ✅ Footer Section */}
        <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
          © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All
          rights reserved.
        </footer>
      </div>{' '}
      {/* ✅ Main Content End */}
    </div>
  );
};

export default Dashboard;

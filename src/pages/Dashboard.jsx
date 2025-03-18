import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, PieChart, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  console.log('✅ Dashboard component is rendering!');

  const location = useLocation();

  const generateTransactions = (count, startIndex = 1) => {
    return Array.from({ length: count }, (_, i) => ({
      receiptNo: `${100 + startIndex + i}`,
      date: `0${(i % 9) + 1}/03/2024`,
      vehicleNo: `DL 0${(i % 9) + 1} AB ${1000 + i}`,
      grossWt: `${(18 + (i % 5)) * 1000} kg`,
      tareWt: `${(4 + (i % 3)) * 1000} kg`,
      netWt: `${(14 + (i % 4)) * 1000} kg`,
    }));
  };

  const [employeeData, setEmployeeData] = useState(() => {
    const storedData = localStorage.getItem('dashboardUserData');
    return storedData ? JSON.parse(storedData) : location.state || {};
  });

  console.log('🚀 Dashboard Loaded! Received Data:', employeeData);

  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      localStorage.setItem('dashboardUserData', JSON.stringify(location.state));
      setEmployeeData(location.state);
    }
  }, [location.state]);

  const employeeName = employeeData?.employeeName || 'Unknown User';
  const employeeID = employeeData?.employeeID || '123456';
  const designation = employeeData?.designation || 'Operator';
  const userLat = employeeData?.lat ?? 'Unknown';
  const userLng = employeeData?.lng ?? 'Unknown';
  const employeePhoto =
    employeeData?.employeePhoto || '/assets/default-user.png';

  const [currentTime, setCurrentTime] = useState(new Date());
  const [transactions, setTransactions] = useState(() =>
    generateTransactions(10)
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadMoreRows = () => {
    setTransactions((prev) => [
      ...prev,
      ...generateTransactions(10, prev.length),
    ]);
  };

  return (
    <div className='flex flex-col min-h-screen bg-white font-sans'>
      <div className='flex-grow p-6'>
        {/* ✅ Header */}
        <header className='bg-white shadow-md p-5 rounded-xl flex justify-between items-center'>
          <div>
            <h1 className='text-xl font-semibold text-orange-500'>Dashboard</h1>
            <p className='text-sm text-gray-500'>
              Test Private Limited - 📍 {userLat}, {userLng}
            </p>
            <p className='text-sm text-gray-500'>
              📅 {currentTime.toLocaleString()}
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            <Bell
              size={24}
              className='text-orange-500 cursor-pointer hover:text-gray-800'
            />
            <div className='flex items-center space-x-3'>
              <img
                src={employeePhoto}
                alt='User'
                className='w-12 h-12 rounded-full border border-orange-500 object-cover'
              />
              <div>
                <p className='text-gray-800 font-medium'>{employeeName}</p>
                <p className='text-gray-500 text-sm'>
                  {designation} - {employeeID}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ✅ Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
          {[
            {
              title1: 'Weighbridge (WB) Type',
              value1: 'Pitless since 25/02/2023',
              title2: 'WB Capacity (In Tons)',
              value2: '100',
            },
            {
              title1: 'Vehicles Weighed (MTD No.)',
              value1: '324',
              title2: 'Overwt. Vehicles (MTD No.)',
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
              className='bg-white p-4 rounded-lg shadow-md font-sans'>
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
          {[PieChart, PieChart, BarChart2].map((ChartIcon, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded-xl shadow-md flex flex-col items-center'>
              <ChartIcon className='text-orange-500 text-4xl' />
              <p className='text-center mt-2 text-gray-700'>
                {index === 2 ? 'Bar Graph' : `Pie Chart ${index + 1}`}
              </p>
            </div>
          ))}
        </div>

        {/* ✅ Transactions Table */}
        <div className='mt-6 bg-white p-6 rounded-xl shadow-md'>
          <div className='mb-4 flex justify-between items-center'>
            <h2 className='text-lg font-semibold text-gray-800'>
              Activity Log
            </h2>
            <input
              type='text'
              placeholder='🔍 Receipt / Vehicle No.'
              className='p-2 border border-gray-300 rounded-lg w-64 focus:ring focus:ring-orange-200'
            />
          </div>
          <div className='max-h-64 overflow-y-auto border border-gray-200 rounded-lg'>
            <table className='w-full min-w-max border-collapse'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='p-3 border text-left text-gray-600'>
                    Receipt No.
                  </th>
                  <th className='p-3 border text-left text-gray-600'>Date</th>
                  <th className='p-3 border text-left text-gray-600'>
                    Vehicle Number
                  </th>
                  <th className='p-3 border text-left text-gray-600'>
                    Gross Weight
                  </th>
                  <th className='p-3 border text-left text-gray-600'>
                    Tare Weight
                  </th>
                  <th className='p-3 border text-left text-gray-600'>
                    Net Weight
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, i) => (
                  <tr
                    key={i}
                    className='border hover:bg-gray-100 transition'>
                    <td className='p-3 border text-gray-800'>
                      {transaction.receiptNo}
                    </td>
                    <td className='p-3 border text-gray-600'>
                      {transaction.date}
                    </td>
                    <td className='p-3 border text-gray-800'>
                      {transaction.vehicleNo}
                    </td>
                    <td className='p-3 border text-gray-800'>
                      {transaction.grossWt}
                    </td>
                    <td className='p-3 border text-gray-800'>
                      {transaction.tareWt}
                    </td>
                    <td className='p-3 border text-gray-800'>
                      {transaction.netWt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={loadMoreRows}
            className='mt-6 w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600'>
            Load More
          </button>
        </div>
      </div>
      {/* ✅ Footer */}
      <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};
export default Dashboard;

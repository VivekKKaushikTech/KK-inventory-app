import React, { useState, useEffect } from 'react';
import {
  FaBell,
  FaDownload,
  FaFileExcel,
  FaFilter,
  FaFilePdf,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FileSpreadsheet, FileText, Bell, Download } from 'lucide-react'; // ✅ Import Lucide Icons

const Reports = () => {
  const [employeeData, setEmployeeData] = useState(() => {
    const storedData = localStorage.getItem('dashboardUserData');
    return storedData ? JSON.parse(storedData) : {};
  });

  useEffect(() => {
    const storedData = localStorage.getItem('dashboardUserData');
    if (storedData) {
      setEmployeeData(JSON.parse(storedData));
    }
  }, []);

  // Extract Employee Details dynamically
  const employeeName = employeeData?.employeeName || 'Unknown User';
  const employeeID = employeeData?.employeeID || '123456';
  const designation = employeeData?.designation || 'Operator';
  const userLat = employeeData?.lat ?? 'Unknown';
  const userLng = employeeData?.lng ?? 'Unknown';
  const employeePhoto =
    employeeData?.employeePhoto || '/assets/default-user.png';
  const currentTime = new Date();

  // Date Range Selection State
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Custom Report Fields Selection
  const [selectedFields, setSelectedFields] = useState([]);

  const reportFields = [
    'Receipt Number',
    'Movement Type',
    'In Date',
    'Out Date',
    'In Time',
    'Out Time',
    'Vehicle Number',
    'Vehicle Type',
    'Vehicle Brand',
    'Vehicle Model',
    'Vehicle Tyre',
    'Driver Name',
    'Driver Mobile No.',
    'Material',
    'Transporter',
    'Party',
    'Inv. / Challan No.',
    'Source Gross Wt.',
    'Source Tare Wt.',
    'Source Nett Wt.',
    'First Weight',
    'Second Weight',
    'Net Weight',
    'Remarks',
  ];

  const toggleFieldSelection = (field) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(field)
        ? prevFields.filter((f) => f !== field)
        : [...prevFields, field]
    );
  };

  return (
    <div className='flex flex-col min-h-screen bg-white-100'>
      <div className='flex-grow p-4'>
        {/* Header Section */}
        <header className='bg-white shadow-md p-5 rounded-xl flex justify-between items-center'>
          <div>
            <h1 className='text-xl font-semibold text-orange-500'>Reports</h1>
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

        <div className='flex-grow p-2'>
          {/* Date Range Picker */}
          <div className='bg-white p-6 rounded-xl shadow-md'>
            <h2 className='text-lg font-semibold text-gray-800 mb-3'>
              Select Date Range
            </h2>
            <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4'>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className='border p-2 rounded-lg w-full md:w-48 focus:ring-2 focus:ring-orange-500'
              />
              <span className='text-gray-600'>to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className='border p-2 rounded-lg w-full md:w-48 focus:ring-2 focus:ring-orange-500'
              />
            </div>
          </div>
        </div>

        {/* Predefined Reports Section */}
        <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            'Daily Vehicle Report (DVR)',
            'Deviation Report (DR)',
            'Loss Prevention Report (LPR)',
          ].map((report, i) => (
            <div
              key={i}
              className='bg-white p-5 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition'>
              <p className='text-gray-700 font-medium'>{report}</p>
              <div className='flex space-x-3'>
                <button className='bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600 transition'>
                  <FileSpreadsheet size={20} />
                </button>
                <button className='bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition'>
                  <FileText size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Report Generator */}
        <div className='mt-6 bg-white p-6 rounded-xl shadow-md'>
          <h2 className='text-lg font-semibold text-gray-800 mb-3'>
            Generate Custom Report
          </h2>
          <p className='text-sm text-gray-500'>
            Select the fields you want in your report
          </p>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4'>
            {reportFields.map((field, i) => (
              <label
                key={i}
                className='flex items-center space-x-2 bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition'>
                <input
                  type='checkbox'
                  className='h-4 w-4'
                  checked={selectedFields.includes(field)}
                  onChange={() => toggleFieldSelection(field)}
                />
                <span className='text-sm text-gray-700'>{field}</span>
              </label>
            ))}
          </div>

          <button className='mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-orange-600 transition'>
            <Download className='mr-2' /> Generate & Download Report
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Reports;

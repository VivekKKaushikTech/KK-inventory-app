import BasicInfo from '../components/BasicInfo'; // ✅ Import BasicInfo component
import Header from '../components/Header'; // ✅ Import the Header component
import WeightButtons from '../components/WeightButtons'; // ✅ Import Weight Buttons
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FaUserCircle,
  FaBell,
  FaCarSide,
  FaTruckLoading,
  FaPlus,
  FaMinus,
} from 'react-icons/fa';

const Weighment = () => {
  const navigate = useNavigate();
  const [receiptNumber, setReceiptNumber] = useState(
    localStorage.getItem('receiptNumber') || ''
  );

  const [firstWeightData, setFirstWeightData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [disableFirstWeight, setDisableFirstWeight] = useState(false);
  const dummyFirstWeightData = {
    'Vehicle Number': 'MH-12-AB-1234',
    Material: 'Cement',
    Transporter: 'XYZ Logistics',
    Party: 'ABC Pvt Ltd',
    'First Weight': '40000 Kg',
    'Weighing Time': '4th March 2025, 14:42:20',
  };
  const fetchFirstWeightData = async () => {
    if (!receiptNumber) return; // ✅ Prevents API call with empty value

    try {
      console.log(
        `🔍 Fetching First Weight Data for Receipt: ${receiptNumber}`
      );

      const response = await fetch(`/api/first-weight/${receiptNumber}`);
      if (!response.ok)
        throw new Error(`HTTP Error! Status: ${response.status}`);

      const data = await response.json();
      console.log('✅ First Weight Data:', data);
      setFirstWeightData(data);
    } catch (error) {
      console.error('❌ Error fetching First Weight Data:', error);
      setFirstWeightData(null);
    }
  };

  console.log('✅ Weighment Page Rendering...');

  const validateFieldsRef = useRef(() => true);

  useEffect(() => {
    if (!receiptNumber) return; // ✅ Ensures function runs only when necessary

    fetchFirstWeightData(); // ✅ Calls function without unnecessary arguments
  }, [receiptNumber]); // ✅ Runs whenever `receiptNumber` changes

  // ✅ Function to handle navigation after validation
  const handleNavigation = () => {
    if (
      !validateFieldsRef.current ||
      typeof validateFieldsRef.current !== 'function'
    ) {
      console.error('❌ Validation function is not set yet or is invalid!');
      return;
    }

    console.log('🔍 Running validation...');

    try {
      const isValid = validateFieldsRef.current();
      console.log('✅ Validation result:', isValid);

      if (!isValid) {
        console.error('❌ Validation Failed - Cannot Proceed!');
        return;
      }

      console.log('✅ Validation Passed - Navigating to Vehicle Inspection...');

      // ✅ Retrieve Basic Info data from localStorage before navigation
      const basicInfo = {
        movementType: localStorage.getItem('movementType') || '',
        vehicleNumber: localStorage.getItem('vehicleNumber') || '',
        vehicleType: localStorage.getItem('vehicleType') || '',
        vehicleBrand: localStorage.getItem('vehicleBrand') || '',
        vehicleModel: localStorage.getItem('vehicleModel') || '',
        vehicleTyre: localStorage.getItem('vehicleTyre') || '',
        driverName: localStorage.getItem('driverName') || '',
        driverMobile: localStorage.getItem('driverMobile') || '',
      };

      // ✅ Navigate to Vehicle Inspection Page with Basic Info Data
      navigate('/dashboard/weighment/vehicle-inspection', {
        state: { basicInfo, employeeData },
      });
    } catch (error) {
      console.error('🚨 Error executing validation function:', error);
    }
  };

  const location = useLocation();
  const storedData = localStorage.getItem('dashboardUserData');
  const employeeData =
    location.state || (storedData ? JSON.parse(storedData) : {});

  // ✅ Extract Company Abbreviation (First Letters)
  const companyFullName = 'Test Pvt Ltd'; // Replace this with a dynamic company name if needed
  const companyAbbreviation = companyFullName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase(); // ➝ "TPL"

  // ✅ Format Today's Date in DDMMYY format for consistency
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}${String(
    today.getMonth() + 1
  ).padStart(2, '0')}${today.getFullYear().toString().slice(-2)}`; // Example: "280224"

  // ✅ Get last used serial number from localStorage
  let storedSerial = localStorage.getItem('receiptSerial') || '0000';

  // ✅ Increment serial number (without resetting)
  storedSerial = String(parseInt(storedSerial) + 1).padStart(4, '0'); // ➝ Increases continuously

  // ✅ Save updated serial number in localStorage
  localStorage.setItem('receiptSerial', storedSerial);

  // ✅ Generate Final Receipt Number
  const newReceiptNumber = `KK/TPL/${formattedDate}/${storedSerial}`;
  localStorage.setItem('receiptNumber', newReceiptNumber);

  // ✅ Store the new Receipt Number (if not already set)
  if (!localStorage.getItem('receiptNumber')) {
    localStorage.setItem('receiptNumber', newReceiptNumber);
    localStorage.setItem('receiptSerial', storedSerial);
  }

  // Extract Employee Details
  const employeeName = employeeData?.employeeName || 'Unknown User';
  const employeeID = employeeData?.employeeID || '123456';
  const designation = employeeData?.designation || 'Operator';
  const userLat = employeeData?.lat ?? 'Unknown';
  const userLng = employeeData?.lng ?? 'Unknown';
  const employeePhoto =
    employeeData?.employeePhoto || '/assets/default-user.png';

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('firstWeight'); // Default tab: First Weight
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [activeHistoryTab, setActiveHistoryTab] = useState('vehicle'); // Default history tab
  const [rowCount, setRowCount] = useState(10); // Initial rows count
  const historyTableHeaders = {
    vehicle: [
      'Receipt No.',
      'Date',
      'Driver Name',
      'Material',
      'Transporter',
      'Supplier',
      'Wt. Deviation',
    ],
    driver: [
      'Receipt No.',
      'Date',
      'Vehicle Number',
      'Material',
      'Transporter',
      'Supplier',
      'Wt. Deviation',
    ],
    transporter: [
      'Receipt No.',
      'Date',
      'Driver Name',
      'Vehicle Number',
      'Material',
      'Supplier',
      'Wt. Deviation',
    ],
    supplier: [
      'Receipt No.',
      'Date',
      'Driver Name',
      'Vehicle Number',
      'Material',
      'Transporter',
      'Wt. Deviation',
    ],
  };

  useEffect(() => {
    // ✅ Clear all transaction-related fields when initiating a new transaction
    const resetFields = [
      'movementType',
      'vehicleNumber',
      'vehicleType',
      'vehicleBrand',
      'vehicleModel',
      'vehicleTyre',
      'driverName',
      'driverMobile',
      'receiptNumber',
    ];

    resetFields.forEach((field) => localStorage.removeItem(field));

    // ✅ Generate new receipt number
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}${String(
      today.getMonth() + 1
    ).padStart(2, '0')}${today.getFullYear().toString().slice(-2)}`;

    let storedSerial = localStorage.getItem('receiptSerial') || '0000';
    storedSerial = String(parseInt(storedSerial) + 1).padStart(4, '0');
    localStorage.setItem('receiptSerial', storedSerial);

    const newReceiptNumber = `KK/TPL/${formattedDate}/${storedSerial}`;
    localStorage.setItem('receiptNumber', newReceiptNumber);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // ✅ Cleanup on unmount
  }, []);
  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <div className='flex-grow p-4'>
        {/* ✅ Main Content */}
        <div className='flex-1 p-4'>
          {/* ✅ Header Section */}
          <Header title='Weigh the Vehicle' />

          {/* ✅ First & Second Weight Buttons (Reusable Component) */}
          <WeightButtons
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            disableFirstWeight={disableFirstWeight} // ✅ Pass disableFirstWeight
            disableSecondWeight={false} // ✅ Ensure second weight works as expected
          />

          {/* ✅ First Weight Content */}
          {activeTab === 'firstWeight' && (
            <>
              {/* ✅ Basic Info Component with Validation Hook */}
              <BasicInfo
                setValidateFunction={(func) => {
                  if (typeof func === 'function') {
                    console.log('✅ Validation function set!');
                    validateFieldsRef.current = func;
                  } else {
                    console.error('❌ Invalid validation function received!');
                  }
                }}
              />

              {/* ✅ History Tabs */}
              <h2 className='text-xl font-semibold text-orange-600 mb-4 mt-4'>
                History
              </h2>
              <div className='mt-4 flex flex-wrap justify-center gap-4'>
                {['vehicle', 'driver', 'transporter', 'supplier'].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-2 rounded-lg px-6 text-base font-medium rounded-md transition-all duration-300 shadow-md ${
                      activeHistoryTab === tab
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-white'
                    }`}
                    onClick={() => setActiveHistoryTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* ✅ Scrollable Table Container */}
              <div className='mt-4 overflow-x-auto'>
                <div className='max-h-64 overflow-y-auto border border-gray-300 rounded-lg'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='bg-gray-100'>
                        {historyTableHeaders[activeHistoryTab].map(
                          (header, index) => (
                            <th
                              key={index}
                              className='p-2 border'>
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {[...Array(rowCount)].map((_, i) => (
                        <tr
                          key={i}
                          className='border'>
                          {historyTableHeaders[activeHistoryTab].map(
                            (header, index) => (
                              <td
                                key={index}
                                className='p-2 border text-center'>
                                {index === 0 ? ( // Making Receipt No. clickable
                                  <a
                                    href={`/receipts/receipt-${i + 1}.pdf`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 underline'>
                                    #000{i + 1}
                                  </a>
                                ) : (
                                  `Sample ${header}`
                                )}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ✅ Load More Button */}
                <button
                  onClick={() => setRowCount(rowCount + 10)}
                  className='mt-6 w-full px-6 py-3 text-lg font-semibold text-white bg-orange-300 rounded-md shadow-md
  transition-all duration-300 hover:bg-orange-600 hover:shadow-lg active:scale-95 focus:outline-none'>
                  Load More
                </button>
              </div>

              {/* ✅ Commence Vehicle Inspection Button with Validation */}
              <button
                className='mt-6 w-full px-6 py-3 text-lg font-semibold text-white bg-orange-500 rounded-md shadow-md
  transition-all duration-300 hover:bg-orange-600 hover:shadow-lg active:scale-95 focus:outline-none'
                onClick={handleNavigation} // ✅ Call function to validate before navigation
              >
                Commence Vehicle Inspection
              </button>
            </>
          )}

          {/* ✅ Second Weight Content */}

          {activeTab === 'secondWeight' && (
            <>
              {/* ✅ Receipt Number Input */}
              <div className='mt-4 bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-4'>
                <span className='text-gray-600 font-medium whitespace-nowrap'>
                  Receipt Number:
                </span>
                <input
                  type='text'
                  className='flex-1 p-3 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-orange-400 outline-none'
                  placeholder='Enter Receipt Number'
                  value={receiptNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReceiptNumber(value);

                    if (value === 'KK/TPL/123456') {
                      setDisableFirstWeight(true); // ✅ Disable first weight tab
                      setFirstWeightData(dummyFirstWeightData); // ✅ Show dummy data
                    }
                  }}
                  onBlur={() => {
                    if (receiptNumber !== 'KK/TPL/123456') {
                      fetchFirstWeightData(); // ✅ Fetch actual data from backend on blur
                    }
                  }}
                />
              </div>

              {/* ✅ First Weight Data (Collapsible Section) */}
              {receiptNumber === 'KK/TPL/123456' && firstWeightData && (
                <div className='mt-6 bg-white p-5 rounded-xl shadow-md border border-gray-200'>
                  <div
                    className='flex justify-between items-center cursor-pointer'
                    onClick={() => setIsExpanded(!isExpanded)}>
                    <h2 className='text-xl font-semibold text-orange-600'>
                      Basic Info
                    </h2>
                    <button className='text-orange-600 transition-transform duration-300'>
                      {isExpanded ? (
                        <FaMinus size={18} />
                      ) : (
                        <FaPlus size={18} />
                      )}
                    </button>
                  </div>

                  {/* ✅ Show Dummy Data for Now (Replace with API Response Later) */}
                  {isExpanded && (
                    <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {Object.keys(firstWeightData).length > 0 ? (
                        Object.keys(firstWeightData).map((key) => (
                          <div
                            key={key}
                            className='flex flex-col'>
                            <label className='text-gray-600 font-medium mb-1'>
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())
                                .trim()}
                            </label>
                            <input
                              type='text'
                              className='w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800 font-semibold outline-none'
                              value={firstWeightData[key] || 'Not Available'}
                              readOnly
                            />
                          </div>
                        ))
                      ) : (
                        <p className='text-gray-500 text-center col-span-full'>
                          No First Weight Data Found
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>{' '}
      {/* ✅ Main Content End */}
      {/* ✅ Footer Section */}
      <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Weighment;

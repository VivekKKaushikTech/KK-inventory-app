import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import Header from '../components/Header';
import WeightButtons from '../components/WeightButtons';

const VehicleWeighing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Retrieve stored employee data or fallback to localStorage
  const storedData = localStorage.getItem('dashboardUserData');
  const employeeData =
    location.state?.employeeData || (storedData ? JSON.parse(storedData) : {});

  // ✅ Extracting Data from Navigation State
  const receiptNumber =
    location.state?.receiptNumber ||
    localStorage.getItem('receiptNumber') ||
    'Not Generated';

  // ✅ Extracting Passed Data from Weighment Page
  const { basicInfo = {} } = location.state || {};

  // ✅ Maintain active tab state (First Weight / Second Weight)
  const [activeTab, setActiveTab] = useState('firstWeight');

  // ✅ Maintain state for collapsible Basic Info section
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // ✅ Redirect to "Vehicle Inspection" if data is missing
    if (!location.state || !location.state.receiptNumber) {
      navigate('/dashboard/weighment/vehicle-inspection', {
        state: { receiptNumber, basicInfo, employeeData },
      });
    }
  }, [receiptNumber, navigate, basicInfo, employeeData, location.state]);

  return (
    <div className='min-h-screen bg-white'>
      {/* ✅ Header */}
      <Header title='Vehicle Weighing' />

      {/* 🔙 Modern Back Button */}
      <div className='flex items-center mt-4 px-0'>
        <button
          onClick={() => navigate('/dashboard/weighment/vehicle-inspection')}
          className='flex items-center gap-2 text-gray-700 bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-all'>
          <FaArrowLeft className='text-gray-600' />
          <span className='font-medium'>Back to Vehicle Inspection</span>
        </button>
      </div>

      {/* ✅ Weight Buttons (Persisting State) */}
      <div className='mt-4'>
        <WeightButtons
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          disableSecondWeight={false}
        />
      </div>

      {/* ✅ Receipt Number Field */}
      <div className='mt-4 flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-md'>
        <span className='text-gray-600 font-medium'>Receipt Number:</span>
        <div className='px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-semibold shadow-sm'>
          {receiptNumber}
        </div>
      </div>

      {/* ✅ Collapsible Basic Info Section (Fixed `isExpanded` Issue) */}
      <div className='mt-6 bg-white p-5 rounded-xl shadow-md border border-gray-200'>
        <div
          className='flex justify-between items-center cursor-pointer'
          onClick={() => setIsExpanded(!isExpanded)}>
          <h2 className='text-xl font-semibold text-orange-600'>Basic Info</h2>
          <button className='text-orange-600 transition-transform duration-300'>
            {isExpanded ? <FaMinus size={18} /> : <FaPlus size={18} />}
          </button>
        </div>

        {/* ✅ Show Data When Expanded */}
        {isExpanded && (
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Object.keys(basicInfo).length > 0 ? (
              Object.keys(basicInfo).map((key) => (
                <div
                  key={key}
                  className='flex flex-col'>
                  <label className='text-gray-600 font-medium mb-1'>
                    {key
                      .replace(/([A-Z])/g, ' $1') // Add spaces before uppercase letters
                      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
                      .trim()}
                  </label>
                  <input
                    type='text'
                    className='w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-orange-400 outline-none'
                    value={basicInfo[key] || 'Not Provided'}
                    readOnly
                  />
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-center col-span-full'>
                No Basic Info Available
              </p>
            )}
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <footer className='w-full text-center py-4 bg-gray-100 text-gray-600 text-sm mt-6'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default VehicleWeighing;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AttendanceConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log('📍 Location Name received:', location.state?.locationName);

  // ✅ Extract Data from Navigation State
  const employeeName = location.state?.userName || 'Unknown User';
  const employeeID = location.state?.employeeID || '123456'; // Replace with actual employee ID
  const designation = location.state?.designation || 'Operator'; // Replace with actual designation
  const attendanceTime = new Date().toLocaleString(); // Capture current timestamp
  const userLat = location.state?.lat ?? 'Unknown'; // Replace with actual latitude
  const userLng = location.state?.lng ?? 'Unknown'; // Replace with actual longitude
  const employeePhoto = location.state?.photo || '/assets/default-user.png'; // Default image if no photo

  // ✅ Loading State to Prevent Flickering
  const [imageLoaded, setImageLoaded] = useState(false);

  const isShiftEnd = location.state?.shiftEnd || false;

  useEffect(() => {
    if (employeePhoto) {
      setImageLoaded(true);
    }
  }, [employeePhoto]);

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-white to-white'>
      {/* Main Content */}
      <div className='flex-grow flex flex-col items-center justify-center px-4 py-12'>
        {/* Logo */}
        <img
          src='/assets/kanta-king-logo.svg'
          alt='Kanta King Logo'
          className='h-20 mb-6 drop-shadow-md'
        />

        {/* Selfie Frame */}
        <div className='w-36 h-36 rounded-full border-4 border-orange-500 overflow-hidden mb-6 shadow-lg ring-2 ring-orange-200'>
          {imageLoaded ? (
            <img
              src={employeePhoto}
              alt={employeeName}
              className='w-full h-full object-cover'
              onError={(e) => {
                e.target.src = '/assets/default-user.png';
              }}
            />
          ) : (
            <div className='flex items-center justify-center h-full text-gray-500 text-sm'>
              Loading...
            </div>
          )}
        </div>

        {/* Confirmation Message */}
        <h2 className='text-2xl font-bold text-center text-orange-600 mb-2'>
          {isShiftEnd ? '✅ Shift Ended' : '✅ Verified Successfully'}
        </h2>
        <p className='text-gray-700 text-center text-lg font-medium mb-6'>
          Welcome, {employeeName}!
        </p>

        {/* Details Card */}
        <div
          className='w-full max-w-sm p-6 text-sm text-gray-800 space-y-3
  bg-white/90 backdrop-blur-xl 
  rounded-2xl border border-white/30 
  shadow-[0_12px_32px_rgba(255,101,0,0.2)] 
  ring-1 ring-orange-100 hover:shadow-[0_16px_40px_rgba(255,101,0,0.25)]
  transition-all duration-300'>
          <p>
            <strong>👤 Employee ID:</strong> {employeeID}
          </p>
          <p>
            <strong>🧰 Designation:</strong> {designation}
          </p>
          <p>
            <strong>🕒 Date & Time:</strong> {attendanceTime}
          </p>
          <p>
            <strong>📍 Location:</strong>{' '}
            {location.state?.locationName || `${userLat}, ${userLng}`}
          </p>
        </div>

        {/* Button */}
        <button
          className='mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600'
          onClick={() => {
            navigate('/dashboard', {
              state: {
                userName: employeeName,
                lat: userLat,
                lng: userLng,
                locationName:
                  location.state?.locationName || `${userLat}, ${userLng}`,
                employeeID: employeeID,
                designation: designation,
                photo: employeePhoto,
              },
            });
          }}>
          🚀 Start the Inventory
        </button>
      </div>

      {/* Footer */}
      <footer
        className='w-full text-center py-4 px-6 mt-6 
  bg-white/60 backdrop-blur-md 
  border-t border-orange-100 
  shadow-[0_-2px_10px_rgba(0,0,0,0.05)] 
  text-sm text-gray-600 font-medium tracking-wide'>
        © {new Date().getFullYear()} Crafted with{' '}
        <span className='text-red-500'>❤</span> by Kanta King Technologies Pvt
        Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default AttendanceConfirmation;

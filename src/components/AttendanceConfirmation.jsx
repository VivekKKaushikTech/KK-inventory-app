import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AttendanceConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (employeePhoto) {
      setImageLoaded(true);
    }
  }, [employeePhoto]);

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      {/* Main Content */}
      <div className='flex-grow flex flex-col items-center justify-center py-12 px-4'>
        {/* Kanta King Logo - Top Center */}
        <img
          src='/assets/kanta-king-logo.svg'
          alt='Kanta King Logo'
          className='h-17 mb-6'
        />

        {/* Employee Selfie in Circle (Fixed Image Issue) */}
        <div className='w-32 h-32 rounded-full border-4 border-orange-500 overflow-hidden mb-4'>
          {imageLoaded ? (
            <img
              src={employeePhoto}
              alt={employeeName}
              className='w-full h-full object-cover'
              onError={(e) => {
                e.target.src = '/assets/default-user.png';
              }} // ✅ Fallback Image
            />
          ) : (
            <p className='text-gray-500 flex items-center justify-center h-full'>
              Loading...
            </p>
          )}
        </div>

        {/* Confirmation Text */}
        <h2 className='text-xl font-bold text-black text-center'>
          ✅ Attendance Marked Successfully,{' '}
          <span className='text-black'>{employeeName}</span>!
        </h2>

        {/* Employee Details */}
        <div className='bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-sm text-center mt-4'>
          <p className='text-gray-700'>
            <strong>Employee ID:</strong> {employeeID}
          </p>
          <p className='text-gray-700'>
            <strong>Designation:</strong> {designation}
          </p>
          <p className='text-gray-700'>
            <strong>Date & Time:</strong> {attendanceTime}
          </p>
          <p className='text-gray-700'>
            <strong>Location:</strong> {userLat}, {userLng}
          </p>
        </div>

        {/* Start Shift Button */}
        <button
          className='mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600'
          onClick={() => {
            console.log('✅ Navigating to QR Code Scan with:', {
              userName: employeeName,
              lat: userLat,
              lng: userLng,
              employeeID: employeeID,
              designation: designation,
              photo: employeePhoto,
            });
            navigate('/qr-code-scan', {
              state: {
                userName: employeeName,
                lat: userLat,
                lng: userLng,
                employeeID: employeeID,
                designation: designation,
                photo: employeePhoto,
              },
            });
          }}>
          Start Your Shift
        </button>
      </div>

      {/* Footer */}
      <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default AttendanceConfirmation;

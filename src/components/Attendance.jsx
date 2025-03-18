import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Attendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || 'User';
  const userMobile = location.state?.userMobile || null;
  console.log('🟢 Debug: Received userMobile →', userMobile);

  // 📌 Mock Data: Pre-assigned Shift Time & Location
  const userShiftData = {
    8860652067: { shiftStart: '01:00', lat: 28.422537, lng: 77.03268 }, // Gurgaon
    9650505555: { shiftStart: '10:00', lat: 19.076, lng: 72.8777 }, // Mumbai
    9650514444: { shiftStart: '01:00', lat: 28.423, lng: 77.031 }, // Gurgaon
  };

  const assignedShift = userMobile ? userShiftData[userMobile] : null;

  // ✅ State for Error Messages & Late Attendance Pop-up
  const [error, setError] = useState({ shift: '', location: '' });
  const [showLatePopup, setShowLatePopup] = useState(false);
  const [lateReason, setLateReason] = useState('');

  const validateAttendance = () => {
    console.log('⏳ Validating Attendance...');

    let errors = { shift: '', location: '' };

    if (!userMobile || !userShiftData[userMobile]) {
      console.log('❌ Shift data not found for this user!');
      errors.shift = '❌ Shift data not found for this user!';
      setError(errors);
      return;
    }

    const assignedShift = userShiftData[userMobile];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [shiftHours, shiftMinutes] = assignedShift.shiftStart
      .split(':')
      .map(Number);
    const shiftStartTime = shiftHours * 60 + shiftMinutes;

    console.log('🕒 Current Time (Minutes):', currentTime);
    console.log('⌛ Shift Start Time (Minutes):', shiftStartTime);

    // ✅ Check Shift Timing
    if (currentTime < shiftStartTime) {
      console.log('🚫 Shift has not started yet.');
      errors.shift = '❌ Sorry! Your shift has not started yet.';
      setError(errors);
      return;
    }

    // ✅ Check Location
    if (!navigator.geolocation) {
      console.log('🚫 Geolocation not supported.');
      errors.location = '❌ Geolocation is not supported by this browser.';
      setError(errors);
      return;
    }

    console.log("📡 Fetching User's Location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        console.log("📌 User's Location:", userLat, userLng);
        console.log(
          '📌 Assigned Location:',
          assignedShift.lat,
          assignedShift.lng
        );

        const distance = getDistance(
          userLat,
          userLng,
          assignedShift.lat,
          assignedShift.lng
        );
        console.log('📏 Distance from Assigned Location:', distance, 'km');

        if (distance > 0.5) {
          console.log('🚫 User is outside the assigned location.');
          errors.location = '❌ Sorry! You are not at your assigned location.';
          setError(errors);
          return;
        }

        // ✅ If user is 15+ minutes late, show pop-up
        if (currentTime > shiftStartTime + 15) {
          console.log('🚨 User is late! Showing pop-up...');
          setShowLatePopup(true);
          return;
        }

        setError(errors);

        // ✅ If no errors, mark attendance and navigate
        if (!errors.shift && !errors.location) {
          console.log('✅ Attendance Marked Successfully! Redirecting...');
          setTimeout(() => {
            navigate('/face-scan', {
              state: { userName, userMobile, userLat, userLng },
            });
          }, 1000);
        }
      },
      () => {
        console.log('🚫 Unable to fetch location.');
        errors.location = '❌ Unable to fetch location. Please enable GPS.';
        setError(errors);
      }
    );
  };

  // ✅ Function to calculate distance between two coordinates
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <div className='flex-grow flex flex-col md:flex-row items-center justify-center py-12 px-4 md:gap-20'>
        <div className='hidden md:block w-1/2'>
          <img
            src='/assets/get-started.svg'
            alt='Get Started'
            className='max-w-[80%]'
          />
        </div>

        <div className='w-full md:w-1/3 bg-white p-10 shadow-md rounded-lg'>
          <img
            src='/assets/kanta-king-logo.svg'
            alt='Kanta King Logo'
            className='h-25 mx-auto mb-8'
          />

          <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>
            Namaskaar, {userName}!
          </h1>
          <p className='text-gray-600 text-center mb-6'>
            It’s time to mark your attendance. Click the button below to
            register your attendance for the day.
          </p>

          <button
            onClick={validateAttendance}
            className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600'>
            Mark Your Attendance
          </button>

          {error.shift && (
            <p className='text-red-500 text-sm mt-2'>{error.shift}</p>
          )}
          {error.location && (
            <p className='text-red-500 text-sm mt-2'>{error.location}</p>
          )}
        </div>
      </div>

      {/* ✅ Late Attendance Pop-Up Modal ✅ */}
      {showLatePopup && (
        <div className='fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96 text-center'>
            <img
              src='/assets/oh.svg'
              alt='Oh!'
              className='mx-auto max-h-20 mb-3'
            />
            <h2 className='text-red-600 font-bold text-xl'>Uh Oh!</h2>
            <p className='text-gray-600 mt-2'>
              You are late today. May we know the reason, please?
            </p>
            <textarea
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mt-3'
              placeholder='Type your reason here...'
              value={lateReason}
              onChange={(e) => setLateReason(e.target.value)}></textarea>
            <button
              className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mt-4'
              onClick={() => navigate('/face-scan', { state: { userName } })}>
              Submit
            </button>
          </div>
        </div>
      )}

      <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Attendance;

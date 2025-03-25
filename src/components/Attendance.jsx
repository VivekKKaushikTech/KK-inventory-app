import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const locationNames = {
  '28.422537,77.03268': "Vivek's Home",
  '28.4238432,77.0474929': "Vivek's Class",
  '19.076,72.8777': 'Mumbai Office',
  '28.423,77.031': 'Gurgaon Office',
};

const shiftDataRaw = localStorage.getItem('dashboardUserShiftData');
const userShiftData = shiftDataRaw ? JSON.parse(shiftDataRaw) : {};

const Attendance = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const storedData = localStorage.getItem('dashboardUserData');
  const fallbackData = storedData ? JSON.parse(storedData) : {};

  const userName =
    location.state?.userName || fallbackData.employeeName || 'User';
  const userMobile =
    location.state?.userMobile ||
    fallbackData.employeeMobile ||
    Object.keys(userShiftData)[0];
  const isShiftEnd = location.state?.shiftEnd || false;

  console.log('🧠 Fallback Data:', fallbackData);
  console.log('🟢 userMobile →', userMobile);
  console.log('🟡 isShiftEnd flag:', isShiftEnd);

  const assignedShift = userMobile ? userShiftData[String(userMobile)] : null;

  const [error, setError] = useState({ shift: '', location: '' });
  const [showDeviationPopup, setShowDeviationPopup] = useState(false);
  const [deviationReason, setDeviationReason] = useState('');
  const [deviationType, setDeviationType] = useState(''); // 'early' or 'late'

  const validateAttendance = () => {
    console.log('⏳ Validating Attendance...');
    let errors = { shift: '', location: '' };

    if (!userMobile || !assignedShift) {
      errors.shift = '❌ Shift data not found for this user!';
      setError(errors);
      return;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [shiftHours, shiftMinutes] = assignedShift.shiftStart
      .split(':')
      .map(Number);
    const shiftStartTime = shiftHours * 60 + shiftMinutes;
    const shiftEndTime = shiftStartTime + 8 * 60; // Assuming 8-hour shift

    if (!isShiftEnd && currentTime < shiftStartTime) {
      errors.shift = '❌ Sorry! Your shift has not started yet.';
      setError(errors);
      return;
    }

    // Check for early or late logout
    if (isShiftEnd) {
      const allowedEarly = shiftEndTime - 15;
      const allowedLate = shiftEndTime + 15;

      if (currentTime < allowedEarly) {
        setDeviationType('early');
        setShowDeviationPopup(true);
        return;
      }

      if (currentTime > allowedLate) {
        setDeviationType('late');
        setShowDeviationPopup(true);
        return;
      }
    }

    if (!navigator.geolocation) {
      errors.location = '❌ Geolocation is not supported by this browser.';
      setError(errors);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const distance = getDistance(
          userLat,
          userLng,
          assignedShift.lat,
          assignedShift.lng
        );
        const assignedLocationKey = `${assignedShift.lat},${assignedShift.lng}`;
        const locationName =
          locationNames[assignedLocationKey] || 'Unknown Location';

        if (distance > 0.5) {
          errors.location = '❌ Sorry! You are not at your assigned location.';
          setError(errors);
          return;
        }

        if (!isShiftEnd && currentTime > shiftStartTime + 15) {
          console.log('🚨 Late Login Detected!');
          setDeviationType('lateLogin');
          setShowDeviationPopup(true);
          return;
        }

        // ✅ If all is well, proceed
        setError({});
        navigate('/face-scan', {
          state: {
            userName,
            userMobile,
            userLat,
            userLng,
            locationName,
            shiftEnd: isShiftEnd,
          },
        });
      },
      () => {
        errors.location = '❌ Unable to fetch location. Please enable GPS.';
        setError(errors);
      }
    );
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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
            {isShiftEnd
              ? 'Please mark the end of your shift before logging out.'
              : 'It’s time to mark your attendance. Click the button below to register your attendance for the day.'}
          </p>
          <button
            onClick={validateAttendance}
            className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600'>
            {isShiftEnd ? 'Mark Shift End' : 'Mark Your Attendance'}
          </button>

          {error.shift && (
            <p className='text-red-500 text-sm mt-2'>{error.shift}</p>
          )}
          {error.location && (
            <p className='text-red-500 text-sm mt-2'>{error.location}</p>
          )}
        </div>
      </div>

      {/* 🟠 Early/Late Logout Reason Modal */}
      {showDeviationPopup && (
        <div className='fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96 text-center'>
            <img
              src='/assets/oh.svg'
              alt='Oh!'
              className='mx-auto max-h-20 mb-3'
            />
            <h2 className='text-red-600 font-bold text-xl'>
              {deviationType === 'early'
                ? 'Early Logout'
                : deviationType === 'late'
                ? 'Late Logout'
                : 'Late Login'}
            </h2>
            <p className='text-gray-600 mt-2'>
              {deviationType === 'early'
                ? 'You are trying to log out early. Please share the reason below:'
                : deviationType === 'late'
                ? 'You are logging out late. Please share the reason below:'
                : 'You are late today. May we know the reason, please?'}
            </p>
            <textarea
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mt-3'
              placeholder='Type your reason here...'
              value={deviationReason}
              onChange={(e) => setDeviationReason(e.target.value)}
            />

            <button
              className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mt-4'
              onClick={() =>
                navigate('/face-scan', {
                  state: {
                    userName,
                    userMobile,
                    userLat: assignedShift.lat,
                    userLng: assignedShift.lng,
                    locationName:
                      locationNames[
                        `${assignedShift.lat},${assignedShift.lng}`
                      ] || 'Unknown Location',
                    shiftEnd: isShiftEnd,
                    deviationType,
                    deviationReason,
                  },
                })
              }>
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

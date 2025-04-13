import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const locationNames = {
  '28.422537,77.03268': "Vivek's Home",
  '28.4238432,77.0474929': "Vivek's Class",
  '19.076,72.8777': 'Mumbai Office',
  '28.423,77.031': 'Gurgaon Office',
  '28.6109361,77.5959684': 'Test Location',
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
            src='/assets/kuchnaya.svg'
            alt='Get Started'
            className='max-w-[80%]'
          />
        </div>

        <div className='w-full md:w-1/3 p-10 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(255,101,0,0.2)] ring-1 ring-orange-100 hover:shadow-[0_25px_60px_rgba(255,101,0,0.3)] transition-all duration-300'>
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
              : 'It’s time to verify your identity. Click the button below to verify your identity.'}
          </p>
          <button
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
                  deviationType: null,
                  deviationReason: null,
                },
              })
            }
            className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600'>
            {isShiftEnd ? 'Mark Shift End' : 'Verify Your Identity'}
          </button>

          {error.shift && (
            <p className='text-red-500 text-sm mt-2'>{error.shift}</p>
          )}
          {error.location && (
            <p className='text-red-500 text-sm mt-2'>{error.location}</p>
          )}
        </div>
      </div>

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
export default Attendance;

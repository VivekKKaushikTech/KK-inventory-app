import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react'; // ✅ Import Lucide Icons

const Header = ({ title }) => {
  const location = useLocation();
  const storedData = localStorage.getItem('dashboardUserData');
  const employeeData =
    location.state?.employeeData || (storedData ? JSON.parse(storedData) : {});

  // Extract Employee Details
  const employeeName = employeeData?.employeeName || 'Unknown User';
  const employeeID = employeeData?.employeeID || '123456';
  const designation = employeeData?.designation || 'Operator';
  const userLat = employeeData?.lat ?? 'Unknown';
  const userLng = employeeData?.lng ?? 'Unknown';
  const employeePhoto =
    employeeData?.employeePhoto || '/assets/default-user.png';

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className='bg-white shadow-md p-4 flex justify-between items-center'>
      <div>
        <h1 className='text-xl text-orange-500 font-bold'>{title}</h1>
        <p className='text-sm text-gray-600'>
          Test Private Limited - 📍Location: {userLat}, {userLng}
        </p>
        <p className='text-sm text-gray-600'>
          Date & Time: {currentTime.toLocaleString()}
        </p>
      </div>
      <div className='flex items-center space-x-4'>
        <Bell
          size={22}
          className='text-orange-500 text-xl cursor-pointer'
        />
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
  );
};

export default Header;

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
    <header className='bg-white shadow-md p-5 rounded-xl flex justify-between items-center'>
      <div>
        <h1 className='text-xl font-semibold text-orange-500'>
          Live Monitoring
        </h1>
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
  );
};

export default Header;

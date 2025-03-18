import VehicleWeighing from './pages/VehicleWeighing'; // ✅ Ensure correct path
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from 'react-router-dom'; // ✅ Import BrowserRouter
import './styles/tailwind.css';

// ✅ Import Components
import Attendance from './components/Attendance';
import FaceScan from './components/FaceScan';
import AttendanceConfirmation from './components/AttendanceConfirmation';
import QRCodeScan from './components/QRCodeScan';
import ShiftHandover from './components/ShiftHandover';

// ✅ Import Dashboard Pages
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Weighment from './pages/Weighment';
import Reports from './pages/Reports';
import LiveMonitoring from './pages/LiveMonitoring';
import Transactions from './pages/Transactions';
import UserManagement from './pages/UserManagement';

import VehicleInspection from './pages/VehicleInspection'; // ✅ Ensure correct path

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ mobile: '', password: '' });
  const [buttonText, setButtonText] = useState('Log In');
  const navigate = useNavigate();

  const userData = {
    8860652067: 'Weigh रक्षक',
    9650505555: 'Mohit',
    9650514444: 'Vishisht',
  };
  const correctPassword = '123456';
  const registeredNumbers = Object.keys(userData);

  const validateCredentials = () => {
    let errorsObject = { mobile: '', password: '' };

    if (!mobile.trim()) {
      errorsObject.mobile = 'Please enter mobile number';
    } else if (!registeredNumbers.includes(mobile)) {
      errorsObject.mobile = 'Mobile number not registered';
    }

    if (!password.trim()) {
      errorsObject.password = 'Please enter password';
    } else if (!errorsObject.mobile && password !== correctPassword) {
      errorsObject.password = 'Wrong Password';
    }

    setError(errorsObject);

    if (!errorsObject.mobile && !errorsObject.password) {
      setButtonText('Logging in...');
      setTimeout(() => {
        setButtonText('Log In');
        navigate('/attendance', {
          state: { userName: userData[mobile], userMobile: mobile },
        }); // ✅ Correct navigation
      }, 1500);
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <div className='flex-grow flex flex-col md:flex-row items-center justify-center py-12 px-4 md:gap-20'>
        <div className='hidden md:block w-1/2 justify-center'>
          <img
            src='/assets/truck-image.svg'
            alt='Truck Design'
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
            Welcome to Kanta King’s Weighbridge App
          </h1>
          <p className='text-gray-600 text-left mb-3'>Enter Mobile Number</p>
          <input
            type='tel'
            placeholder='Mobile Number'
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setError((prev) => ({ ...prev, mobile: '' }));
            }}
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none'
          />
          {error.mobile && (
            <p className='text-red-500 text-sm mt-2'>{error.mobile}</p>
          )}
          <p className='text-gray-600 text-left mt-4'>Enter Password</p>
          <input
            type='password'
            placeholder='Enter 6-digit password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError((prev) => ({ ...prev, password: '' }));
            }}
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mt-2'
          />
          {error.password && (
            <p className='text-red-500 text-sm mt-2'>{error.password}</p>
          )}
          <button
            onClick={validateCredentials}
            className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mt-4'>
            {buttonText}
          </button>
        </div>
      </div>
      <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

// ✅ Dashboard Layout (No Nested <Routes> Here)
const DashboardLayout = () => (
  <div className='flex min-h-screen'>
    <Sidebar /> {/* ✅ Sidebar Stays Fixed */}
    <div className='flex-grow p-6'>
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      {/* ✅ Authentication Routes */}
      <Route
        path='/'
        element={<Login />}
      />
      <Route
        path='/attendance'
        element={<Attendance />}
      />
      <Route
        path='/face-scan'
        element={<FaceScan />}
      />
      <Route
        path='/attendance-confirmation'
        element={<AttendanceConfirmation />}
      />
      <Route
        path='/qr-code-scan'
        element={<QRCodeScan />}
      />
      <Route
        path='/shift-handover'
        element={<ShiftHandover />}
      />

      {/* ✅ Dashboard Layout with Sidebar */}
      <Route
        path='/dashboard/*'
        element={<DashboardLayout />}>
        <Route
          index
          element={<Dashboard />}
        />

        {/* ✅ Keep Weighment as a separate page */}
        <Route
          path='weighment'
          element={<Weighment />}
        />

        {/* ✅ Define Vehicle Inspection as a separate page */}
        <Route
          path='weighment/vehicle-inspection'
          element={<VehicleInspection />}
        />

        <Route
          path='reports'
          element={<Reports />}
        />
        <Route
          path='live-monitoring'
          element={<LiveMonitoring />}
        />
        <Route
          path='transactions'
          element={<Transactions />}
        />
        <Route
          path='user-management'
          element={<UserManagement />}
        />
        <Route
          path='weighment/vehicle-weighing'
          element={<VehicleWeighing />}
        />
      </Route>
    </Routes>
  );
};

export default App;

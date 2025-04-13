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
import { LogIn, Phone, Lock, PackageCheck } from 'lucide-react';

// ✅ Import Components
import Attendance from './components/Attendance';
import FaceScan from './components/FaceScan';
import AttendanceConfirmation from './components/AttendanceConfirmation';
import QRCodeScan from './components/QRCodeScan';
import ShiftHandover from './components/ShiftHandover';

// ✅ Import Dashboard Pages
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddItem from './pages/AddItem';
import MoveItem from './pages/MoveItem';
import ActivityLog from './pages/ActivityLog';
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

        // ✅ Store the userData in localStorage
        localStorage.setItem(
          'dashboardUserData',
          JSON.stringify({
            employeeName: userData[mobile],
            employeeMobile: mobile.trim(), // ✅ Store this!
            employeeID: '123456',
            designation: 'Operator',
            lat: 28.422537,
            lng: 77.03268,
            employeePhoto: '/assets/default-user.png',
            locationName: "Vivek's Home",
          })
        );

        localStorage.setItem(
          'dashboardUserShiftData',
          JSON.stringify({
            8860652067: { shiftStart: '01:00', lat: 28.422537, lng: 77.03268 },
            9650505555: { shiftStart: '10:00', lat: 19.076, lng: 72.8777 },
            9650514444: { shiftStart: '01:00', lat: 28.423, lng: 77.031 },
          })
        );

        navigate('/attendance', {
          state: {
            userName: userData[mobile],
            userMobile: mobile,
          },
        });
      }, 1500);
    }
  };

  return (
    <div
      className='min-h-screen flex flex-col justify-between bg-cover bg-center'
      style={{ backgroundImage: "url('/assets/background.svg')" }}>
      <div className='flex flex-grow items-center justify-center px-4'>
        <div className='w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-10 ring-1 ring-orange-100 shadow-[0_15px_30px_rgba(255,101,0,0.25)] transition-all duration-300'>
          <img
            src='/assets/kanta-king-logo.svg'
            alt='Kanta King Logo'
            className='h-20 mx-auto mb-8'
          />
          <h1 className='text-3xl font-extrabold text-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-transparent bg-clip-text drop-shadow-md mb-4'>
            Welcome to Kanta King’s Inventory App
          </h1>
          <img
            src='/assets/yatharth.svg'
            alt='यथार्थ Logo'
            className='mx-auto h-12 sm:h-14 md:h-16 mb-6'
          />

          {/* Mobile Number */}
          <div className='mt-4'>
            <label className='text-gray-600 text-sm'>Mobile Number</label>
            <div className='relative mt-1'>
              <Phone className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
              <input
                type='tel'
                placeholder='Enter Mobile Number'
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setError((prev) => ({ ...prev, mobile: '' }));
                }}
                className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm'
              />
            </div>
            {error.mobile && (
              <p className='text-red-500 text-sm mt-2'>{error.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div className='mt-4'>
            <label className='text-gray-600 text-sm'>Password</label>
            <div className='relative mt-1'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
              <input
                type='password'
                placeholder='Enter 6-digit password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError((prev) => ({ ...prev, password: '' }));
                }}
                className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm'
              />
            </div>
            {error.password && (
              <p className='text-red-500 text-sm mt-2'>{error.password}</p>
            )}
          </div>

          <button
            onClick={validateCredentials}
            className='w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 mt-6'>
            <LogIn className='h-5 w-5' />
            {buttonText}
          </button>
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

      {/* ✅ Dashboard Layout with Sidebar */}
      <Route
        path='/dashboard/*'
        element={<DashboardLayout />}>
        <Route
          index
          element={<Dashboard />}
        />

        {/* ✅ Keep Inventory as a separate page */}
        <Route
          path='inventory'
          element={<Inventory />}
        />

        {/* ✅ Keep Add Item as a separate page */}
        <Route
          path='add-item'
          element={<AddItem />}
        />

        {/* ✅ Define Vehicle Inspection as a separate page */}
        <Route
          path='weighment/vehicle-inspection'
          element={<VehicleInspection />}
        />

        <Route
          path='move-item'
          element={<MoveItem />}
        />
        <Route
          path='activity-log'
          element={<ActivityLog />}
        />

        <Route
          path='user-management'
          element={<UserManagement />}
        />
      </Route>
    </Routes>
  );
};

export default App;

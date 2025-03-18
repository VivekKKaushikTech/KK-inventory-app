import React, { useState } from 'react'; // ✅ Import useState
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaTruck,
  FaChartBar,
  FaCamera,
  FaCog,
  FaUsers,
  FaSignOutAlt,
  FaBars, // ✅ Import for mobile menu toggle
  FaTimes, // ✅ Import for mobile menu toggle
} from 'react-icons/fa';

import {
  LayoutDashboard, // Dashboard
  Truck, // Weighment
  FileText, // Reports
  Monitor, // Live Monitoring
  Users, // User Management
  LogOut, // Logout
  Menu, // Sidebar Toggle Button
  X, // Close Button
} from 'lucide-react'; // ✅ Import Lucide Icons

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Initialize navigate hook
  const [isOpen, setIsOpen] = useState(false); // ✅ Sidebar state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // ✅ State for logout confirmation modal

  // ✅ Show Logout Confirmation Modal
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  // ✅ Confirm Logout and Navigate to Login Page
  const handleConfirmLogout = () => {
    localStorage.clear(); // ✅ Clear all stored user data
    navigate('/'); // ✅ Redirect to Login Page
  };

  return (
    <>
      {/* ✅ Mobile Toggle Button */}
      <button
        className='md:hidden fixed top-4 left-4 z-50 bg-orange-500 text-white p-2 rounded-lg shadow-lg'
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className='text-xl' /> : <Menu className='text-xl' />}
      </button>

      {/* ✅ Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 min-h-screen bg-orange-500 text-white p-5 flex flex-col transition-all duration-300 
        ${
          isOpen
            ? 'translate-x-0 w-64 opacity-100 visible'
            : '-translate-x-full opacity-0 invisible'
        } 
        md:w-64 md:translate-x-0 md:opacity-100 md:visible`}>
        {/* ✅ Logo */}
        <div className='mb-8'>
          <img
            src='/assets/kanta-king-logo-white.svg'
            alt='Logo'
            className='h-20 mx-auto'
          />
        </div>

        {/* ✅ Sidebar Navigation */}
        <nav className='flex-grow'>
          <ul
            className={`space-y-2 transition-all duration-300 
            ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} 
            md:opacity-100 md:visible`}>
            {[
              {
                name: 'Dashboard',
                path: '/dashboard',
                icon: <LayoutDashboard size={22} />, // ✅ Lucide Dashboard Icon
              },
              {
                name: 'Weighment',
                path: '/dashboard/weighment',
                icon: <Truck size={22} />, // ✅ Lucide Truck Icon
              },
              {
                name: 'Reports',
                path: '/dashboard/reports',
                icon: <FileText size={22} />, // ✅ Lucide FileText Icon
              },
              {
                name: 'Live Monitoring',
                path: '/dashboard/live-monitoring',
                icon: <Monitor size={22} />, // ✅ Lucide Monitor Icon
              },
              {
                name: 'User Management',
                path: '/dashboard/user-management',
                icon: <Users size={22} />, // ✅ Lucide Users Icon
              },
            ].map((item) => {
              // Handle Dashboard separately (exact match)
              const isDashboard =
                item.path === '/dashboard' &&
                location.pathname === '/dashboard';

              // Highlight Weighment for all its subpages
              const isWeighment =
                item.path === '/dashboard/weighment' &&
                location.pathname.startsWith('/dashboard/weighment');

              // Generic check for other items
              const isActive =
                isDashboard || isWeighment || location.pathname === item.path;

              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`relative flex items-center space-x-3 p-3 w-full transition-all duration-300
                      ${
                        isActive
                          ? 'bg-white text-orange-500 pl-6 pr-20 rounded-l-[40px] rounded-r-[-40px] w-[calc(100%+25px)] -mr-5'
                          : 'hover:bg-orange-600 text-white'
                      }`}
                    onClick={() => setIsOpen(false)} // ✅ Close sidebar when a menu is clicked
                  >
                    <span
                      className={isActive ? 'text-orange-500' : 'text-white'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ✅ Logout Button with Confirmation Popup */}
        <button
          className='mt-auto flex items-center space-x-3 w-full p-3 rounded-lg bg-white text-orange-500 hover:bg-gray-200'
          onClick={handleLogoutClick}>
          {' '}
          {/* ✅ Opens confirmation modal */}
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </aside>

      {/* ✅ Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96 text-center'>
            <h2 className='text-lg font-bold text-red-600 mb-4'>
              Confirm Logout
            </h2>
            <p className='text-gray-700 mb-4'>
              Are you sure you want to log out?
            </p>
            <div className='flex justify-center space-x-4'>
              {/* ✅ Confirm Logout */}
              <button
                onClick={handleConfirmLogout}
                className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'>
                Yes, Logout
              </button>

              {/* ✅ Cancel Logout */}
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className='bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

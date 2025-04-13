import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusSquare,
  Truck,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
  Boxes,
} from 'lucide-react';

const shiftDataRaw = localStorage.getItem('dashboardUserShiftData');
const userShiftData = shiftDataRaw ? JSON.parse(shiftDataRaw) : {};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const collapseTimerRef = useRef(null);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('dashboardUserData');
    localStorage.removeItem('dashboardUserShiftData');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setHoverEnabled(false);
        clearTimeout(collapseTimerRef.current);
        setTimeout(() => setHoverEnabled(true), 1000);
      }
      return next;
    });
  };

  useEffect(() => {
    if (window.innerWidth >= 768) {
      collapseTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
      return () => clearTimeout(collapseTimerRef.current);
    }
  }, []);

  return (
    <>
      <button
        className='md:hidden fixed top-4 left-4 z-50 bg-orange-500 text-white p-2 rounded-lg shadow-lg'
        onClick={toggleSidebar}>
        {isOpen ? <X className='text-xl' /> : <Menu className='text-xl' />}
      </button>

      <aside
        onMouseEnter={() => {
          if (hoverEnabled) setIsOpen(true);
        }}
        onMouseLeave={() => {
          if (hoverEnabled) setIsOpen(false);
        }}
        className={`fixed md:relative top-0 left-0 min-h-screen bg-orange-500 text-white p-5 flex flex-col transition-all duration-300 
        ${isOpen ? 'w-64' : 'w-20'} z-40`}>
        <div className='mb-8 flex justify-center'>
          <img
            src='/assets/kanta-king-logo-white.svg'
            alt='Logo'
            className={`transition-all duration-300 ${
              isOpen ? 'h-20' : 'h-10'
            }`}
          />
        </div>

        <nav className='flex-grow'>
          <ul className='space-y-2'>
            {[
              {
                name: 'Dashboard',
                path: '/dashboard',
                icon: <LayoutDashboard size={22} />,
              },
              {
                name: 'Inventory',
                path: '/dashboard/inventory',
                icon: <Boxes size={22} />,
              },
              {
                name: 'Add Item',
                path: '/dashboard/add-item',
                icon: <PlusSquare size={22} />,
              },
              {
                name: 'Move Item',
                path: '/dashboard/move-item',
                icon: <Truck size={22} />,
              },
              {
                name: 'Activity Log',
                path: '/dashboard/activity-log',
                icon: <ClipboardList size={22} />,
              },
              {
                name: 'User Management',
                path: '/dashboard/user-management',
                icon: <Users size={22} />,
              },
            ].map((item) => {
              const isDashboard =
                item.path === '/dashboard' &&
                location.pathname === '/dashboard';
              const isWeighment =
                item.path === '/dashboard/weighment' &&
                location.pathname.startsWith('/dashboard/weighment');
              const isActive =
                isDashboard || isWeighment || location.pathname === item.path;

              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`relative flex items-center space-x-3 p-3 w-full transition-all duration-300
                      ${
                        isActive
                          ? 'bg-white text-orange-500 rounded-xl'
                          : 'hover:bg-orange-600 text-white'
                      }
                      ${!isOpen ? 'justify-center' : ''}`}
                    onClick={() => setIsOpen(false)}>
                    <span>{item.icon}</span>
                    {isOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          className='mt-auto flex items-center space-x-3 w-full p-3 rounded-lg bg-white text-orange-500 hover:bg-gray-200 justify-center'
          onClick={handleLogoutClick}>
          <LogOut size={22} />
          {isOpen && <span>Logout</span>}
        </button>
      </aside>

      {isLogoutModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96 text-center z-50'>
            <h2 className='text-lg font-bold text-red-600 mb-4'>
              Confirm Logout
            </h2>
            <p className='text-gray-700 mb-4'>
              Are you sure you want to log out?
            </p>
            <div className='flex justify-center space-x-4'>
              <button
                onClick={handleConfirmLogout}
                className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'>
                Yes, Logout
              </button>
              <button
                onClick={handleCancelLogout}
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

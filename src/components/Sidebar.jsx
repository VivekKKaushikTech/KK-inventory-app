import React, { useState } from "react"; // ✅ Import useState
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTruck,
  FaChartBar,
  FaCamera,
  FaCog,
  FaUsers,
  FaSignOutAlt,
  FaBars,   // ✅ Import for mobile menu toggle
  FaTimes   // ✅ Import for mobile menu toggle
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // ✅ Sidebar state

  return (
    <>
      {/* ✅ Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-orange-500 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* ✅ Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 min-h-screen bg-orange-500 text-white p-5 flex flex-col transition-all duration-300 
        ${isOpen ? "translate-x-0 w-64 opacity-100 visible" : "-translate-x-full opacity-0 invisible"} 
        md:w-64 md:translate-x-0 md:opacity-100 md:visible`}
      >
        {/* ✅ Logo */}
        <div className="mb-8">
          <img src="/assets/kanta-king-logo-white.svg" alt="Logo" className="h-20 mx-auto" />
        </div>

        {/* ✅ Sidebar Navigation */}
        <nav className="flex-grow">
          <ul className={`space-y-2 transition-all duration-300 
            ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"} 
            md:opacity-100 md:visible`}
          >
            {[
              { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
              { name: "Weighment", path: "/dashboard/weighment", icon: <FaTruck /> },
              { name: "Reports", path: "/dashboard/reports", icon: <FaChartBar /> },
              { name: "Live Monitoring", path: "/dashboard/live-monitoring", icon: <FaCamera /> },
              { name: "Transactions", path: "/dashboard/transactions", icon: <FaCog /> },
              { name: "User Management", path: "/dashboard/user-management", icon: <FaUsers /> },
            ].map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={`relative flex items-center space-x-3 p-3 w-full transition-all duration-300
                    ${location.pathname === item.path 
                      ? "bg-white text-orange-500 pl-6 pr-20 rounded-l-[40px] rounded-r-[-40px] w-[calc(100%+25px)] -mr-5"
                      : "hover:bg-orange-600 text-white"
                    }`}
                  onClick={() => setIsOpen(false)} // ✅ Close sidebar when a menu is clicked
                >
                  <span className={location.pathname === item.path ? "text-orange-500" : "text-white"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ✅ Logout Button */}
        <button 
          className="mt-auto flex items-center space-x-3 w-full p-3 rounded-lg bg-white text-orange-500 hover:bg-gray-200"
          onClick={() => setIsOpen(false)} // ✅ Close sidebar when logout is clicked (mobile)
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

    
    </>
  );
};

export default Sidebar;

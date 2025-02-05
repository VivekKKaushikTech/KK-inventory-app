import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";  // ✅ Import Tailwind styles
import DepthFrame from "./components/DepthFrame";  // ✅ Login Page
import Attendance from "./components/Attendance"; // ✅ Attendance Page

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center">
        <Routes>
          <Route path="/" element={<DepthFrame />} />  {/* ✅ Login Page */}
          <Route path="/attendance" element={<Attendance />} />  {/* ✅ Attendance Page */}
        </Routes>
      </div>

      {/* Footer Section - Stays at Bottom */}
      <footer className="w-full text-center py-4 bg-gray-100 text-gray-600 text-sm">
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles/tailwind.css";
import Attendance from "./components/Attendance"; // ✅ Keep Attendance Page
import FaceScan from "./components/FaceScan";
import AttendanceConfirmation from "./components/AttendanceConfirmation";
import QRCodeScan from "./components/QRCodeScan"; // ✅ Import QR Code Scanner Page
import ShiftHandover from "./components/ShiftHandover"; // ✅ Import Shift Handover Page


const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ mobile: "", password: "" });
  const [buttonText, setButtonText] = useState("Log In");
  const navigate = useNavigate();

  const userData = {
    "8860652067": "Vivek",
    "9650505555": "Mohit",
    "9650514444": "Vishisht",
  };
  const correctPassword = "123456";  
  const registeredNumbers = Object.keys(userData);

  const validateCredentials = () => {
    let errorsObject = { mobile: "", password: "" };

    if (!mobile.trim()) {
      errorsObject.mobile = "Please enter mobile number";  
    } else if (!registeredNumbers.includes(mobile)) {
      errorsObject.mobile = "Mobile number not registered";
    }

    if (!password.trim()) {
      errorsObject.password = "Please enter password";  
    } else if (!errorsObject.mobile && password !== correctPassword) {  
      errorsObject.password = "Wrong Password";
    }

    setError(errorsObject);

    if (!errorsObject.mobile && !errorsObject.password) {
      setButtonText("Logging in...");
      setTimeout(() => {
        setButtonText("Log In");
        navigate("/attendance", { state: { userName: userData[mobile], userMobile: mobile } }); // ✅ Correct navigation
      }, 1500);
    }
  };

  return (
      <div className="min-h-screen flex flex-col bg-white">
        {/* Main Content (Expands to Push Footer Down) */}
        <div className="flex-grow flex flex-col md:flex-row items-center justify-center py-12 px-4 md:gap-20">
          
          {/* Left Side - Truck Image */}
          <div className="hidden md:block w-1/2 justify-center">
            <img src="/assets/truck-image.svg" alt="Truck Design" className="max-w-[80%]" />
          </div>
    
          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/3 bg-white p-10 shadow-md rounded-lg">
            <img src="/assets/kanta-king-logo.svg" alt="Kanta King Logo" className="h-25 mx-auto mb-8" />
    
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Welcome to Kanta King’s Weighbridge App
            </h1>
    
            <p className="text-gray-600 text-left mb-3">Enter Mobile Number</p>
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                setError((prev) => ({ ...prev, mobile: "" }));
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            {error.mobile && <p className="text-red-500 text-sm mt-2">{error.mobile}</p>}
    
            <p className="text-gray-600 text-left mt-4">Enter Password</p>
            <input
              type="password"
              placeholder="Enter 6-digit password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError((prev) => ({ ...prev, password: "" }));
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mt-2"
            />
            {error.password && <p className="text-red-500 text-sm mt-2">{error.password}</p>}
    
            <button
              onClick={validateCredentials}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mt-4"
            >
              {buttonText}
            </button>
          </div>
        </div>
    
        {/* ✅ Footer Always Stays at Bottom ✅ */}
        <footer className="w-full text-center py-4 bg-gray-100 text-gray-600 text-sm mt-auto">
          © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights reserved.
        </footer>
      </div>
    );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/face-scan" element={<FaceScan />} />
      <Route path="/attendance-confirmation" element={<AttendanceConfirmation />} />
      <Route path="/qr-code-scan" element={<QRCodeScan />} />  {/* ✅ New Route Added */}
      <Route path="/shift-handover" element={<ShiftHandover />} /> {/* ✅ Added Route */}
</Routes>
  );
};

export default App;

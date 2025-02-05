import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./ui/Card";  
import Input from "./ui/Input";

const DepthFrame = () => {
  const [mobile, setMobile] = useState("");  
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState({ mobile: "", password: "" }); 
  const [buttonText, setButtonText] = useState("Log In"); 
  const navigate = useNavigate(); 

  const userData = {
    "8860652067": "Vivek",
    "9650505555": "Mohit",
    "9650514444": "Vishihst",
  };
  const correctPassword = "123456";  
  const registeredNumbers = Object.keys(userData);

  // ✅ Finalized Validation Function
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

    setError(errorsObject); // ✅ Update state with errors

    console.log("✅ Local Errors:", errorsObject);

    // ✅ Use LOCAL VARIABLE instead of state for validation
    if (errorsObject.mobile === "" && errorsObject.password === "") {
      console.log("✅ No Errors Found! Navigating...");
      handleLoginSuccess(mobile);
    } else {
      console.log("❌ Errors Still Exist! Fix Required.");
    }
  };

  // ✅ Handles successful login and navigation
  const handleLoginSuccess = (mobileNumber) => {
    setButtonText("Logging in...");
    setTimeout(() => {
      setButtonText("Log In");
      navigate("/attendance", { state: { userName: userData[mobileNumber] } });
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-4 gap-12">
      {/* Left Side - Truck Image */}
      <div className="hidden md:block w-1/2">
        <img src="/assets/truck-image.svg" alt="Truck Design" className="max-w-full" />
      </div>

      {/* Right Side - Login Form */}
      <Card className="w-full md:w-1/2 bg-white p-8 shadow-md rounded-lg">
        <img src="/assets/kanta-king-logo.svg" alt="Kanta King Logo" className="h-25 mx-auto mb-8" />

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome to Kanta King’s Weighbridge App
        </h1>

        <p className="text-gray-600 text-left mb-3">Enter Mobile Number</p>

        {/* Mobile Input Field */}
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            setError((prev) => ({ ...prev, mobile: "" }));
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />

        {/* Mobile Error Message */}
        {error.mobile && <p className="text-red-500 text-sm mt-2">{error.mobile}</p>}

        {/* Password Label */}
        <p className="text-gray-600 text-left mt-4">Enter Password</p>

        {/* Password Input Field */}
        <Input
          type="password"
          placeholder="Enter 6-digit password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError((prev) => ({ ...prev, password: "" }));
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mt-2"
        />

        {/* Password Error Message */}
        {error.password && <p className="text-red-500 text-sm mt-2">{error.password}</p>}

        {/* Submit Button */}
        <button
          onClick={validateCredentials}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mt-4"
        >
          {buttonText}
        </button>
      </Card>
    </div>
  );
};

export default DepthFrame;

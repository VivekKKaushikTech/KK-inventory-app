import React from "react";
import { useLocation } from "react-router-dom";
import Card from "./ui/Card";

const Attendance = () => {
  const location = useLocation();

  // Get the user name from the previous screen (Login Screen)
  const userName = location.state?.userName || "User"; // Default if no name is found

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {/* Kanta King Logo - Top Left */}
      <div className="w-full flex justify-start">
        <img src="/assets/kanta-king-logo.svg" alt="Kanta King Logo" className="h-12" />
      </div>

      {/* Welcome Message */}
      <Card className="w-full md:w-1/2 bg-white p-8 shadow-md rounded-lg text-center mt-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Namaskaar, {userName}!
        </h1>
        <p className="text-gray-600 mt-4">
          It’s time to mark your attendance. Click the button below to register your attendance for the day.
        </p>

        {/* Mark Attendance Button */}
        <button 
          className="mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600"
          onClick={() => alert("Attendance Marked Successfully!")}
        >
          Mark Your Attendance
        </button>
      </Card>

      {/* Footer */}
      <footer className="w-full text-center py-4 bg-gray-100 text-gray-600 text-sm mt-6">
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default Attendance;

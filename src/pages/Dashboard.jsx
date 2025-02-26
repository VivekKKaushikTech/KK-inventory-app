import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // ✅ Import useLocation
import Sidebar from "../components/Sidebar"; // ✅ Ensuring Sidebar is included only once
import {
  FaUserCircle,
  FaBell,
  FaChartPie,
  FaChartBar,
} from "react-icons/fa";

const Dashboard = () => {
  console.log("✅ Dashboard component is rendering!");

  const location = useLocation();
  const [employeeData, setEmployeeData] = useState(() => {
    // ✅ Load from Local Storage FIRST on Mount
    const storedData = localStorage.getItem("dashboardUserData");
    return storedData ? JSON.parse(storedData) : location.state || {};
  });

  console.log("🚀 Dashboard Loaded! Received Data:", employeeData);

  useEffect(() => {
    const storedData = localStorage.getItem("dashboardUserData");
    const parsedStoredData = storedData ? JSON.parse(storedData) : null;
  
    if (location.state && Object.keys(location.state).length > 0) {
      if (!parsedStoredData || JSON.stringify(location.state) !== JSON.stringify(parsedStoredData)) {
        console.log("📝 Saving Dashboard Data to Local Storage...");
        localStorage.setItem("dashboardUserData", JSON.stringify(location.state));
        setEmployeeData(location.state); // ✅ Update ONLY when new data is received
      }
    } else if (parsedStoredData) {
      setEmployeeData(parsedStoredData); // ✅ Use stored data if no new state
    }
  }, [location.state]);  // ✅ Only update when location.state changes
  
  

  // ✅ Extract Employee Details
  const employeeName = employeeData?.employeeName || "Unknown User";
  const employeeID = employeeData?.employeeID || "123456";
  const designation = employeeData?.designation || "Operator";
  const userLat = employeeData?.lat ?? "Unknown";
  const userLng = employeeData?.lng ?? "Unknown";
  const employeePhoto = employeeData?.employeePhoto || "/assets/default-user.png";

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-white-100">

      {/* ✅ Main Content */}
      <div className="flex-1 p-4">
        
{/* ✅ Header Section */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl text-orange-500 font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">Test Private Limited - 📍Location: {userLat}, {userLng}</p>
            <p className="text-sm text-gray-600">Date & Time: {currentTime.toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaBell className="text-orange-500 text-xl cursor-pointer" />
            <div className="flex items-center space-x-2">
              <img src={employeePhoto} alt="User" className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover" />
              <div>
                <p className="text-orange-500">{employeeName}</p>
                <p className="text-gray-600 text-sm">{designation} - {employeeID}</p>
              </div>
            </div>
          </div>
        </header>


{/* ✅ Statistics Boxes (Now only 4) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
  {[
    {
      title1: "Weighbridge Type",
      value1: "Pitless since 25/02/2023",
      title2: "Weighbridge Capacity (In Tons)",
      value2: "100"
    },
    {
      title1: "Vehicles Weighed (MTD No.)",
      value1: "324",
      title2: "Overweight Vehicles (MTD No.)",
      value2: "15"
    },
    {
      title1: "Date of Stamping",
      value1: "25/02/2025",
      title2: "Next Stamping Due In",
      value2: "52 days"
    },
    {
      title1: "AMC Visits - Promised",
      value1: "10",
      title2: "AMC Visits - Done",
      value2: "7"
    }
  ].map((item, index) => (
    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
      <p className="text-orange-500 text-sm">{item.title1}</p>
      <p className="text-sm text-gray-600">{item.value1}</p>
      <hr className="my-2 border-orange-500" />
      <p className="text-orange-500 text-sm">{item.title2}</p>
      <p className="text-sm text-gray-600">{item.value2}</p>
    </div>
  ))}
</div>


        {/* ✅ Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaChartPie className="text-orange-500 text-4xl mx-auto" />
            <p className="text-center mt-2">Pie Chart 1</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaChartPie className="text-orange-500 text-4xl mx-auto" />
            <p className="text-center mt-2">Pie Chart 2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaChartBar className="text-orange-500 text-4xl mx-auto" />
            <p className="text-center mt-2">Bar Graph</p>
          </div>
        </div>

        {/* ✅ Activity Log Restored */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md overflow-x-auto scroll-smooth">
          <h2 className="text-lg text-orange-500 font-bold">Activity Log</h2>
          <table className="w-full min-w-max border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Date & Time</th>
                <th className="p-2">Serial No.</th>
                <th className="p-2">Vehicle Number</th>
                <th className="p-2">Gross Weight</th>
                <th className="p-2">Tare Weight</th>
                <th className="p-2">Net Weight</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 text-wrap break-words text-center">{currentTime.toLocaleString()}</td>
                  <td className="p-2 text-wrap break-words text-center">{i + 1}</td>
                  <td className="p-2 text-wrap break-words text-center">DL 01 AB 1234</td>
                  <td className="p-2 text-wrap break-words text-center">20,000 kg</td>
                  <td className="p-2 text-wrap break-words text-center">5,000 kg</td>
                  <td className="p-2 text-wrap break-words text-center">15,000 kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ✅ Footer Section */}
          <footer className="w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md">
            © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights reserved.
          </footer>
          </div> {/* ✅ Main Content End */}
    </div>
  );
};

export default Dashboard;

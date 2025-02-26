import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaBell,
  FaCarSide,
  FaTruckLoading,
} from "react-icons/fa";

const Weighment = () => {
  console.log("✅ Weighment Page Rendering...");

  const location = useLocation();
  const storedData = localStorage.getItem("dashboardUserData");
  const employeeData = location.state || (storedData ? JSON.parse(storedData) : {});

  // Extract Employee Details
  const employeeName = employeeData?.employeeName || "Unknown User";
  const employeeID = employeeData?.employeeID || "123456";
  const designation = employeeData?.designation || "Operator";
  const userLat = employeeData?.lat ?? "Unknown";
  const userLng = employeeData?.lng ?? "Unknown";
  const employeePhoto = employeeData?.employeePhoto || "/assets/default-user.png";

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("firstWeight"); // Default tab: First Weight
  const [activeHistoryTab, setActiveHistoryTab] = useState("vehicle"); // Default history tab
  const [rowCount, setRowCount] = useState(10); // Initial rows count
  const historyTableHeaders = {
    vehicle: ["Receipt No.", "Date", "Driver Name", "Material", "Transporter", "Supplier", "Wt. Deviation"],
    driver: ["Receipt No.", "Date", "Vehicle Number", "Material", "Transporter", "Supplier", "Wt. Deviation"],
    transporter: ["Receipt No.", "Date", "Driver Name", "Vehicle Number", "Material", "Supplier", "Wt. Deviation"],
    supplier: ["Receipt No.", "Date", "Driver Name", "Vehicle Number", "Material", "Transporter", "Wt. Deviation"],
    
  };
  

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
            <h1 className="text-xl text-orange-500 font-bold">Weigh the Vehicle</h1>
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

        {/* ✅ Toggle Between First Weight & Second Weight */}
        <div className="mt-4 flex gap-2">
          <button
            className={`flex-1 py-3 rounded-lg text-white ${
              activeTab === "firstWeight" ? "bg-orange-500" : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("firstWeight")}
          >
            First Weight
          </button>
          <button
            className={`flex-1 py-3 rounded-lg text-white ${
              activeTab === "secondWeight" ? "bg-orange-500" : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("secondWeight")}
          >
            Second Weight
          </button>
        </div>

        {/* ✅ First Weight Content */}
        {activeTab === "firstWeight" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-orange-500 mb-4">Basic Info</h2>
            
            {/* Vehicle Information */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Movement Type */}
              <div>
                <label className="text-gray-700">Movement Type</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Inbound</option>
                  <option>Outbound</option>
                </select>
              </div>

              {/* Vehicle Number */}
              <div>
                <label className="text-gray-700">Vehicle Number</label>
                <input type="text" placeholder="Enter Vehicle Number" className="w-full p-2 border rounded-lg" />
              </div>


              {/* Vehicle Type */}
              <div>
                <label className="text-gray-700">Vehicle Type</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="">Select Vehicle Type</option>
                  <option value="Three-wheeler Freight">Three-wheeler Freight</option>
                  <option value="Light Commercial vehicle 2-axle">Light Commercial vehicle 2-axle</option>
                  <option value="Light Commercial vehicle 3-axle">Light Commercial vehicle 3-axle</option>
                  <option value="Truck 2 - axle">Truck 2 - axle</option>
                  <option value="Truck 3 - axle">Truck 3 - axle</option>
                  <option value="Truck 4 - axle">Truck 4 - axle</option>
                  <option value="Truck 5 - axle">Truck 5 - axle</option>
                  <option value="Truck 6 - axle">Truck 6 - axle</option>
                  <option value="Truck Multi axle (7 and above)">Truck Multi axle (7 and above)</option>
                  <option value="Earth Moving Machinery">Earth Moving Machinery</option>
                  <option value="Heavy Construction machinery">Heavy Construction machinery</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Tractor with trailer">Tractor with trailer</option>
                  <option value="Tata Ace or Similar Mini Light Commercial Vehicle">Tata Ace or Similar Mini Light Commercial Vehicle</option>
                </select>
              </div>

              {/* Vehicle Brand */}
              <div>
                <label className="text-gray-700">Vehicle Brand</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="">Select Vehicle Brand</option>
                  <option value="Tata Motors Limited">Tata Motors Limited</option>
                  <option value="Mahindra & Mahindra Limited">Mahindra & Mahindra Limited</option>
                  <option value="Eicher Motors Limited">Eicher Motors Limited</option>
                  <option value="Ashok Leyland Limited">Ashok Leyland Limited</option>
                  <option value="Force Motors Limited">Force Motors Limited</option>
                  <option value="SML ISUZU Limited">SML ISUZU Limited</option>
                  <option value="Hindustan Motors">Hindustan Motors</option>
                  <option value="Scania Commercial Vehicle India Pvt Ltd">Scania Commercial Vehicle India Pvt Ltd</option>
                  <option value="Hino Motor Sales India Private Limited">Hino Motor Sales India Private Limited</option>
                  <option value="Daimler India Commercial Vehicles' BharatBenz">Daimler India Commercial Vehicles' BharatBenz</option>
                  <option value="Volvo Trucks">Volvo Trucks</option>
                  <option value="Asia Motorworks">Asia Motorworks</option>
                  <option value="VE Commercial Vehicle’s Limited">VE Commercial Vehicle’s Limited</option>
                  <option value="Bharat Benz">Bharat Benz</option>
                  <option value="AMW Motors Ltd">AMW Motors Ltd</option>
                </select>
              </div>


              {/* Vehicle Model */}
              <div>
                <label className="text-gray-700">Vehicle Model</label>
                <input type="text" placeholder="Enter Vehicle Model" className="w-full p-2 border rounded-lg" />
              </div>

              {/* Driver Name */}
              <div>
                <label className="text-gray-700">Driver Name</label>
                <input type="text" placeholder="Enter Driver Name" className="w-full p-2 border rounded-lg" />
              </div>

              {/* Driver Mobile */}
              <div>
                <label className="text-gray-700">Driver Mobile</label>
                <input type="text" placeholder="Enter Driver Mobile" className="w-full p-2 border rounded-lg" />
              </div>
            </div>

            {/* ✅ History Tabs */}
            <h2 className="mt-6 text-lg text-orange-500 font-bold">History</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {["vehicle", "driver", "transporter", "supplier"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 rounded-lg ${
                    activeHistoryTab === tab ? "bg-orange-500 text-white" : "bg-gray-300 text-white"
                  }`}
                  onClick={() => setActiveHistoryTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

{/* ✅ Scrollable Table Container */}
<div className="mt-4 overflow-x-auto">
  <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg"> {/* ✅ Added scrollable area */}
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          {historyTableHeaders[activeHistoryTab].map((header, index) => (
            <th key={index} className="p-2 border">{header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[...Array(rowCount)].map((_, i) => (
          <tr key={i} className="border">
            {historyTableHeaders[activeHistoryTab].map((header, index) => (
              <td key={index} className="p-2 border text-center">
                {index === 0 ? ( // Making Receipt No. clickable
                  <a href={`/receipts/receipt-${i + 1}.pdf`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    #000{i + 1}
                  </a>
                ) : (
                  `Sample ${header}`
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* ✅ Load More Button */}
  <button 
    onClick={() => setRowCount(rowCount + 10)} 
    className="mt-2 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
  >
    Load More
  </button>
</div>


            {/* ✅ Action Button */}
            <button className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg">
              Commence Vehicle Inspection
            </button>
          </div>
        )}
          {/* ✅ Footer Section */}
          <footer className="w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md">
            © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights reserved.
          </footer>

          </div> {/* ✅ Main Content End */}
    </div>
  );
};

export default Weighment;

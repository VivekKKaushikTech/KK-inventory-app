import React, { useState, useEffect } from "react";

const BasicInfo = ({ setValidateFunction }) => {
  // ✅ State to Store Basic Info
  const [basicInfo, setBasicInfo] = useState({
    movementType: localStorage.getItem("movementType") || "",
    vehicleNumber: localStorage.getItem("vehicleNumber") || "",
    vehicleType: localStorage.getItem("vehicleType") || "",
    vehicleBrand: localStorage.getItem("vehicleBrand") || "",
    vehicleModel: localStorage.getItem("vehicleModel") || "",
    vehicleTyre: localStorage.getItem("vehicleTyre") || "",
    driverName: localStorage.getItem("driverName") || "",
    driverMobile: localStorage.getItem("driverMobile") || "",
  });

  // ✅ State to Store Errors
  const [errors, setErrors] = useState({});

  // ✅ Function to Handle Input Changes & Update Local Storage
  const handleInputChange = (field, value) => {
    localStorage.setItem(field, value);
    setBasicInfo((prev) => ({ ...prev, [field]: value }));

    // ✅ Clear error when field is filled
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  // ✅ Validation Function (Called Before Submission)
  const validateFields = () => {
    const newErrors = {};
    Object.keys(basicInfo).forEach((field) => {
      if (!basicInfo[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ Returns true if no errors
  };


  useEffect(() => {
    if (setValidateFunction) {
        console.log("✅ Validation function set in Weighment.jsx");
        setValidateFunction(() => () => validateFields()); // ✅ Returns a function reference that executes validation when called
    }
}, []);




  
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-orange-500 mb-4">Basic Info</h2>

      {/* ✅ Vehicle Information */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Movement Type */}
        <div>
          <label className="text-gray-700">Movement Type</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={basicInfo.movementType}
            onChange={(e) => handleInputChange("movementType", e.target.value)}
          >
            <option value="">Select Movement Type</option>
            <option value="Inbound">Inbound</option>
            <option value="Outbound">Outbound</option>
          </select>
          {errors.movementType && <p className="text-red-500 text-sm">{errors.movementType}</p>}
        </div>

        {/* Vehicle Number */}
        <div>
          <label className="text-gray-700">Vehicle Number</label>
          <input
            type="text"
            placeholder="Enter Vehicle Number"
            className="w-full p-2 border rounded-lg"
            value={basicInfo.vehicleNumber}
            onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
          />
          {errors.vehicleNumber && <p className="text-red-500 text-sm">{errors.vehicleNumber}</p>}
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="text-gray-700">Vehicle Type</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={basicInfo.vehicleType}
            onChange={(e) => handleInputChange("vehicleType", e.target.value)}
          >
            <option value="">Select Vehicle Type</option>
            <option value="Three-wheeler Freight">Three-wheeler Freight</option>
            <option value="Light Commercial vehicle 2-axle">Light Commercial vehicle 2-axle</option>
            <option value="Light Commercial vehicle 3-axle">Light Commercial vehicle 3-axle</option>
            <option value="RMC Truck">RMC Truck</option>
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
          {errors.vehicleType && <p className="text-red-500 text-sm">{errors.vehicleType}</p>}
        </div>

        {/* Vehicle Brand */}
        <div>
          <label className="text-gray-700">Vehicle Brand</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={basicInfo.vehicleBrand}
            onChange={(e) => handleInputChange("vehicleBrand", e.target.value)}
          >
            <option value="">Select Vehicle Brand</option>
            <option value="AMW Motors Ltd">AMW Motors Ltd</option>
            <option value="Asia Motorworks">Asia Motorworks</option>
            <option value="Ashok Leyland Limited">Ashok Leyland Limited</option>
            <option value="Bharat Benz">Bharat Benz</option>
            <option value="Daimler India Commercial Vehicles' BharatBenz">Daimler India Commercial Vehicles' BharatBenz</option>
            <option value="Eicher Motors Limited">Eicher Motors Limited</option>
            <option value="Force Motors Limited">Force Motors Limited</option>
            <option value="Hindustan Motors">Hindustan Motors</option>
            <option value="Hino Motor Sales India Private Limited">Hino Motor Sales India Private Limited</option>
            <option value="Mahindra & Mahindra Limited">Mahindra & Mahindra Limited</option>
            <option value="Scania Commercial Vehicle India Pvt Ltd">Scania Commercial Vehicle India Pvt Ltd</option>
            <option value="SML ISUZU Limited">SML ISUZU Limited</option>
            <option value="Tata Motors Limited">Tata Motors Limited</option>
            <option value="VE Commercial Vehicle’s Limited">VE Commercial Vehicle’s Limited</option>
            <option value="Volvo Trucks">Volvo Trucks</option>
          </select>
          {errors.vehicleBrand && <p className="text-red-500 text-sm">{errors.vehicleBrand}</p>}
        </div>

        {/* Vehicle Model */}
        <div>
          <label className="text-gray-700">Vehicle Model</label>
          <input
            type="text"
            placeholder="Enter Vehicle Model"
            className="w-full p-2 border rounded-lg"
            value={basicInfo.vehicleModel}
            onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
          />
          {errors.vehicleModel && <p className="text-red-500 text-sm">{errors.vehicleModel}</p>}
        </div>

        {/* Vehicle Tyre */}
        <div>
          <label className="text-gray-700">Vehicle Tyre</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={basicInfo.vehicleTyre}
            onChange={(e) => handleInputChange("vehicleTyre", e.target.value)}
          >
            <option value="">Select Vehicle Tyre</option>
            <option value="Aeolus">Aeolus</option>
            <option value="Apollo Tyres">Apollo Tyres</option>
            <option value="Balkrishna Industries Ltd (BKT Tyres)">Balkrishna Industries Ltd (BKT Tyres)</option>
            <option value="Bridgestone">Bridgestone</option>
            <option value="CEAT">CEAT</option>
            <option value="Continental">Continental</option>
            <option value="Dunlop">Dunlop</option>
            <option value="Goodyear">Goodyear</option>
            <option value="Innovative Tyres">Innovative Tyres</option>
            <option value="JK Tyre">JK Tyre</option>
            <option value="Krypton Industries">Krypton Industries</option>
            <option value="Maxxis Tyres">Maxxis Tyres</option>
            <option value="Michelin">Michelin</option>
            <option value="MRF Tyres">MRF Tyres</option>
            <option value="Ralco Tyres">Ralco Tyres</option>
            <option value="TVS Eurogrip">TVS Eurogrip</option>
            <option value="Yokohama Tyres">Yokohama Tyres</option>
          </select>
          {errors.vehicleTyre && <p className="text-red-500 text-sm">{errors.vehicleTyre}</p>}
        </div>

        {/* Driver Name */}
        <div>
          <label className="text-gray-700">Driver Name</label>
          <input
            type="text"
            placeholder="Enter Driver Name"
            className="w-full p-2 border rounded-lg"
            value={basicInfo.driverName}
            onChange={(e) => handleInputChange("driverName", e.target.value)}
          />
          {errors.driverName && <p className="text-red-500 text-sm">{errors.driverName}</p>}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

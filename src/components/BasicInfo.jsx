import React, { useState, useEffect } from 'react';

const BasicInfo = ({ setValidateFunction }) => {
  // ✅ State to Store Basic Info
  const [basicInfo, setBasicInfo] = useState({
    movementType: '',
    vehicleNumber: '',
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleTyre: '',
    driverName: '',
    driverMobile: '',
  });

  // ✅ State to Store Errors
  const [errors, setErrors] = useState({});

  // ✅ Function to Handle Input Changes & Update Local Storage
  const handleInputChange = (field, value) => {
    localStorage.setItem(field, value);
    setBasicInfo((prev) => ({ ...prev, [field]: value }));

    // ✅ Clear error when field is filled
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  // ✅ Reset the form fields when the component mounts
  useEffect(() => {
    setBasicInfo({
      movementType: localStorage.getItem('movementType') || '',
      vehicleNumber: localStorage.getItem('vehicleNumber') || '',
      vehicleType: localStorage.getItem('vehicleType') || '',
      vehicleBrand: localStorage.getItem('vehicleBrand') || '',
      vehicleModel: localStorage.getItem('vehicleModel') || '',
      vehicleTyre: localStorage.getItem('vehicleTyre') || '',
      driverName: localStorage.getItem('driverName') || '',
      driverMobile: localStorage.getItem('driverMobile') || '',
    });
  }, []);

  return (
    <div className='mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
      <h2 className='text-xl font-semibold text-orange-600 mb-4'>Basic Info</h2>

      {/* ✅ Vehicle Information */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Movement Type */}
        <div className='flex flex-col'>
          <label className='text-gray-600 font-medium mb-1'>
            Movement Type
          </label>
          <select
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
            value={basicInfo.movementType}
            onChange={(e) => handleInputChange('movementType', e.target.value)}>
            <option value=''>Select Movement Type</option>
            <option value='Inbound'>Inbound</option>
            <option value='Outbound'>Outbound</option>
          </select>
          {errors.movementType && (
            <p className='text-red-500 text-sm mt-1'>{errors.movementType}</p>
          )}
        </div>

        {/* Vehicle Number */}
        <div className='flex flex-col'>
          <label className='text-gray-600 font-medium mb-1'>
            Vehicle Number
          </label>
          <input
            type='text'
            placeholder='Enter Vehicle Number'
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
            value={basicInfo.vehicleNumber}
            onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
          />
          {errors.vehicleNumber && (
            <p className='text-red-500 text-sm mt-1'>{errors.vehicleNumber}</p>
          )}
        </div>

        {/* Vehicle Type */}
        <div className='flex flex-col'>
          <label className='text-gray-600 font-medium mb-1'>Vehicle Type</label>
          <select
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
            value={basicInfo.vehicleType}
            onChange={(e) => handleInputChange('vehicleType', e.target.value)}>
            <option value=''>Select Vehicle Type</option>
            <option value='Canter'>Canter</option>
            <option value='Three-wheeler Freight'>Three-wheeler Freight</option>
            <option value='Light Commercial vehicle 2-axle'>
              Light Commercial vehicle 2-axle
            </option>
            <option value='Light Commercial vehicle 3-axle'>
              Light Commercial vehicle 3-axle
            </option>
            <option value='RMC Truck'>RMC Truck</option>
            <option value='Tralla'>Tralla</option>
            <option value='Truck 2 - axle'>Truck 2 - axle</option>
            <option value='Truck 3 - axle'>Truck 3 - axle</option>
            <option value='Truck 4 - axle'>Truck 4 - axle</option>
            <option value='Truck 5 - axle'>Truck 5 - axle</option>
            <option value='Truck 6 - axle'>Truck 6 - axle</option>
            <option value='Truck Multi axle (7 and above)'>
              Truck Multi axle (7 and above)
            </option>
            <option value='Earth Moving Machinery'>
              Earth Moving Machinery
            </option>
            <option value='Heavy Construction machinery'>
              Heavy Construction machinery
            </option>
            <option value='Tractor'>Tractor</option>
            <option value='Tractor with trailer'>Tractor with trailer</option>
            <option value='Tata Ace or Similar Mini Light Commercial Vehicle'>
              Tata Ace or Similar Mini Light Commercial Vehicle
            </option>
          </select>
          {errors.vehicleType && (
            <p className='text-red-500 text-sm mt-1'>{errors.vehicleType}</p>
          )}
        </div>

        {/* Vehicle Brand */}
        <div className='flex flex-col'>
          <label className='text-gray-600 font-medium mb-1'>
            Vehicle Brand
          </label>
          <select
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
            value={basicInfo.vehicleBrand}
            onChange={(e) => handleInputChange('vehicleBrand', e.target.value)}>
            <option value=''>Select Vehicle Brand</option>
            <option value='AMW Motors Ltd'>AMW Motors Ltd</option>
            <option value='Asia Motorworks'>Asia Motorworks</option>
            <option value='Ashok Leyland Limited'>Ashok Leyland Limited</option>
            <option value='Bharat Benz'>Bharat Benz</option>
            <option value="Daimler India Commercial Vehicles' BharatBenz">
              Daimler India Commercial Vehicles' BharatBenz
            </option>
            <option value='Eicher Motors Limited'>Eicher Motors Limited</option>
            <option value='Force Motors Limited'>Force Motors Limited</option>
            <option value='Hindustan Motors'>Hindustan Motors</option>
            <option value='Hino Motor Sales India Private Limited'>
              Hino Motor Sales India Private Limited
            </option>
            <option value='Mahindra & Mahindra Limited'>
              Mahindra & Mahindra Limited
            </option>
            <option value='Scania Commercial Vehicle India Pvt Ltd'>
              Scania Commercial Vehicle India Pvt Ltd
            </option>
            <option value='SML ISUZU Limited'>SML ISUZU Limited</option>
            <option value='Tata Motors Limited'>Tata Motors Limited</option>
            <option value='VE Commercial Vehicle’s Limited'>
              VE Commercial Vehicle’s Limited
            </option>
            <option value='Volvo Trucks'>Volvo Trucks</option>
          </select>
          {errors.vehicleBrand && (
            <p className='text-red-500 text-sm mt-1'>{errors.vehicleBrand}</p>
          )}
        </div>

        {/* Vehicle Model */}
        <div className='flex flex-col'>
          <label className='text-gray-600 font-medium mb-1'>
            Vehicle Model
          </label>
          <input
            type='text'
            placeholder='Enter Vehicle Model'
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
            value={basicInfo.vehicleModel}
            onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
          />
          {errors.vehicleModel && (
            <p className='text-red-500 text-sm mt-1'>{errors.vehicleModel}</p>
          )}
        </div>

        {/* Vehicle Tyre */}
        <div className='flex flex-col'>
          <label className='text-gray-600 font-medium mb-1'>Vehicle Tyre</label>
          <select
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
            value={basicInfo.vehicleTyre}
            onChange={(e) => handleInputChange('vehicleTyre', e.target.value)}>
            <option value=''>Select Vehicle Tyre</option>
            <option value='Aeolus'>Aeolus</option>
            <option value='Apollo Tyres'>Apollo Tyres</option>
            <option value='Balkrishna Industries Ltd (BKT Tyres)'>
              Balkrishna Industries Ltd (BKT Tyres)
            </option>
            <option value='Bridgestone'>Bridgestone</option>
            <option value='CEAT'>CEAT</option>
            <option value='Continental'>Continental</option>
            <option value='Dunlop'>Dunlop</option>
            <option value='Goodyear'>Goodyear</option>
            <option value='Innovative Tyres'>Innovative Tyres</option>
            <option value='JK Tyre'>JK Tyre</option>
            <option value='Krypton Industries'>Krypton Industries</option>
            <option value='Maxxis Tyres'>Maxxis Tyres</option>
            <option value='Michelin'>Michelin</option>
            <option value='MRF Tyres'>MRF Tyres</option>
            <option value='Ralco Tyres'>Ralco Tyres</option>
            <option value='TVS Eurogrip'>TVS Eurogrip</option>
            <option value='Yokohama Tyres'>Yokohama Tyres</option>
          </select>
          {errors.vehicleTyre && (
            <p className='text-red-500 text-sm mt-1'>{errors.vehicleTyre}</p>
          )}
        </div>

        {/* Driver Name */}
        <div className='flex flex-col'>
          <label className='text-gray-600 font-medium mb-1'>Driver Name</label>
          <input
            type='text'
            placeholder='Enter Driver Name'
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
            value={basicInfo.driverName}
            onChange={(e) => handleInputChange('driverName', e.target.value)}
          />
          {errors.driverName && (
            <p className='text-red-500 text-sm mt-1'>{errors.driverName}</p>
          )}
        </div>

        {/* Driver Mobile */}
        <div className='flex flex-col'>
          <label className='text-gray-600 font-medium mb-1'>
            Driver Mobile No.
          </label>
          <input
            type='text'
            placeholder='Enter Driver Mobile'
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
            value={basicInfo.driverMobile}
            onChange={(e) => handleInputChange('driverMobile', e.target.value)}
          />
          {errors.driverMobile && (
            <p className='text-red-500 text-sm mt-1'>{errors.driverMobile}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

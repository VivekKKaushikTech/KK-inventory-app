import React, { useState, useEffect } from 'react';
import { FaBell, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Bell, ArrowLeft, ArrowRight } from 'lucide-react'; // ✅ Import Lucide Bell Icon
import Header from '../components/Header'; // ✅ Import the Header component

const MAX_LOCATIONS = 10; // Define max locations

const LiveMonitoring = () => {
  const [liveData, setLiveData] = useState({});
  const [employeeData, setEmployeeData] = useState(() => {
    const storedData = localStorage.getItem('dashboardUserData');
    return storedData ? JSON.parse(storedData) : {};
  });

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

  const locations = [
    'Location 1',
    'Location 2',
    'Location 3',
    'Location 4',
    'Location 5',
    'Location 6',
    'Location 7',
    'Location 8',
    'Location 9',
    'Location 10',
  ];

  // ✅ Fetch Live Data for Selected Locations
  useEffect(() => {
    const fetchLiveData = () => {
      let updatedData = {};
      selectedLocations.forEach((location) => {
        const storedData = localStorage.getItem(
          `liveMonitoringData_${location}`
        );
        if (storedData) {
          updatedData[location] = JSON.parse(storedData);
        }
      });
      setLiveData(updatedData);
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 2000);
    return () => clearInterval(interval);
  }, [selectedLocations]);

  useEffect(() => {
    const storedData = localStorage.getItem('dashboardUserData');
    if (storedData) {
      setEmployeeData(JSON.parse(storedData));
    }
  }, []);

  // ✅ Auto-scroll to the next location every 5 seconds
  useEffect(() => {
    if (selectedLocations.length > 1) {
      const autoScroll = setInterval(() => {
        setCurrentLocationIndex((prevIndex) =>
          prevIndex === selectedLocations.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(autoScroll);
    }
  }, [selectedLocations]);

  // ✅ Extract Employee Details dynamically
  const employeeName = employeeData?.employeeName || 'Unknown User';
  const employeeID = employeeData?.employeeID || '123456';
  const designation = employeeData?.designation || 'Operator';
  const userLat = employeeData?.lat ?? 'Unknown';
  const userLng = employeeData?.lng ?? 'Unknown';
  const employeePhoto =
    employeeData?.employeePhoto || '/assets/default-user.png';
  const currentTime = new Date();

  // ✅ Function to Handle Location Selection
  const toggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  // ✅ Function to Manually Scroll Through Locations
  const goToPreviousLocation = () => {
    setCurrentLocationIndex((prevIndex) =>
      prevIndex === 0 ? selectedLocations.length - 1 : prevIndex - 1
    );
  };

  const goToNextLocation = () => {
    setCurrentLocationIndex((prevIndex) =>
      prevIndex === selectedLocations.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className='flex flex-col min-h-screen bg-white-100'>
      <div className='flex-grow p-4'>
        <Header title='Live Monitoring' />

        {/* ✅ Location Multi-Selection Panel */}
        <div className='mt-6 bg-white p-6 rounded-xl shadow-md'>
          <h2 className='text-lg font-semibold text-gray-800 mb-3'>
            Select Locations to Monitor
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2'>
            {locations.map((location, index) => (
              <label
                key={index}
                className='flex items-center space-x-2 bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition'>
                <input
                  type='checkbox'
                  checked={selectedLocations.includes(location)}
                  onChange={() => toggleLocation(location)}
                  className='h-4 w-4'
                />
                <span className='text-sm text-gray-700'>{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ✅ Display Only One Location at a Time with Arrows */}
        {selectedLocations.length > 0 && (
          <div className='mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-200 relative flex items-center'>
            {/* Left Arrow */}
            {selectedLocations.length > 1 && (
              <button
                className='absolute left-2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full'
                onClick={goToPreviousLocation}>
                <ArrowLeft size={20} />
              </button>
            )}

            {/* Current Location Display */}
            <div className='w-full text-center'>
              <h2 className='text-2xl font-semibold text-orange-600'>
                {selectedLocations[currentLocationIndex]} - Live Data
              </h2>

              {liveData[selectedLocations[currentLocationIndex]] ? (
                <>
                  {/* Truck Weight Image + Dynamic Weight */}
                  <div className='bg-orange-500 flex items-center justify-center relative p-8 rounded-lg mt-4'>
                    <img
                      src='/public/assets/vehicle-weight.svg'
                      alt='Vehicle Weight'
                      className='w-[80%] md:w-[90%] lg:w-full max-w-xl'
                    />
                    <span className='absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-[90%] text-white text-5xl font-bold'>
                      {
                        liveData[selectedLocations[currentLocationIndex]]
                          .currentWeight
                      }{' '}
                      Kg
                    </span>
                  </div>
                </>
              ) : (
                <p className='text-center text-gray-500 mt-4'>
                  Waiting for live data...
                </p>
              )}
            </div>

            {/* Right Arrow */}
            {selectedLocations.length > 1 && (
              <button
                className='absolute right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full'
                onClick={goToNextLocation}>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default LiveMonitoring;

/*Next Steps
Replace Static Values with Live API Data from Weighbridge Sensors.
Enhance CCTV Feeds with Real Video Streams.
Optimize Storage by clearing localStorage after a certain time.*/

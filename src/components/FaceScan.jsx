import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FaceScan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCamera, setShowCamera] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const isShiftEnd = location.state?.shiftEnd || false;

  // 📍 Known Locations (for fuzzy matching)
  const knownLocations = [
    { name: "Vivek's Home", lat: 28.422537, lng: 77.03268 },
    { name: "Vivek's Class", lat: 28.4238432, lng: 77.0474929 },
    { name: 'Mumbai Office', lat: 19.076, lng: 72.8777 },
    { name: 'Gurgaon Office', lat: 28.423, lng: 77.031 },
    { name: 'Test Location', lat: 28.6109361, lng: 77.5959684 },
  ];

  // 📍 Haversine distance formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const startCamera = () => {
    setShowCamera(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('❌ Camera Access Denied:', err));
  };

  const captureAndUpload = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 300, 300);
    const imageUrl = canvasRef.current.toDataURL('image/png');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // 🔍 Fuzzy match to closest known location
        let closestLocation = 'Unknown Location';
        let minDistance = Infinity;

        knownLocations.forEach((loc) => {
          const dist = getDistance(userLat, userLng, loc.lat, loc.lng);
          console.log(`📏 Distance from ${loc.name}: ${dist.toFixed(3)} km`);
          if (dist < minDistance && dist < 0.2) {
            // 200 meters
            minDistance = dist;
            closestLocation = loc.name;
          }
        });

        console.log('📍 Location Name being passed:', closestLocation);

        // Simulate upload
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress === 100) {
            clearInterval(interval);
            alert('✅ Face Captured Successfully!');
            navigate('/attendance-confirmation', {
              state: {
                userName: location.state?.userName || 'Unknown User',
                faceCaptured: true,
                lat: userLat,
                lng: userLng,
                photo: imageUrl,
                locationName: closestLocation,
                shiftEnd: isShiftEnd,
              },
            });
          }
        }, 500);
      },
      () => {
        alert('❌ Unable to fetch location. Please enable GPS.');
      }
    );
  };

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <div className='flex-grow flex flex-col md:flex-row items-center justify-center py-12 px-4 md:gap-20'>
        <div className='hidden md:block w-1/2'>
          <img
            src='/assets/selfie.svg'
            alt='Smile to Verify'
            className='max-w-[80%]'
          />
        </div>

        <div className='w-full md:w-1/3 p-10 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(255,101,0,0.2)] ring-1 ring-orange-100 hover:shadow-[0_25px_60px_rgba(255,101,0,0.3)] transition-all duration-300'>
          <img
            src='/assets/kanta-king-logo.svg'
            alt='Kanta King Logo'
            className='h-25 mx-auto mb-8'
          />

          <h1 className='text-2xl font-bold text-gray-800 mb-4'>
            {isShiftEnd
              ? 'SMILE TO END YOUR SHIFT'
              : 'मुस्कुराइए, आप इन्वेंटरी कर रहें हैं 😊'}
          </h1>
          <p className='text-gray-600 mb-6'>
            {isShiftEnd
              ? 'Scan your face to confirm shift end.'
              : 'Scan your face to verify your identity'}
          </p>

          {showCamera ? (
            <div>
              <video
                ref={videoRef}
                autoPlay
                className='mx-auto w-full rounded-lg shadow-md'
              />
              <canvas
                ref={canvasRef}
                className='hidden'
              />
              <div className='relative w-full bg-gray-200 rounded-full h-4 mt-4'>
                <div
                  className='bg-orange-500 h-4 rounded-full'
                  style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p className='text-gray-600 text-sm mt-2'>
                Hold the phone straight in front of your face and smile. We love
                to see you happy!
              </p>
              <button
                className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mt-4'
                onClick={captureAndUpload}>
                {isShiftEnd ? 'Capture & End Shift' : 'Capture & Upload'}
              </button>
            </div>
          ) : (
            <button
              className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600'
              onClick={startCamera}>
              I’m Ready to Smile
            </button>
          )}
        </div>
      </div>

      <footer
        className='w-full text-center py-4 px-6 mt-6 
  bg-white/60 backdrop-blur-md 
  border-t border-orange-100 
  shadow-[0_-2px_10px_rgba(0,0,0,0.05)] 
  text-sm text-gray-600 font-medium tracking-wide'>
        © {new Date().getFullYear()} Crafted with{' '}
        <span className='text-red-500'>❤</span> by Kanta King Technologies Pvt
        Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default FaceScan;

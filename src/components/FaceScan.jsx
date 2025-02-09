import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const FaceScan = () => {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const location = useLocation();

  // ✅ Start Camera Function
  const startCamera = () => {
    setShowCamera(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("❌ Camera Access Denied:", err));
  };

  // ✅ Capture & Upload Image
  const captureAndUpload = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 300);

      // ✅ Convert Captured Image to Base64
  const imageUrl = canvasRef.current.toDataURL("image/png");

      // ✅ Fetch current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;


    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        alert("✅ Face Captured Successfully!");
        navigate("/attendance-confirmation", {
          state: {
            userName: location.state?.userName || "Unknown User", // ✅ Pass the userName
            faceCaptured: true,
            lat: userLat, // ✅ Pass Current Latitude
            lng: userLng, // ✅ Pass Current Longitude
            photo: imageUrl, // ✅ Pass Captured Photo

          },
        });
      }
    }, 500);
  },
  () => {
    alert("❌ Unable to fetch location. Please enable GPS.");
  }
);
};

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center py-12 px-4 md:gap-20">
        
        {/* Left Side - Face Scan Illustration */}
        <div className="hidden md:block w-1/2">
          <img src="/assets/selfie.svg" alt="Smile to Verify" className="max-w-[80%]" />
        </div>

        {/* Right Side - Face Scan Instructions */}
        <div className="w-full md:w-1/3 bg-white p-10 shadow-md rounded-lg text-center">
          <img src="/assets/kanta-king-logo.svg" alt="Kanta King Logo" className="h-25 mx-auto mb-8" />

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            SMILE TO MARK YOUR ATTENDANCE
          </h1>
          <p className="text-gray-600 mb-6">Scan your face to verify your identity</p>

          {/* Camera & Capture UI */}
          {showCamera ? (
            <div>
              <video ref={videoRef} autoPlay className="mx-auto w-full rounded-lg shadow-md" />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Upload Progress Bar */}
              <div className="relative w-full bg-gray-200 rounded-full h-4 mt-4">
                <div className="bg-orange-500 h-4 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Hold the phone straight in front of your face and smile. We love to see you happy!
              </p>

              {/* Capture Button */}
              <button
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mt-4"
                onClick={captureAndUpload}
              >
                Capture & Upload
              </button>
            </div>
          ) : (
            /* Button to Start Camera */
            <button
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
              onClick={startCamera}
            >
              I’m Ready to Smile
            </button>
          )}
        </div>
      </div>

      <footer className="w-full text-center py-4 bg-gray-100 text-gray-600 text-sm mt-auto">
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default FaceScan;


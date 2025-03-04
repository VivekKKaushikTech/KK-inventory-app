import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ FIX: Import useLocation
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || 'Unknown User'; // ✅ Fix userName

  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);

  console.log('🟢 Debug: Received userName in QRCodeScan →', userName);

  console.log('🟢 Debug: Received userName →', userName); // ✅ Debugging userName

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        if (!scanResult) {
          setScanResult(decodedText);
          alert('✅ QR Code Scanned Successfully! Redirecting...');

          // ✅ Navigate to Shift Handover Page with Scanned Data
          setTimeout(() => {
            navigate('/shift-handover', {
              state: {
                scannedQR: decodedText,
                userName: location.state?.userName || 'Unknown User',
                lat: location.state?.lat || 'Unknown', // ✅ Pass Latitude
                lng: location.state?.lng || 'Unknown', // ✅ Pass Longitude
                employeeID: location.state?.employeeID || '123456',
                designation: location.state?.designation || 'Operator',
                photo: location.state?.photo || '/assets/default-user.png',
              },
            });
          }, 1000);
        }
      },
      (error) => console.log('QR Scan Error:', error)
    );

    return () => {
      scannerRef.current
        .clear()
        .catch((err) => console.log('Scanner Cleanup Error:', err));
    };
  }, [navigate, scanResult]); // ✅ Ensure state updates & navigation work correctly

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white text-black p-6'>
      {/* Heading */}
      <h1 className='text-xl font-bold mb-4'>
        Scan Previous Shift's Operator’s QR Code
      </h1>

      {/* QR Scanner */}
      <div
        id='qr-reader'
        className='w-full max-w-md bg-gray-200 p-4 rounded-lg shadow-md'></div>

      {/* Scan Button */}
      <button
        className='mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600'
        onClick={() => alert('Align the QR code within the frame')}>
        Scan QR Code
      </button>

      {/* Display Scanned Result */}
      {scanResult && (
        <p className='mt-4 text-green-400 font-semibold'>
          Scanned: {scanResult}
        </p>
      )}
    </div>
  );
};

export default QRCodeScan;

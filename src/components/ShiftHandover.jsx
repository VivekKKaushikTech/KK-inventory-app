import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCamera, FaCommentDots } from 'react-icons/fa'; // Icons for Remarks & Camera

const ShiftHandover = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName || 'Unknown User';
  console.log('🟢 Debug: ShiftHandover received userName →', userName);
  const userLat = location.state?.lat ?? 'Unknown';
  const userLng = location.state?.lng ?? 'Unknown';

  console.log('📌 Debug: Received Location →', userLat, userLng);
  console.log('📌 Debug: Sending Data to Dashboard →', {
    employeeName: location.state?.userName,
    employeeID: location.state?.employeeID,
    designation: location.state?.designation,
    lat: location.state?.lat,
    lng: location.state?.lng,
    employeePhoto: location.state?.photo,
  });

  const currentDateTime = new Date().toLocaleString();

  // Shift Checklist Items with Toggle State, Remarks, and Image Capture
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      label: 'Is COMPUTER WORKING OK ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 2,
      label: 'Is PRINTER WORKING OK ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 3,
      label: 'Are A4 PAGES - 2 BUNDLES in stock ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 4,
      label: 'Is OPERATOR TABLE CLEAN and well organised ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 5,
      label: 'Is OPERATOR ROOM CLEAN and well organised ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 6,
      label: 'Are AREAS AROUND WEIGHBRIDGE clean ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 7,
      label: 'Are GITTIS AROUND WEIGHBRIDGE clean ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 8,
      label: 'Are there EQUAL WEIGHT ON EACH CORNER of the Weighbridge ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 9,
      label: 'Are BOLTS OF WEIGHBRIDGE Tight ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 10,
      label: 'Are all CAMERA ANGLES OK ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 11,
      label: 'Is SOFTWARE CAPTURING RIGHT IMAGES from the cameras ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 12,
      label: 'Is WEIGHBRIDGE PATE free ?',
      value: null,
      remarks: '',
      image: null,
    },
    {
      id: 13,
      label: 'Have you RANDOMLY PRINTED 15 DAYS OLD SLIP / Parchi ?',
      value: null,
      remarks: '',
      image: null,
    },
  ]);

  // Function to Handle Toggle Switch
  const handleToggle = (id, value) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  // Function to Handle Remarks Input
  const handleRemarks = (id, text) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, remarks: text } : item
      )
    );
  };

  // Function to Handle Image Capture (Simulated)
  const handleCapture = async (id) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 300, 300);

        const imageUrl = canvas.toDataURL('image/png'); // Convert Image to Base64

        setChecklist((prevChecklist) =>
          prevChecklist.map((item) =>
            item.id === id ? { ...item, image: imageUrl } : item
          )
        );

        stream.getTracks().forEach((track) => track.stop()); // Stop Camera
        alert('✅ Image Captured Successfully!');
      }, 2000); // Capture Image after 2 seconds for better focus
    } catch (error) {
      alert('❌ Camera Access Denied: Please grant camera permission.');
      console.error('Camera Error:', error);
    }
  };

  // Function to Handle Form Submission
  const handleSubmit = () => {
    console.log('📋 Shift Handover Checklist Data:', checklist);
    alert('✅ Shift Handover Submitted Successfully!');
    navigate('/dashboard'); // Redirect to Dashboard
  };

  return (
    <div className='min-h-screen flex flex-col bg-white-100 p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <img
          src='/assets/kanta-king-logo.svg'
          alt='Kanta King Logo'
          className='h-15'
        />
      </div>

      {/* Title & Info */}
      <h1 className='text-2xl font-bold text-gray-800'>
        Please check and confirm your shift-handover list, {userName}!
      </h1>
      <p className='text-gray-600 mt-2'>
        📍 Location: {userLat}, {userLng}
      </p>
      <p className='text-gray-600 mb-6'>📅 Date & Time: {currentDateTime}</p>

      {/* Checklist Table */}
      <div className='bg-white p-4 rounded-lg shadow-lg'>
        {checklist.map((item) => (
          <div
            key={item.id}
            className='flex items-center justify-between border-b py-3'>
            <span className='text-gray-700'>
              {item.label
                .split(/(\b[A-Z\s-]+\b)/)
                .map((part, index) =>
                  /^[A-Z\s-]+$/.test(part) ? (
                    <strong key={index}>{part}</strong>
                  ) : (
                    part
                  )
                )}
            </span>

            {/* Toggle Switch */}
            <div className='flex items-center'>
              <button
                className={`px-4 py-2 rounded-lg ${
                  item.value === true
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300'
                }`}
                onClick={() => handleToggle(item.id, true)}>
                Yes
              </button>
              <button
                className={`ml-2 px-4 py-2 rounded-lg ${
                  item.value === false ? 'bg-red-500 text-white' : 'bg-gray-300'
                }`}
                onClick={() => handleToggle(item.id, false)}>
                No
              </button>

              {/* Remarks Icon */}
              <FaCommentDots
                className='ml-3 text-blue-500 cursor-pointer'
                onClick={() => {
                  const remark = prompt('Enter your remarks:');
                  handleRemarks(item.id, remark);
                }}
              />

              {/* Capture Image Icon */}
              <FaCamera
                className='ml-3 text-orange-500 cursor-pointer'
                onClick={handleCapture} // ✅ Open Camera on Click
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mt-6'
        onClick={() => {
          console.log(
            '✅ Shift Handover Submitted! Navigating to Dashboard...'
          );

          const userData = {
            employeeName: location.state?.userName || 'Unknown User',
            employeeID: location.state?.employeeID || '123456',
            designation: location.state?.designation || 'Operator',
            lat: location.state?.lat || 'Unknown',
            lng: location.state?.lng || 'Unknown',
            employeePhoto: location.state?.photo || '/assets/default-user.png',
          };

          // ✅ Save to Local Storage BEFORE navigating
          localStorage.removeItem('dashboardUserData');
          navigate('/dashboard', { state: userData, replace: true });

          // ✅ Navigate with state ONCE
          setTimeout(() => {
            navigate('/dashboard', { state: userData, replace: true });
          }, 50); // ✅ Short delay ensures smooth state transition
        }}>
        Submit
      </button>

      {/* Footer */}
      <footer className='w-full text-center py-4 text-gray-600 text-sm mt-6'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default ShiftHandover;

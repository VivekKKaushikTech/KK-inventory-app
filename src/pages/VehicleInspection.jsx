import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ Keep only this
import { FaCamera, FaEdit, FaUpload, FaPlus, FaMinus } from 'react-icons/fa';
import {
  Camera,
  Pencil,
  UploadCloud,
  Plus,
  Minus,
  ArrowLeft,
} from 'lucide-react';
import Header from '../components/Header';
import WeightButtons from '../components/WeightButtons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import emailjs from 'emailjs-com';
import { FaArrowLeft } from 'react-icons/fa';

const VehicleInspection = () => {
  const navigate = useNavigate();

  const [deviationDetected, setDeviationDetected] = useState(false);
  const [isWeighVehicleEnabled, setIsWeighVehicleEnabled] = useState(true);

  useEffect(() => {
    if (deviationDetected) {
      setIsWeighVehicleEnabled(false); // Disable the button if Deviation is ON
    } else {
      setIsWeighVehicleEnabled(true); // Enable the button if Deviation is OFF
    }
  }, [deviationDetected]);

  // ✅ Retrieve stored values for Receipt Number & Vehicle Number
  const [isExpanded, setIsExpanded] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState(
    localStorage.getItem('vehicleNumber') || 'Not Entered'
  );
  const [receiptNumber, setReceiptNumber] = useState('Not Generated');

  useEffect(() => {
    // ✅ Get latest receipt number from localStorage
    const latestReceipt =
      localStorage.getItem('receiptNumber') || 'Not Generated';
    setReceiptNumber(latestReceipt); // ✅ Update state
  }, []); // Runs once when component mounts

  const [activeTab, setActiveTab] = useState('firstWeight');

  const [deviationReport, setDeviationReport] = useState('');
  const [deviationImages, setDeviationImages] = useState([]);

  // ✅ Extracting Passed Data from Weighment Page
  const location = useLocation();
  const { basicInfo = {}, employeeData = {} } = location.state || {};

  // ✅ Function to open Camera (Placeholder Implementation)
  const openCamera = (id) => {
    alert(`Open camera for item ID: ${id}`);
  };

  const submitDeviationReport = async () => {
    const input = document.getElementById('pdf-content'); // Capture the entire page content

    // ✅ Hide Unnecessary Elements Before Capture
    const elementsToHide = document.querySelectorAll('.exclude-from-pdf');
    elementsToHide.forEach((el) => (el.style.display = 'none'));

    // ✅ Convert HTML to Canvas
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // ✅ Add Title "Deviation Alert !!!" at the top of the PDF
      pdf.setFontSize(20);
      pdf.setTextColor(255, 0, 0); // Red Color for Title
      pdf.text('Deviation Alert !!!', pdf.internal.pageSize.width / 2, 15, {
        align: 'center',
      });

      // ✅ Reset text color to black for normal content
      pdf.setTextColor(0, 0, 0);

      const imgWidth = 190; // Width of the PDF
      const pageHeight = 297; // A4 page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, 0);

      // ✅ Restore Hidden Elements After Capture
      elementsToHide.forEach((el) => (el.style.display = ''));

      let yPosition = 10;
      let heightLeft = imgHeight;
      let pageIndex = 0;

      while (heightLeft > 0) {
        // ✅ Add the image section-wise to fit on the page
        const pdfSection = document.createElement('canvas');
        pdfSection.width = canvas.width;
        pdfSection.height = Math.min(
          canvas.height,
          (pageHeight - 20) * (canvas.width / imgWidth)
        );

        const ctx = pdfSection.getContext('2d');
        ctx.drawImage(
          canvas,
          0,
          pageIndex * pdfSection.height,
          canvas.width,
          pdfSection.height,
          0,
          0,
          canvas.width,
          pdfSection.height
        );

        const sectionImg = pdfSection.toDataURL('image/png');
        pdf.addImage(sectionImg, 'PNG', 10, yPosition, imgWidth, 0);

        heightLeft -= pageHeight - 20;
        pageIndex++;

        if (heightLeft > 0) pdf.addPage();
      }

      // ✅ Check if Deviation Report is detected
      if (deviationDetected) {
        pdf.addPage(); // ✅ Add a new page for the report
        pdf.setFontSize(14);
        pdf.text('Deviation Report', 10, 20); // ✅ Title at Y = 20

        // ✅ Insert Deviation Report text with more margin
        pdf.setFontSize(12);
        let textLines = pdf.splitTextToSize(
          deviationReport || 'No Deviation Report Provided',
          180
        );

        let startY = 30; // ✅ Increase Y-position to add margin below the title

        textLines.forEach((line, index) => {
          pdf.text(line, 10, startY + index * 6, { align: 'left' }); // ✅ Moves each line down by 6mm, keeping top alignment
        });

        // ✅ Determine new yPosition after text
        let yPos = startY + textLines.length * 6; // ✅ Correct top spacing

        // ✅ Ensure extra spacing between sections
        yPos += 10;

        // ✅ Check if yPos exceeds page height, move to a new page
        if (yPos + 60 > pdf.internal.pageSize.height - 20) {
          pdf.addPage();
          yPos = 20; // Reset to top on new page
        }

        pdf.setFontSize(14);
        pdf.text('Attached Images:', 10, yPos);
        yPos += 10;

        // ✅ Add uploaded images to the PDF
        for (const image of deviationImages) {
          const imgURL = URL.createObjectURL(image);
          const img = new Image();
          img.src = imgURL;

          pdf.addImage(img, 'PNG', 10, yPos, 80, 50);
          yPos += 60;

          // ✅ If image reaches bottom of page, add new page
          if (yPos + 60 > pdf.internal.pageSize.height - 20) {
            pdf.addPage();
            yPos = 20;
          }
        }
      }

      // ✅ Auto-download PDF
      const pdfFileName = `Vehicle_Inspection_Report_${vehicleNumber}.pdf`;
      pdf.save(pdfFileName);

      // ✅ Send PDF via Email
      const pdfBlob = pdf.output('blob');
      sendPDFEmail(pdfBlob, pdfFileName);
    });
  };

  const sendPDFEmail = (pdfBlob, pdfFileName) => {
    emailjs
      .send(
        'your_service_id', // Replace with your EmailJS service ID
        'your_template_id', // Replace with your EmailJS template ID
        {
          to_email: 'recipient@example.com',
          pdfFile: pdfBlob,
          pdfFileName: pdfFileName,
        },
        'your_user_id' // Replace with your EmailJS user ID
      )
      .then((response) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
      });
  };

  // ✅ State for OTPs
  const [clientOTP, setClientOTP] = useState('');
  const [generatedClientOTP, setGeneratedClientOTP] = useState(null);
  const [clientOTPVerified, setClientOTPVerified] = useState(false);

  const [managerOTP, setManagerOTP] = useState('');
  const [generatedManagerOTP, setGeneratedManagerOTP] = useState(null);
  const [managerOTPVerified, setManagerOTPVerified] = useState(false);

  // ✅ Function to Generate Random 6-Digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  };

  // ✅ Generate Client OTP
  const handleGenerateClientOTP = () => {
    const newOTP = generateOTP();
    setGeneratedClientOTP(newOTP);
    setClientOTP(''); // Reset input field
    setClientOTPVerified(false);
    alert(`Client OTP: ${newOTP}`); // Simulate sending OTP (Replace with API call)
  };

  // ✅ Generate Manager OTP
  const handleGenerateManagerOTP = () => {
    const newOTP = generateOTP();
    setGeneratedManagerOTP(newOTP);
    setManagerOTP(''); // Reset input field
    setManagerOTPVerified(false);
    alert(`Manager OTP: ${newOTP}`); // Simulate sending OTP (Replace with API call)
  };

  const verifyClientOTP = () => {
    const isVerified = clientOTP === generatedClientOTP;
    setClientOTPVerified(isVerified);
    checkIfCanWeighVehicle(isVerified, managerOTPVerified);
  };

  const verifyManagerOTP = () => {
    const isVerified = managerOTP === generatedManagerOTP;
    setManagerOTPVerified(isVerified);
    checkIfCanWeighVehicle(clientOTPVerified, isVerified);
  };

  // ✅ New function to check OTP verification status and enable "Weigh the Vehicle"
  const checkIfCanWeighVehicle = (clientVerified, managerVerified) => {
    setIsWeighVehicleEnabled(clientVerified && managerVerified);
  };

  // ✅ Checklist Items (Fixed Duplicate ID Issue)
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      itemName: 'Battey/बट्टे',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 2,
      itemName: 'Belt Machine/बेल्ट मशीन',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 3,
      itemName: 'Blanket/कम्बल',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 4,
      itemName: 'Bucket/बाल्टी',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 5,
      itemName: 'Chain/चैन',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 6,
      itemName: 'Diesel Tank/डीजल टैंक',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 7,
      itemName: 'Extra Battery/एक्स्ट्रा बैटरी',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 8,
      itemName: 'Fattey/फट्टे',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 9,
      itemName: 'Fire Cylinder/फायर सिलिंडर',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 10,
      itemName: 'Gas Cylinder/गैस सिलिंडर',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 11,
      itemName: 'Gutkey/गुटके',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 12,
      itemName: 'Iron Plate/लोहे की प्लेट',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 13,
      itemName: 'Jack/जैक',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 14,
      itemName: 'Hydraulic Jack/हाइड्रोलिक जैक',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 15,
      itemName: 'Khute/खूटे',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 16,
      itemName: 'Panna/पान्ना',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 17,
      itemName: 'Pipe/पाइप',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 18,
      itemName: 'Rod/रोड',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 19,
      itemName: 'Ropes/रस्से',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 20,
      itemName: 'Sariya/सरिया',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 21,
      itemName: 'Shikanja/शिकंजा',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 22,
      itemName: 'Speaker/स्पीकर',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 23,
      itemName: 'Stepney/स्टेपनी',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 24,
      itemName: 'Stopper/स्टॉपर',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 25,
      itemName: 'Tirpal/तिरपाल',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 26,
      itemName: 'Tool Set/टूल सेट',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 27,
      itemName: 'Tyre Lever/टायर लीवर',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 28,
      itemName: 'Utensils/बर्तन सेट',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 29,
      itemName: 'Water Cane/पानी की केन',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 30,
      itemName: 'Wheel Panna/पहिया पाना',
      available: false,
      removed: false,
      remarks: '',
    },
    {
      id: 31,
      itemName: 'Wooden Slipper/लकड़ी के स्लीपर',
      available: false,
      removed: false,
      remarks: '',
    },
  ]);

  // ✅ State for remarks modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRemark, setCurrentRemark] = useState('');
  const [currentItemId, setCurrentItemId] = useState(null);

  // ✅ Function to toggle availability and removal state
  const toggleField = (id, field) => {
    setChecklist((prevChecklist) =>
      prevChecklist.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    );
  };

  // ✅ Function to open remarks modal
  const openRemarksModal = (id, remark) => {
    setCurrentItemId(id);
    setCurrentRemark(remark);
    setModalOpen(true);
  };

  // ✅ Function to save remarks
  const saveRemarks = () => {
    setChecklist((prevChecklist) =>
      prevChecklist.map((item) =>
        item.id === currentItemId ? { ...item, remarks: currentRemark } : item
      )
    );
    setModalOpen(false);
  };

  const saveAsDraft = () => {
    // ✅ Gather all relevant data
    const draftData = {
      receiptNumber,
      vehicleNumber,
      basicInfo,
      deviationDetected,
      deviationReport,
      deviationImages,
      checklist,
      timestamp: new Date().toISOString(), // ✅ Store timestamp for sorting in Activity Log
    };

    // ✅ Retrieve existing drafts from localStorage
    const existingDrafts =
      JSON.parse(localStorage.getItem('draftTransactions')) || [];

    // ✅ Append the new draft
    const updatedDrafts = [...existingDrafts, draftData];

    // ✅ Save updated drafts back to localStorage
    localStorage.setItem('draftTransactions', JSON.stringify(updatedDrafts));

    // ✅ Clear form fields before redirection
    localStorage.removeItem('vehicleNumber');
    localStorage.removeItem('receiptNumber');

    // ✅ Redirect user to Weighment Page
    navigate('/dashboard/weighment');
  };

  return (
    <div
      className='min-h-screen bg-white'
      id='pdf-content'>
      {/* ✅ Header Section */}
      <Header title='Vehicle Inspection' />

      {/* 🔙 Modern Back Button */}
      <div className='flex items-center mt-4 px-0'>
        <button
          onClick={() => navigate('/dashboard/weighment')}
          className='flex items-center gap-2 text-gray-700 bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-all exclude-from-pdf'>
          <ArrowLeft className='text-gray-600' />
          Back to Basic Info
        </button>
      </div>

      {/* ✅ Show "Deviation Alert !!" Only When Toggle is ON */}
      {deviationDetected && (
        <div className='flex items-center justify-center bg-red-500 text-white text-lg font-semibold rounded-lg shadow-md py-3 px-5 mb-4'>
          <span className='text-xl'>🚨</span>
          <span className='ml-2'>Deviation Alert!</span>
        </div>
      )}

      {/* ✅ Weight Buttons (Second Weight Disabled) */}
      <WeightButtons
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disableSecondWeight={true}
      />

      {/* ✅ Receipt Number Field */}
      <div className='mt-4 flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-md'>
        <span className='text-gray-600 font-medium'>Receipt Number:</span>
        <div className='px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-semibold shadow-sm'>
          {receiptNumber}
        </div>
      </div>

      {/* ✅ Collapsible Basic Info Section */}
      <div className='mt-6 bg-white p-5 rounded-xl shadow-md border border-gray-200'>
        <div
          className='flex justify-between items-center cursor-pointer'
          onClick={() => setIsExpanded(!isExpanded)}>
          <h2 className='text-xl font-semibold text-orange-600'>Basic Info</h2>
          <button className='text-orange-600 transition-transform duration-300'>
            {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
          </button>
        </div>

        {/* ✅ Show Data When Expanded */}
        {isExpanded && (
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Object.keys(basicInfo).length > 0 ? (
              Object.keys(basicInfo).map((key) => (
                <div
                  key={key}
                  className='flex flex-col'>
                  <label className='text-gray-600 font-medium mb-1'>
                    {key
                      .replace(/([A-Z])/g, ' $1') // Add spaces before uppercase letters
                      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
                      .trim()}
                  </label>
                  <input
                    type='text'
                    className='w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-orange-400 outline-none'
                    value={basicInfo[key] || 'Not Provided'}
                    readOnly
                  />
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-center col-span-full'>
                No Basic Info Available
              </p>
            )}
          </div>
        )}
      </div>

      {/* ✅ Vehicle Inspection Checklist */}
      <div className='mt-6 bg-white p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold text-orange-500 mb-4'>
          Vehicle Inspection Check List
        </h2>

        {/* ✅ Checklist Table */}
        <div className='overflow-x-auto'>
          <table className='w-full border border-gray-300 rounded-lg shadow-sm'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='p-3 border text-left'>Item Name</th>
                <th className='p-3 border text-center'>Available on Truck</th>
                <th className='p-3 border text-center'>Removed from Truck</th>
                <th className='p-3 border text-center'>Capture Photo</th>
                <th className='p-3 border text-center'>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((item) => (
                <tr
                  key={item.id}
                  className='border text-gray-800 bg-white hover:bg-gray-50 transition'>
                  {/* Item Name */}
                  <td className='p-3 border text-left'>{item.itemName}</td>

                  {/* Toggle: Available on Truck */}
                  <td className='p-3 border text-center'>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={item.available}
                        onChange={() => toggleField(item.id, 'available')}
                        className='sr-only peer'
                      />
                      <div className='w-12 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer-checked:bg-green-500 peer-checked:after:translate-x-6 after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all'></div>
                    </label>
                  </td>

                  {/* Toggle: Removed from Truck */}
                  <td className='p-3 border text-center'>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={item.removed}
                        onChange={() => toggleField(item.id, 'removed')}
                        className='sr-only peer'
                      />
                      <div className='w-12 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer-checked:bg-red-500 peer-checked:after:translate-x-6 after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all'></div>
                    </label>
                  </td>

                  {/* Capture Photo Button */}
                  <td className='p-3 border text-center'>
                    <button
                      className='p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition'
                      onClick={() => openCamera(item.id)} // Call function to open camera
                    >
                      <Camera size={22} />
                    </button>
                  </td>

                  {/* Remarks Icon Button */}
                  <td className='p-3 border text-center'>
                    <button
                      className='text-gray-500 hover:text-gray-800 transition'
                      onClick={() => openRemarksModal(item.id, item.remarks)}>
                      <Pencil size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Remarks Modal */}
      {modalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3'>
            <h2 className='text-lg font-bold text-gray-800 mb-4'>
              Enter Remarks
            </h2>
            <textarea
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none'
              value={currentRemark}
              onChange={(e) => setCurrentRemark(e.target.value)}
              placeholder='Type your remarks here...'
            />
            <div className='mt-4 flex justify-end gap-3'>
              <button
                className='bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition'
                onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button
                className='bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition'
                onClick={saveRemarks}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deviation / Theft Attempt Section */}
      <div className='mt-6 p-4 border rounded-lg bg-gray-100 shadow-md exclude-from-pdf'>
        <h2 className='text-lg font text-red-500'>
          Any Deviation / Theft Attempt Detected during Vehicle Inspection
        </h2>

        {/* Toggle Switch for Yes/No */}
        <div className='mt-2 flex items-center gap-4'>
          <span className='text-gray-700'>Detected:</span>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={deviationDetected}
              onChange={() => setDeviationDetected(!deviationDetected)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {/* Show Report Input & Image Upload if "Yes" is Selected */}
        {deviationDetected && (
          <div className='mt-4 p-4 border rounded-lg bg-white shadow'>
            {/* Report Textarea */}
            <label className='text-gray-700 font-medium'>
              Deviation Report
            </label>
            <textarea
              className='w-full p-2 border rounded-lg mt-2'
              placeholder='Enter details about the deviation...'
              rows='3'
              value={deviationReport}
              onChange={(e) => setDeviationReport(e.target.value)}></textarea>

            {/* Image Upload */}
            <div className='mt-4'>
              <label className='text-gray-700 font-medium'>Attach Images</label>
              <div className='flex items-center gap-2 mt-2'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  id='deviation-image-upload'
                  onChange={(e) =>
                    setDeviationImages([...deviationImages, ...e.target.files])
                  }
                  multiple
                />
                <label
                  htmlFor='deviation-image-upload'
                  className='p-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-300 transition'>
                  <UploadCloud /> Upload Images
                </label>
              </div>

              {/* Show Uploaded Image Names */}
              {deviationImages.length > 0 && (
                <ul className='mt-2 text-sm text-gray-600'>
                  {deviationImages.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* ✅ Submit Deviation Report Button */}
            <button
              className='mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition exclude-from-pdf'
              onClick={submitDeviationReport}>
              Submit Deviation Report
            </button>
          </div>
        )}
      </div>

      {/* Show OTP Verification Only When Deviation is Detected */}
      {deviationDetected && (
        <div className='mt-4 p-4 border rounded-lg bg-white shadow exclude-from-pdf'>
          <h3 className='text-gray-700 font-medium mb-2'>OTP Verification</h3>

          {/* OTP Row - Client & Manager */}
          <div className='flex flex-wrap items-center gap-6 exclude-from-pdf'>
            {/* ✅ Manager OTP Section */}
            <div className='flex items-center gap-2 exclude-from-pdf'>
              <span className='text-gray-700 font-medium'>Manager OTP:</span>
              <button
                className='px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition'
                onClick={handleGenerateManagerOTP}>
                Generate
              </button>
              {generatedManagerOTP && (
                <>
                  <input
                    type='text'
                    className='p-2 border border-gray-300 rounded-lg w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-400'
                    placeholder='Enter OTP'
                    value={managerOTP}
                    onChange={(e) => setManagerOTP(e.target.value)}
                  />
                  <button
                    className='px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition'
                    onClick={verifyManagerOTP}>
                    Verify
                  </button>
                  {managerOTPVerified ? (
                    <span className='text-green-500 text-lg'>✔</span>
                  ) : managerOTP !== '' ? (
                    <span className='text-red-500 text-lg'>✖</span>
                  ) : (
                    ''
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className='mt-6 flex justify-between gap-4'>
        {/* ✅ "Save as Draft" button should only appear when Deviation is detected */}
        {deviationDetected && (
          <div className='flex'>
            <button
              onClick={saveAsDraft} // ✅ Call the function
              className='bg-orange-500 text-white px-6 py-3 text-lg font-semibold rounded-md shadow-md transition-all duration-300 hover:bg-orange-600 hover:shadow-lg active:scale-95 focus:outline-none exclude-from-pdf'>
              Save as Draft
            </button>
          </div>
        )}

        {/* ✅ Weigh the Vehicle Button (Fixed Syntax) */}
        <div className='flex flex-grow justify-end'>
          <button
            className={`px-6 py-3 text-lg font-semibold rounded-md shadow-md transition-all duration-300 
        ${
          isWeighVehicleEnabled
            ? 'bg-green-500 text-white hover:bg-green-700 hover:shadow-lg'
            : 'bg-gray-300 text-gray-100 cursor-not-allowed'
        }
        active:scale-95 focus:outline-none`}
            disabled={!isWeighVehicleEnabled}
            onClick={() => {
              if (isWeighVehicleEnabled) {
                navigate('/dashboard/weighment/vehicle-weighing', {
                  state: {
                    receiptNumber,
                    basicInfo,
                    employeeData,
                    vehicleInspection: checklist,
                  },
                });
              }
            }}>
            Weigh the Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleInspection;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus, FaCamera, FaEdit } from 'react-icons/fa';
import {
  ArrowLeft,
  Plus,
  Minus,
  Camera,
  Pencil,
  Mail,
  MessageSquare,
} from 'lucide-react';
import Header from '../components/Header';
import WeightButtons from '../components/WeightButtons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import materialList from '../components/materialList';

const handleSmallPrint = () => {
  window.print();
};

const VehicleWeighing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Declaration for Select Material
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [declarationUploaded, setDeclarationUploaded] = useState(false);
  const [declarationPhoto, setDeclarationPhoto] = useState(null);

  const mandatoryDeclarationMaterials = [
    'TMT 8MM',
    'TMT 12MM',
    'TMT 16MM',
    'TMT 20MM',
    'TMT 25MM',
    'TMT 32MM',
    'FLYASH',
    'CEMENT BAGS',
    'SCRAP TMT',
    'SCRAP ALUMINIUM',
    'SCRAP MS',
    'SCRAP WOODEN',
    'ALUMINIUM SHUTTERING/FORMWORK',
    'PLY SHUTTERING',
    'AGGREGATE 10MM (RODI)',
    'AGGREGATE 20MM (RODI)',
    'COARSE DUST',
    'FINE DUST',
    'MS ACCESSORIES',
    'MS STRUCTURE',
  ];

  // ✅ Define Weighing Info Fields
  const [weighingInfo, setWeighingInfo] = useState({
    material: '',
    transporter: '',
    seller: '',
    buyer: '',
    invoiceChallanNo: '',
    remarks: '',
  });

  const isDeclarationRequired = mandatoryDeclarationMaterials.includes(
    weighingInfo.material
  );

  // ✅ States for Modal Handling
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // ✅ For Parchi Print (Small Size)
  const handleSmallPrint = () => {
    const printable = document.getElementById('printable-receipt');

    if (!printable) {
      console.error('❌ Printable element not found');
      return;
    }

    console.log('🖨️ Showing printable receipt on screen...');
    printable.style.display = 'block';

    requestAnimationFrame(() => {
      console.log('✅ requestAnimationFrame triggered');

      setTimeout(() => {
        console.log('🕒 500ms delay complete. Triggering print...');
        window.print();

        // Post-print hide
        setTimeout(() => {
          console.log('👋 Hiding printable receipt after print');
          printable.style.display = 'none';
        }, 500);
      }, 500); // You can increase this to 1000ms if print dialog is still blank
    });
  };

  // ✅ Function to Open Remarks Modal
  const openRemarksModal = (item) => {
    setSelectedItem(item);
    setIsRemarksModalOpen(true);
  };

  // ✅ Function to Open Photo Modal
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setIsPhotoModalOpen(true);
  };

  const handleSave = () => {
    console.log('Save action triggered!');
  };
  const [generatedPDFUrl, setGeneratedPDFUrl] = useState('');

  const handleShare = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) return;

    try {
      const elementsToHide = document.querySelectorAll('.exclude-from-pdf');
      elementsToHide.forEach((el) => (el.style.display = 'none'));

      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(20);
      pdf.setTextColor(234, 88, 12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Weighing Receipt', pdf.internal.pageSize.width / 2, 15, {
        align: 'center',
      });
      pdf.addImage(imgData, 'PNG', 10, 25, 190, 0);

      elementsToHide.forEach((el) => (el.style.display = ''));

      const pdfBlob = pdf.output('blob');
      const pdfURL = URL.createObjectURL(pdfBlob);

      // ✅ Set the PDF URL to state so we can share via modal buttons
      setGeneratedPDFUrl(pdfURL);
      setShowShareModal(true);
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('Failed to generate and share the PDF.');
    }
  };

  useEffect(() => {
    const fetchRecipients = async () => {
      // TEMP MOCK - replace this with actual API call when backend is ready
      setShareContacts({
        emails: ['vivek@ihiva.ai'],
        phones: ['8860652067'],
      });
    };

    fetchRecipients();
  }, []);

  const handlePrintPDF = async () => {
    const input = document.getElementById('pdf-content'); // Capture only main content

    if (!input) {
      console.error('❌ PDF Content not found');
      return;
    }

    // ✅ Hide Sidebar Before Capturing
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'none';

    // ✅ Convert Content to Canvas
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // ✅ Add Title to PDF
      pdf.setFontSize(20);
      pdf.setTextColor(234, 88, 12); // Orange-500 in Tailwind
      pdf.setFont('helvetica', 'bold'); // Sans-serif font with bold style
      pdf.text('Weighing Receipt', pdf.internal.pageSize.width / 2, 15, {
        align: 'center',
      });

      const imgWidth = 190; // PDF width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, 0);

      // ✅ Restore Sidebar After Capturing
      if (sidebar) sidebar.style.display = '';

      // ✅ Save the PDF File
      const pdfFileName = `Vehicle_Weighing_Report.pdf`;
      pdf.save(pdfFileName);

      // ✅ Trigger Print Dialog after a small delay
      setTimeout(() => {
        pdf.autoPrint(); // Auto-trigger the print dialog
        window.open(pdf.output('bloburl'), '_blank'); // Open the PDF in a new tab for printing
      }, 500);
    });
  };

  // Weight Capture Section State
  const [showWeightSection, setShowWeightSection] = useState(false);
  const [currentWeight, setCurrentWeight] = useState('40,000'); // Replace with live weight capture
  const [firstWeight, setFirstWeight] = useState('40,000');
  const [firstWeightTime, setFirstWeightTime] = useState(
    '4th March 2025, 14:42:20'
  );
  const [secondWeight, setSecondWeight] = useState('500');
  const [secondWeightTime, setSecondWeightTime] = useState(
    '4th March 2025, 16:42:20'
  );
  const [netWeightTime, setNetWeightTime] = useState(
    '4th March 2025, 16:42:20'
  );

  const netWeight = parseFloat(firstWeight) - parseFloat(secondWeight);
  const printDateTime = new Date().toLocaleString();

  // ✅ Function to Capture Weight & Save it for Live Monitoring
  const captureWeight = () => {
    const capturedData = {
      currentWeight,
      firstWeight,
      firstWeightTime,
      secondWeight,
      secondWeightTime,
      netWeightTime,
      timestamp: new Date().toISOString(), // Track last update time
    };

    // ✅ Save to Local Storage for Live Monitoring Page
    localStorage.setItem('liveMonitoringData', JSON.stringify(capturedData));

    alert('Live Weight Data Captured! Now visible on Live Monitoring Page.');
  };

  // ✅ Retrieve stored employee data or fallback to localStorage
  const storedData = localStorage.getItem('dashboardUserData');
  const employeeData =
    location.state?.employeeData || (storedData ? JSON.parse(storedData) : {});

  // ✅ Extracting Data from Navigation State
  const receiptNumber =
    location.state?.receiptNumber ||
    localStorage.getItem('receiptNumber') ||
    'Not Generated';

  // ✅ Extracting Passed Data from Weighment Page
  const { basicInfo = {}, vehicleInspection = [] } = location.state || {};

  // ✅ Maintain active tab state (First Weight / Second Weight)
  const [activeTab, setActiveTab] = useState('firstWeight');

  // ✅ Maintain state for collapsible Basic Info section
  const [isExpanded, setIsExpanded] = useState(false);

  // ✅ Maintain state for collapsible Weighing Info section
  const [isWeighingInfoExpanded, setIsWeighingInfoExpanded] = useState(false);
  const [isVehicleInspectionExpanded, setIsVehicleInspectionExpanded] =
    useState(false);

  // ✅ Filter the items that were marked "Available" (Green) in Vehicle Inspection
  const availableInspectionItems = vehicleInspection.filter(
    (item) => item.available
  );

  // ✅ Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // Tracks which dropdown is being updated

  // ✅ New Item State
  const [newItem, setNewItem] = useState({
    name: '',
    address: '',
    contact: '',
  });

  // ✅ Existing Dropdown Options (Can be loaded from API/localStorage)
  const [materials, setMaterials] = useState(materialList);
  const [transporters, setTransporters] = useState([
    'XYZ Transport',
    'ABC Logistics',
    'PQR Movers',
  ]);
  const [parties, setParties] = useState(['Client A', 'Client B', 'Client C']);

  // ✅ Parchi Sharing to Prefixed email and whats app numbers ONLY

  const [shareContacts, setShareContacts] = useState({
    emails: [],
    phones: [],
  });

  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // ✅ Redirect to "Vehicle Inspection" if data is missing
    if (!location.state || !location.state.receiptNumber) {
      navigate('/dashboard/weighment/vehicle-inspection', {
        state: { receiptNumber, basicInfo, employeeData },
      });
    }
  }, [receiptNumber, navigate, basicInfo, employeeData, location.state]);

  return (
    <div className='min-h-screen bg-white'>
      {/* ✅ pdf content starts from here */}

      <div id='pdf-content'>
        {/* ✅ Header */}
        <Header title='Vehicle Weighing' />

        {/* 🔙 Modern Back Button */}
        <div className='flex items-center mt-4 px-0'>
          <button
            onClick={() => navigate('/dashboard/weighment/vehicle-inspection')}
            className='flex items-center gap-2 text-gray-700 bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-all exclude-from-pdf'>
            <ArrowLeft className='text-gray-600' />
            <span className='font-medium'>Back to Vehicle Inspection</span>
          </button>
        </div>

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

        {/* ✅ Collapsible Basic Info Section (Fixed `isExpanded` Issue) */}
        <div className='mt-6 bg-white p-5 rounded-xl shadow-md border border-gray-200'>
          <div
            className='flex justify-between items-center cursor-pointer'
            onClick={() => setIsExpanded(!isExpanded)}>
            <h2 className='text-xl font-semibold text-orange-600'>
              Basic Info
            </h2>
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

        {/* ✅ Collapsible Vehicle Inspection Summary */}
        <div className='mt-6 bg-white p-5 rounded-xl shadow-md border border-gray-200'>
          <div
            className='flex justify-between items-center cursor-pointer'
            onClick={() =>
              setIsVehicleInspectionExpanded(!isVehicleInspectionExpanded)
            }>
            <h2 className='text-xl font-semibold text-orange-600'>
              Vehicle Inspection Summary
            </h2>
            <button className='text-orange-600 transition-transform duration-300'>
              {isVehicleInspectionExpanded ? (
                <Minus size={18} />
              ) : (
                <Plus size={18} />
              )}
            </button>
          </div>

          {/* ✅ Display Table Only if Expanded */}
          {isVehicleInspectionExpanded &&
          availableInspectionItems.length > 0 ? (
            <div className='overflow-x-auto mt-4'>
              <table className='w-full border-collapse border border-gray-300'>
                <thead>
                  <tr className='bg-gray-100 text-gray-700 text-sm'>
                    <th className='p-2 border'>Item Name</th>
                    <th className='p-2 border'>Available on Truck</th>
                    <th className='p-2 border'>Removed from Truck</th>

                    <th className='p-2 border'>Photo</th>
                    <th className='p-2 border'>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {availableInspectionItems.map((item) => (
                    <tr
                      key={item.id}
                      className='border text-center'>
                      {/* ✅ Item Name */}
                      <td className='p-2 border'>{item.itemName}</td>

                      {/* ✅ Status */}
                      {/* ✅ Available on Truck Toggle */}
                      <td className='p-2 border text-center'>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={item.available}
                            className='sr-only peer'
                            disabled
                          />
                          <div
                            className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 
        dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
        peer-checked:after:translate-x-full peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>

                      {/* ❌ Removed from Truck Toggle */}
                      <td className='p-2 border text-center'>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={item.removed}
                            className='sr-only peer'
                            disabled
                          />
                          <div
                            className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 
        dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
        peer-checked:after:translate-x-full peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>

                      {/* ✅ Photo (If Exists) */}
                      <td className='p-2 border'>
                        {item.photo ? (
                          <button
                            onClick={() => openPhotoModal(item.photo)}
                            className='text-gray-500 hover:text-gray-700'>
                            <Camera size={18} />
                          </button>
                        ) : (
                          <span className='text-gray-400'>—</span>
                        )}
                      </td>

                      {/* ✅ Remarks (If Exists) */}
                      <td className='p-2 border'>
                        {item.remarks ? (
                          <button
                            onClick={() => openRemarksModal(item)}
                            className='text-blue-500 hover:text-blue-700'>
                            <Pencil size={18} />
                          </button>
                        ) : (
                          <span className='text-gray-400'>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            isVehicleInspectionExpanded && (
              <p className='text-gray-500 text-center mt-2'>
                No items were marked as available.
              </p>
            )
          )}
        </div>

        {/* ✅ Remarks Modal */}
        {isRemarksModalOpen && selectedItem && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
              <h2 className='text-lg font-bold text-orange-500 mb-4'>
                Remarks for {selectedItem.itemName}
              </h2>
              <p className='text-gray-700'>
                {selectedItem.remarks || 'No remarks provided'}
              </p>
              <div className='mt-4 flex justify-end'>
                <button
                  className='bg-gray-500 text-white py-2 px-4 rounded-lg'
                  onClick={() => setIsRemarksModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Photo Modal */}
        {isPhotoModalOpen && selectedPhoto && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-4 rounded-lg shadow-lg w-auto max-w-lg'>
              <h2 className='text-lg font-bold text-orange-500 mb-2'>
                Attached Photo
              </h2>
              <img
                src={selectedPhoto}
                alt='Inspection Item'
                className='w-full max-h-96 rounded-lg shadow-md'
              />
              <div className='mt-4 flex justify-end'>
                <button
                  className='bg-gray-500 text-white py-2 px-4 rounded-lg'
                  onClick={() => setIsPhotoModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Always Visible Weighing Info Section */}
        <div className='mt-6 bg-white p-5 rounded-xl shadow-md border border-gray-200'>
          <h2 className='text-xl font-semibold text-orange-600'>
            Weighing Info
          </h2>

          {/* ✅ Display this content always */}
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Material Dropdown */}
            <div className='flex flex-col relative'>
              <label className='text-gray-600 font-medium mb-1'>Material</label>
              <div className='flex items-center gap-2'>
                <select
                  className='w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-orange-400 outline-none'
                  value={weighingInfo.material}
                  onChange={(e) => {
                    const selectedMat = e.target.value;
                    setWeighingInfo({
                      ...weighingInfo,
                      material: e.target.value,
                    });
                    if (mandatoryDeclarationMaterials.includes(selectedMat)) {
                      setShowDeclarationModal(true);
                    }
                  }}>
                  <option value=''>Select Material</option>
                  {materials.map((mat, index) => (
                    <option
                      key={index}
                      value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setModalType('Material');
                    setIsModalOpen(true);
                  }}
                  className='p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition'>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {showDeclarationModal && (
              <div className='fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center'>
                <div className='bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md border border-gray-100'>
                  <div className='mb-4 text-center'>
                    <h2 className='text-2xl font-semibold text-gray-800'>
                      Upload Declaration
                    </h2>
                    <p className='text-sm text-gray-500 mt-1'>
                      Declaration is required for the selected material.
                    </p>
                  </div>

                  <div className='flex flex-col gap-4'>
                    {/* 📸 Capture with Camera */}
                    <label className='flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl shadow text-sm cursor-pointer transition'>
                      📷 Capture Photo
                      <input
                        type='file'
                        accept='image/*'
                        capture='environment'
                        className='hidden'
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            const file = e.target.files[0];
                            setDeclarationPhoto(URL.createObjectURL(file));
                            setDeclarationUploaded(true);
                            setShowDeclarationModal(false);
                          }
                        }}
                      />
                    </label>

                    {/* 📄 Upload File */}
                    <label className='flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl shadow text-sm cursor-pointer transition'>
                      📄 Upload Declaration
                      <input
                        type='file'
                        accept='application/pdf,image/*'
                        className='hidden'
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            const file = e.target.files[0];
                            setDeclarationPhoto(URL.createObjectURL(file));
                            setDeclarationUploaded(true);
                            setShowDeclarationModal(false);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <button
                    onClick={() => setShowDeclarationModal(false)}
                    className='mt-6 text-sm text-gray-400 hover:text-gray-600 transition-all'>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Transporter Dropdown */}
            <div className='flex flex-col relative'>
              <label className='text-gray-600 font-medium mb-1'>
                Transporter
              </label>
              <div className='flex items-center gap-2'>
                <select
                  className='w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-orange-400 outline-none'
                  value={weighingInfo.transporter}
                  onChange={(e) =>
                    setWeighingInfo({
                      ...weighingInfo,
                      transporter: e.target.value,
                    })
                  }>
                  <option value=''>Select Transporter</option>
                  {transporters.map((trans, index) => (
                    <option
                      key={index}
                      value={trans}>
                      {trans}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setModalType('Transporter');
                    setIsModalOpen(true);
                  }}
                  className='p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition'>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Seller / Sender Dropdown */}
            <div className='flex flex-col relative'>
              <label className='text-gray-600 font-medium mb-1'>
                Seller / Sender
              </label>
              <div className='flex items-center gap-2'>
                <select
                  className='w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-orange-400 outline-none'
                  value={weighingInfo.seller}
                  onChange={(e) =>
                    setWeighingInfo({ ...weighingInfo, seller: e.target.value })
                  }>
                  <option value=''>Select Seller / Sender</option>
                  {parties.map((seller, index) => (
                    <option
                      key={index}
                      value={seller}>
                      {seller}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setModalType('seller');
                    setIsModalOpen(true);
                  }}
                  className='p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition'>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buyer / Receiver Dropdown */}
            <div className='flex flex-col relative'>
              <label className='text-gray-600 font-medium mb-1'>
                Buyer / Receiver
              </label>
              <div className='flex items-center gap-2'>
                <select
                  className='w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-orange-400 outline-none'
                  value={weighingInfo.receiver}
                  onChange={(e) =>
                    setWeighingInfo({
                      ...weighingInfo,
                      receiver: e.target.value,
                    })
                  }>
                  <option value=''>Select Buyer / Receiver</option>
                  {parties.map((receiver, index) => (
                    <option
                      key={index}
                      value={receiver}>
                      {receiver}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setModalType('receiver');
                    setIsModalOpen(true);
                  }}
                  className='p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition'>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Invoice/Challan No. */}
            <div className='flex flex-col'>
              <label className='text-gray-600 font-medium mb-1'>
                Inv. / Challan No.
              </label>
              <input
                type='text'
                placeholder='Enter Invoice/Challan No.'
                className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
                value={weighingInfo.invoiceChallanNo}
                onChange={(e) =>
                  setWeighingInfo({
                    ...weighingInfo,
                    invoiceChallanNo: e.target.value,
                  })
                }
              />
            </div>

            {/* Remarks Field */}
            <div className='flex flex-col'>
              <label className='text-gray-600 font-medium mb-1'>Remarks</label>
              <input
                type='text'
                placeholder='Enter remarks...'
                className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none'
                value={weighingInfo.remarks}
                onChange={(e) =>
                  setWeighingInfo({ ...weighingInfo, remarks: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
              <h2 className='text-lg font-bold text-orange-500 mb-4'>
                Add New {modalType}
              </h2>

              {/* Name Field */}
              <label className='text-gray-700 font-medium'>Name</label>
              <input
                type='text'
                className='w-full p-2 border rounded-lg mb-3'
                placeholder={`Enter ${modalType} Name`}
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />

              {/* Address Field */}
              {modalType !== 'Material' && (
                <>
                  <label className='text-gray-700 font-medium'>Address</label>
                  <input
                    type='text'
                    className='w-full p-2 border rounded-lg mb-3'
                    placeholder='Enter Address'
                    value={newItem.address}
                    onChange={(e) =>
                      setNewItem({ ...newItem, address: e.target.value })
                    }
                  />
                </>
              )}

              {/* Contact Field */}
              {modalType !== 'Material' && (
                <>
                  <label className='text-gray-700 font-medium'>
                    Contact Number
                  </label>
                  <input
                    type='text'
                    className='w-full p-2 border rounded-lg mb-3'
                    placeholder='Enter Contact Number'
                    value={newItem.contact}
                    onChange={(e) =>
                      setNewItem({ ...newItem, contact: e.target.value })
                    }
                  />
                </>
              )}

              {/* ✅ Remarks Field (Only for Transporter & seller) */}
              {modalType !== 'Material' && (
                <>
                  <label className='text-gray-700 font-medium'>Remarks</label>
                  <textarea
                    className='w-full p-2 border rounded-lg mb-3'
                    placeholder='Enter any remarks...'
                    rows='2'
                    value={newItem.remarks}
                    onChange={(e) =>
                      setNewItem({ ...newItem, remarks: e.target.value })
                    }
                  />
                </>
              )}

              {/* Buttons */}
              <div className='mt-4 flex justify-end gap-2'>
                <button
                  className='bg-gray-500 text-white py-2 px-4 rounded-lg'
                  onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button
                  className='bg-green-500 text-white py-2 px-4 rounded-lg'
                  onClick={() => {
                    if (modalType === 'Material')
                      setMaterials([...materials, newItem.name]);
                    if (modalType === 'Transporter')
                      setTransporters([...transporters, newItem.name]);
                    if (modalType === 'Seller')
                      setParties([...parties, newItem.name]);
                    if (modalType === 'Buyer')
                      setParties([...parties, newItem.name]);

                    setNewItem({
                      name: '',
                      address: '',
                      contact: '',
                    }); // Reset fields
                    setIsModalOpen(false);
                  }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Capture Weight Button */}
        <div className='mt-6'>
          <button
            className='w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-4 rounded-lg shadow-md transition-all duration-300'
            onClick={() => setShowWeightSection(!showWeightSection)}>
            Capture Weight
          </button>
        </div>

        {/* Capture Weight Section - Visible when button is clicked */}
        {showWeightSection && (
          <div className='mt-6 bg-white p-5 rounded-xl shadow-md border border-gray-200'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Truck Weight Image + Dynamic Weight */}
              <div className='bg-orange-500 flex items-center justify-center relative p-6 rounded-lg'>
                <img
                  src='/public/assets/vehicle-weight.svg'
                  alt='Vehicle Weight'
                  className='w-[80%] md:w-[90%] lg:w-full max-w-xl'
                />
                <span className='absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-[90%] text-orange-500 text-5xl font-bold'>
                  {currentWeight} Kg
                </span>
              </div>

              {/* CCTV Camera Feeds (Placeholder) */}
              <div className='grid grid-cols-2 gap-2'>
                {[1, 2, 3, 4].map((_, index) => (
                  <div
                    key={index}
                    className='bg-gray-200 h-34 flex items-center justify-center rounded-md shadow'>
                    <span className='text-gray-600'>Live Feed {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight Table */}
            <div className='mt-6 border-t border-gray-300'>
              <div className='grid grid-cols-3 text-center font-semibold text-gray-700 mt-3'>
                <div className='border-r border-gray-300 p-3'>
                  First / Gross Weight
                </div>
                <div className='border-r border-gray-300 p-3'>
                  Second / Tare Weight
                </div>
                <div className='p-3'>Net Weight</div>
              </div>
              <div className='grid grid-cols-3 text-center text-2xl font-bold p-4'>
                <div className='border-r border-gray-300 text-gray-900'>
                  {firstWeight} Kg
                  <div className='text-sm text-orange-600'>
                    {firstWeightTime}
                  </div>
                </div>
                <div className='border-r border-gray-300 text-gray-900'>
                  {secondWeight} Kg
                  <div className='text-sm text-orange-600'>
                    {secondWeightTime}
                  </div>
                </div>
                <div className='text-gray-900'>
                  {firstWeight - secondWeight} Kg
                  <div className='text-sm text-orange-600'>{netWeightTime}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showShareModal && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-100'>
            {/* Title */}
            <h2 className='text-xl font-semibold text-gray-800 mb-2 text-center'>
              Share Weighment Receipt
            </h2>
            <p className='text-sm text-gray-500 mb-6 text-center'>
              Choose how you'd like to share:
            </p>

            {/* Share Buttons */}
            <div className='space-y-3'>
              {/* WhatsApp Share Buttons */}
              {shareContacts.phones.map((phone, idx) => (
                <button
                  key={idx}
                  onClick={async () => {
                    const input = document.getElementById('pdf-content');
                    const canvas = await html2canvas(input, {
                      scale: 2,
                      useCORS: true,
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
                    const blob = pdf.output('blob');
                    const url = URL.createObjectURL(blob);

                    const message = `Hi, sharing the weighing receipt.`;
                    window.open(
                      `https://wa.me/${phone}?text=${encodeURIComponent(
                        message + '\n' + url
                      )}`
                    );
                    setShowShareModal(false);
                  }}
                  className='w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl shadow transition-all'>
                  <img
                    src='https://img.icons8.com/color/24/000000/whatsapp--v1.png'
                    alt='WhatsApp'
                  />
                  WhatsApp to {phone}
                </button>
              ))}

              {/* Email Share Buttons */}
              {shareContacts.emails.map((email, idx) => (
                <button
                  key={idx}
                  onClick={async () => {
                    const input = document.getElementById('pdf-content');
                    const canvas = await html2canvas(input, {
                      scale: 2,
                      useCORS: true,
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
                    const blob = pdf.output('dataurlstring');

                    window.location.href = `mailto:${email}?subject=Weighment Receipt&body=Please find the receipt attached:\n${blob}`;
                    setShowShareModal(false);
                  }}
                  className='w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl shadow transition-all'>
                  <img
                    src='https://img.icons8.com/fluency/24/000000/new-post.png'
                    alt='Email'
                  />
                  Email to {email}
                </button>
              ))}
            </div>

            {/* Cancel */}
            <div className='mt-6 text-center'>
              <button
                onClick={() => setShowShareModal(false)}
                className='text-sm text-gray-400 hover:text-gray-600 transition'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='mt-6 flex flex-wrap gap-4 justify-between'>
        {/* Back to Weighment */}
        <button
          className='w-full md:w-auto px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition'
          onClick={() => navigate('/dashboard/weighment')}>
          Back to Weighment
        </button>

        <div className='flex flex-wrap gap-4 justify-end'>
          {/* Save */}
          <button
            className='px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition'
            onClick={handleSave}>
            Save
          </button>

          {/* Print
          <button
            className='px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition'
            onClick={handlePrintPDF}>
            Print
          </button> */}

          <button
            className='px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition'
            onClick={handleSmallPrint}>
            Print
          </button>

          {/* Share */}
          <button
            className='px-6 py-3 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition'
            onClick={() => setShowShareModal(true)}>
            Share
          </button>
        </div>
      </div>
      <div
        id='printable-receipt'
        style={{
          width: '5in',
          height: '3in',
          padding: '10px',
          fontSize: '11px', // compact font size
          fontFamily: 'monospace', // for alignment
          display: 'none',
          boxSizing: 'border-box',
          lineHeight: '1.3',
        }}>
        {/* Company Name */}
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '13px',
            marginBottom: '2px',
          }}>
          Test Private Limited
        </div>

        {/* Location */}
        <div style={{ textAlign: 'center', marginBottom: '6px' }}>
          📍 Location: Vivek's Home
        </div>

        {/* Separator */}
        <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>

        {/* Date-Time and Receipt No */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2px',
            fontSize: '11px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            gap: '4px',
          }}>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
            Date & Time: {printDateTime}
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'right',
            }}>
            Receipt No: {receiptNumber}
          </span>
        </div>

        {/* Material and Transporter */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2px',
            fontSize: '11px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            gap: '4px',
          }}>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
            Material: {weighingInfo.material || '-'}
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'right',
            }}>
            Transporter: {weighingInfo.transporter || '-'}
          </span>
        </div>

        {/* Sender and Receiver */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2px',
            fontSize: '11px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            gap: '4px',
          }}>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
            Sender: {weighingInfo.seller || '-'}
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'right',
            }}>
            Receiver: {weighingInfo.receiver || '-'}
          </span>
        </div>

        {/* Separator */}
        <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>

        {/* Gross / Tare / Net */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            marginBottom: '4px',
          }}>
          <span style={{ width: '33%' }}>Gross Wt: {firstWeight} Kg</span>
          <span style={{ width: '33%', textAlign: 'center' }}>
            Tare Wt: {secondWeight} Kg
          </span>
          <span style={{ width: '33%', textAlign: 'right' }}>
            Net Wt: {netWeight} Kg
          </span>
        </div>

        {/* Separator */}
        <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>

        {/* Remarks */}
        {weighingInfo.remarks && (
          <div style={{ marginTop: '2px' }}>
            Remarks: {weighingInfo.remarks}
          </div>
        )}

        {/* Signature */}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          Operator Signature: ___________
        </div>
      </div>

      <style>
        {`

 @media print {
  body * {
    visibility: hidden !important;
  }

  #printable-receipt, #printable-receipt * {
    visibility: visible !important;
    display: block !important;
  }

  #printable-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
    z-index: 9999;
    background: white;
    padding: 10px;
  }
}

  `}
      </style>

      {/* ✅ Footer */}
      <footer className='w-full text-center py-4 bg-gray-100 text-gray-600 text-sm mt-6'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default VehicleWeighing;

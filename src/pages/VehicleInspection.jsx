import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaEdit, FaUpload, FaPlus, FaMinus } from "react-icons/fa"; // ✅ Import Icons
import Header from "../components/Header"; // ✅ Import Header
import WeightButtons from "../components/WeightButtons"; // ✅ Import Weight Buttons
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import emailjs from "emailjs-com";

const VehicleInspection = () => {
  const navigate = useNavigate();
  

  // ✅ Retrieve stored values for Receipt Number & Vehicle Number
  const [isExpanded, setIsExpanded] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState(localStorage.getItem("vehicleNumber") || "Not Entered");
  const [receiptNumber, setReceiptNumber] = useState(localStorage.getItem("receiptNumber") || "Not Generated");
  const [activeTab, setActiveTab] = useState("firstWeight");

  const [deviationDetected, setDeviationDetected] = useState(false);
  const [deviationReport, setDeviationReport] = useState("");
  const [deviationImages, setDeviationImages] = useState([]);

  // ✅ Extracting Passed Data from Weighment Page
  const location = useLocation();
  const { basicInfo = {}, employeeData = {} } = location.state || {};

  // ✅ Function to open Camera (Placeholder Implementation)
  const openCamera = (id) => {
    alert(`Open camera for item ID: ${id}`);
  };

  const submitDeviationReport = async () => {
    const input = document.getElementById("pdf-content"); // Capture the entire page content

    // ✅ Hide Unnecessary Elements Before Capture
  const elementsToHide = document.querySelectorAll(".exclude-from-pdf");
  elementsToHide.forEach((el) => (el.style.display = "none"));

// ✅ Convert HTML to Canvas
html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");


    // ✅ Add Title "Deviation Alert !!!" at the top of the PDF
    pdf.setFontSize(20);
    pdf.setTextColor(255, 0, 0); // Red Color for Title
    pdf.text("Deviation Alert !!!", pdf.internal.pageSize.width / 2, 15, { align: "center" });
  
    // ✅ Reset text color to black for normal content
    pdf.setTextColor(0, 0, 0);


  const imgWidth = 190; // Width of the PDF
  const pageHeight = 297; // A4 page height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 10, 20, imgWidth, 0);

  // ✅ Restore Hidden Elements After Capture
  elementsToHide.forEach((el) => (el.style.display = ""));
  
  let yPosition = 10;
  let heightLeft = imgHeight;
  let pageIndex = 0;

  while (heightLeft > 0) {
      // ✅ Add the image section-wise to fit on the page
      const pdfSection = document.createElement("canvas");
      pdfSection.width = canvas.width;
      pdfSection.height = Math.min(canvas.height, (pageHeight - 20) * (canvas.width / imgWidth));

      const ctx = pdfSection.getContext("2d");
      ctx.drawImage(canvas, 0, pageIndex * pdfSection.height, canvas.width, pdfSection.height, 0, 0, canvas.width, pdfSection.height);

      const sectionImg = pdfSection.toDataURL("image/png");
      pdf.addImage(sectionImg, "PNG", 10, yPosition, imgWidth, 0);

      heightLeft -= pageHeight - 20;
      pageIndex++;

      if (heightLeft > 0) pdf.addPage();
  }


     
  

          // ✅ Check if Deviation Report is detected
    if (deviationDetected) {
      pdf.addPage(); // ✅ Add a new page for the report
      pdf.setFontSize(14);
      pdf.text("Deviation Report", 10, 20);

      
      // ✅ Insert Deviation Report text
      pdf.setFontSize(12);
      let textLines = pdf.splitTextToSize(deviationReport || "No Deviation Report Provided", 180);
      let startY = 20;  // Ensure sufficient top margin

      textLines.forEach((line, index) => {
        pdf.text(line, 10, startY + index * 6); // Moves each line down by 6mm, keeping top alignment
      });

      // ✅ Determine new yPosition after text
let yPos = 30 + textLines.length * 6; // 6mm per line for spacing

// ✅ Add extra spacing to avoid overlap
yPos += 10; 

// ✅ Check if yPos exceeds page height, move to a new page
if (yPos + 60 > pdf.internal.pageSize.height - 20) {
    pdf.addPage();
    yPos = 20; // Reset to top on new page
}

pdf.setFontSize(14);
pdf.text("Attached Images:", 10, yPos);
yPos += 10;

// ✅ Add uploaded images to the PDF
for (const image of deviationImages) {
    const imgURL = URL.createObjectURL(image);
    const img = new Image();
    img.src = imgURL;
    
    pdf.addImage(img, "PNG", 10, yPos, 80, 50);
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
      const pdfBlob = pdf.output("blob");
      sendPDFEmail(pdfBlob, pdfFileName);
    });
  };

  const sendPDFEmail = (pdfBlob, pdfFileName) => {
    emailjs
      .send(
        "your_service_id", // Replace with your EmailJS service ID
        "your_template_id", // Replace with your EmailJS template ID
        {
          to_email: "recipient@example.com",
          pdfFile: pdfBlob,
          pdfFileName: pdfFileName,
        },
        "your_user_id" // Replace with your EmailJS user ID
      )
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
      });
  };

  // ✅ Checklist Items (Fixed Duplicate ID Issue)
  const [checklist, setChecklist] = useState([
    { id: 1, itemName: "Battey/बट्टे", available: false, removed: false, remarks: "" },
    { id: 2, itemName: "Belt Machine/बेल्ट मशीन", available: false, removed: false, remarks: "" },
    { id: 3, itemName: "Blanket/कम्बल", available: false, removed: false, remarks: "" },
    { id: 4, itemName: "Bucket/बाल्टी", available: false, removed: false, remarks: "" },
    { id: 5, itemName: "Chain/चैन", available: false, removed: false, remarks: "" },
    { id: 6, itemName: "Diesel Tank/डीजल टैंक", available: false, removed: false, remarks: "" },
    { id: 7, itemName: "Extra Battery/एक्स्ट्रा बैटरी", available: false, removed: false, remarks: "" },
    { id: 8, itemName: "Fattey/फट्टे", available: false, removed: false, remarks: "" },
    { id: 9, itemName: "Fire Cylinder/फायर सिलिंडर", available: false, removed: false, remarks: "" },
    { id: 10, itemName: "Gas Cylinder/गैस सिलिंडर", available: false, removed: false, remarks: "" },
    { id: 11, itemName: "Gutkey/गुटके", available: false, removed: false, remarks: "" },
    { id: 12, itemName: "Iron Plate/लोहे की प्लेट", available: false, removed: false, remarks: "" },
    { id: 13, itemName: "Jack/जैक", available: false, removed: false, remarks: "" },
    { id: 14, itemName: "Hydraulic Jack/हाइड्रोलिक जैक", available: false, removed: false, remarks: "" },
    { id: 15, itemName: "Khute/खूटे", available: false, removed: false, remarks: "" },
    { id: 16, itemName: "Panna/पान्ना", available: false, removed: false, remarks: "" },
    { id: 17, itemName: "Pipe/पाइप", available: false, removed: false, remarks: "" },
    { id: 18, itemName: "Rod/रोड", available: false, removed: false, remarks: "" },
    { id: 19, itemName: "Ropes/रस्से", available: false, removed: false, remarks: "" },
    { id: 20, itemName: "Sariya/सरिया", available: false, removed: false, remarks: "" },
    { id: 21, itemName: "Shikanja/शिकंजा", available: false, removed: false, remarks: "" },
    { id: 22, itemName: "Speaker/स्पीकर", available: false, removed: false, remarks: "" },
    { id: 23, itemName: "Stepney/स्टेपनी", available: false, removed: false, remarks: "" },
    { id: 24, itemName: "Stopper/स्टॉपर", available: false, removed: false, remarks: "" },
    { id: 25, itemName: "Tirpal/तिरपाल", available: false, removed: false, remarks: "" },
    { id: 26, itemName: "Tool Set/टूल सेट", available: false, removed: false, remarks: "" },
    { id: 27, itemName: "Tyre Lever/टायर लीवर", available: false, removed: false, remarks: "" },
    { id: 28, itemName: "Utensils/बर्तन सेट", available: false, removed: false, remarks: "" },
    { id: 29, itemName: "Water Cane/पानी की केन", available: false, removed: false, remarks: "" },
    { id: 30, itemName: "Wheel Panna/पहिया पाना", available: false, removed: false, remarks: "" },
    { id: 31, itemName: "Wooden Slipper/लकड़ी के स्लीपर", available: false, removed: false, remarks: "" },
  ]);

  // ✅ State for remarks modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRemark, setCurrentRemark] = useState("");
  const [currentItemId, setCurrentItemId] = useState(null);

    // ✅ Function to toggle availability and removal state
    const toggleField = (id, field) => {
      setChecklist(prevChecklist =>
        prevChecklist.map(item =>
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
      setChecklist(prevChecklist =>
        prevChecklist.map(item =>
          item.id === currentItemId ? { ...item, remarks: currentRemark } : item
        )
      );
      setModalOpen(false);
    };

  return (
    <div className="min-h-screen bg-white" id="pdf-content">
      {/* ✅ Header Section */}
      <Header title="Vehicle Inspection" />

      {/* ✅ Show "Deviation Alert !!" Only When Toggle is ON */}
        {deviationDetected && (
          <div className="bg-red-500 text-white text-lg font-bold text-center p-2 rounded-lg mb-4">
            🚨 Deviation Alert !!
          </div>
        )}

      {/* ✅ Weight Buttons (Second Weight Disabled) */}
      <WeightButtons activeTab={activeTab} setActiveTab={setActiveTab} disableSecondWeight={true} />

       {/* ✅ Receipt Number Field */}
       <div className="mt-4 flex items-center gap-2">
        <label className="text-gray-700 font-medium">Receipt Number:</label>
        <input 
          type="text" 
          className="p-2 border rounded-lg bg-gray-100 w-auto" 
          value={receiptNumber} 
          readOnly 
        />
      </div>

      {/* ✅ Collapsible Basic Info Section */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-bold text-orange-500">Basic Info</h2>
          <button className="text-orange-500">
            {isExpanded ? <FaMinus size={18} /> : <FaPlus size={18} />}
          </button>
        </div>

        {/* ✅ Show Data When Expanded */}
        {isExpanded && (
          <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(basicInfo).length > 0 ? (
              Object.keys(basicInfo).map((key) => (
                <div key={key}>
                  <label className="text-gray-700">{key.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    value={basicInfo[key] || "Not Provided"}
                    readOnly
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No Basic Info Available</p>
            )}
          </div>
        )}
      </div>

 {/* ✅ Vehicle Inspection Checklist */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-orange-500 mb-4">Vehicle Inspection Check List</h2>
        
        {/* ✅ Checklist Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Available on Truck</th>
                <th className="p-2 border">Removed from Truck</th>
                <th className="p-2 border">Capture Photo</th>
                <th className="p-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((item) => (
                <tr key={item.id} className="border">
                  {/* Item Name */}
                  <td className="p-2 border text-center">{item.itemName}</td>

                  {/* Toggle: Available on Truck */}
                  <td className="p-2 border text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => toggleField(item.id, "available")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>


                  {/* Toggle: Removed from Truck */}
                  <td className="p-2 border text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.removed}
                        onChange={() => toggleField(item.id, "removed")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>

                {/* Capture Photo Button */}
                    <td className="p-2 border text-center">
                      <button
                        className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition duration-200"
                        onClick={() => openCamera(item.id)} // Call function to open camera
                      >
                        <FaCamera size={20} />
                      </button>
                    </td>

                  {/* Remarks Icon Button */}
                    <td className="p-2 border text-center">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => openRemarksModal(item.id, item.remarks)}
                      >
                        <FaEdit size={20} />
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold text-orange-500 mb-4">Enter Remarks</h2>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={currentRemark}
              onChange={(e) => setCurrentRemark(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                onClick={saveRemarks}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

{/* Deviation / Theft Attempt Section */}
<div className="mt-6 p-4 border rounded-lg bg-gray-100 shadow-md exclude-from-pdf">
  <h2 className="text-lg font text-red-500">
    Any Deviation / Theft Attempt Detected during Vehicle Inspection
  </h2>

  {/* Toggle Switch for Yes/No */}
  <div className="mt-2 flex items-center gap-4">
    <span className="text-gray-700">Detected:</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={deviationDetected}
        onChange={() => setDeviationDetected(!deviationDetected)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
    </label>
  </div>

  {/* Show Report Input & Image Upload if "Yes" is Selected */}
  {deviationDetected && (
    <div className="mt-4 p-4 border rounded-lg bg-white shadow">
      {/* Report Textarea */}
      <label className="text-gray-700 font-medium">Deviation Report</label>
      <textarea
        className="w-full p-2 border rounded-lg mt-2"
        placeholder="Enter details about the deviation..."
        rows="3"
        value={deviationReport}
        onChange={(e) => setDeviationReport(e.target.value)}
      ></textarea>

      {/* Image Upload */}
      <div className="mt-4">
        <label className="text-gray-700 font-medium">Attach Images</label>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="deviation-image-upload"
            onChange={(e) => setDeviationImages([...deviationImages, ...e.target.files])}
            multiple
          />
          <label
            htmlFor="deviation-image-upload"
            className="p-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-300 transition"
          >
            <FaUpload /> Upload Images
          </label>
        </div>

        {/* Show Uploaded Image Names */}
        {deviationImages.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600">
            {deviationImages.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

    {/* ✅ Submit Deviation Report Button */}
    <button
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition exclude-from-pdf"
              onClick={submitDeviationReport}
            >
              Submit Deviation Report
            </button>
          </div>
        )}
      </div>


      {/* ✅ Submit & Back Buttons */}
      <div className="mt-6 flex justify-between">
        <button 
          onClick={() => navigate("/dashboard/weighment")} 
          className="bg-gray-500 text-white py-3 px-6 rounded-lg exclude-from-pdf"
        >
          Back to Weighment
        </button>

        <button className="bg-green-500 text-white py-3 px-6 rounded-lg exclude-from-pdf">
          Weigh the Vehicle
        </button>
      </div>
    </div>
  );
};

export default VehicleInspection;


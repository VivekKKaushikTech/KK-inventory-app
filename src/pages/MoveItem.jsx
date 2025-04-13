import BasicInfo from '../components/BasicInfo';
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  ListTree,
  ScanBarcode,
  Hash,
  PackagePlus,
  CircleHelp,
  LocateFixed,
  QrCode,
  FileSignature,
  User,
  MapPin,
  Truck,
} from 'lucide-react';
import skuData from '../data/skuData';

const MoveItem = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [skuList, setSkuList] = useState([]);
  const [selectedSKU, setSelectedSKU] = useState('');
  const [serial, setSerial] = useState('');
  const [qty, setQty] = useState('');
  const [condition, setCondition] = useState('Repaired');
  const [location, setLocation] = useState('Dayabasti');
  const [movementPurpose, setMovementPurpose] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [buyerSeller, setBuyerSeller] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedCategory && skuData[selectedCategory]) {
      setSkuList(skuData[selectedCategory]);
    } else {
      setSkuList([]);
    }
  }, [selectedCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!selectedCategory) newErrors.category = 'Product category is required';
    if (!selectedSKU) newErrors.sku = 'SKU ID is required';
    if (!serial.trim()) newErrors.serial = 'Serial number is required';
    if (!qty) newErrors.qty = 'Quantity is required';
    if (!movementPurpose)
      newErrors.movementPurpose = 'Movement purpose is required';
    if (!invoiceNo.trim())
      newErrors.invoiceNo = 'Invoice/Challan No. is required';
    if (!buyerSeller.trim()) newErrors.buyerSeller = 'Buyer/Seller is required';
    if (!newLocation) newErrors.newLocation = 'New location is required';
    if (!receiverName.trim())
      newErrors.receiverName = 'Receiver name is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('✅ Moving Item:', {
        selectedCategory,
        selectedSKU,
        serial,
        qty,
        condition,
        location,
        movementPurpose,
        invoiceNo,
        buyerSeller,
        newLocation,
        receiverName,
      });
    }
  };

  return (
    <div className='flex flex-col flex-grow bg-white min-h-screen'>
      <Header title='Move Item' />

      <div className='flex-1 p-4'>
        <div className='max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl space-y-6'>
          <h1 className='text-3xl font-bold text-orange-500 flex items-center gap-2'>
            <Truck size={28} /> Move an Item / Product : Stock-Out
          </h1>

          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <CalendarDays size={16} /> Date
              </label>
              <input
                type='date'
                defaultValue={new Date().toISOString().split('T')[0]}
                className='w-full p-3 border border-gray-300 rounded-lg'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <ListTree size={16} /> Product Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
                required>
                <option value=''>Select Product Category</option>
                {Object.keys(skuData).map((cat) => (
                  <option
                    key={cat}
                    value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className='text-red-500 text-sm'>{errors.category}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <ScanBarcode size={16} /> SKU ID
              </label>
              <select
                value={selectedSKU}
                onChange={(e) => setSelectedSKU(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
                required>
                <option value=''>Select SKU ID</option>
                {skuList.map((sku, i) => (
                  <option
                    key={i}
                    value={sku}>
                    {sku}
                  </option>
                ))}
              </select>
              {errors.sku && (
                <p className='text-red-500 text-sm'>{errors.sku}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <Hash size={16} /> Item Code
              </label>
              <input
                type='text'
                placeholder='Item Code'
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
                required
              />
              {errors.serial && (
                <p className='text-red-500 text-sm'>{errors.serial}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <PackagePlus size={16} /> Quantity
              </label>
              <input
                type='number'
                placeholder='Enter Quantity'
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
                required
              />
              {errors.qty && (
                <p className='text-red-500 text-sm'>{errors.qty}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <CircleHelp size={16} /> Product Condition
              </label>
              <input
                type='text'
                value={condition}
                readOnly
                className='w-full p-3 border border-gray-300 bg-gray-100 rounded-lg'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <LocateFixed size={16} /> Current Location
              </label>
              <input
                type='text'
                value={location}
                readOnly
                className='w-full p-3 border border-gray-300 bg-gray-100 rounded-lg'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <FileSignature size={16} /> Movement Purpose
              </label>
              <select
                value={movementPurpose}
                onChange={(e) => setMovementPurpose(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'>
                <option value=''>Select Movement Purpose</option>
                <option value='Purchase'>Purchase</option>
                <option value='Transfer - In'>Transfer - In</option>
                <option value='Client - Return'>Client - Return</option>
                <option value='Repair - In'>Repair - In</option>
                <option value='Sale'>Sale</option>
                <option value='Transfer - Out'>Transfer - Out</option>
                <option value='Repair - Out'>Repair - Out</option>
              </select>
              {errors.movementPurpose && (
                <p className='text-red-500 text-sm'>{errors.movementPurpose}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <Hash size={16} />
                Invoice / Challan No.
              </label>
              <input
                type='text'
                placeholder='Invoice / Delivery Challan no.'
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
              />
              {errors.invoiceNo && (
                <p className='text-red-500 text-sm'>{errors.invoiceNo}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <User size={16} />
                Purchased From / Sold To
              </label>
              <input
                type='text'
                placeholder='Purchased From / Sold To'
                value={buyerSeller}
                onChange={(e) => setBuyerSeller(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
              />
              {errors.buyerSeller && (
                <p className='text-red-500 text-sm'>{errors.buyerSeller}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <MapPin size={16} />
                Dispatch / Transfer (to) Location
              </label>
              <select
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'>
                <option value=''>
                  Select Dispatch / Transfer (to) Location
                </option>
                <option value='Buyerlocation'>Buyer Location</option>
                <option value='Dayabasti'>Dayabasti</option>
                <option value='Kirtinagar'>Kirtinagar</option>
                <option value='Bhiwadi'>Bhiwadi</option>
              </select>
              {errors.newLocation && (
                <p className='text-red-500 text-sm'>{errors.newLocation}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <User size={16} />
                Dispatch / Transfer (to) Person
              </label>
              <input
                type='text'
                placeholder='Enter Person Name'
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
              />
              {errors.receiverName && (
                <p className='text-red-500 text-sm'>{errors.receiverName}</p>
              )}
            </div>
            <input
              type='text'
              id='notes'
              placeholder='Notes / Comments'
              class='w-full border-2 border-gray-200 rounded p-3'
            />

            <div className='col-span-full'>
              <button
                type='submit'
                className='flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-all font-semibold text-lg shadow-lg'>
                <Truck size={20} /> Confirm Movement
              </button>
            </div>
          </form>
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

export default MoveItem;

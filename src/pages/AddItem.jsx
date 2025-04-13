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
  IndianRupee,
  CircleHelp,
  LocateFixed,
  QrCode,
} from 'lucide-react';
import skuData from '../data/skuData';

const AddItem = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [skuList, setSkuList] = useState([]);
  const [selectedSKU, setSelectedSKU] = useState('');
  const [serial, setSerial] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');

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
    if (!condition) newErrors.condition = 'Product condition is required';
    if (!location) newErrors.location = 'Current location is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('✅ Submitting:', {
        selectedCategory,
        selectedSKU,
        serial,
        qty,
        price,
        condition,
        location,
      });
    }
  };

  return (
    <div className='flex flex-col flex-grow bg-white min-h-screen'>
      <Header title='Add Item' />

      <div className='flex-1 p-4'>
        <div className='max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl space-y-6'>
          <h1 className='text-3xl font-bold text-orange-500 flex items-center gap-2'>
            <PackagePlus size={28} /> Add a New Item / Product : Stock-In
          </h1>

          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <CalendarDays size={16} /> Date{' '}
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                defaultValue={new Date().toISOString().split('T')[0]}
                className='w-full p-3 border border-gray-300 rounded-lg'
                required
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <ListTree size={16} /> Product Category{' '}
                <span className='text-red-500'>*</span>
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
                <span className='text-red-500'>*</span>
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
                <Hash size={16} /> Serial No.
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                placeholder='Serial Number'
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
                <span className='text-red-500'>*</span>
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
                <IndianRupee size={16} /> Price (incl. GST)
              </label>
              <input
                type='number'
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <CircleHelp size={16} /> Product Condition
                <span className='text-red-500'>*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
                required>
                <option value=''>Select Condition</option>
                <option value='New'>New</option>
                <option value='Old'>Old</option>
                <option value='Testing'>Testing</option>
                <option value='Sample'>Sample</option>
                <option value='Repaired'>Repaired</option>
              </select>
              {errors.condition && (
                <p className='text-red-500 text-sm'>{errors.condition}</p>
              )}
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <LocateFixed size={16} /> Current Location
                <span className='text-red-500'>*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg'
                required>
                <option value=''>Select Current Location</option>
                <option value='Dayabasti'>Dayabasti</option>
                <option value='Kirtinagar'>Kirtinagar</option>
                <option value='Bhiwadi'>Bhiwadi</option>
              </select>
              {errors.location && (
                <p className='text-red-500 text-sm'>{errors.location}</p>
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
                <QrCode size={20} /> Generate QR Code
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

export default AddItem;

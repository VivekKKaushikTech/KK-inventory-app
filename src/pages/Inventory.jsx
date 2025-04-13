import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { CalendarDays, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const Inventory = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const dummyData = Array.from({ length: 15 }, (_, i) => ({
      datetime: new Date(Date.now() - i * 3600000).toLocaleString(),
      itemCode: `KK-ITEM-${1000 + i}`,
      productCategory: 'KK-LC',
      skuId: 'KK-LC-C&B-AP-ACB-A 40-40TF / AN / 1',
      serialNo: `SN-${1000 + i}`,
      quantity: 10 + i,
      price: 500 + i * 10,
      condition: 'New',
      currentLocation: 'Dayabasti',
      movementPurpose: 'Purchase',
      invoiceNo: `INV-${2000 + i}`,
      buyerSeller: 'ABC Pvt Ltd',
      dispatchLocation: 'Kirtinagar',
      dispatchPerson: 'Mr. X',
      notes: 'No remarks',
      qrCodeUrl: 'http://example.com/qr-code.png',
    }));
    setInventoryData(dummyData);
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inventoryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Log');
    XLSX.writeFile(workbook, 'inventory_log.xlsx');
  };

  const headers = [
    'datetime',
    'itemCode',
    'productCategory',
    'skuId',
    'serialNo',
    'quantity',
    'price',
    'condition',
    'currentLocation',
    'movementPurpose',
    'invoiceNo',
    'buyerSeller',
    'dispatchLocation',
    'dispatchPerson',
    'notes',
    'qrCodeUrl',
  ];

  const displayHeaders = [
    'Date & Time',
    'Item Code',
    'Product Category',
    'SKU ID',
    'Serial No',
    'Quantity',
    'Price (incl. GST)',
    'Product Condition',
    'Current Location',
    'Movement Purpose',
    'Invoice / Challan No',
    'Purchased From / Sold To',
    'Dispatch / Transfer (to) Location',
    'Dispatch / Transfer (to) Person',
    'Notes',
    'QR Code URL',
  ];

  const filteredData = inventoryData.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      return !value || row[key] === value;
    });
  });

  const getUniqueValues = (key) => {
    return ['All', ...new Set(inventoryData.map((item) => item[key]))];
  };

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <div className='flex-grow p-4'>
        <Header title='Inventory' />

        <div className='bg-white p-6 mt-6 rounded-xl shadow-md flex flex-wrap items-center gap-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <label className='flex items-center gap-2 font-medium'>
              <CalendarDays size={16} /> From
            </label>
            <input
              type='date'
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className='p-2 border border-gray-300 rounded-lg'
            />
            <label className='flex items-center gap-2 font-medium'>To</label>
            <input
              type='date'
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className='p-2 border border-gray-300 rounded-lg'
            />
          </div>

          {fromDate && toDate && (
            <button
              onClick={exportToExcel}
              className='bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md transition active:scale-95'
              title='Export to Excel'>
              <FileSpreadsheet size={18} />
            </button>
          )}
        </div>

        <div className='mt-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-auto max-h-[600px]'>
          <table className='w-full text-sm text-left border-separate border-spacing-y-2 min-w-[1200px]'>
            <thead className='sticky top-0 bg-white shadow-sm z-10'>
              <tr className='text-gray-700 text-xs uppercase tracking-wide'>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className='p-3 whitespace-nowrap'>
                    {displayHeaders[i]}
                    <select
                      className='ml-1 text-gray-400 text-xs'
                      onChange={(e) => {
                        const value = e.target.value;
                        setFilters((prev) => ({
                          ...prev,
                          [header]: value === 'All' ? '' : value,
                        }));
                      }}>
                      {getUniqueValues(header).map((option, j) => (
                        <option
                          key={j}
                          value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr
                  key={index}
                  className='bg-gray-50 hover:bg-orange-50 transition shadow-sm rounded-xl'>
                  <td className='p-3'>{entry.datetime}</td>
                  <td className='p-3 text-blue-600 underline cursor-pointer'>
                    {entry.itemCode}
                  </td>
                  <td className='p-3'>{entry.productCategory}</td>
                  <td className='p-3'>{entry.skuId}</td>
                  <td className='p-3'>{entry.serialNo}</td>
                  <td className='p-3'>{entry.quantity}</td>
                  <td className='p-3'>₹{entry.price}</td>
                  <td className='p-3'>{entry.condition}</td>
                  <td className='p-3'>{entry.currentLocation}</td>
                  <td className='p-3'>{entry.movementPurpose}</td>
                  <td className='p-3'>{entry.invoiceNo}</td>
                  <td className='p-3'>{entry.buyerSeller}</td>
                  <td className='p-3'>{entry.dispatchLocation}</td>
                  <td className='p-3'>{entry.dispatchPerson}</td>
                  <td className='p-3'>{entry.notes}</td>
                  <td className='p-3'>
                    <a
                      href={entry.qrCodeUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline'>
                      View QR
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className='w-full text-center py-4 px-6 mt-6 bg-white/60 backdrop-blur-md border-t border-orange-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] text-sm text-gray-600 font-medium tracking-wide'>
        © {new Date().getFullYear()} Crafted with{' '}
        <span className='text-red-500'>❤</span> by Kanta King Technologies Pvt
        Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default Inventory;

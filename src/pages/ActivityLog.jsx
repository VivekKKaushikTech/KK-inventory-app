import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { CalendarDays, QrCode, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const ActivityLog = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    // Load last 10 dummy transactions on first render
    const dummyData = Array.from({ length: 10 }, (_, i) => ({
      datetime: new Date(Date.now() - i * 3600000).toLocaleString(),
      employeeName: `User ${i + 1}`,
      activityType: i % 2 === 0 ? 'Add Item' : 'Move Item',
      itemCode: `KK-ITEM-${1000 + i}`,
    }));
    setLogData(dummyData);
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(logData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Activity Log');
    XLSX.writeFile(workbook, 'activity_log.xlsx'); // ✅ This creates a true Excel file

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'activity_log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <div className='flex-grow p-4'>
        <Header title='Activity Log' />

        {/* Date Range Selector */}
        <div className='bg-white p-6 mt-6 rounded-xl shadow-md flex flex-col md:flex-row gap-4 md:items-center justify-between'>
          <div className='flex gap-4 items-center'>
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
              className='group flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-md hover:bg-green-700 transition-all duration-300 active:scale-95'>
              <FileSpreadsheet
                size={20}
                className='group-hover:rotate-6 transition-transform duration-300'
              />
              <span className='font-semibold tracking-wide'>
                Export to Excel
              </span>
            </button>
          )}
        </div>

        {/* Activity Table */}
        <div className='mt-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-auto max-h-[500px]'>
          <table className='w-full text-sm text-left border-separate border-spacing-y-2 min-w-[600px]'>
            <thead className='sticky top-0 bg-white shadow-sm z-10'>
              <tr className='text-gray-700 text-sm uppercase tracking-wide'>
                <th className='p-3 text-left'>Date & Time</th>
                <th className='p-3 text-left'>Employee Name</th>
                <th className='p-3 text-left'>Activity Type</th>
                <th className='p-3 text-left'>Item Code</th>
              </tr>
            </thead>
            <tbody>
              {logData.length === 0 ? (
                <tr>
                  <td
                    colSpan='4'
                    className='text-center py-4 text-gray-500'>
                    No activity logs available.
                  </td>
                </tr>
              ) : (
                logData.map((entry, index) => (
                  <tr
                    key={index}
                    className='bg-gray-50 hover:bg-orange-50 transition shadow-sm rounded-xl'>
                    <td className='p-3 rounded-l-xl'>{entry.datetime}</td>
                    <td className='p-3'>{entry.employeeName}</td>
                    <td className='p-3'>{entry.activityType}</td>
                    <td className='p-3 text-blue-600 underline cursor-pointer rounded-r-xl'>
                      {entry.itemCode}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className='w-full text-center py-4 px-6 mt-6 bg-white/60 backdrop-blur-md border-t border-orange-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] text-sm text-gray-600 font-medium tracking-wide'>
        © {new Date().getFullYear()} Crafted with{' '}
        <span className='text-red-500'>❤</span> by Kanta King Technologies Pvt
        Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default ActivityLog;

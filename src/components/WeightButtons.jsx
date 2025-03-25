import React from 'react';

const WeightButtons = ({
  activeTab,
  setActiveTab,
  disableFirstWeight,
  disableSecondWeight,
}) => {
  return (
    <div className='flex items-center justify-center gap-4 w-full max-w-[1100px] mx-auto mb-4 mt-4 px-2'>
      {/* ✅ First Weight Button */}
      <button
        className={`flex-1 py-3 px-6 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg
    ${
      disableFirstWeight
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // ✅ Disabled UI
        : activeTab === 'firstWeight'
        ? 'bg-orange-500 text-white scale-105 shadow-md shadow-blue-300'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
        onClick={() => !disableFirstWeight && setActiveTab('firstWeight')}
        disabled={disableFirstWeight} // ✅ Prevent click if disabled
      >
        First / Gross Weight
      </button>

      {/* ✅ Second Weight Button (Disabled in Vehicle Inspection Page) */}
      <button
        className={`flex-1 py-3 px-6 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg
          ${
            activeTab === 'secondWeight'
              ? 'bg-orange-500 text-white scale-105 shadow-md shadow-blue-300'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${disableSecondWeight ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => {
          if (!disableSecondWeight) {
            setActiveTab('secondWeight');
          }
        }}
        disabled={disableSecondWeight}>
        Second / Tare Weight
      </button>
    </div>
  );
};

export default WeightButtons;

import React from "react";

const WeightButtons = ({ activeTab, setActiveTab, disableSecondWeight }) => {
  return (
    <div className="mt-4 flex gap-2">
      {/* ✅ First Weight Button */}
      <button
        className={`flex-1 py-3 rounded-lg text-white ${
          activeTab === "firstWeight" ? "bg-orange-500" : "bg-gray-300"
        }`}
        onClick={() => setActiveTab("firstWeight")}
      >
        First Weight
      </button>

      {/* ✅ Second Weight Button (Disabled in Vehicle Inspection Page) */}
      <button
        className={`flex-1 py-3 rounded-lg text-white ${
          activeTab === "secondWeight" ? "bg-orange-500" : "bg-gray-300"
        } ${disableSecondWeight ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => {
          if (!disableSecondWeight) {
            setActiveTab("secondWeight");
          }
        }}
        disabled={disableSecondWeight}
      >
        Second Weight
      </button>
    </div>
  );
};

export default WeightButtons;

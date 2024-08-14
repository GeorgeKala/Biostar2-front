import React from "react";

const CardScanModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-lg font-medium text-gray-900 mb-4">დააფიქსირეთ ბარათი</h2>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#105D8D] text-white px-4 py-2 rounded-md"
          >
            დახურვა
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardScanModal;

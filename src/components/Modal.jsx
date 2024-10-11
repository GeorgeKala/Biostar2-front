import React, { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, onSave, title, initialValue }) => {
  const [value, setValue] = useState(initialValue || "");

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="hover:text-gray-200 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            სახელი:
          </label>
          <input
            type="text"
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
            >
              შენახვა
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
            >
              გაუქმება
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

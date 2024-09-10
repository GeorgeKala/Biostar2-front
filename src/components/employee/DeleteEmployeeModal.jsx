import React, { useState } from "react";

const DeleteEmployeeModal = ({ isOpen, onClose, onDelete, employee }) => {
  const [expiryDatetime, setExpiryDatetime] = useState("");

  const handleSubmit = () => {
    if (expiryDatetime) {
      onDelete(expiryDatetime); 
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center p-4 bg-red-500 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Delete Employee</h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 focus:outline-none"
          >
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
        <div className="p-4">
          <p>
            დარწმუნებული ხართ რომ გსურთ თანამშრომელი{" "}
            <strong>{employee?.fullname}ს</strong> დაარქივება?
          </p>
          <label className="block mt-4 text-sm font-medium text-gray-700">
            გათავისუპლების თარიღი:
            <input
              type="date"
              value={expiryDatetime}
              onChange={(e) => setExpiryDatetime(e.target.value)}
              className="mt-2 px-3 py-2 block w-full bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </label>
          <div className="mt-6 flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={onClose}
            >
              გაუქმება
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={handleSubmit}
            >
              დაარქივება
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeModal;

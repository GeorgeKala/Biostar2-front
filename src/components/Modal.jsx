
import React from "react";

const Modal = ({ isOpen, onClose, onSave, title, initialValue }) => {
  const [value, setValue] = React.useState(initialValue || "");

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg z-50">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            გაუქმება
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            შენახვა
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

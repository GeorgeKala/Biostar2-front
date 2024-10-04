import React from "react";

const LinksModal = ({ isVisible, links, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-[5%] bg-white shadow-lg p-6 z-50 rounded-lg border border-gray-200 w-64">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Quick Links</h2>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.path}
            className="text-blue-600 hover:text-blue-800 hover:bg-gray-50 p-2 rounded-md transition duration-300 block"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default LinksModal;

import React from 'react';
import { Link } from 'react-router-dom';

const LinksModal = ({ isOpen, links, onClose, position }) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute bg-white shadow-lg rounded-lg p-4 z-50"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        ✕
      </button>
      <div className="flex flex-col">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className="text-black hover:bg-gray-200 px-4 py-2 rounded"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LinksModal;

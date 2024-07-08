import React from "react";
import TickleIcon from "../assets/tickcircle.png";
import CloseIcon from "../assets/close.png";

const SuccessPopup = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white  w-80 rounded-xl  shadow-lg">
        <div className="flex bg-[#1976D2] rounded-t-xl rounded-lg justify-between items-center border-b pb-2 px-2 py-2">
          <h2 className="text-xl text-white font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <img src={CloseIcon} />
          </button>
        </div>
        <div className="py-4 text-center flex flex-col items-center justify-center rounded-b-xl">
          <div className="mb-4">
            <img src={TickleIcon} alt="" />
          </div>
          <p className="mb-4 font-bold">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;

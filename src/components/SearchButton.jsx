import React from 'react';
import SuccessIcon from '../assets/successicon.png';

const SearchButton = ({ onClick, type = '' }) => {
  return (
    <button
    type={type}
      className="flex items-center gap-2 bg-[#1976D2] text-white min-w-max	 py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
      onClick={onClick}
    >
      <img src={SuccessIcon} className='w-[20px]' alt="Success Icon" />
      ნახვა
    </button>
  );
};

export default SearchButton;

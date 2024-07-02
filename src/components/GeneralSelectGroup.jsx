import { useState } from "react";
import CheckIcon from "../assets/Check.png"; 

const GeneralSelectGroup = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative inline-block w-full">
        <div
          className="border border-[#105D8D] py-3 rounded px-2 cursor-pointer flex justify-between items-center"
          onClick={toggleDropdown}
        >
          <span className={`text-gray-400 ${selected ? "text-black" : ""}`}>
            {selected ? selected : label}
          </span>
          <svg
            className={`w-4 h-4 transition-transform transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        {isOpen && (
          <div className="absolute w-full mt-1 border border-[#105D8D] rounded bg-white shadow-lg z-10">
            {options.map((option, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                onClick={() => handleSelect(option)}
              >
                {option}
                {selected === option && (
                  <div className="ml-2 bg-[#1976D2] rounded p-1">
                    <img src={CheckIcon} alt="Checked" className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSelectGroup;

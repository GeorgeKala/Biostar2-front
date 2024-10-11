import React, { useState, useEffect, useRef } from "react";

const ArrowDownIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-5 transition-transform duration-300 ${
      isOpen ? "rotate-180" : "rotate-0"
    }`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const CustomSelect = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  return (
    <div
      ref={selectRef}
      className={`relative outline-none rounded-md w-full ${
        className ? className : "bg-white border border-[#105D8D]"
      }`}
    >
      <div
        className={`${
          className ? className : "bg-white border-[#105D8D]"
        } border border-gray-300 rounded-md cursor-pointer py-2 px-4 flex items-center justify-between`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedValue ? selectedValue : placeholder}
        </span>
        <ArrowDownIcon isOpen={isOpen} />
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 bg-white border border-gray-300 rounded-md mt-2 w-full shadow-lg transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 max-h-60' : 'opacity-0 max-h-0'
          } transform`}
          style={{
            maxHeight: isOpen ? "300px" : "0",
            overflow: isOpen ? "auto" : "hidden",
          }}
        >
          <input
            type="text"
            className="w-full p-2 border-b focus:outline-none"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-h-60 overflow-y-auto py-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                  onClick={() => handleSelect(option)}
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

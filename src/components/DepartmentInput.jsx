import React from "react";
import SearchIcon from "../assets/search.png";

const DepartmentInput = ({
  value,
  onClear,
  onSearchClick,
  placeholder = "დეპარტამენტი",
  className,
}) => {
  const defaultClasses =
    "bg-white border border-[#105D8D] outline-none rounded-l py-3 px-4 w-full pr-10";

  const inputClassName = className ? className : defaultClasses;

  return (
    <div className="w-full flex flex-col gap-2 relative">
      <div className="flex">
        <input
          className={inputClassName}
          placeholder={placeholder}
          value={value}
          readOnly
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-12 top-[50%] transform -translate-y-1/2 mr-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="black"
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
        )}
        <button onClick={onSearchClick} className="bg-[#105D8D] px-4 rounded-r">
          <img className="w-[20px]" src={SearchIcon} alt="Search" />
        </button>
      </div>
    </div>
  );
};

export default DepartmentInput;

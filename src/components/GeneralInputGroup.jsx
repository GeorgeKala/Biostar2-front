import React from "react";

const GeneralInputGroup = ({ placeholder, type, name, value = "", onChange }) => {
  const handleClear = () => {
    onChange({ target: { name, value: "" } });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          className="outline-none border border-[#105D8D] py-3 rounded px-2 w-full pr-10"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
      </div>
    </div>
  );
};

export default GeneralInputGroup;

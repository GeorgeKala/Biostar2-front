import React from "react";

const InputGroup = ({
  label,
  placeholder,
  type,
  name,
  value = "",
  onChange,
  error
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[#105D8D] font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        className="outline-none border border-[#105D8D] py-3 rounded-2xl px-2 w-full"
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default InputGroup;

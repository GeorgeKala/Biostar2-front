import React, { useState } from "react";

const FilterModal = ({
  isOpen,
  onClose,
  filterableData,
  onApply,
  position,
  label = "Filters",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleCheckboxChange = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSelectAll = () => {
    if (selectedFilters.length === filterableData.length) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters(filterableData);
    }
  };

  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  const filteredData = filterableData.filter((item) => {
    if (typeof item === "number") {
      return item.toString().includes(searchTerm);
    }
    if (typeof item === "string") {
      return item.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });
  

  return isOpen ? (
    <div
      className="absolute bg-white border border-gray-300 shadow-lg z-50 w-56 p-4 rounded-md"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="mb-3 font-semibold text-gray-700 text-sm">{label}</div>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-3 text-sm border border-gray-300 rounded"
        />
      </div>
      <div className="max-h-40 overflow-y-auto mb-3 p-2 border border-gray-200 rounded bg-gray-50">
        <div className="mb-2">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={selectedFilters.length === filterableData.length}
              onChange={handleSelectAll}
              className="mr-2"
            />
            (All)
          </label>
        </div>
        {filteredData.map((item, index) => (
          <div key={index} className="mb-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                value={item}
                checked={selectedFilters.includes(item)}
                onChange={() => handleCheckboxChange(item)}
                className="mr-2"
              />
              {item}
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setSelectedFilters([])}
          className="px-3 py-1 text-sm rounded bg-gray-200 border border-gray-300"
        >
          Clear
        </button>
        <div>
          <button
            onClick={handleApply}
            className="px-3 py-1 text-sm rounded bg-blue-600 text-white border border-blue-600 mr-2"
          >
            Apply
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded bg-red-600 text-white border border-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default FilterModal;

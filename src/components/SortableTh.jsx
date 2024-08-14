import React from "react";
import FilterIcon from "../assets/filter-icon.png";

const SortableTh = ({ label, sortKey, sortConfig, onSort, onFilterClick }) => {
  const ArrowUpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 inline"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );

  const ArrowDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 inline"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const handleFilterClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onFilterClick(rect);
  };

  return (
    <th
      className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative group"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span className="truncate flex-grow">{label}</span>
        <span className="flex items-center gap-1">
          <button
            onClick={handleFilterClick}
            className="filter-icon opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <img src={FilterIcon} alt="Filter" className="w-3 h-3" />
          </button>
          {sortConfig.key === sortKey && (
            <span>
              {sortConfig.direction === "ascending" ? (
                <ArrowUpIcon />
              ) : (
                <ArrowDownIcon />
              )}
            </span>
          )}
        </span>
      </div>
    </th>
  );
};

export default SortableTh;

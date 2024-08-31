import React, { useState, useEffect, useRef } from "react";
import FilterIcon from "../assets/filter-icon.png";

const Table = ({
  data,
  headers,
  filters,
  sortConfig,
  onSort,
  onFilterClick,
  onFilterChange,
  rowClassName = () => "",
  onRowClick,
  onRowDoubleClick, 
  filterableFields,
  onContext,
}) => {
  const [columnWidths, setColumnWidths] = useState(
    headers.reduce((acc, header) => {
      acc[header.key] = 50;
      return acc;
    }, {})
  );

  const tableRef = useRef(null);

  const handleResizeColumn = (newWidth, key) => {
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [key]: newWidth > 10 ? newWidth : 10,
    }));
  };

  const handleMouseDown = (e, sortKey) => {
    e.preventDefault();
    document.body.style.userSelect = "none";

    const startX = e.clientX;
    const initialWidth = columnWidths[sortKey];

    const handleMouseMove = (moveEvent) => {
      const newWidth = initialWidth + (moveEvent.clientX - startX);
      handleResizeColumn(newWidth, sortKey);
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

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

  return (
    <div className="container mx-auto  overflow-x-auto">
      <div
        className="min-w-max max-h-[100vh] overflow-y-auto"
        ref={tableRef}
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-[#1976D2] text-white text-xs sticky top-0 z-10">
            <tr>
              <th className="w-[30px]"></th>
              {headers &&
                headers.map((header) => (
                  <th
                    key={header.key}
                    className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative group"
                    style={{
                      maxWidth: `${columnWidths[header.key]}px`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onClick={() => onSort(header.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate flex-grow">{header.label}</span>
                      <span className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            onFilterClick(
                              data
                                .map((item) => header.extractValue(item))
                                .filter(Boolean),
                              header.key,
                              rect
                            );
                          }}
                          className="filter-icon opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <img
                            src={FilterIcon}
                            alt="Filter"
                            className="w-3 h-3"
                          />
                        </button>
                        {sortConfig.key === header.key && (
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
                    <div
                      onMouseDown={(e) => handleMouseDown(e, header.key)}
                      className="absolute top-0 right-0 h-full w-2 cursor-col-resize bg-transparent"
                    />
                  </th>
                ))}
            </tr>
            <tr>
              <th className="w-[30px]">
                <img
                  className="w-[20px] m-auto"
                  src={FilterIcon}
                  alt="Filter Icon"
                />
              </th>
              {filterableFields &&
                filterableFields.map((filterKey) => (
                  <th
                    key={filterKey}
                    className="border border-gray-200 customized-th-tr"
                    style={{
                      maxWidth: `${columnWidths.filterKey}px`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <input
                      type="text"
                      name={filterKey}
                      value={filters[filterKey]?.text || ""}
                      onChange={onFilterChange}
                      className="font-normal px-2 py-1 w-full outline-none border-none bg-transparent"
                      autoComplete="off"
                    />
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-xs">
            {data &&
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`px-2 py-1 border border-gray-200 w-20 ${rowClassName(
                    item
                  )}`}
                  onClick={() => onRowClick(item)}
                  onDoubleClick={() => onRowDoubleClick(item)} // Add double-click handler
                  onContextMenu={(e) => onContext(e)}
                >
                  <td className="w-[30px]"></td>
                  {headers.map((header) => (
                    <td
                      key={header.key}
                      className="px-2 py-1 border border-gray-200 customized-th-tr"
                      style={{
                        maxWidth: `${columnWidths[header.key]}px`,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {header.extractValue
                        ? header.extractValue(item)
                        : item[header.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

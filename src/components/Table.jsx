import React from "react";
import SortableTh from "./SortableTh";
import FilterIcon from "../assets/filter-icon.png";

const Table = ({
  data,
  headers,
  filters,
  sortConfig,
  onSort,
  onFilterClick,
  onFilterChange,
  rowClassName,
  onRowClick,
  filterableFields,
  onContext
}) => {
  return (
    <div className="container mx-auto mt-10 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
        <thead className="bg-[#1976D2] text-white text-xs">
          <tr>
            <th className="w-[30px]"></th>
            {headers &&
              headers.map((header) => (
                <SortableTh
                  key={header.key}
                  label={header.label}
                  sortKey={header.key}
                  sortConfig={sortConfig}
                  onSort={onSort}
                  onFilterClick={(rect) =>
                    onFilterClick(
                      data
                        .map((item) => header.extractValue(item))
                        .filter(Boolean),
                      header.key,
                      rect
                    )
                  }
                />
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
          {data && data.map((item, index) => (
            <tr
              key={index}
              className={`px-2 py-1 border border-gray-200 w-20 ${rowClassName(
                item
              )}`}
              onClick={() => onRowClick(item)}
              onContextMenu={(e) => onContext(e)}
            >
              <td className="w-[30px]"></td>
              {headers.map((header) => (
                <td
                  key={header.key}
                  className="px-2 py-1 border border-gray-200 customized-th-tr"
                >
                  {header.extractValue(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

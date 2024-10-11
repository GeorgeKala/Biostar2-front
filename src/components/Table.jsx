// import React, { useState, useEffect, useRef } from "react";
// import FilterIcon from "../assets/filter-icon.png";

// const Table = ({
//   data,
//   headers,
//   filters,
//   sortConfig,
//   onSort,
//   onFilterClick,
//   onFilterChange,
//   rowClassName = () => "",
//   onRowClick,
//   onRowDoubleClick, 
//   filterableFields,
//   onContext,
//   lastReportRef,
//   formData
// }) => {
//   const [columnWidths, setColumnWidths] = useState(
//     headers.reduce((acc, header) => {
//       acc[header.key] = 50;
//       return acc;
//     }, {})
//   );

//   const tableRef = useRef(null);

//   const handleResizeColumn = (newWidth, key) => {
//     setColumnWidths((prevWidths) => ({
//       ...prevWidths,
//       [key]: newWidth > 10 ? newWidth : 10,
//     }));
//   };

//   const handleMouseDown = (e, sortKey) => {
//     e.preventDefault();
//     document.body.style.userSelect = "none";

//     const startX = e.clientX;
//     const initialWidth = columnWidths[sortKey];

//     const handleMouseMove = (moveEvent) => {
//       const newWidth = initialWidth + (moveEvent.clientX - startX);
//       handleResizeColumn(newWidth, sortKey);
//     };

//     const handleMouseUp = () => {
//       document.body.style.userSelect = "";
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const ArrowUpIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-4 w-4 inline"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       strokeWidth="2"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
//     </svg>
//   );

//   const ArrowDownIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-4 w-4 inline"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       strokeWidth="2"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//     </svg>
//   );

//   return (
//     <div className="w-full mx-auto  overflow-x-auto">
//       <div className="min-w-max max-h-[750px] overflow-y-auto" ref={tableRef}>
//         <table className="min-w-full divide-y divide-gray-200 ">
//           <thead className=" text-white text-xs sticky top-0 z-50 ">
//             <tr>
//               <th className="bg-[#1976D2] w-[30px] "></th>
//               {headers &&
//                 headers.map((header) => (
//                   <th
//                     key={header.key}
//                     className=" border-solid  border-2 text-[14px] bg-[#1976D2] font-normal text-left px-2 customized-th-tr  cursor-pointer relative group"
//                     style={{
//                       maxWidth: `${columnWidths[header.key]}px`,
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                     onClick={() => onSort(header.key)}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="truncate flex-grow">{header.label}</span>
//                       <span className="flex items-center gap-1">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             const rect =
//                               e.currentTarget.getBoundingClientRect();
//                             onFilterClick(
//                               data
//                                 .map((item) => header.extractValue(item))
//                                 .filter(Boolean),
//                               header.key,
//                               rect
//                             );
//                           }}
//                           className="filter-icon opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                         >
//                           <img
//                             src={FilterIcon}
//                             alt="Filter"
//                             className="w-3 h-3"
//                           />
//                         </button>
//                         {sortConfig.key === header.key && (
//                           <span>
//                             {sortConfig.direction === "ascending" ? (
//                               <ArrowUpIcon />
//                             ) : (
//                               <ArrowDownIcon />
//                             )}
//                           </span>
//                         )}
//                       </span>
//                     </div>
//                     <div
//                       onMouseDown={(e) => handleMouseDown(e, header.key)}
//                       className="absolute top-0 right-0 h-full w-2 cursor-col-resize bg-transparent"
//                     />
//                   </th>
//                 ))}
//             </tr>
//             <tr>
//               <th  className="bg-[#1976D2] w-[30px]">
//                 <img
//                   className="w-[20px] m-auto"
//                   src={FilterIcon}
//                   alt="Filter Icon"
//                 />
//               </th>
//               {filterableFields &&
//                 filterableFields.map((filterKey) => (
//                   <th
//                     key={filterKey}
//                     className="border  customized-th-tr"
//                     style={{
//                       maxWidth: `${columnWidths.filterKey}px`,
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     <input
//                       type="text"
//                       name={filterKey}
//                       value={
//                         formData && formData[filterKey]
//                           ? formData[filterKey]
//                           : filters[filterKey]?.text || ""
//                       }
//                       onChange={onFilterChange}
//                       className="font-normal text-black bg-[#D3DBEB] px-2 py-1 w-full outline-none border-none "
//                       autoComplete="off"
//                     />
//                   </th>
//                 ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200 text-xs">
//             {data.map((item, index) => {
//               const isLastRow = index === data.length - 1;
//               return (
//                 <tr
//                   key={index}
//                   className={`px-2 py-1 border border-gray-200 cursor-default ${rowClassName(
//                     item
//                   )}`}
//                   onClick={() => onRowClick(item)}
//                   onDoubleClick={() => onRowDoubleClick(item)}
//                   onContextMenu={(e) => onContext(e)}
//                   ref={isLastRow ? lastReportRef : null} // Attach ref to the last row
//                 >
//                   <td className="w-[30px]"></td>
//                   {headers.map((header) => (
//                     <td
//                       key={header.key}
//                       className="px-2 py-1 border border-gray-200 customized-th-tr"
//                       style={{
//                         maxWidth: `${columnWidths[header.key]}px`,
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {header.extractValue
//                         ? header.extractValue(item)
//                         : item[header.key]}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Table;



import React, { useState, useRef } from "react";
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
  lastReportRef,
  formData
}) => {
  const [columnWidths, setColumnWidths] = useState(
    headers.reduce((acc, header) => {
      acc[header.key] = 50;
      return acc;
    }, {})
  );

  const [isResizing, setIsResizing] = useState(false); // New flag to track resizing
  const resizeTimeout = useRef(null); // Ref to store timeout for resetting resize

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
    setIsResizing(true); // Set resizing to true when resize starts

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

      // Clear the resize flag after a short delay to prevent accidental sorting clicks
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        setIsResizing(false);
      }, 100); // Adjust this delay if necessary
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSortClick = (headerKey) => {
    // If the user is resizing, do not trigger sorting
    if (!isResizing) {
      onSort(headerKey);
    }
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
    <div className="w-full mx-auto overflow-x-auto">
      <div className="min-w-max max-h-[750px] overflow-y-auto" ref={tableRef}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="text-white text-xs sticky top-0 z-20">
            <tr>
              <th className="bg-[#1976D2] w-[30px]"></th>
              {headers &&
                headers.map((header) => (
                  <th
                    key={header.key}
                    className="border border-solid border-2 text-[14px] bg-[#1976D2] font-normal text-left px-2 cursor-pointer relative group"
                    style={{
                      maxWidth: `${columnWidths[header.key]}px`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onClick={() => handleSortClick(header.key)} // Use custom click handler
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
              <th className="bg-[#1976D2] w-[30px]">
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
                    className="border border-solid border-2 customized-th-tr"
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
                      value={
                        formData && formData[filterKey]
                          ? formData[filterKey]
                          : filters[filterKey]?.text || ""
                      }
                      onChange={onFilterChange}
                      className="font-normal text-black bg-[#D3DBEB] px-2 py-1 w-full outline-none border-none"
                      autoComplete="off"
                    />
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-xs">
            {data.map((item, index) => {
              const isLastRow = index === data.length - 1;
              return (
                <tr
                  key={index}
                  className={`px-2 py-1 border border-gray-200 cursor-default ${rowClassName(
                    item
                  )}`}
                  onClick={() => onRowClick(item)}
                  onDoubleClick={() => onRowDoubleClick(item)}
                  onContextMenu={(e) => onContext(e)}
                  ref={isLastRow ? lastReportRef : null} // Attach ref to the last row
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
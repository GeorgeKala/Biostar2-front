import React from "react";
import ArchivedEmployeesIcon from "../assets/archived-employees.png";
import AllEmployeesIcon from "../assets/all-employees.png";
import ActiveEmployeesIcon from "../assets/active-employees.png";
import CloseIcon from "../assets/close.png"; 

const EmployeeStatusModal = ({ isOpen, onClose, handleSearch }) => {
    
  const handleClick = (status) => {
    handleSearch(status);  
    onClose();             
  };
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all duration-300 
              scale-95 opacity-0 ease-out animate-fade-in"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4 text-center">
                თანამშრომლები
              </h2>
              <button onClick={onClose} className="focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-around mt-6">
              {/* Active Employees */}
              <div
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => handleClick("active")}
              >
                <div className="flex justify-center p-4 rounded-full transition-all duration-200 transform group-hover:scale-110 group-hover:bg-blue-100">
                  <img
                    src={ActiveEmployeesIcon}
                    alt="Active Employees"
                    className="w-16 h-16"
                  />
                </div>
                <span className="mt-2 text-center">აქტიური</span>
              </div>
              <div
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => handleClick("archived")}
              >
                <div className="flex justify-center p-4 rounded-full transition-all duration-200 transform group-hover:scale-110 group-hover:bg-blue-100">
                  <img
                    src={ArchivedEmployeesIcon}
                    alt="Archived Employees"
                    className="w-16 h-16"
                  />
                </div>
                <span className="mt-2 text-center">დაარქივირებული</span>
              </div>
              {/* All Employees */}
              <div
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => handleClick("all")}
              >
                <div className="flex justify-center p-4 rounded-full transition-all duration-200 transform group-hover:scale-110 group-hover:bg-blue-100">
                  <img
                    src={AllEmployeesIcon}
                    alt="All Employees"
                    className="w-16 h-16"
                  />
                </div>
                <span className="mt-2 text-center">ყველა</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeStatusModal;

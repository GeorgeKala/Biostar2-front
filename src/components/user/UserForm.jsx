import React from "react";
import DepartmentInput from "../../components/DepartmentInput";
import EmployeeInput from "../../components/employee/EmployeeInput";

const UserForm = ({
  formData,
  userTypes,
  departments,
  handleChange,
  handleSave,
  closeModal,
  modalMode,
  handleClearDepartment,
  handleSelectEmployee,
  handleEmployeeInputClick,
  openNestedDropdown,
  setOpenNestedDropdown,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">
            {modalMode === "create" ? "დაამატე ახალი მომხმარებელი" : "განაახლე მომხმარებელი"}
          </h2>
          <button onClick={closeModal} className="hover:text-gray-200 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        {/* Explicitly prevent form submission when interacting with inputs */}
        <form
          className="p-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              სახელი:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              მომხმარებელი:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              მომხმარებლის ტიპი:
            </label>
            <select
              id="userType"
              name="userType"
              className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="">აირჩიე მომხმარებლის ტიპი</option>
              {userTypes &&
                userTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              დეპარტამენტი:
            </label>
            <DepartmentInput
              value={departments.find((d) => d.id === formData.department)?.name || ""}
              onClear={handleClearDepartment}
              onSearchClick={() => setOpenNestedDropdown(true)}
              className="px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-l shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
              თანამშრომელი:
            </label>
            <EmployeeInput
              value={formData.employee}
              onClear={handleSelectEmployee}
              onSearchClick={handleEmployeeInputClick}
              className="px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-l shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

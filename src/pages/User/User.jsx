import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import DeleteIcon from "../../assets/delete.png";
import EditIcon from "../../assets/edit.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import { fetchUsers } from "../../redux/userDataSlice";
import { fetchUserTypes } from "../../redux/userTypeSlice";
import userService from "../../services/users";
import EmployeeModal from "../../components/employee/EmployeeModal";
import * as XLSX from "xlsx";
import NestedDropdownModal from "../../components/NestedDropdownModal";
import FilterIcon from "../../assets/filter-icon.png";
import EmployeeInput from "../../components/employee/EmployeeInput";
import DepartmentInput from "../../components/DepartmentInput";

const User = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.user.users.items);
  const userTypes = useSelector((state) => state.userType.items);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    userType: "",
    department: "",
    employee: "",
    employeeId: "",
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    username: "",
    userType: "",
    department: "",
    employeeFullname: "",
  });
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUserTypes());
  }, [dispatch]);

  useEffect(() => {
    setUsers(usersData);
    setFilteredUsers(usersData);
  }, [usersData]);

  const applyFilters = () => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        user.username.toLowerCase().includes(filters.username.toLowerCase()) &&
        (filters.userType
          ? user.user_type?.name
              .toLowerCase()
              .includes(filters.userType.toLowerCase())
          : true) &&
        (filters.department
          ? user.department?.name
              .toLowerCase()
              .includes(filters.department.toLowerCase())
          : true) &&
        (filters.employeeFullname
          ? user.employee?.fullname
              .toLowerCase()
              .includes(filters.employeeFullname.toLowerCase())
          : true)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setModalMode("create");
    setFormData({
      name: "",
      username: "",
      userType: "",
      department: "",
      employee: "",
      employeeId: "",
    });
  };

  const openUpdateModal = () => {
    if (selectedUserId) {
      const user = users.find((u) => u.id === selectedUserId);
      setIsAddModalOpen(true);
      setModalMode("update");
      setFormData({
        name: user.name,
        username: user.username,
        userType: user.user_type.id,
        department: user.department ? user.department.id : "",
        employee: user.employee ? user.employee.fullname : "",
        employeeId: user.employee ? user.employee.id : "",
      });
    } else {
      alert("Please select a user to edit.");
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalMode("create");
    setSelectedUserId(null);
    setFormData({
      name: "",
      username: "",
      userType: "",
      department: "",
      employee: "",
      employeeId: "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { name, username, userType, department, employeeId } = formData;

    const userData = {
      name: name,
      username: username,
      user_type_id: userType,
      department_id: department,
      employee_id: employeeId,
    };

    try {
      if (modalMode === "create") {
        await userService.createUser(userData);
        closeAddModal();
      } else if (modalMode === "update" && selectedUserId) {
        const updatedUser = await userService.updateUser(
          selectedUserId,
          userData
        );
        const updatedIndex = users.findIndex(
          (user) => user.id === selectedUserId
        );
        if (updatedIndex !== -1) {
          const updatedUsers = [...users];
          updatedUsers[updatedIndex] = updatedUser;
          setUsers(updatedUsers);
        }
        closeAddModal();
      }
      dispatch(fetchUsers());
    } catch (error) {
      alert("Failed to save user: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (
      selectedUserId &&
      window.confirm("Are you sure you want to delete this user?")
    ) {
      try {
        await userService.deleteUser(selectedUserId);
        setUsers(users.filter((user) => user.id !== selectedUserId));
        setSelectedUserId(null);
      } catch (error) {
        alert("Failed to delete user: " + error.message);
      }
    } else {
      alert("Please select a user to delete.");
    }
  };

  const handleRowClick = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEmployeeInputClick = () => {
    setIsEmployeeModalOpen(true);
  };

  const handleSelectEmployee = (employee) => {
    setFormData((prevState) => ({
      ...prevState,
      employee: employee.fullname,
      employeeId: employee.id,
    }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((user) => ({
        მომხმარებელი: user.username,
        "სახელი გვარი": user.name,
        "მომხმარებლის ტიპი": user.user_type.name,
        დეპარტამენტი: user.department?.name,
        თანამშრომელი: user.employee?.fullname,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users.xlsx");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDepartmentSelect = (departmentId) => {
    setFormData((prevData) => ({
      ...prevData,
      department: departmentId,
    }));
    setOpenNestedDropdown(false);
  };

  const handleClearDepartment = () => {
    setFormData((prevData) => ({
      ...prevData,
      department: "",
    }));
  };

  const handleClearFormData = () => {
    setFormData((prevData) => ({
      ...prevData,
      employee: "",
      employeeId: "",
    }));
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            მომხმარებლები
          </h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={openAddModal}
            >
              <img src={NewIcon} alt="New" />
              ახალი
            </button>
            <button
              onClick={openUpdateModal}
              className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
              disabled={!selectedUserId}
            >
              <img src={EditIcon} alt="Edit" />
              შეცვლა
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#D9534F] text-white px-4 py-4 rounded-md flex items-center gap-2"
              disabled={!selectedUserId}
            >
              <img src={DeleteIcon} alt="Delete" />
              წაშლა
            </button>
            <button
              onClick={exportToExcel}
              className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
            >
              ჩამოტვირთვა
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="container mx-auto mt-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-[#1976D2] text-white">
              <tr>
                <th className="px-4 py-2 border"></th>
                {[
                  "მომხმარებელი",
                  "სახელი გვარი",
                  "მომხმარებლის ტიპი",
                  "დეპარტამენტი",
                  "თანამშრომელი",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border"
                  >
                    {header}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="px-4  border">
                  <img
                    className="w-[20px] m-auto"
                    src={FilterIcon}
                    alt="Filter"
                  />
                </th>
                {[
                  "username",
                  "name",
                  "userType",
                  "department",
                  "employeeFullname",
                ].map((filterKey, index) => (
                  <th key={index} className=" border">
                    <input
                      type="text"
                      name={filterKey}
                      value={filters[filterKey]}
                      onChange={handleFilterChange}
                      className="font-normal px-2 py-1 w-full outline-none border-none bg-transparent"
                      autoComplete="off"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers &&
                filteredUsers.map((user) => (
                  <tr
                    key={user?.id}
                    className={`cursor-pointer ${
                      user?.id === selectedUserId ? "bg-blue-200" : ""
                    }`}
                    onClick={() => handleRowClick(user.id)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs border">
                       {user?.id === selectedUserId && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs border">
                      {user?.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm truncate max-w-xs border">
                      {user?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm truncate max-w-xs border">
                      {user?.user_type?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm truncate max-w-xs border">
                      {user?.department?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm truncate max-w-xs border">
                      {user?.employee?.fullname}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {modalMode === "create"
                  ? "დაამატე ახალი მომხმარებელი"
                  : "განაახლე მომხმარებელი"}
              </h2>
              <button
                onClick={closeAddModal}
                className="hover:text-gray-200 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
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
            </div>
            <form onSubmit={handleSave} className="p-3">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="userType"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  დეპარტამენტი:
                </label>
                <DepartmentInput
                  value={
                    departments.find((d) => d.id === formData.department)
                      ?.name || ""
                  }
                  onClear={handleClearDepartment}
                  onSearchClick={() => setOpenNestedDropdown(true)}
                  className={
                    " px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-l shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="employeeId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  თანამშრომელი:
                </label>
                <EmployeeInput
                  value={formData.employee}
                  onClear={handleClearFormData}
                  onSearchClick={handleEmployeeInputClick}
                  className={
                    " px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-l shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  }
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openNestedDropdown && (
        <NestedDropdownModal
          header="დეპარტამენტები"
          isOpen={openNestedDropdown}
          onClose={() => setOpenNestedDropdown(false)}
          onSelect={handleDepartmentSelect}
          data={nestedDepartments}
          link={"/departments"}
        />
      )}

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSelectEmployee={handleSelectEmployee}
      />
    </AuthenticatedLayout>
  );
};

export default User;

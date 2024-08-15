import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import EditIcon from "../../assets/edit.png";
import { fetchUsers } from "../../redux/userDataSlice";
import { fetchUserTypes } from "../../redux/userTypeSlice";
import userService from "../../services/users";
import EmployeeModal from "../../components/employee/EmployeeModal";
import * as XLSX from "xlsx";
import NestedDropdownModal from "../../components/NestedDropdownModal";
import FilterIcon from "../../assets/filter-icon.png";

import { useFilter } from "../../hooks/useFilter";
import FilterModal from "../../components/FilterModal";
import SortableTh from "../../components/SortableTh";
import UserForm from "../../components/user/UserForm";


const User = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.user.users.items);
  const userTypes = useSelector((state) => state.userType.items);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );

  const { filters, handleInputChange, applyModalFilters, clearFilters } = useFilter({
    username: { text: "", selected: [] },
    name: { text: "", selected: [] },
    userType: { text: "", selected: [] },
    department: { text: "", selected: [] },
    employeeFullname: { text: "", selected: [] },
  });

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    userType: "",
    department: "",
    employee: "",
    employeeId: "",
  });

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUserTypes());
  }, [dispatch]);

  useEffect(() => {
    setUsers(usersData);
    setFilteredUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    applyFilters();
  }, [filters, sortConfig]);

  const applyFilters = () => {
    const filtered = users.filter((user) => {
      const matches = (fieldValue, filter) => {
        const textFilter = filter.text.toLowerCase();
        const selectedFilters = filter.selected.map((f) => f.toLowerCase());

        const matchesText = !textFilter || (fieldValue && fieldValue.toLowerCase().includes(textFilter));
        const matchesSelected =
          selectedFilters.length === 0 ||
          selectedFilters.some((selected) => fieldValue && fieldValue.toLowerCase().includes(selected));

        return matchesText && matchesSelected;
      };

      return (
        matches(user.username, filters.username) &&
        matches(user.name, filters.name) &&
        matches(user?.user_type?.name, filters.userType) &&
        matches(user?.department?.name, filters.department) &&
        matches(user?.employee?.fullname, filters.employeeFullname)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = sortConfig.key.split(".").reduce((o, i) => (o ? o[i] : ""), a);
        const bValue = sortConfig.key.split(".").reduce((o, i) => (o ? o[i] : ""), b);
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(filtered);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleOpenFilterModal = (data, fieldName, rect) => {
    setFilterableData(data);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  };

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

  const openUpdateModal = (user) => {
    setIsAddModalOpen(true);
    setModalMode("update");
    setSelectedUserId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      userType: user.user_type.id,
      department: user.department ? user.department.id : "",
      employee: user.employee ? user.employee.fullname : "",
      employeeId: user.employee ? user.employee.id : "",
    });
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
      name,
      username,
      user_type_id: userType,
      department_id: department,
      employee_id: employeeId,
    };

    try {
      if (modalMode === "create") {
        await userService.createUser(userData);
        closeAddModal();
      } else if (modalMode === "update" && selectedUserId) {
        const updatedUser = await userService.updateUser(selectedUserId, userData);
        const updatedIndex = users.findIndex((user) => user.id === selectedUserId);
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

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        alert("Failed to delete user: " + error.message);
      }
    }
  };

  const handleRowClick = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  const handleSelectEmployee = (employee) => {
    setFormData((prevData) => ({
      ...prevData,
      employee: employee.fullname,
      employeeId: employee.id,
    }));
    setIsEmployeeModalOpen(false);
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

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">მომხმარებლები</h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={openAddModal}
            >
              <img src={NewIcon} alt="New" />
              ახალი
            </button>
              <button
                  onClick={() => openUpdateModal(users.find((user) => user.id === selectedUserId))}
                  className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
                >
                  <img src={EditIcon} alt="Edit" />
                  შეცვლა
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedUserId);
                  }}
                  className="bg-[#D9534F] text-white px-4 py-4 rounded-md flex items-center gap-2"
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
                <SortableTh
                  label="მომხმარებელი"
                  sortKey="username"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onFilterClick={(rect) =>
                    handleOpenFilterModal(
                      filteredUsers.map((user) => user.username).filter(Boolean),
                      "username",
                      rect
                    )
                  }
                />
                <SortableTh
                  label="სახელი გვარი"
                  sortKey="name"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onFilterClick={(rect) =>
                    handleOpenFilterModal(
                      filteredUsers.map((user) => user.name).filter(Boolean),
                      "name",
                      rect
                    )
                  }
                />
                <SortableTh
                  label="მომხმარებლის ტიპი"
                  sortKey="user_type.name"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onFilterClick={(rect) =>
                    handleOpenFilterModal(
                      filteredUsers.map((user) => user?.user_type?.name).filter(Boolean),
                      "userType",
                      rect
                    )
                  }
                />
                <SortableTh
                  label="დეპარტამენტი"
                  sortKey="department.name"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onFilterClick={(rect) =>
                    handleOpenFilterModal(
                      filteredUsers.map((user) => user?.department?.name).filter(Boolean),
                      "department",
                      rect
                    )
                  }
                />
                <SortableTh
                  label="თანამშრომელი"
                  sortKey="employee.fullname"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onFilterClick={(rect) =>
                    handleOpenFilterModal(
                      filteredUsers.map((user) => user?.employee?.fullname).filter(Boolean),
                      "employeeFullname",
                      rect
                    )
                  }
                />
              </tr>
              <tr>
                <th className="px-4 border">
                  <img className="w-[20px] m-auto" src={FilterIcon} alt="Filter" />
                </th>
                {[
                  "username",
                  "name",
                  "userType",
                  "department",
                  "employeeFullname",
                ].map((filterKey, index) => (
                  <th key={index} className="border">
                    <input
                      type="text"
                      name={filterKey}
                      value={filters[filterKey]?.text || ""}
                      onChange={handleInputChange}
                      className="font-normal px-2  w-full outline-none border-none bg-transparent"
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
                    className={`cursor-pointer ${user?.id === selectedUserId ? "bg-blue-200" : ""}`}
                    onClick={() => handleRowClick(user.id)}
                  >
                    <td className="px-2 py-1 border border-gray-200 max-w-3">
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
                    <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs border">
                      {user?.username}
                    </td>
                    <td className="px-6  whitespace-nowrap text-sm truncate max-w-xs border">
                      {user?.name}
                    </td>
                    <td className="px-6  whitespace-nowrap text-sm truncate max-w-xs border">
                      {user?.user_type?.name}
                    </td>
                    <td className="px-6  whitespace-nowrap text-sm truncate max-w-xs border">
                      {user?.department?.name}
                    </td>
                    <td className="px-6  whitespace-nowrap text-sm truncate max-w-xs border">
                      {user?.employee?.fullname}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <UserForm
          formData={formData}
          userTypes={userTypes}
          departments={departments}
          handleChange={handleChange}
          handleSave={handleSave}
          closeModal={closeAddModal}
          modalMode={modalMode}
          handleClearDepartment={handleClearDepartment}
          handleSelectEmployee={handleSelectEmployee}
          handleEmployeeInputClick={handleEmployeeInputClick}
          openNestedDropdown={openNestedDropdown}
          setOpenNestedDropdown={setOpenNestedDropdown}
        />
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

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterableData={filterableData}
        onApply={(selectedFilters) => applyModalFilters(currentFilterField, selectedFilters)}
        position={modalPosition}
      />
    </AuthenticatedLayout>
  );
};

export default User;

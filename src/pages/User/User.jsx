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
import { useFilter } from "../../hooks/useFilter";
import FilterModal from "../../components/FilterModal";
import Table from "../../components/Table";
import UserForm from "../../components/user/UserForm";

const User = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.user.users.items);
  const userTypes = useSelector((state) => state.userType.items);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );

  const { filters, handleInputChange, applyModalFilters, clearFilters } =
    useFilter({
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

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
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

        const matchesText =
          !textFilter ||
          (fieldValue && fieldValue.toLowerCase().includes(textFilter));
        const matchesSelected =
          selectedFilters.length === 0 ||
          selectedFilters.some(
            (selected) =>
              fieldValue && fieldValue.toLowerCase().includes(selected)
          );

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
        const aValue = sortConfig.key
          .split(".")
          .reduce((o, i) => (o ? o[i] : ""), a);
        const bValue = sortConfig.key
          .split(".")
          .reduce((o, i) => (o ? o[i] : ""), b);
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


  const tableHeaders = [
    {
      label: "მომხმარებელი",
      key: "username",
      extractValue: (user) => user.username,
    },
    {
      label: "სახელი გვარი",
      key: "name",
      extractValue: (user) => user.name,
    },
    {
      label: "მომხმარებლის ტიპი",
      key: "user_type.name",
      extractValue: (user) => user?.user_type?.name,
    },
    {
      label: "დეპარტამენტი",
      key: "department.name",
      extractValue: (user) => user?.department?.name,
    },
    {
      label: "თანამშრომელი",
      key: "employee.fullname",
      extractValue: (user) => user?.employee?.fullname,
    },
  ];

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
              onClick={() =>
                openUpdateModal(
                  users.find((user) => user.id === selectedUserId)
                )
              }
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
        <Table
          data={filteredUsers}
          headers={tableHeaders}
          filters={filters}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterClick={handleOpenFilterModal}
          onFilterChange={handleInputChange}
          rowClassName={(user) =>
            user?.id === selectedUserId ? "bg-blue-200" : ""
          }
          onRowClick={(user) => handleRowClick(user.id)}
          filterableFields={[
            "username",
            "name",
            "userType",
            "department",
            "employeeFullname",
          ]}
        />
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
        onApply={(selectedFilters) =>
          applyModalFilters(currentFilterField, selectedFilters)
        }
        position={modalPosition}
      />
    </AuthenticatedLayout>
  );
};

export default User;

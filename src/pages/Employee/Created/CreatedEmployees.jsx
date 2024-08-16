import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, deleteEmployee } from "../../../redux/employeeSlice";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import EmployeeEditModal from "../../../components/EmployeeEditModal";
import EmployeeStatusModal from "../../../components/EmployeeStatusModal";
import * as XLSX from "xlsx";
import FilterModal from "../../../components/FilterModal";
import { useFilter } from "../../../hooks/useFilter";
import Table from "../../../components/Table";
import NewIcon from "../../../assets/new.png";
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";
import { Link } from "react-router-dom";

const CreatedEmployees = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.items);
  const user = useSelector((state) => state.user.user);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [employeeStatusModal, setEmployeeStatusModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");

  const { filters, handleInputChange, applyModalFilters, clearFilters } =
    useFilter({
      fullname: { text: "", selected: [] },
      department_name: { text: "", selected: [] },
      position: { text: "", selected: [] },
      personal_id: { text: "", selected: [] },
      phone_number: { text: "", selected: [] },
      card_number: { text: "", selected: [] },
      group_name: { text: "", selected: [] },
      schedule_name: { text: "", selected: [] },
      honorable_minutes_per_day: { text: "", selected: [] },
      holidays: { text: "", selected: [] },
    });

  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [employees, filters, sortConfig]);

  const applyFilters = () => {
    let filtered = employees.filter((employee) => {
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
        matches(employee.fullname, filters.fullname) &&
        matches(employee?.department?.name, filters.department_name) &&
        matches(employee.position, filters.position) &&
        matches(employee.personal_id, filters.personal_id) &&
        matches(employee.phone_number, filters.phone_number) &&
        matches(employee.card_number, filters.card_number) &&
        matches(employee?.group?.name, filters.group_name) &&
        matches(employee?.schedule?.name, filters.schedule_name) &&
        matches(
          employee.honorable_minutes_per_day?.toString(),
          filters.honorable_minutes_per_day
        ) &&
        matches(
          employee.holidays.map((holiday) => holiday.name).join(", "),
          filters.holidays
        )
      );
    });

    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
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

    setFilteredEmployees(filtered);
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

  const handleDeleteEmployee = (employeeId) => {
    dispatch(deleteEmployee(employeeId));
  };

  const exportToExcel = () => {
    const dataToExport = [
      [
        "სახელი/გვარი",
        "დეპარტამენტი",
        "პოზიცია",
        "პირადი ნომერი",
        "ტელეფონის ნომერი",
        "ბარათის ნომერი",
        "ჯგუფი",
        "განრიგი",
        "საპატიო წუთები",
        "დასვენების დღეები",
      ],
      ...filteredEmployees.map((employee) => [
        employee.fullname,
        employee?.department?.name || "",
        employee.position,
        employee.personal_id,
        employee.phone_number,
        employee.card_number,
        employee?.group?.name || "",
        employee?.schedule?.name || "",
        employee.honorable_minutes_per_day,
        employee.holidays.map((holiday) => holiday.name).join(", "),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employees.xlsx");
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    setEmployeeStatusModal(true);
  };

  const handleSearch = (status = "active") => {
    dispatch(fetchEmployees({ status })); 
    setEmployeeStatusModal(false);
  };

  const employeeHeaders = [
    {
      label: "სახელი/გვარი",
      key: "fullname",
      extractValue: (employee) => employee.fullname,
    },
    {
      label: "დეპარტამენტი",
      key: "department.name",
      extractValue: (employee) => employee?.department?.name || "",
    },
    {
      label: "პოზიცია",
      key: "position",
      extractValue: (employee) => employee.position,
    },
    {
      label: "პირადი ნომერი",
      key: "personal_id",
      extractValue: (employee) => employee.personal_id,
    },
    {
      label: "ტელეფონის ნომერი",
      key: "phone_number",
      extractValue: (employee) => employee.phone_number,
    },
    {
      label: "ბარათის ნომერი",
      key: "card_number",
      extractValue: (employee) => employee.card_number,
    },
    {
      label: "ჯგუფი",
      key: "group.name",
      extractValue: (employee) => employee?.group?.name || "",
    },
    {
      label: "განრიგი",
      key: "schedule.name",
      extractValue: (employee) => employee?.schedule?.name || "",
    },
    {
      label: "საპატიო წუთები",
      key: "honorable_minutes_per_day",
      extractValue: (employee) => employee.honorable_minutes_per_day,
    },
    {
      label: "დასვენების დღეები",
      key: "holidays",
      extractValue: (employee) =>
        employee.holidays.map((holiday) => holiday.name).join(", "),
    },
  ];

  return (
    <AuthenticatedLayout>
      <div className="w-full px-10 py-4 flex flex-col gap-8 2xl:px-20">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლები
          </h1>
          <div className="flex items-center gap-8">
            {user?.user_type?.has_full_access ||
            user?.user_type?.name === "მენეჯერი-რეგიონები" ? (
              <>
                <Link
                to={'/employee/create'}
                  className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
                >
                  <img src={NewIcon} alt="New" />
                  ახალი
                </Link>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
                >
                  <img src={EditIcon} alt="Edit" />
                  შეცვლა
                </button>
                <button
                  onClick={() => handleDeleteEmployee(selectedEmployee?.id)}
                  className="bg-[#D9534F] text-white px-4 py-4 rounded-md flex items-center gap-2"
                >
                  <img src={DeleteIcon} alt="Delete" />
                  წაშლა
                </button>
              </>
            ) : null}
            <button
              onClick={exportToExcel}
              className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
            >
              ჩამოტვირთვა
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <Table
          data={filteredEmployees}
          headers={employeeHeaders}
          onContext={handleRightClick}
          filters={filters}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterClick={handleOpenFilterModal}
          onFilterChange={handleInputChange}
          rowClassName={(employee) =>
            selectedEmployee?.id === employee.id ? "bg-blue-200" : ""
          }
          onRowClick={(employee) => setSelectedEmployee(employee)}
          filterableFields={[
            "fullname",
            "department_name",
            "position",
            "personal_id",
            "phone_number",
            "card_number",
            "group_name",
            "schedule_name",
            "honorable_minutes_per_day",
            "holidays",
          ]}
        />
      </div>
      {editModalOpen && (
        <EmployeeEditModal
          employee={selectedEmployee}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {employeeStatusModal && (
        <EmployeeStatusModal
          isOpen={employeeStatusModal}
          onClose={() => setEmployeeStatusModal(false)}
          handleSearch={handleSearch}
        />
      )}
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

export default CreatedEmployees;

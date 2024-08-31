import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, deleteEmployee } from "../../../redux/employeeSlice";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import EmployeeEditModal from "../../../components/EmployeeEditModal";
import EmployeeStatusModal from "../../../components/EmployeeStatusModal";
import * as XLSX from "xlsx";
import FilterModal from "../../../components/FilterModal";
import Table from "../../../components/Table";
import { Link } from "react-router-dom";
import NewIcon from "../../../assets/new.png";
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";
import { useFilterAndSort } from "../../../hooks/useFilterAndSort";


const CreatedEmployees = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.items);
  const user = useSelector((state) => state.user.user);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [employeeStatusModal, setEmployeeStatusModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");

  const {
    filteredAndSortedData,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    filters,
    sortConfig,
  } = useFilterAndSort(
    employees,
    {
      fullname: { text: "", selected: [] },
      "department.name": { text: "", selected: [] },
      position: { text: "", selected: [] },
      personal_id: { text: "", selected: [] },
      phone_number: { text: "", selected: [] },
      card_number: { text: "", selected: [] },
      "group.name": { text: "", selected: [] },
      "schedule.name": { text: "", selected: [] },
      honorable_minutes_per_day: { text: "", selected: [] },
      holidays: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleExportToExcel = () => {
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
      ...filteredAndSortedData.map((employee) => [
        employee.fullname || "",
        employee?.department?.name || "",
        employee.position || "",
        employee.personal_id || "",
        employee.phone_number || "",
        employee.card_number || "",
        employee?.group?.name || "",
        employee?.schedule?.name || "",
        employee.honorable_minutes_per_day !== null
          ? employee.honorable_minutes_per_day
          : "",
        employee.holidays.length > 0
          ? employee.holidays.map((holiday) => holiday.name).join(", ")
          : "",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); 
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: {
          bold: true,
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
    ];

    XLSX.writeFile(workbook, "Employees.xlsx");
  };



  const handleOpenFilterModal = (data, fieldName, rect) => {
    setFilterableData(data);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  };

  const employeeHeaders = [
    {
      label: "სახელი/გვარი",
      key: "fullname",
      extractValue: (emp) => emp.fullname,
    },
    {
      label: "დეპარტამენტი",
      key: "department.name",
      extractValue: (emp) => emp?.department?.name || "",
    },
    { label: "პოზიცია", key: "position", extractValue: (emp) => emp.position },
    {
      label: "პირადი ნომერი",
      key: "personal_id",
      extractValue: (emp) => emp.personal_id,
    },
    {
      label: "ტელეფონის ნომერი",
      key: "phone_number",
      extractValue: (emp) => emp.phone_number,
    },
    {
      label: "ბარათის ნომერი",
      key: "card_number",
      extractValue: (emp) => emp.card_number,
    },
    {
      label: "ჯგუფი",
      key: "group.name",
      extractValue: (emp) => emp?.group?.name || "",
    },
    {
      label: "განრიგი",
      key: "schedule.name",
      extractValue: (emp) => emp?.schedule?.name || "",
    },
    {
      label: "საპატიო წუთები",
      key: "honorable_minutes_per_day",
      extractValue: (emp) => emp.honorable_minutes_per_day,
    },
    {
      label: "დასვენების დღეები",
      key: "holidays",
      extractValue: (emp) =>
        emp.holidays.map((holiday) => holiday.name).join(", "),
    },
  ];


  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm("დარწმუნებული ხართ რომ გსურთ თანამშრომლის წაშლა?")) {
      dispatch(deleteEmployee(employeeId)).then(() => {
        dispatch(fetchEmployees());
        setSelectedEmployee(null); 
      });
    }
  };


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
                  to="/employees/create"
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
              onClick={handleExportToExcel}
              className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
            >
              ჩამოტვირთვა
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <Table
          data={filteredAndSortedData}
          headers={employeeHeaders}
          filters={filters}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterClick={handleOpenFilterModal}
          onFilterChange={handleFilterChange}
          filterableFields={[
            "fullname",
            "department.name",
            "position",
            "personal_id",
            "phone_number",
            "card_number",
            "group.name",
            "schedule.name",
            "honorable_minutes_per_day",
            "holidays",
          ]}
          rowClassName={(employee) =>
            selectedEmployee?.id === employee.id ? "bg-blue-200" : ""
          }
          onRowClick={(employee) => setSelectedEmployee(employee)}
          onContext={(e) => {
            e.preventDefault();
            setEmployeeStatusModal(true);
          }}
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
          handleSearch={(status) => dispatch(fetchEmployees({ status }))}
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

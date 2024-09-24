import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearEmployees, fetchEmployees } from "../../../redux/employeeSlice";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import EmployeeEditModal from "../../../components/EmployeeEditModal";
import EmployeeStatusModal from "../../../components/EmployeeStatusModal";
import FilterModal from "../../../components/FilterModal";
import Table from "../../../components/Table";
import { Link } from "react-router-dom";
import NewIcon from "../../../assets/new.png";
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";
import { useFilterAndSort } from "../../../hooks/useFilterAndSort";
import ExcelJS from "exceljs";
import DeleteEmployeeModal from "../../../components/employee/DeleteEmployeeModal";
import employeeService from "../../../services/employee";

const CreatedEmployees = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.items);
  const hasMore = useSelector((state) => state.employees.hasMore);
  const status = useSelector((state) => state.employees.status);
  const user = useSelector((state) => state.user.user);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [employeeStatusModal, setEmployeeStatusModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); 
  const [statusFilter, setStatusFilter] = useState('active');

  useEffect(() => {
    dispatch(clearEmployees());
    dispatch(fetchEmployees({ status: statusFilter, page: 1 }));
  }, [statusFilter, dispatch]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status); 
  };
  

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
      status: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    const columns = [
      { header: "სახელი/გვარი", key: "fullname", width: 20 },
      { header: "დეპარტამენტი", key: "department", width: 30 },
      { header: "პოზიცია", key: "position", width: 20 },
      { header: "პირადი ნომერი", key: "personal_id", width: 20 },
      { header: "ტელეფონის ნომერი", key: "phone_number", width: 20 },
      { header: "ბარათის ნომერი", key: "card_number", width: 20 },
      { header: "ჯგუფი", key: "group", width: 20 },
      { header: "განრიგი", key: "schedule", width: 30 },
      { header: "საპატიო წუთები", key: "honorable_minutes_per_day", width: 20 },
      { header: "დასვენების დღეები", key: "holidays", width: 30 },
      { header: "სტატუსი", key: "status", width: 15 },
    ];

    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "center",
    };

    filteredAndSortedData.forEach((employee) => {
      worksheet.addRow({
        fullname: employee.fullname || "",
        department: employee?.department?.name || "",
        position: employee.position || "",
        personal_id: employee.personal_id || "",
        phone_number: employee.phone_number || "",
        card_number: employee.card_number || "",
        group: employee?.group?.name || "",
        schedule: employee?.schedule?.name || "",
        
        honorable_minutes_per_day:
          employee.honorable_minutes_per_day !== null
            ? employee.honorable_minutes_per_day
            : "",
        holidays:
          employee.holidays.length > 0
            ? employee.holidays.map((holiday) => holiday.name).join(", ")
            : "",
        status: employee.active ? "აქტიური" : "შეჩერებული",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Employees.xlsx";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenFilterModal = (data, fieldName, rect) => {
    setFilterableData(data);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  };

  const handleDeleteEmployee = async (expiryDatetime) => {
    if (selectedEmployee) {
      try {
        await employeeService.deleteEmployee(
          selectedEmployee.id,
          expiryDatetime
        );
        console.log(
          `Employee ${selectedEmployee.id} expiry date updated to ${expiryDatetime}`
        );

        dispatch(fetchEmployees()); 
      } catch (error) {
        console.error("Error deleting (updating expiry) employee:", error);
      }
    }
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
      extractValue: (emp) => emp?.department || "",
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
      extractValue: (emp) => emp?.group || "",
    },
    {
      label: "განრიგი",
      key: "schedule.name",
      extractValue: (emp) => emp?.schedule || "",
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
        emp.holidays.map((holiday) => holiday).join(", "),
    },
    {
      label: "სტატუსი",
      key: "status",
      extractValue: (emp) => (emp.active ? "აქტიური" : "შეჩერებული"),
    },
  ];
  

  const observer = useRef();

  const lastReportElementRef = useCallback((node) => {
    if (status === "loading" || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(fetchEmployees({ status: statusFilter })); // Always send the status filter when loading more
      }
    });

    if (node) observer.current.observe(node);
  }, [status, hasMore, dispatch, statusFilter]);


  console.log(employees.length);

  // useEffect(() => {
  //   dispatch(clearEmployees());
  //   dispatch(fetchEmployees({ status: statusFilter, page: 1 }));
  // }, [statusFilter, dispatch]);
  


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
                  className="bg-[#5CB85C] text-white px-4 py-4 rounded-md flex items-center gap-2"
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
                  onClick={() => setDeleteModalOpen(true)} 
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
          lastReportRef={lastReportElementRef}
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
            "status"
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
          handleSearch={handleStatusFilterChange}
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
      <DeleteEmployeeModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteEmployee}
        employee={selectedEmployee}
      />
    </AuthenticatedLayout>
  );
};

export default CreatedEmployees;

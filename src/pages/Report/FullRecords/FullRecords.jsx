import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFullRecords } from "../../../redux/reportSlice";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import Table from "../../../components/Table";
import FilterModal from "../../../components/FilterModal";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import DepartmentInput from "../../../components/DepartmentInput";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import SearchIcon from "../../../assets/search.png";
import EmployeeInput from "../../../components/employee/EmployeeInput";
import EmployeeModal from "../../../components/employee/EmployeeModal";
import { useFilterAndSort } from "../../../hooks/useFilterAndSort";
import ExcelJS from "exceljs";

const FullRecords = () => {
  const dispatch = useDispatch();
  const fullRecords = useSelector((state) => state.reports.fullRecords);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const buildings = useSelector((state) => state.building);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    department_id: "",
    building_id: "",
    employee: "",
  });
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [EmployeeModalOpen, setEmployeeModalOpen] = useState(false);

  const {
    filteredAndSortedData: filteredRecords,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    filters,
    sortConfig,
  } = useFilterAndSort(
    fullRecords,
    {
      employee_fullname: { text: "", selected: [] },
      department: { text: "", selected: [] },
      position: { text: "", selected: [] },
      device_name: { text: "", selected: [] },
      group: { text: "", selected: [] },
      building_name: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

  const handleOpenFilterModal = useCallback((data, fieldName, rect) => {
    const uniqueData = [...new Set(data)];
    setFilterableData(uniqueData);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  }, []);

  const handleClear = useCallback((field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleSubmit = useCallback(() => {
    const filters = {
      start_date: formData.start_date,
      end_date: formData.end_date,
      department_id: formData.department_id,
      building_id: formData.building_id,
    };

    dispatch(fetchFullRecords(filters));
  }, [formData, dispatch]);

  const openModal = useCallback(() => setEmployeeModalOpen(true), []);
  const closeModal = useCallback(() => setEmployeeModalOpen(false), []);

  const handleDepartmentSelect = useCallback((departmentId) => {
    setFormData((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  }, []);

  const handleEmployeeSelect = useCallback((employee) => {
    setFormData((prev) => ({
      ...prev,
      employee_id: employee.id,
      employee: employee.fullname,
    }));
  }, []);

  const recordHeaders = [
    {
      label: "სახელი/გვარი",
      key: "employee_fullname",
      extractValue: (record) => record.employee_fullname,
    },
    {
      label: "თარიღი და დრო",
      key: "server_datetime",
      extractValue: (record) => record.server_datetime,
    },
    {
      label: "დეპარტამენტი",
      key: "department",
      extractValue: (record) => record.department,
    },
    {
      label: "პოზიცია",
      key: "position",
      extractValue: (record) => record.position,
    },
    {
      label: "მოწყობილობა",
      key: "device_name",
      extractValue: (record) => record.device_name,
    },
    { label: "ჯგუფი", key: "group", extractValue: (record) => record.group },
    {
      label: "შენობა",
      key: "building_name",
      extractValue: (record) => record.building_name,
    },
    {
      label: "წვდომა",
      key: "has_access",
      extractValue: (record) => (record.has_access ? "კი" : "არა"),
    },
  ];

  const exportToExcel = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Full Records");

    // Set a uniform width for all columns
    const uniformWidth = 30;

    worksheet.columns = [
      { header: "სახელი/გვარი", key: "employee_fullname", width: uniformWidth },
      { header: "დეპარტამენტი", key: "department", width: uniformWidth },
      { header: "პოზიცია", key: "position", width: uniformWidth },
      { header: "მოწყობილობა", key: "device_name", width: uniformWidth },
      { header: "ჯგუფი", key: "group", width: uniformWidth },
      { header: "შენობა", key: "building_name", width: uniformWidth },
      { header: "წვდომა", key: "has_access", width: uniformWidth },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    filteredRecords.forEach((record) => {
      worksheet.addRow({
        employee_fullname: record.employee_fullname,
        department: record.department,
        position: record.position,
        device_name: record.device_name,
        group: record.group,
        building_name: record.building_name,
        has_access: record.has_access ? "კი" : "არა",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "FullRecords.xlsx";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredRecords]);

  return (
    <AuthenticatedLayout>
      <div className="w-full px-10 py-4 flex flex-col gap-8 2xl:px-20">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            სრული ჩანაწერები
          </h1>
          <button
            onClick={exportToExcel}
            className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
          >
            ჩამოტვირთვა
            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <GeneralInputGroup
            name="start_date"
            placeholder="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, start_date: e.target.value }))
            }
          />
          <GeneralInputGroup
            name="end_date"
            placeholder="End Date"
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, end_date: e.target.value }))
            }
          />
          <DepartmentInput
            value={
              departments.find((d) => d.id === formData.department_id)?.name ||
              ""
            }
            onClear={() => handleClear("department_id")}
            onSearchClick={() => setOpenNestedDropdown(true)}
          />
          <EmployeeInput
            value={formData.employee}
            onClear={() => handleClear("employee")}
            onSearchClick={openModal}
          />
          <button
            className="bg-[#1AB7C1] rounded-lg min-w-[75px] flex items-center justify-center py-2"
            onClick={handleSubmit}
          >
            <img src={SearchIcon}   alt="Search Icon" />
          </button>
        </div>

        {/* Table */}
        <Table
          data={filteredRecords}
          headers={recordHeaders}
          filters={filters}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterClick={handleOpenFilterModal}
          onFilterChange={handleFilterChange}
          onRowClick={(record) => setSelectedRecord(record)}
          filterableFields={[
            "employee_fullname",
            "server_datetime",
            "department",
            "position",
            "device_name",
            "group",
            "building_name",
            "has_access",
          ]}
        />
      </div>

      {/* Modals */}
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
        isOpen={EmployeeModalOpen}
        onClose={closeModal}
        onSelectEmployee={handleEmployeeSelect}
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

export default FullRecords;


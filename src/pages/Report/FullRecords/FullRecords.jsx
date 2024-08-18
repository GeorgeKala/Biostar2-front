import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFullRecords } from "../../../redux/reportSlice";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import Table from "../../../components/Table";
import FilterModal from "../../../components/FilterModal";
import { useFilter } from "../../../hooks/useFilter";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import DepartmentInput from "../../../components/DepartmentInput";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import SearchIcon from "../../../assets/search.png"
import EmployeeInput from "../../../components/employee/EmployeeInput";
import EmployeeModal from "../../../components/employee/EmployeeModal";

const FullRecords = () => {
  const dispatch = useDispatch();
  const { fullRecords } = useSelector((state) => ({
    fullRecords: state.reports.fullRecords,
  }));

  const { departments, nestedDepartments } = useSelector((state) => state.departments)
  const buildings = useSelector((state) => state.building);

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
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

  const { filters, handleInputChange, applyModalFilters } = useFilter({
    employee_fullname: { text: "", selected: [] },
    department: { text: "", selected: [] },
    position: { text: "", selected: [] },
    device_name: { text: "", selected: [] },
    group: { text: "", selected: [] },
    building_name: { text: "", selected: [] },
  });

  const [filteredRecords, setFilteredRecords] = useState([]);


  useEffect(() => {
    applyFilters();
  }, [fullRecords, filters, sortConfig]);

  const applyFilters = () => {
    let filtered = fullRecords.filter((record) => {
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
        matches(record.employee_fullname, filters.employee_fullname) &&
        matches(record.department, filters.department) &&
        matches(record.position, filters.position) &&
        matches(record.device_name, filters.device_name) &&
        matches(record.group, filters.group) &&
        matches(record.building_name, filters.building_name)
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

    setFilteredRecords(filtered);
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

  const handleClear = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    const filters = {
      start_date: formData.start_date,
      end_date: formData.end_date,
      department_id: formData.department_id,
      building_id: formData.building_id,
    };

    dispatch(fetchFullRecords(filters));
  };

  const openModal = () => setEmployeeModalOpen(true);
  const closeModal = () => setEmployeeModalOpen(false);

  const handleDepartmentSelect = (departmentId) => {
    setFormData((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  };

   const handleEmployeeSelect = (employee) => {
     setFormData({
       ...formData,
       employee_id: employee.id,
       employee: employee.fullname,
     });
   };
  const recordHeaders = [
    {
      label: "სახელი/გვარი",
      key: "employee_fullname",
      extractValue: (record) => record.employee_fullname,
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
    {
      label: "ჯგუფი",
      key: "group",
      extractValue: (record) => record.group,
    },
    {
      label: "შენობა",
      key: "building_name",
      extractValue: (record) => record.building_name,
    },
    {
      label: "წვდომა",
      key: "has_access",
      extractValue: (record) => (record.has_access ? "Yes" : "No"),
    },
  ];

  const exportToExcel = () => {
    const dataToExport = [
      [
        "სახელი/გვარი",
        "დეპარტამენტი",
        "პოზიცია",
        "მოწყობილობა",
        "ჯგუფი",
        "შენობა",
        "წვდომა",
      ],
      ...filteredRecords.map((record) => [
        record.employee_fullname,
        record.department,
        record.position,
        record.device_name,
        record.group,
        record.building_name,
        record.has_access ? "Yes" : "No",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FullRecords");
    XLSX.writeFile(workbook, "FullRecords.xlsx");
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-10 py-4 flex flex-col gap-8 2xl:px-20">
        {/* Header Section */}
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            პერიოდის რეპორტი
          </h1>
          <button
            onClick={exportToExcel}
            className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
          >
            ჩამოტვირთვა
            {/* <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" /> */}
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
          {/* <div className="relative">
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2"
              value={formData.building_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  building_id: e.target.value,
                }))
              }
            >
              <option value="">Select Building</option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div> */}
          <EmployeeInput
            value={formData.employee}
            onClear={() => handleClear("employee")}
            onSearchClick={openModal}
          />
          <button
            className="bg-[#1AB7C1] rounded-lg px-8 py-5"
            onClick={handleSubmit}
          >
            <img src={SearchIcon} className="w-[50px]" alt="Search Icon" />
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
          onFilterChange={handleInputChange}
          rowClassName={(record) =>
            selectedRecord?.id === record.id ? "bg-blue-200" : ""
          }
          onRowClick={(record) => setSelectedRecord(record)}
          filterableFields={[
            "employee_fullname",
            "department",
            "position",
            "device_name",
            "group",
            "building_name",
            "has_access"
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

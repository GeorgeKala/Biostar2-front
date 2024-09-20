import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import GeneralInputGroup from "../../components/GeneralInputGroup";
import SearchIcon from "../../assets/search.png";
import dayTypeService from "../../services/dayType";
import EmployeeModal from "../../components/employee/EmployeeModal";
import reportService from "../../services/report";
import DeleteIcon from "../../assets/delete.png";
import { useDispatch, useSelector } from "react-redux";
import NestedDropdownModal from "../../components/NestedDropdownModal";
import DepartmentInput from "../../components/DepartmentInput";
import EmployeeInput from "../../components/employee/EmployeeInput";
import { fetchEmployeeOrders } from "../../redux/orderSlice";
import SuccessPopup from "../../components/SuccessPopup";
import Table from "../../components/Table";
import FilterModal from "../../components/FilterModal";
import { useFilterAndSort } from "../../hooks/useFilterAndSort";
import ExcelJS from "exceljs";
import CustomSelect from "../../components/CustomSelect";


const Order = () => {
  const user = useSelector((state) => state.user.user);
  const { orders } = useSelector((state) => state.orders);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    employee_id: "",
    start_date: "",
    end_date: "",
    day_type_id: "",
  });
  
  const [dayTypes, setDayTypes] = useState([]);
  const [modalMode, setModalMode] = useState("create");
  const [openModal, setOpenModal] = useState(false);
  const [EmployeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [currentEmployeeInput, setCurrentEmployeeInput] = useState("");
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    employee_id: "",
    department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
  });

  const {
    filteredAndSortedData,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    filters: tableFilters,
    sortConfig,
  } = useFilterAndSort(
    orders,
    {
      date: { text: "", selected: [] },
      employee: { text: "", selected: [] },
      department: { text: "", selected: [] },
      violation_type: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dayTypesResponse = await dayTypeService.getAllDayTypes();
        setDayTypes(dayTypesResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    if (filters.start_date) payload.start_date = filters.start_date;
    if (filters.end_date) payload.end_date = filters.end_date;
    if (filters.department_id) payload.department_id = filters.department_id;
    if (filters.employee_id) payload.employee_id = filters.employee_id;

    try {
      dispatch(fetchEmployeeOrders(payload));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    try {
      await reportService.updateDayTypeForDateRange(formData);
      dispatch(fetchEmployeeOrders(filters));
      setShowSuccessPopup(true);
      setSuccessMessage("ბრძანება წარმატებით დაემატა");
      closeModal();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handleDeleteOrder = async (e) => {
    e.preventDefault();
    try {
      await reportService.deleteDayTypeForDateRange(formData);
      dispatch(fetchEmployeeOrders(filters));
      setShowSuccessPopup(true);
      setSuccessMessage("ბრძანება წარმატებით წაიშალა");
      closeModal();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const openModalForCreate = () => {
    setModalMode("create");
    setOpenModal(true);
  };

  const openModalForDelete = () => {
    setModalMode("delete");
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setFormData({
      start_date: "",
      end_date: "",
      employee_id: "",
      day_type_id: "",
    });
  };

  const openEmployeeModal = (inputName) => {
    setCurrentEmployeeInput(inputName);
    setEmployeeModalOpen(true);
  };

  const closeEmployeeModal = () => {
    setEmployeeModalOpen(false);
  };

  const handleEmployeeSelect = (employee) => {
    if (currentEmployeeInput === "filter") {
      setFilters({
        ...filters,
        employee_id: employee.id,
        employee: employee.fullname,
      });
    } else if (currentEmployeeInput === "form") {
      setFormData({
        ...formData,
        employee_id: employee.id,
        employee: employee.fullname,
      });
    }
    closeEmployeeModal();
  };

  const handleDepartmentSelect = (departmentId, departmentName) => {
    setFilters((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  };

  const handleClearFilterData = () => {
    setFilters((prevData) => ({
      ...prevData,
      employee: "",
      employee_id: "",
    }));
  };

  const handleClearFormData = () => {
    setFormData((prevData) => ({
      ...prevData,
      employee: "",
      employee_id: "",
    }));
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");
    const uniformWidth = 30;

    worksheet.columns = [
      { header: "თარიღი", key: "date", width: uniformWidth },
      { header: "თანამშრომელი", key: "employee", width: uniformWidth },
      { header: "დეპარტამენტი", key: "department", width: uniformWidth },
      { header: "ბრძანების ტიპი", key: "violation_type", width: uniformWidth },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    filteredAndSortedData.forEach((item) => {
      worksheet.addRow({
        date: item.date,
        employee: item.employee,
        department: item.department,
        violation_type: item.violation_type,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Orders.xlsx";
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

  const orderHeaders = [
    { label: "თარიღი", key: "date", extractValue: (item) => item.date },
    {
      label: "თანამშრომელი",
      key: "employee",
      extractValue: (item) => item.employee,
    },
    {
      label: "დეპარტამენტი",
      key: "department",
      extractValue: (item) => item.department,
    },
    {
      label: "ბრძანების ტიპი",
      key: "violation_type",
      extractValue: (item) => item.violation_type,
    },
  ];

  const filteredNestedDepartments = user?.user_type?.has_full_access
    ? nestedDepartments
    : nestedDepartments.filter(
        (dept) =>
          dept.id === user?.department?.id ||
          dept.parent_id === user?.department?.id
      );

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  

  const handleClear = (field) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: "",
    }));
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">ბრძანებები</h1>
          <button
            onClick={exportToExcel}
            className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
          >
            ჩამოტვირთვა
            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
          </button>
        </div>
        <form className="flex items-center gap-4" onSubmit={handleSubmit}>
          <GeneralInputGroup
            name="start_date"
            placeholder="Start Date"
            type="date"
            value={filters.start_date}
            onChange={handleInputChange}
          />
          <GeneralInputGroup
            name="end_date"
            placeholder="End Date"
            type="date"
            value={filters.end_date}
            onChange={handleInputChange}
          />
          <EmployeeInput
            value={filters.employee}
            onClear={handleClearFilterData}
            onSearchClick={() => openEmployeeModal("filter")}
            onChange={handleInputChange}
          />
          <DepartmentInput
            value={
              departments.find((d) => d.id === filters.department_id)?.name ||
              ""
            }
            onClear={() => handleClear("department_id")}
            onSearchClick={() => setOpenNestedDropdown(true)}
          />
          <button className="bg-[#1AB7C1] rounded-lg min-w-[75px] flex items-center justify-center py-2">
            <img src={SearchIcon} alt="Search Icon" />
          </button>
        </form>
        <div className="flex justify-end gap-4">
          <button
            className="bg-[#5CB85C] text-white py-2 px-4 rounded-md"
            onClick={openModalForCreate}
          >
            + შექმნა
          </button>
          <button
            className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={openModalForDelete}
          >
            <img src={DeleteIcon} alt="Delete Icon" />
            წაშლა
          </button>
        </div>
        <Table
          data={filteredAndSortedData}
          headers={orderHeaders}
          filters={tableFilters}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterClick={handleOpenFilterModal}
          onFilterChange={handleFilterChange}
          filterableFields={[
            "date",
            "employee",
            "department",
            "violation_type",
          ]}
        />
      </div>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {modalMode === "create"
                  ? "დაამატე ბრძანება"
                  : "წაშალე ბრძანება"}
              </h2>
              <button
                onClick={closeModal}
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
            <form className="p-3">
              <div className="mb-4">
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  დაწყების თარიღი:
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.start_date}
                  onChange={handleFormInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  დამთავრების თარიღი:
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.end_date}
                  onChange={handleFormInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="employee"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  თანამშრომელი:
                </label>
                <EmployeeInput
                  value={formData.employee}
                  onClear={handleClearFormData}
                  onSearchClick={() => openEmployeeModal("form")}
                  onChange={handleFormInputChange}
                  className={
                    " px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-l shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  }
                />
              </div>
              {modalMode === "create" && (
                <div className="mb-4">
                  <label
                    htmlFor="day_type_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ბრძანების ტიპი:
                  </label>
                  {/* <select
                    id="day_type_id"
                    name="day_type_id"
                    className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    value={formData.day_type_id}
                    onChange={handleFormInputChange}
                    required
                  >
                    <option value="">აირჩიეთ ბრძანების ტიპი</option>
                    {dayTypes &&
                      dayTypes.map((dayType) => (
                        <option key={dayType.id} value={dayType.id}>
                          {dayType.name}
                        </option>
                      ))}
                  </select> */}
                  <CustomSelect
                    options={dayTypes.map((dayType) => ({
                      id: dayType.id,
                      name: dayType.name,
                    }))}
                    selectedValue={
                      dayTypes.find((d) => d.id === formData.day_type_id)?.name
                    }
                    onSelect={(selectedOption) =>
                      setFormData({
                        ...formData,
                        day_type_id: selectedOption.id,
                      })
                    }
                    placeholder="აირჩიეთ ბრძანების ტიპი"
                    className="bg-gray-300"
                  />
                </div>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={
                    modalMode === "create" ? handleSaveOrder : handleDeleteOrder
                  }
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
                >
                  {modalMode === "create" ? "Save" : "Delete"}
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
      )}
      {openNestedDropdown && (
        <NestedDropdownModal
          header="დეპარტამენტები"
          isOpen={openNestedDropdown}
          onClose={() => setOpenNestedDropdown(false)}
          onSelect={handleDepartmentSelect}
          data={filteredNestedDepartments}
          link={"/departments"}
        />
      )}
      <EmployeeModal
        isOpen={EmployeeModalOpen}
        onClose={closeEmployeeModal}
        onSelectEmployee={handleEmployeeSelect}
      />
      {showSuccessPopup && (
        <SuccessPopup
          title="Success"
          message={successMessage}
          onClose={() => setShowSuccessPopup(false)}
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

export default Order;

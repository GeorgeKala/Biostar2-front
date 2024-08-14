import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import GeneralInputGroup from "../../components/GeneralInputGroup";
import SearchIcon from "../../assets/search.png";
import orderService from "../../services/order";
import dayTypeService from "../../services/dayType";
import EmployeeModal from "../../components/employee/EmployeeModal";
import reportService from "../../services/report";
import DeleteIcon from "../../assets/delete.png";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import NestedDropdownModal from "../../components/NestedDropdownModal";
import DepartmentInput from "../../components/DepartmentInput";
import EmployeeInput from "../../components/employee/EmployeeInput";

const Order = () => {
  const user = useSelector((state) => state.user.user);
  const [openModal, setOpenModal] = useState(false);
  const [EmployeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [currentEmployeeInput, setCurrentEmployeeInput] = useState("");
  const { departments, nestedDepartments } = useSelector((state) => state.departments);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    employee_id: "",
    department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
  });
  const [data, setData] = useState([]);
  const columns = [
    { label: "თარიღი", key: "date" },
    { label: "თანამშრომელი", key: "employee" },
    { label: "დეპარტამენტი", key: "department" },
    { label: "ბრძანების ტიპი", key: "violation_type" },
  ];

  const [formData, setFormData] = useState({
    employee_id: "",
    start_date: "",
    end_date: "",
    day_type_id: "",
  });
  const [dayTypes, setDayTypes] = useState([]);
  const [modalMode, setModalMode] = useState("create"); 
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);


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
      const response = await orderService.fetchEmployeeOrders(payload);

      setData(response.data);
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
      const response = await reportService.updateDayTypeForDateRange(formData);
      window.location.reload();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handleDeleteOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await reportService.deleteDayTypeForDateRange(formData);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
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


  const openModalForCreate = () => {
    setModalMode("create");
    setOpenModal(true);
  };

  const openModalForDelete = () => {
    setModalMode("delete");
    setOpenModal(true);
  };

  const exportToExcel = () => {
    const dataToExport = [];
    const header = columns.map((col) => col.label);
    dataToExport.push(header);

    data.forEach((item) => {
      const row = columns.map((col) => item[col.key]);
      dataToExport.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    XLSX.writeFile(workbook, "Orders.xlsx");
  };


  const handleDepartmentSelect = (departmentId, departmentName) => {
    setFilters((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  };

  const handleClear = (field) => {
    setFilters((prevData) => ({
      ...prevData,
      [field]: "",
    }));
  };


  const filteredNestedDepartments = user?.user_type?.has_full_access
    ? nestedDepartments
    : nestedDepartments.filter(
        (dept) =>
          dept.id === user?.department?.id ||
          dept.parent_id === user?.department?.id
      );

  

  const handleClearFormData = () => {
    setFormData((prevData) => (
      {
        ...prevData,
        employee:"",
        employee_id:"",
      }
    ));
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
            <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
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
          {/* <div onClick={() => openEmployeeModal("filter")} className="w-full">
            <GeneralInputGroup
              name="employee"
              placeholder="თანამშრომელი"
              type="text"
              value={filters.employee}
              onChange={handleInputChange}
            />
          </div> */}
          {/* <div className="w-full flex flex-col gap-2 relative">
            <div className="flex">
              <input
                className="bg-white border border-[#105D8D] outline-none rounded-l py-3 px-4 w-full pr-10"
                placeholder="თანამშრომელი"
                value={filters.employee}
                onChange={handleInputChange}
                readOnly
              />
              {filters.employee && (
                <button
                  type="button"
                  onClick={() => handleClear("employee")}
                  className="absolute right-12 top-[50%] transform -translate-y-1/2 mr-4"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="black"
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
              )}
              <button
                onClick={() => openEmployeeModal("filter")}
                className="bg-[#105D8D] px-4 rounded-r"
              >
                <img className="w-[20px]" src={SearchIcon} alt="" />
              </button>
            </div>
          </div> */}
          <EmployeeInput
            value={filters.employee}
            onClear={() => handleClear("employee")}
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
          <button className="bg-[#1AB7C1] rounded-lg px-6 py-4" type="submit">
            <img src={SearchIcon} className="w-[100px]" alt="Search Icon" />
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
        <div className="min-w-max">
          <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
            <thead className="bg-[#1976D2] text-white">
              <tr>
                {columns.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-2 border border-gray-200 w-1/6 truncate"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data &&
                data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
                      {item.date}
                    </td>
                    <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
                      {item.employee}
                    </td>
                    <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
                      {item.department}
                    </td>
                    <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
                      {item.day_type}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {modalMode === "create"
                  ? "დაამატე ბრაძანება"
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
                  className="block text-sm font-medium text-gray-700"
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
                  className="block text-sm font-medium text-gray-700"
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
                  className="block text-sm font-medium text-gray-700"
                >
                  თანამშრომელი:
                </label>
                {/* <input
                  type="text"
                  name="employee"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.employee}
                  onChange={handleFormInputChange}
                  required
                  onClick={() => openEmployeeModal("form")}
                /> */}
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
                    className="block text-sm font-medium text-gray-700"
                  >
                    ბრძანების ტიპი:
                  </label>
                  <select
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
                  </select>
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
    </AuthenticatedLayout>
  );
};

export default Order;

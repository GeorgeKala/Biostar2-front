import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchEmployees, deleteEmployee } from "../../../redux/employeeSlice";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../../assets/arrow-down-2.png";
import NewIcon from "../../../assets/new.png";
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import GeneralSelectGroup from "../../../components/GeneralSelectGroup";
import SearchIcon from "../../../assets/search.png";
import EmployeeEditModal from "../../../components/EmployeeEditModal";
import * as XLSX from "xlsx";
import { fetchDepartments } from "../../../redux/departmentsSlice";

const CreatedEmployees = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.items);
  const status = useSelector((state) => state.employees.status);
  const user = useSelector((state) => state.user.user);
  const {departments} = useSelector((state) => state.departments);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expandedCell, setExpandedCell] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    fullname: "",
    department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
  });
  

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmployees());
      dispatch(fetchDepartments());
    }
  }, [status, dispatch]);

  const handleClick = (employee) => {
    setSelectedEmployee(selectedEmployee === employee ? null : employee);
  };

  const handleDoubleClick = (index) => {
    setExpandedCell(index === expandedCell ? null : index);
  };

  const handleDelete = () => {
    if (selectedEmployee) {
      dispatch(deleteEmployee(selectedEmployee.id)).then(() => {
        setSelectedEmployee(null);
      });
    }
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEmployee(null);
    setEditModalOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    dispatch(fetchEmployees(filters));
  };

  const exportToExcel = () => {
    const dataToExport = [];

    const header = [
      "სახელი/გვარი",
      "დეპარტამენტი",
      "პოზიცია",
      "პირადი ნომერი",
      "ტელეფონის ნომერი",
      "ბარათის ნომერი",
      "სტატუსი",
      "მომხმარებელი",
      "ჯგუფი",
      "განრიგი",
      "საპატიო წუთები",
      "დასვენების დღეები",
    ];
    dataToExport.push(header);

    employees.forEach((employee) => {
      const row = [
        employee.fullname,
        employee?.department?.name || "",
        employee.position,
        employee.personal_id,
        employee.phone_number,
        employee.card_number,
        employee.expiry_datetime ? "შეჩერებულია" : "აქტიურია",
        employee?.user?.name || "",
        employee?.group?.name || "",
        employee?.schedule?.name || "",
        employee.honorable_minutes_per_day,
        employee.holidays.map((holiday) => holiday.name).join(", "),
      ];
      dataToExport.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "Employees.xlsx");
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლები
          </h1>
          <div className="flex items-center gap-8">
            <Link
              to="/employees/create"
              className="bg-[#5CB85C] text-white px-4 py-4 rounded-md flex items-center gap-2"
            >
              <img src={NewIcon} alt="New Icon" />
              ახალი
            </Link>
            <button
              onClick={() => openEditModal(selectedEmployee)}
              className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
            >
              <img src={EditIcon} alt="Edit" />
              შეცვლა
            </button>
            <button
              onClick={handleDelete}
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
        <div className="flex items-center gap-4">
          <GeneralInputGroup
            name="fullname"
            placeholder="სახელი/გვარი"
            type="text"
            value={filters.fullname}
            onChange={handleFilterChange}
          />
          <div className="w-full flex flex-col gap-2">
            <select
              id="department_id"
              name="department_id"
              value={filters.department_id}
              onChange={handleFilterChange}
              className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
              disabled={!user?.user_type?.has_full_access}
            >
              <option value="">აირჩიეთ დეპარტამენტი</option>
              {departments &&
                departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <button
            className="bg-[#1AB7C1] rounded-lg px-6 py-4"
            onClick={handleSearch}
          >
            <img src={SearchIcon} alt="Search Icon" />
          </button>
        </div>
        <div className="container mx-auto mt-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
            <thead className="bg-[#1976D2] text-white text-xs">
              <tr>
                {[
                  "სახელი/გვარი",
                  "დეპარტამენტი",
                  "პოზიცია",
                  "პირადი ნომერი",
                  "ტელეფონის ნომერი",
                  "ბარათის ნომერი",
                  "სტატუსი",
                  "მომხმარებელი",
                  "ჯგუფი",
                  "განრიგი",
                  "საპატიო წუთები",
                  "დასვენების დღეები",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-2 py-1 border border-gray-200 w-20 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <span>{header}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              {employees.map((employee, index) => (
                <tr
                  key={employee.id}
                  onClick={() => handleClick(employee)}
                  onDoubleClick={() => handleDoubleClick(index)}
                  className={`text-center ${
                    selectedEmployee && selectedEmployee.id === employee.id
                      ? "bg-blue-200"
                      : ""
                  }`}
                >
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 whitespace-normal ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    <input
                      type="text"
                      value={employee.fullname}
                      className="w-full bg-transparent outline-none"
                      readOnly
                    />
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee?.department?.name}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee.position}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee.personal_id}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee.phone_number}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee.card_number}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee.expiry_datetime ? "შეჩერებულია" : "აქტიურია"}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee?.user?.name}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee?.group?.name}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee?.schedule?.name}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee.honorable_minutes_per_day}
                  </td>
                  <td
                    className={`px-2 py-1 border border-gray-200 w-20 ${
                      expandedCell === index ? "expanded-cell" : "truncate-cell"
                    }`}
                  >
                    {employee.holidays &&
                      employee.holidays.map((item, idx) => (
                        <span className="text-black" key={idx}>
                          {item.name},{" "}
                        </span>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editModalOpen && (
        <EmployeeEditModal
          employee={selectedEmployee}
          isOpen={editModalOpen}
          onClose={closeEditModal}
        />
      )}
    </AuthenticatedLayout>
  );
};

export default CreatedEmployees;

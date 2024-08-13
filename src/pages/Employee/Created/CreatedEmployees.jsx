import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchEmployees, deleteEmployee } from "../../../redux/employeeSlice";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../../assets/arrow-down-2.png";
import NewIcon from "../../../assets/new.png";
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";

import EmployeeEditModal from "../../../components/EmployeeEditModal";
import * as XLSX from "xlsx";
import EmployeeStatusModal from "../../../components/EmployeeStatusModal";
import FilterIcon from '../../../assets/filter-icon.png';

const CreatedEmployees = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.items);
  const user = useSelector((state) => state.user.user);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [employeeStatusModal, setEmployeeStatusModal] = useState(false);
  const [filters, setFilters] = useState({
    fullname: "",
    department_name: "",
    position: "",
    personal_id: "",
    phone_number: "",
    card_number: "",
    group_name: "",
    schedule_name: "",
    honorable_minutes_per_day: "",
    holidays: "",
  });
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [employees, filters, sortConfig]);

  const applyFilters = () => {
    let filtered = employees.filter((employee) => {
      const matches = (value, filter) =>
        !filter || (value && value.toLowerCase().includes(filter.toLowerCase()));

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
        (!filters.holidays ||
          employee.holidays.some((holiday) =>
            holiday.name.toLowerCase().includes(filters.holidays.toLowerCase())
          ))
      );
    });

    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        const aValue = sortConfig.key.split('.').reduce((o, i) => (o ? o[i] : ""), a);
        const bValue = sortConfig.key.split('.').reduce((o, i) => (o ? o[i] : ""), b);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
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


  const ArrowUpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 inline"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
  
  const ArrowDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 inline"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  return (
    <AuthenticatedLayout>
      <div className="w-full px-10 py-4 flex flex-col gap-8 2xl:px-20">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლები
          </h1>
          <div className="flex items-center gap-8">
            {user?.user_type?.has_full_access ||
            user?.user_type?.name == "მენეჯერი-რეგიონები" ? (
              <>
                <Link
                  to="/employees/create"
                  className="bg-[#5CB85C] text-white px-4 py-4 rounded-md flex items-center gap-2"
                >
                  <img src={NewIcon} alt="New Icon" />
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
                  onClick={() => handleDelete(selectedEmployee)}
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
        <div className="container mx-auto mt-10 overflow-x-auto">
          <table className="w-full text-center divide-y divide-gray-200 table-fixed border-collapse">
            <thead className="bg-[#1976D2] text-white text-xs">
              <tr>
                <th className="w-[30px]"></th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("fullname")}
                >
                  სახელი/გვარი
                  {sortConfig.key === "fullname" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("department.name")}
                >
                  დეპარტამენტი
                  {sortConfig.key === "department.name" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("position")}
                >
                  პოზიცია
                  {sortConfig.key === "position" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("personal_id")}
                >
                  პირადი ნომერი
                  {sortConfig.key === "personal_id" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("phone_number")}
                >
                  ტელეფონის ნომერი
                  {sortConfig.key === "phone_number" && (
                    <span className="">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("card_number")}
                >
                  ბარათის ნომერი
                  {sortConfig.key === "card_number" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("group.name")}
                >
                  ჯგუფი
                  {sortConfig.key === "group.name" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("schedule.name")}
                >
                  განრიგი
                  {sortConfig.key === "schedule.name" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("honorable_minutes_per_day")}
                >
                  საპატიო წუთები
                  {sortConfig.key === "honorable_minutes_per_day" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className="border font-normal border-gray-200 text-left px-2 customized-th-tr cursor-pointer relative"
                  onClick={() => handleSort("holidays")}
                >
                  დასვენების დღეები
                  {sortConfig.key === "holidays" && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                    </span>
                  )}
                </th>
              </tr>
              <tr>
                <th className="w-[30px]">
                  <img className="w-[20px] m-auto" src={FilterIcon} alt="" />
                </th>
                {[
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
                ].map((filterKey) => (
                  <th
                    key={filterKey}
                    className="border border-gray-200 text-center"
                  >
                    <input
                      type="text"
                      name={filterKey}
                      value={filters[filterKey]}
                      onChange={handleFilterChange}
                      className="w-full text-center bg-transparent outline-none px-2 py-1"
                      autoComplete="off"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className={`text-center ${
                    selectedEmployee?.id === employee.id ? "bg-blue-200" : ""
                  }`}
                >
                  <td className={`px-2 py-1 border border-gray-200 max-w-3`}>
                    {selectedEmployee?.id === employee.id && (
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
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr whitespace-normal">
                    {employee.fullname}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee?.department?.name}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee.position}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee.personal_id}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee.phone_number}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee.card_number}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee?.group?.name}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee?.schedule?.name}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee.honorable_minutes_per_day}
                  </td>
                  <td className="px-2 py-1 border border-gray-200 customized-th-tr">
                    {employee.holidays.map((holiday, idx) => (
                      <span key={idx}>{holiday.name}, </span>
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
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {employeeStatusModal && (
        <EmployeeStatusModal
          isOpen={employeeStatusModal}
          onClose={() => setEmployeeStatusModal(false)}
          handleSearch={applyFilters}
        />
      )}
    </AuthenticatedLayout>
  );
};

export default CreatedEmployees;




// <tr>
//                 <th className="w-[30px]"><img className="w-[15px] m-auto" src={FilterIcon} alt="" /></th>
//                 {[
//                   "fullname",
//                   "department_name",
//                   "position",
//                   "personal_id",
//                   "phone_number",
//                   "card_number",
//                   "group_name",
//                   "schedule_name",
//                   "honorable_minutes_per_day",
//                   "holidays",
//                 ].map((filterKey) => (
//                   <th key={filterKey} className="border border-gray-200 text-center">
//                     <input
//                       type="text"
//                       name={filterKey}
//                       value={filters[filterKey]}
//                       onChange={handleFilterChange}
//                       className="w-full text-center bg-transparent outline-none px-2 py-1"
//                       autoComplete="off"
//                     />
//                   </th>
//                 ))}
//               </tr>
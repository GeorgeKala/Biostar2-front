import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteEmployee } from "../../../redux/employeeSlice";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../../assets/arrow-down-2.png";
import NewIcon from "../../../assets/new.png";
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import GeneralSelectGroup from "../../../components/GeneralSelectGroup";
import SearchIcon from "../../../assets/search.png";
import EmployeeEditModal from "../../../components/EmployeeEditModal";
import employeeService from "../../../services/employee";

const ArchivedEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [status, setStatus] = useState("idle"); // To handle loading state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expandedCell, setExpandedCell] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const getArchivedEmployees = async () => {
      setStatus("loading");
      try {
        const data = await employeeService.getArchivedEmployees();
        console.log(data);
        setEmployees(data);
        setStatus("succeeded");
      } catch (error) {
        console.error("Failed to fetch archived employees:", error);
        setStatus("failed");
      }
    };

    if (status === "idle") {
      getArchivedEmployees();
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleClick = (employee) => {
    setSelectedEmployee(selectedEmployee === employee ? null : employee);
  };

  const handleDoubleClick = (index) => {
    setExpandedCell(index === expandedCell ? null : index);
  };

  const handleDelete = async () => {
    if (selectedEmployee) {
      try {
        await deleteEmployee(selectedEmployee.id);
        setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
        setSelectedEmployee(null);
      } catch (error) {
        console.error("Failed to delete employee:", error);
      }
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

  console.log(employees);

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            დაარქივებული თანამშრომლები
          </h1>
          <div className="flex items-center gap-8">
            <Link
              to="/employees/create"
              className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <img src={NewIcon} alt="New Icon" />
              New
            </Link>
            <button
              onClick={() => openEditModal(selectedEmployee)}
              className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <img src={EditIcon} alt="Edit" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <img src={DeleteIcon} alt="Delete" />
              Delete
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              Download Data
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <GeneralInputGroup
            name="employee"
            placeholder="თანამშრომელი"
            type="text"
          />
          <GeneralSelectGroup
            label="დეპარტამენტი"
            options={["Option 1", "Option 2", "Option 3"]}
          />
          <button className="bg-[#1AB7C1] rounded-lg px-6 py-2">
            <img src={SearchIcon} className="w-[80px]" alt="Search Icon" />
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

export default ArchivedEmployee;

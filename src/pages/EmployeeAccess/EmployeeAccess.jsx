import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import { fetchBuildings } from "../../redux/buildingSlice";
import employeeService from "../../services/employee";
import DeleteIcon from '../../assets/delete.png';
import EditIcon from '../../assets/edit.png';
import NewIcon from '../../assets/new.png';
import EmployeeModal from "../../components/employee/EmployeeModal";

const EmployeeAccess = () => {
  const dispatch = useDispatch();
  const buildings = useSelector((state) => state.building.items);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState({
    id: "",
    name: "",
  });
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [formData, setFormData] = useState({ building_id: "", name: "", employee_id: "", access_group: "" });

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await employeeService.getEmployeesWithBuildings();
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleBuildingSelect = (e) => {
    const selectedBuildingId = e.target.value;
    const selectedBuilding = buildings.find(building => building.id === parseInt(selectedBuildingId));
    if (selectedBuilding) {
      setFormData({
        ...formData,
        building_id: selectedBuilding.id,
        access_group: selectedBuilding.access_group
      });
      setSelectedBuilding(selectedBuilding);
    }
  };

  const handleEmployeeSelect = (employee) => {
    setFormData({ ...formData, name: employee.fullname, employee_id: employee.id });
    setIsEmployeeModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateAccessGroups(
        formData.access_group,
        formData.employee_id
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლების წვდომა
          </h1>
          <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
            მონაცემების ჩამოტვირთვა
            <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={formData.building_id}
            onChange={handleBuildingSelect}
            className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
          >
            <option value="">აირჩიე შენობა</option>
            {buildings &&
              buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
          </select>
          <input
            type="text"
            value={selectedEmployee.name}
            placeholder="თანამშრომელი"
            onClick={() => setIsEmployeeModalOpen(true)}
            readOnly
            className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 cursor-pointer w-full"
          />
          <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
            ჩართვა
          </button>
        </div>
        <div className="flex justify-end items-center gap-8">
          <button
            className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={NewIcon} alt="New Icon" />
            New
          </button>
          <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={EditIcon} alt="Edit Icon" />
            Edit
          </button>
          <button className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={DeleteIcon} alt="Delete Icon" />
            Delete
          </button>
        </div>
        <div className="container mx-auto mt-10 overflow-x-auto">
          <div className="min-w-max">
            <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
              <thead className="bg-[#1976D2] text-white text-xs">
                <tr>
                  {[
                    "სახელი/გვარი",
                    "დეპარტამენტი",
                    "პოზიცია",
                    "პირადი ნომერი / ID",
                    "შენობა",
                    "შეზღუდული",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-2 py-1 border border-gray-200 break-all w-20"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-xs">
                {data.length > 0 &&
                  data.map((item, index) => (
                    <tr
                      key={index}
                      className="px-2 py-1 border border-gray-200 w-20"
                    >
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item?.fullname}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item?.department}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.position}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item?.personal_id}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item?.building?.name}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        <input
                          type="checkbox"
                          checked={item?.is_not_accessed}
                          readOnly
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <EmployeeModal
          isOpen={isEmployeeModalOpen}
          onClose={() => setIsEmployeeModalOpen(false)}
          onSelectEmployee={handleEmployeeSelect}
        />
        {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg max-w-md w-full ">
              <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
                <h2 className="text-lg font-semibold">Add New Employee</h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:text-gray-200 focus:outline-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSave} className="p-3">
                <div className="mb-4">
                  <label htmlFor="building_id" className="block text-sm font-medium text-gray-700">Building:</label>
                  <select
                    id="building_id"
                    name="building_id"
                    className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    value={formData.building_id}
                    onChange={handleBuildingSelect}
                  >
                    <option value="">Select Building</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Employee:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    value={formData.name}
                    onClick={() => setIsEmployeeModalOpen(true)}
                    readOnly
                    required
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2">Save</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default EmployeeAccess;
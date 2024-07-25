import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import { fetchBuildings } from "../../redux/buildingSlice";
import EmployeeModal from "../../components/employee/EmployeeModal";

const EmployeeAccess = () => {
  const dispatch = useDispatch();
  const buildings = useSelector((state) => state.building.items);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState({
    id: "",
    name: "",
  });
  const [events, setEvents] = useState([
    {
      employee_name: "John Doe",
      department: "IT",
      position: "Developer",
      personal_id: "123456789",
      building: "Building 1",
      restricted: false,
    },
    {
      employee_name: "Jane Smith",
      department: "HR",
      position: "Manager",
      personal_id: "987654321",
      building: "Building 2",
      restricted: true,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  const fetchData = async () => {
    if (selectedBuilding) {
      try {
        // Fetch events logic here
        const response = [
          {
            employee_name: "Alice Brown",
            department: "Finance",
            position: "Accountant",
            personal_id: "111222333",
            building: "Building 3",
            restricted: false,
          },
        ];
        setEvents(response);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    } else {
      console.error("No building selected");
    }
  };

  const handleBuildingSelect = (e) => {
    setSelectedBuilding(e.target.value);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee({ id: employee.id, name: employee.fullname });
    setIsModalOpen(false);
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
            value={selectedBuilding}
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
            onClick={() => setIsModalOpen(true)}
            readOnly
            className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 cursor-pointer w-full"
          />
          <button
            onClick={fetchData}
            className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            ჩართვა
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
                {events.length > 0 &&
                  events.map((item, index) => (
                    <tr
                      key={index}
                      className="px-2 py-1 border border-gray-200 w-20"
                    >
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.employee_name}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.department}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.position}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.personal_id}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.building}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        <input
                          type="checkbox"
                          checked={item.restricted}
                          readOnly
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectEmployee={handleEmployeeSelect}
      />
    </AuthenticatedLayout>
  );
};

export default EmployeeAccess;

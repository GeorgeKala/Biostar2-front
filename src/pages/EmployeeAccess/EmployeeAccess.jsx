// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
// import ArrowDownIcon from "../../assets/arrow-down-2.png";
// import { fetchBuildings } from "../../redux/buildingSlice";
// import employeeService from "../../services/employee";
// import DeleteIcon from "../../assets/delete.png";
// import NewIcon from "../../assets/new.png";
// import SearchIcon from "../../assets/search.png";
// import EmployeeModal from "../../components/employee/EmployeeModal";
// import * as XLSX from "xlsx";
// import Table from "../../components/Table";
// import FilterModal from "../../components/FilterModal";
// import { useFilter } from "../../hooks/useFilter";
// import { useFilterAndSort } from "../../hooks/useFilterAndSort";

// const EmployeeAccess = () => {
//   const dispatch = useDispatch();
//   const buildings = useSelector((state) => state.building.items);
//   const [selectedEmployee, setSelectedEmployee] = useState({
//     id: "",
//     name: "",
//   });
//   const [data, setData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     building_id: "",
//     name: "",
//     employee_id: "",
//     access_group: [],
//   });
//   const [searchData, setSearchData] = useState({
//     building_id: "",
//     employee_id: "",
//     name: "",
//   });
//   const [isSearchContext, setIsSearchContext] = useState(false);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [filterableData, setFilterableData] = useState([]);
//   const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
//   const [currentFilterField, setCurrentFilterField] = useState("");

//    const {
//      filteredAndSortedData: filteredEmployees,
//      handleFilterChange,
//      applyModalFilters,
//      handleSort,
//      filters,
//      sortConfig,
//    } = useFilterAndSort(
//      data,
//      {
//        fullname: { text: "", selected: [] },
//        department: { text: "", selected: [] },
//        position: { text: "", selected: [] },
//        personal_id: { text: "", selected: [] },
//        building: { text: "", selected: [] },
//        is_not_accessed: { text: "", selected: [] },
//      },
//      { key: "", direction: "ascending" }
//    );

//   useEffect(() => {
//     dispatch(fetchBuildings());
//   }, [dispatch]);

//   const getEmployeesWithBuildings = async () => {
//     try {
//       const response = await employeeService.getEmployeesWithBuildings(
//         searchData.employee_id || undefined,
//         searchData.building_id || undefined
//       );
//       setData(response);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleBuildingSelect = (e) => {
//     const selectedBuildingId = e.target.value;
//     const selectedBuilding = buildings.find(
//       (building) => building.id === parseInt(selectedBuildingId)
//     );
//     if (selectedBuilding) {
//       setSearchData({
//         ...searchData,
//         building_id: selectedBuilding.id,
//       });
//     }
//   };

//   const handleEmployeeSelect = (employee) => {
//     if (isSearchContext) {
//       setSearchData({
//         ...searchData,
//         name: employee?.fullname,
//         employee_id: employee.id,
//       });
//     } else {
//       setFormData({
//         ...formData,
//         name: employee?.fullname,
//         employee_id: employee.id,
//       });
//     }
//     setIsEmployeeModalOpen(false);
//   };

//   const handleModalBuildingSelect = (e) => {
//     const selectedBuildingId = e.target.value;
//     const selectedBuilding = buildings.find(
//       (building) => building.id === parseInt(selectedBuildingId)
//     );
//     if (selectedBuilding) {
//       setFormData({
//         ...formData,
//         building_id: selectedBuilding.id,
//         access_group: selectedBuilding.access_group.map((group) => ({
//           access_group_id: group.access_group_id,
//           access_group_name: group.access_group_name,
//           device_name: group.device_name,
//         })),
//       });
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       await employeeService.updateAccessGroups(
//         formData.access_group,
//         formData.employee_id
//       );
//       setIsModalOpen(false);
//       getEmployeesWithBuildings();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDeleteAccessGroup = async (employeeId) => {
//     try {
//       await employeeService.removeAccessGroups(
//         selectedEmployee.building.access_group,
//         employeeId
//       );
//       getEmployeesWithBuildings();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredEmployees.map((item) => ({
//         "სახელი/გვარი": item?.fullname,
//         დეპარტამენტი: item?.department,
//         პოზიცია: item?.position,
//         "პირადი ნომერი": item?.personal_id,
//         შენობა: item?.building?.name,
//         შეზღუდული: item?.is_not_accessed,
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "employees");
//     XLSX.writeFile(workbook, "employees.xlsx");
//   };

//   const handleClear = () => {
//     setSearchData({ name: "", employee_id: "" });
//   };

//   const openEmployeeModal = (context) => {
//     setIsSearchContext(context === "filter");
//     setIsEmployeeModalOpen(true);
//   };

//   const handleOpenFilterModal = (data, fieldName, rect) => {
//     const uniqueData = [...new Set(data)];
//     setFilterableData(uniqueData);
//     setIsFilterModalOpen(true);
//     setModalPosition({ top: rect.bottom, left: rect.left - 240 });
//     setCurrentFilterField(fieldName);
//   };

//   const tableHeaders = [
//     { label: "სახელი/გვარი", key: "fullname", extractValue: (item) => item.fullname },
//     { label: "დეპარტამენტი", key: "department", extractValue: (item) => item.department },
//     { label: "პოზიცია", key: "position", extractValue: (item) => item.position },
//     { label: "პირადი ნომერი", key: "personal_id", extractValue: (item) => item.personal_id },
//     { label: "შენობა", key: "building", extractValue: (item) => item.building?.name },
//     {
//       label: "შეზღუდული",
//       key: "is_not_accessed",
//       extractValue: (item) => (
//         <input
//           type="checkbox"
//           checked={item?.is_not_accessed}
//           readOnly
//         />
//       ),
//     },
//   ];

//   return (
//     <AuthenticatedLayout>
//       <div className="w-full px-20 py-4 flex flex-col gap-8">
//         <div className="flex justify-between w-full">
//           <h1 className="text-[#1976D2] font-medium text-[23px]">
//             თანამშრომლის დაშვება
//           </h1>
//           <button
//             onClick={exportToExcel}
//             className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
//           >
//             ჩამოტვირთვა
//             <span className="absolute inset-0 border border-white border-dashed rounded"></span>
//           </button>
//         </div>
//         <div className="flex items-center gap-4">
//           <select
//             value={searchData.building_id}
//             onChange={handleBuildingSelect}
//             className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
//           >
//             <option value="">აირჩიე შენობა</option>
//             {buildings &&
//               buildings.map((building) => (
//                 <option key={building.id} value={building.id}>
//                   {building.name}
//                 </option>
//               ))}
//           </select>
//           <div className="w-full flex flex-col gap-2 relative">
//             <div className="flex">
//               <input
//                 className="bg-white border border-[#105D8D] outline-none rounded-l py-3 px-4 w-full pr-10"
//                 placeholder="თანამშრომელი"
//                 value={searchData.name}
//                 readOnly
//               />
//               {searchData.name && (
//                 <button
//                   type="button"
//                   onClick={handleClear}
//                   className="absolute right-12 top-[50%] transform -translate-y-1/2 mr-4"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="black"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     ></path>
//                   </svg>
//                 </button>
//               )}
//               <button
//                 onClick={() => openEmployeeModal("filter")}
//                 className="bg-[#105D8D] px-4 rounded-r"
//               >
//                 <img className="w-[20px]" src={SearchIcon} alt="Search Icon" />
//               </button>
//             </div>
//           </div>
//           <button
//             onClick={getEmployeesWithBuildings}
//             className="bg-[#1976D2] text-white px-4 py-3 rounded-md flex items-center gap-2"
//           >
//             ძებნა
//           </button>
//         </div>
//         <div className="flex justify-end items-center gap-8">
//           <button
//             className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2"
//             onClick={() => setIsModalOpen(true)}
//           >
//             <img src={NewIcon} alt="New Icon" />
//             ახალი
//           </button>
//           <button
//             className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2"
//             onClick={() => handleDeleteAccessGroup(selectedEmployee.user_id)}
//           >
//             <img src={DeleteIcon} alt="Delete Icon" />
//             წაშლა
//           </button>
//         </div>
//         <div className="container mx-auto mt-10 overflow-x-auto">
//           <Table
//             data={filteredEmployees}
//             headers={tableHeaders}
//             filters={filters}
//             sortConfig={sortConfig}
//             onSort={handleSort}
//             onFilterClick={handleOpenFilterModal}
//             onFilterChange={handleFilterChange}
//             filterableFields={[
//               "fullname",
//               "department",
//               "position",
//               "personal_id",
//               "building",
//               "is_not_accessed",
//             ]}
//             rowClassName={(item) =>
//               selectedEmployee?.user_id === item?.user_id &&
//               selectedEmployee?.building?.id === item?.building?.id
//                 ? "bg-blue-300"
//                 : ""
//             }
//             onRowClick={(item) => setSelectedEmployee(item)}
//           />
//         </div>
//         <EmployeeModal
//           isOpen={isEmployeeModalOpen}
//           onClose={() => setIsEmployeeModalOpen(false)}
//           onSelectEmployee={handleEmployeeSelect}
//         />
//         {isModalOpen && (
//           <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white rounded-lg max-w-md w-full ">
//               <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
//                 <h2 className="text-lg font-semibold">თანამშრომლის დაშვება</h2>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="hover:text-gray-200 focus:outline-none"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     ></path>
//                   </svg>
//                 </button>
//               </div>
//               <form onSubmit={handleSave} className="p-3">
//                 <div className="mb-4">
//                   <label
//                     htmlFor="building_id"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     შენობა:
//                   </label>
//                   <select
//                     id="building_id"
//                     name="building_id"
//                     className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//                     value={formData.building_id}
//                     onChange={handleModalBuildingSelect}
//                   >
//                     <option value="">აირჩიე შენობა</option>
//                     {buildings.map((building) => (
//                       <option key={building.id} value={building.id}>
//                         {building.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="name"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     თანამშრომელი:
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//                     value={formData.name}
//                     onClick={() => {
//                       setIsEmployeeModalOpen(true);
//                       setIsSearchContext(false);
//                     }}
//                     readOnly
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
//                   >
//                     შენახვა
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
//                   >
//                     გაუქმება
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//         {isFilterModalOpen && (
//           <FilterModal
//             isOpen={isFilterModalOpen}
//             onClose={() => setIsFilterModalOpen(false)}
//             filterableData={filterableData}
//             onApply={(selectedFilters) =>
//               applyModalFilters(currentFilterField, selectedFilters)
//             }
//             position={modalPosition}
//           />
//         )}
//       </div>
//     </AuthenticatedLayout>
//   );
// };

// export default EmployeeAccess;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import { fetchBuildings } from "../../redux/buildingSlice";
import employeeService from "../../services/employee";
import DeleteIcon from "../../assets/delete.png";
import NewIcon from "../../assets/new.png";
import SearchIcon from "../../assets/search.png";
import EmployeeModal from "../../components/employee/EmployeeModal";
import * as XLSX from "xlsx";
import Table from "../../components/Table";
import FilterModal from "../../components/FilterModal";
import { useFilterAndSort } from "../../hooks/useFilterAndSort";
import EmployeeInput from "../../components/employee/EmployeeInput";
import CustomSelect from "../../components/CustomSelect";

const EmployeeAccess = () => {
  const dispatch = useDispatch();
  const buildings = useSelector((state) => state.building.items);
  const [selectedEmployee, setSelectedEmployee] = useState({
    id: "",
    name: "",
  });
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    building_id: "",
    name: "",
    employee_id: "",
    access_group: [],
  });
  const [searchData, setSearchData] = useState({
    building_id: "",
    employee_id: "",
    name: "",
  });
  const [isSearchContext, setIsSearchContext] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");

  const {
    filteredAndSortedData: filteredEmployees,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    filters,
    sortConfig,
  } = useFilterAndSort(
    data,
    {
      fullname: { text: "", selected: [] },
      department: { text: "", selected: [] },
      position: { text: "", selected: [] },
      personal_id: { text: "", selected: [] },
      building: { text: "", selected: [] },
      is_not_accessed: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  const getEmployeesWithBuildings = async () => {
    try {
      const response = await employeeService.getEmployeesWithBuildings(
        searchData.employee_id || undefined,
        searchData.building_id || undefined
      );
      setData(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuildingSelect = (e) => {
    const selectedBuildingId = e.target.value;
    const selectedBuilding = buildings.find(
      (building) => building.id === parseInt(selectedBuildingId)
    );
    if (selectedBuilding) {
      setSearchData({
        ...searchData,
        building_id: selectedBuilding.id,
      });
    }
  };

  const handleEmployeeSelect = (employee) => {
    if (isSearchContext) {
      setSearchData({
        ...searchData,
        name: employee?.fullname,
        employee_id: employee.id,
      });
    } else {
      setFormData({
        ...formData,
        name: employee?.fullname,
        employee_id: employee.id,
      });
    }
    setIsEmployeeModalOpen(false);
  };

  const handleModalBuildingSelect = (e) => {
    const selectedBuildingId = e.target.value;
    const selectedBuilding = buildings.find(
      (building) => building.id === parseInt(selectedBuildingId)
    );
    if (selectedBuilding) {
      setFormData({
        ...formData,
        building_id: selectedBuilding.id,
        access_group: selectedBuilding.access_group.map((group) => ({
          access_group_id: group.access_group_id,
          access_group_name: group.access_group_name,
          device_name: group.device_name,
        })),
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateAccessGroups(
        formData.access_group,
        formData.employee_id
      );
      setIsModalOpen(false);
      getEmployeesWithBuildings();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccessGroup = async (employeeId) => {
    try {
      await employeeService.removeAccessGroups(
        selectedEmployee.building.access_group,
        employeeId
      );
      getEmployeesWithBuildings();
    } catch (error) {
      console.error(error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEmployees.map((item) => ({
        "სახელი/გვარი": item?.fullname,
        დეპარტამენტი: item?.department,
        პოზიცია: item?.position,
        "პირადი ნომერი": item?.personal_id,
        შენობა: item?.building?.name,
        შეზღუდული: item?.is_not_accessed,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "employees");
    XLSX.writeFile(workbook, "employees.xlsx");
  };

  const handleClear = () => {
    setSearchData({ name: "", employee_id: "" });
  };

  const openEmployeeModal = (context) => {
    setIsSearchContext(context === "filter");
    setIsEmployeeModalOpen(true);
  };

  const handleOpenFilterModal = (data, fieldName, rect) => {
    const uniqueData = [...new Set(data)];
    setFilterableData(uniqueData);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  };

  const tableHeaders = [
    {
      label: "სახელი/გვარი",
      key: "fullname",
      extractValue: (item) => item.fullname,
    },
    {
      label: "დეპარტამენტი",
      key: "department",
      extractValue: (item) => item.department,
    },
    {
      label: "პოზიცია",
      key: "position",
      extractValue: (item) => item.position,
    },
    {
      label: "პირადი ნომერი",
      key: "personal_id",
      extractValue: (item) => item.personal_id,
    },
    {
      label: "შენობა",
      key: "building",
      extractValue: (item) => item.building?.name,
    },
    {
      label: "შეზღუდული",
      key: "is_not_accessed",
      extractValue: (item) => (
        <input type="checkbox" checked={item?.is_not_accessed} readOnly />
      ),
    },
  ];

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლის დაშვება
          </h1>
          <div>
          <div className="flex justify-end items-center gap-8">
          <button
            className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={NewIcon} alt="New Icon" />
            ახალი
          </button>
          <button
            className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => handleDeleteAccessGroup(selectedEmployee.user_id)}
          >
            <img src={DeleteIcon} alt="Delete Icon" />
            წაშლა
          </button>
          <button
            onClick={exportToExcel}
            className="bg-[#105D8D] px-7 py-2 rounded flex items-center gap-3 text-white text-[16px] border relative"
          >
            ჩამოტვირთვა
            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
          </button>
        </div>
          </div>
         
        </div>
        <div className="flex items-center gap-4">
          {/* <select
            value={searchData.building_id}
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
          </select> */}
          <CustomSelect
            options={buildings}
            selectedValue={
              buildings.find((b) => b.id === searchData.building_id)?.name
            }
            onSelect={(selectedOption) =>
              setSearchData({ ...searchData, building_id: selectedOption.id })
            }
            placeholder="აირჩიე შენობა"
            className="bg-white border-[#105D8D]"
          />
          <div className="w-full flex flex-col gap-2 relative">
            <div className="flex">
              <input
                className="bg-white border border-[#105D8D] outline-none rounded-l py-3 px-4 w-full pr-10"
                placeholder="თანამშრომელი"
                value={searchData.name}
                readOnly
              />
              {searchData.name && (
                <button
                  type="button"
                  onClick={handleClear}
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
                <img className="w-[20px]" src={SearchIcon} alt="Search Icon" />
              </button>
            </div>
          </div>
          <button
            onClick={getEmployeesWithBuildings}
            className="bg-[#1976D2] text-white px-4 py-3 rounded-md flex items-center gap-2"
          >
            ძებნა
          </button>
        </div>
        
        <div className="container mx-auto mt-10 overflow-x-auto">
          <Table
            data={filteredEmployees}
            headers={tableHeaders}
            filters={filters}
            sortConfig={sortConfig}
            onSort={handleSort}
            onFilterClick={handleOpenFilterModal}
            onFilterChange={handleFilterChange}
            filterableFields={[
              "fullname",
              "department",
              "position",
              "personal_id",
              "building",
              "is_not_accessed",
            ]}
            rowClassName={(item) =>
              selectedEmployee?.user_id === item?.user_id &&
              selectedEmployee?.building?.id === item?.building?.id
                ? "bg-blue-300"
                : ""
            }
            onRowClick={(item) => setSelectedEmployee(item)}
          />
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
                <h2 className="text-lg font-semibold">თანამშრომლის დაშვება</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
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
              <form onSubmit={handleSave} className="p-3">
                <div className="mb-4">
                  <label
                    htmlFor="building_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    შენობა:
                  </label>
                  {/* <select
                    id="building_id"
                    name="building_id"
                    className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    value={formData.building_id}
                    onChange={handleModalBuildingSelect}
                  >
                    <option value="">აირჩიე შენობა</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select> */}
                  <div className="mb-4">
                    <CustomSelect
                      options={buildings}
                      selectedValue={
                        buildings.find((b) => b.id === formData.building_id)
                          ?.name
                      }
                      onSelect={(selectedOption) =>
                        setFormData({
                          ...formData,
                          building_id: selectedOption.id,
                        })
                      }
                      placeholder="აირჩიე შენობა"
                      className="bg-gray-300"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    თანამშრომელი:
                  </label>
                  <EmployeeInput
                    value={formData.name}
                    onClear={() =>
                      setFormData({ ...formData, name: "", employee_id: "" })
                    }
                    onSearchClick={() => setIsEmployeeModalOpen(true)}
                    className="px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-l shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
                  >
                    შენახვა
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                  >
                    გაუქმება
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isFilterModalOpen && (
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            filterableData={filterableData}
            onApply={(selectedFilters) =>
              applyModalFilters(currentFilterField, selectedFilters)
            }
            position={modalPosition}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default EmployeeAccess;



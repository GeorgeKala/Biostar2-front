// import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
// import ArrowDownIcon from "../../../assets/arrow-down-2.png";
// import GeneralInputGroup from "../../../components/GeneralInputGroup";
// import { useEffect, useState } from "react";
// import reportService from "../../../services/report";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchForgiveTypes } from "../../../redux/forgiveTypeSlice";
// import SearchIcon from "../../../assets/search.png";
// import EmployeeModal from "../../../components/employee/EmployeeModal";
// import FilterIcon from '../../../assets/filter-icon.png'; 
// import * as XLSX from "xlsx";
// import NestedDropdownModal from "../../../components/NestedDropdownModal";
// import DepartmentInput from "../../../components/DepartmentInput";
// import EmployeeInput from "../../../components/employee/EmployeeInput";
// import { fetchReports, updateOrAddReport } from "../../../redux/reportSlice";

// const GeneralReport = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user.user)
//   const { departments, nestedDepartments } = useSelector((state) => state.departments);
//   const { reports } = useSelector((state) => state.reports);
//   const [filteredReports, setFilteredReports] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [EmployeeModalOpen, setEmployeeModalOpen] = useState(false);
//   const [openNestedDropdown, setOpenNestedDropdown] = useState(false);

//   const forgiveTypeItems = useSelector(
//     (state) => state.forgiveTypes.forgiveTypes
//   );
//   const [formData, setFormData] = useState({
//     start_date: "",
//     end_date: "",
//     department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
//     employee: "",
//   });

//   const [editData, setEditData] = useState({
//     employee_id: "",
//     employee_name: "",
//     date: "",
//     forgive_type_id: "",
//     comment: "",
//     final_penalized_time: "",
//     comment_datetime: "",
//   });

//   const [filters, setFilters] = useState({
//     fullname: "",
//     department: "",
//     position: "",
//     date: "",
//     come_time: "",
//     come_early: "",
//     come_late: "",
//     penalized_time: "",
//     leave_time: "",
//     leave_early: "",
//     leave_late: "",
//     worked_hours: "",
//     day_type: "",
//     week_day: "",
//     homorable_minutes: "",
//     schedule: "",
//     final_penalized_time: "",
//     comment: "",
//   });

//   const applyFilters = () => {
//     const filtered = reports.filter((report) => {
//       const matches = (value, filter) =>
//         !filter ||
//         (value &&
//           value.toString().toLowerCase().includes(filter.toLowerCase()));

//       return (
//         matches(report.fullname, filters.fullname) &&
//         matches(report.department, filters.department) &&
//         matches(report.position, filters.position) &&
//         matches(report.date, filters.date) &&
//         matches(report.come_time, filters.come_time) &&
//         matches(report.come_early, filters.come_early) &&
//         matches(report.come_late, filters.come_late) &&
//         matches(report.penalized_time, filters.penalized_time) &&
//         matches(report.leave_time, filters.leave_time) &&
//         matches(report.leave_early, filters.leave_early) &&
//         matches(report.leave_late, filters.leave_late) &&
//         matches(report.worked_hours, filters.worked_hours) &&
//         matches(report.day_type, filters.day_type) &&
//         matches(report.week_day, filters.week_day) &&
//         matches(report.homorable_minutes, filters.homorable_minutes) &&
//         matches(report.schedule, filters.schedule) &&
//         matches(report.final_penalized_time, filters.final_penalized_time) &&
//         matches(report.comment, filters.comment)
//       );
//     });

//     setFilteredReports(filtered);
//   };


//    const handleFilterChange = (e) => {
//      const { name, value } = e.target;
//      setFilters({ ...filters, [name]: value });
//    };


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value.trim(),
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = {};

//       if (formData.start_date) {
//         data.start_date = formData.start_date;
//       }

//       if (formData.end_date) {
//         data.end_date = formData.end_date;
//       }

//       if (formData.department_id) {
//         data.department_id = formData.department_id;
//       }

//       if (formData.employee_id) {
//         data.employee_id = formData.employee_id;
//       }

//       dispatch(fetchReports(data));
//     } catch (error) {
//       console.error("Error fetching report data:", error);
//     }
//   };

//   const handleRowDoubleClick = (report) => {
//     setEditData({
//       employee_id: report.user_id,
//       employee_name: report.fullname,
//       date: report.date,
//       forgive_type_id: "",
//       comment: report.comment,
//       final_penalized_time: report.final_penalized_time,
//       comment_datetime: report.comment_datetime,
//     });
//     setModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setModalOpen(false);
//     setEditData({
//       employee_id: "",
//       employee_name: "",
//       date: "",
//       forgive_type_id: "",
//       comment: "",
//       final_penalized_time: "",
//       comment_datetime: "",
//     });
//   };

//   const handleModalSave = async () => {
//     try {
//       const data = {
//         employee_id: editData.employee_id,
//         date: editData.date,
//         forgive_type_id: editData.forgive_type_id,
//         comment: editData.comment,
//         final_penalized_time: editData.final_penalized_time,
//         comment_datetime: editData.comment_datetime,
//       };
//       const response = await reportService.updateOrCreateDayDetail(data);
  
//       dispatch(updateOrAddReport({
//         user_id: editData.employee_id,
//         date: editData.date,
//         forgive_type_id: editData.forgive_type_id,
//         comment: response.data.comment,
//         final_penalized_time: editData.final_penalized_time,
//         fullname: editData.employee_name,
//         department: formData.department_id,
//       }));
  
//       handleModalClose();
//     } catch (error) {
//       console.error("Error saving data:", error);
//     }
//   };


//   useEffect(() => {
//     applyFilters();
//   }, [reports, filters]);

//   useEffect(() => {
//     dispatch(fetchForgiveTypes());
//   }, [dispatch]);

//   const handleModalInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditData({
//       ...editData,
//       [name]: value,
//     });
//   };

//   const openModal = (id) => {
//     setEmployeeModalOpen(true);
//   };

//   const closeModal = () => {
//     setEmployeeModalOpen(false);
//   };

//   const handleEmployeeSelect = (employee) => {
//     setFormData({
//       ...formData,
//       employee_id: employee.id,
//       employee: employee.fullname,
//     });
//   };



//   const exportToExcel = () => {
//     const dataToExport = [];
//     const header = [
//       "სახელი/გვარი",
//       "დეპარტამენტი",
//       "თანამდებობა",
//       "თარიღი",
//       "მოსვლის დრო",
//       "ადრე მოსვლა",
//       "გვიან მოსვლა",
//       "დაგვიანებული წუთები",
//       "წასვლის დრო",
//       "ადრე წასვლა",
//       "გვიან წასვლა",
//       "ნამუშევარი საათები",
//       "დღის ტიპი",
//       "კვირის დღე",
//       "საპატიო წუთები",
//       "განრიგი",
//       "საჯარიმო დრო",
//       "კომენტარი",
//     ];
//     dataToExport.push(header);

//     reports.forEach((report) => {
//       const row = [
//         report.fullname,
//         report.department,
//         report.position,
//         report.date,
//         report.come_time,
//         report.come_early,
//         report.come_late,
//         report.penalized_time,
//         report.leave_time,
//         report.leave_early,
//         report.leave_late,
//         report.worked_hours,
//         report.day_type,
//         report.week_day,
//         report.homorable_minutes,
//         report.schedule,
//         Number(report.final_penalized_time).toFixed(2),
//         report.comment,
//       ];
//       dataToExport.push(row);
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "General Report");

//     XLSX.writeFile(workbook, "General_Report.xlsx");
//   };


  // const getRowClassName = (item) => {
  //   if (
  //     item.final_penalized_time > 0  &&
  //     !item.day_type_id &&
  //     !item.forgive_type
  //   || item.day_type == "გაცდენა" && !item.day_type_id && !item.forgive_type 
  //   ) {
  //     return "bg-yellow-300";
  //   } else if (
  //     item.final_penalized_time > 0  &&
  //     item.forgive_type.forgive == 0 &&
  //     !item.day_type_id
  //     || item.day_type == "გაცდენა" && item.forgive_type.forgive == 0 && !item.day_type_id
  //     || item.final_penalized_time == null  &&
  //     item.forgive_type.forgive == 0 &&
  //     !item.day_type_id

  //   ) {
  //     return "bg-red-300";
  //   } else if (
  //     item.final_penalized_time > 0 &&
  //     item.forgive_type.forgive == 1 &&
  //     !item.day_type_id
  //     || item.day_type == "გაცდენა" && item.forgive_type.forgive == 1 && !item.day_type_id
  //     || item.final_penalized_time == null &&
  //     item.forgive_type.forgive == 1 &&
  //     !item.day_type_id
  //   ) {
  //     return "bg-green-300";
  //   } else {
  //     return "bg-white";
  //   }
  // };


//   const handleDepartmentSelect = (departmentId, departmentName) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       department_id: departmentId,
//     }));
//     setOpenNestedDropdown(false);
//   };

//   const handleClear = (field) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: "",
//     }));
//   };


//   const filteredNestedDepartments = user?.user_type?.has_full_access
//     ? nestedDepartments
//     : nestedDepartments.filter(
//         (dept) =>
//           dept.id === user?.department?.id ||
//           dept.parent_id === user?.department?.id
//       );

    
//   const handleEmployeeClear = () => {
//     setFormData((prevData) => (
//       {
//         ...prevData,
//         employee:"",
//         employee_id:""
//       }
//     ))
//   }


//   console.log(reports);
  
  
//   return (
//     <AuthenticatedLayout>
//       <div className="w-full px-10 py-4 flex flex-col gap-8 2xl:px-20">
//         <div className="flex justify-between w-full">
//           <h1 className="text-[#1976D2] font-medium text-[23px]">
//             პერიოდის რეპორტი
//           </h1>
//           <button
//             onClick={exportToExcel}
//             className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
//           >
//             ჩამოტვირთვა
//             <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
//             <span className="absolute inset-0 border border-white border-dashed rounded"></span>
//           </button>
//         </div>
//         <div className="flex items-center gap-4">
//           <GeneralInputGroup
//             name="start_date"
//             placeholder="Start Date"
//             type="date"
//             value={formData.start_date}
//             onChange={handleInputChange}
//           />
//           <GeneralInputGroup
//             name="end_date"
//             placeholder="End Date"
//             type="date"
//             value={formData.end_date}
//             onChange={handleInputChange}
//           />
//           <DepartmentInput
//             value={
//               departments.find((d) => d.id === formData.department_id)?.name ||
//               ""
//             }
//             onClear={() => handleClear("department_id")}
//             onSearchClick={() => setOpenNestedDropdown(true)}
//           />
//           <EmployeeInput
//             value={formData.employee}
//             onClear={() => handleEmployeeClear()}
//             onSearchClick={openModal}
//             onChange={handleInputChange}
//           />
//           <button
//             className="bg-[#1AB7C1] rounded-lg px-8 py-5"
//             onClick={handleSubmit}
//           >
//             <img src={SearchIcon} className="w-[50px]" alt="Search Icon" />
//           </button>
//         </div>
        
//         <div className="container mx-auto mt-10 overflow-x-auto">
//           <div className="min-w-max">
//             <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
//               <thead className="bg-[#1976D2] text-white text-xs">
//                 <tr>
//                   <th className="w-[30px]"></th>
//                   {[
//                     "სახელი/გვარი",
//                     "დეპარტამენტი",
//                     "თანამდებობა",
//                     "თარიღი",
//                     "მოსვლის დრო",
//                     "ადრე მოსვლა",
//                     "გვიან მოსვლა",
//                     "დაგვიანებული წუთები",
//                     "წასვლის დრო",
//                     "ადრე წასვლა",
//                     "გვიან წასვლა",
//                     "ნამუშევარი საათები",
//                     "დღის ტიპი",
//                     "კვირის დღე",
//                     "საპატიო წუთები",
//                     "განრიგი",
//                     "საჯარიმო დრო",
//                     "კომენტარი",
//                   ].map((header) => (
//                     <th
//                       key={header}
//                       className="border border-gray-200 customized-th-tr"
//                     >
//                       <input
//                         type="text"
//                         value={header}
//                         className="font-normal px-2 py-1 w-full outline-none border-none bg-transparent"
//                         readOnly
//                       />
//                     </th>
//                   ))}
//                 </tr>
//                 <tr>
//                   <th className="w-[30px]">
//                     <img className="w-[20px] m-auto" src={FilterIcon} alt="" />
//                   </th>
//                   {[
//                     "fullname",
//                     "department",
//                     "position",
//                     "date",
//                     "come_time",
//                     "come_early",
//                     "come_late",
//                     "penalized_time",
//                     "leave_time",
//                     "leave_early",
//                     "leave_late",
//                     "worked_hours",
//                     "day_type",
//                     "week_day",
//                     "homorable_minutes",
//                     "schedule",
//                     "final_penalized_time",
//                     "comment",
//                   ].map((filterKey) => (
//                     <th
//                       key={filterKey}
//                       className="border border-gray-200 customized-th-tr"
//                     >
//                       <input
//                         type="text"
//                         name={filterKey}
//                         value={filters[filterKey]}
//                         onChange={handleFilterChange}
//                         className="font-normal px-2 py-1 w-full outline-none border-none bg-transparent"
//                         autoComplete="off"
//                       />
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200 text-xs max-h-[100vh] overflow-y-auto">

//                 {filteredReports &&
//                   filteredReports.map((item, index) => (
//                     <tr
//                       key={index}
//                       className={`px-2 py-1 border border-gray-200 w-20 ${getRowClassName(
//                         item
//                       )}`}
//                       onDoubleClick={() => handleRowDoubleClick(item)}
//                     >
//                       <td className="w-[30px]"></td>
//                       <td className="border border-gray-200 customized-th-tr">
//                         <input
//                           type="text"
//                           value={item.fullname}
//                           className="font-normal px-2 py-1 w-full outline-none border-none bg-transparent"
//                           readOnly
//                         />
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.department}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.position}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.date}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.come_time}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.come_early}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.come_late}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.penalized_time}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.leave_time}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.leave_early}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.leave_late}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.worked_hours}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.day_type}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.week_day}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.homorable_minutes}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.schedule}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {Number(item.final_penalized_time).toFixed(2)}
//                       </td>
//                       <td className="px-2 py-1 border border-gray-200 customized-th-tr">
//                         {item.comment}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {modalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//               <h2 className="text-2xl mb-4">კომენტარის დაწერა</h2>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   სახელი და გვარი
//                 </label>
//                 <input
//                   type="text"
//                   name="employee_name"
//                   value={editData.employee_name}
//                   onChange={handleModalInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                   readOnly
//                 />
//                 <input
//                   type="hidden"
//                   name="employee_id"
//                   value={editData.employee_id}
//                   onChange={handleModalInputChange}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   თარიღი
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={editData.date}
//                   onChange={handleModalInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   პატიების ტიპი
//                 </label>
//                 <select
//                   name="forgive_type_id"
//                   value={editData.forgive_type_id}
//                   onChange={handleModalInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">აირჩიე პატიების ტიპი</option>
//                   {forgiveTypeItems &&
//                     forgiveTypeItems.map((item) => (
//                       <option key={item.id} value={item.id}>
//                         {item.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   კომენტარი
//                 </label>
//                 <textarea
//                   name="comment"
//                   value={editData.comment}
//                   onChange={handleModalInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
//                   onClick={handleModalClose}
//                 >
//                   გამოსვლა
//                 </button>
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                   onClick={handleModalSave}
//                 >
//                   შენახვა
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {openNestedDropdown && (
//         <NestedDropdownModal
//           header="დეპარტამენტები"
//           isOpen={openNestedDropdown}
//           onClose={() => setOpenNestedDropdown(false)}
//           onSelect={handleDepartmentSelect}
//           data={filteredNestedDepartments}
//           link={"/departments"}
//         />
//       )}
//       <EmployeeModal
//         isOpen={EmployeeModalOpen}
//         onClose={closeModal}
//         onSelectEmployee={handleEmployeeSelect}
//       />
//     </AuthenticatedLayout>
//   );
// };

// export default GeneralReport;



import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../../assets/arrow-down-2.png";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import { useDispatch, useSelector } from "react-redux";
import { fetchForgiveTypes } from "../../../redux/forgiveTypeSlice";
import EmployeeModal from "../../../components/employee/EmployeeModal";
import * as XLSX from "xlsx";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import DepartmentInput from "../../../components/DepartmentInput";
import EmployeeInput from "../../../components/employee/EmployeeInput";
import { fetchReports, updateOrAddReport } from "../../../redux/reportSlice";
import FilterModal from "../../../components/FilterModal";
import Table from "../../../components/Table";
import { useFilterAndSort } from "../../../hooks/useFilterAndSort";
import SearchButton from "../../../components/SearchButton";
import SearchIcon from "../../../assets/search.png";
import reportService from "../../../services/report";


const GeneralReport = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const { reports } = useSelector((state) => state.reports);
  const forgiveTypeItems = useSelector(
    (state) => state.forgiveTypes.forgiveTypes
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
    employee: "",
  });

  const [editData, setEditData] = useState({
    employee_id: "",
    employee_name: "",
    date: "",
    forgive_type_id: "",
    comment: "",
    final_penalized_time: "",
    comment_datetime: "",
  });

  const {
    filteredAndSortedData,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    filters,
    sortConfig,
  } = useFilterAndSort(
    reports,
    {
      fullname: { text: "", selected: [] },
      department: { text: "", selected: [] },
      position: { text: "", selected: [] },
      date: { text: "", selected: [] },
      come_time: { text: "", selected: [] },
      come_early: { text: "", selected: [] },
      come_late: { text: "", selected: [] },
      penalized_time: { text: "", selected: [] },
      leave_time: { text: "", selected: [] },
      leave_early: { text: "", selected: [] },
      leave_late: { text: "", selected: [] },
      worked_hours: { text: "", selected: [] },
      day_type: { text: "", selected: [] },
      week_day: { text: "", selected: [] },
      homorable_minutes: { text: "", selected: [] },
      schedule: { text: "", selected: [] },
      final_penalized_time: { text: "", selected: [] },
      comment: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (!data.start_date) delete data.start_date;
    if (!data.end_date) delete data.end_date;
    if (!data.department_id) delete data.department_id;
    if (!data.employee_id) delete data.employee_id;
    dispatch(fetchReports(data));
  };

  const handleRowDoubleClick = (report) => {
    setModalOpen(true);
    setEditData({
      employee_id: report.user_id,
      employee_name: report.fullname,
      date: report.date,
      forgive_type_id: "",
      comment: report.comment,
      final_penalized_time: report.final_penalized_time,
      comment_datetime: report.comment_datetime,
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSave = async () => {
    try {
      const data = {
        employee_id: editData.employee_id,
        date: editData.date,
        forgive_type_id: editData.forgive_type_id,
        comment: editData.comment,
        final_penalized_time: editData.final_penalized_time,
        comment_datetime: editData.comment_datetime,
      };
      const response = await reportService.updateOrCreateDayDetail(data);
      dispatch(
        updateOrAddReport({
          user_id: editData.employee_id,
          date: editData.date,
          forgive_type_id: editData.forgive_type_id,
          comment: response.data.comment,
          final_penalized_time: editData.final_penalized_time,
          fullname: editData.employee_name,
          department: formData.department_id,
        })
      );
      handleModalClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };


  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const exportToExcel = () => {
    const dataToExport = [
      [
        "სახელი/გვარი",
        "დეპარტამენტი",
        "თანამდებობა",
        "თარიღი",
        "მოსვლის დრო",
        "ადრე მოსვლა",
        "გვიან მოსვლა",
        "დაგვიანებული წუთები",
        "წასვლის დრო",
        "ადრე წასვლა",
        "გვიან წასვლა",
        "ნამუშევარი საათები",
        "დღის ტიპი",
        "კვირის დღე",
        "საპატიო წუთები",
        "განრიგი",
        "საჯარიმო დრო",
        "კომენტარი",
      ],
      ...filteredAndSortedData.map((report) => [
        report.fullname,
        report.department,
        report.position,
        report.date,
        report.come_time,
        report.come_early,
        report.come_late,
        report.penalized_time,
        report.leave_time,
        report.leave_early,
        report.leave_late,
        report.worked_hours,
        report.day_type,
        report.week_day,
        report.homorable_minutes,
        report.schedule,
        Number(report.final_penalized_time).toFixed(2),
        report.comment,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "General Report");
    XLSX.writeFile(workbook, "General_Report.xlsx");
  };

  useEffect(() => {
    dispatch(fetchForgiveTypes());
  }, [dispatch]);

  // Define filteredNestedDepartments based on the user's access level
  const filteredNestedDepartments = user?.user_type?.has_full_access
    ? nestedDepartments
    : nestedDepartments.filter(
        (dept) =>
          dept.id === user?.department?.id ||
          dept.parent_id === user?.department?.id
      );

  const tableHeaders = [
    {
      label: "სახელი/გვარი",
      key: "fullname",
      extractValue: (report) => report.fullname,
    },
    {
      label: "დეპარტამენტი",
      key: "department",
      extractValue: (report) => report.department,
    },
    {
      label: "თანამდებობა",
      key: "position",
      extractValue: (report) => report.position,
    },
    { label: "თარიღი", key: "date", extractValue: (report) => report.date },
    {
      label: "მოსვლის დრო",
      key: "come_time",
      extractValue: (report) => report.come_time,
    },
    {
      label: "ადრე მოსვლა",
      key: "come_early",
      extractValue: (report) => report.come_early,
    },
    {
      label: "გვიან მოსვლა",
      key: "come_late",
      extractValue: (report) => report.come_late,
    },
    {
      label: "დაგვიანებული წუთები",
      key: "penalized_time",
      extractValue: (report) => report.penalized_time,
    },
    {
      label: "წასვლის დრო",
      key: "leave_time",
      extractValue: (report) => report.leave_time,
    },
    {
      label: "ადრე წასვლა",
      key: "leave_early",
      extractValue: (report) => report.leave_early,
    },
    {
      label: "გვიან წასვლა",
      key: "leave_late",
      extractValue: (report) => report.leave_late,
    },
    {
      label: "ნამუშევარი საათები",
      key: "worked_hours",
      extractValue: (report) => report.worked_hours,
    },
    {
      label: "დღის ტიპი",
      key: "day_type",
      extractValue: (report) => report.day_type,
    },
    {
      label: "კვირის დღე",
      key: "week_day",
      extractValue: (report) => report.week_day,
    },
    {
      label: "საპატიო წუთები",
      key: "homorable_minutes",
      extractValue: (report) => report.homorable_minutes,
    },
    {
      label: "განრიგი",
      key: "schedule",
      extractValue: (report) => report.schedule,
    },
    {
      label: "საჯარიმო დრო",
      key: "final_penalized_time",
      extractValue: (report) => report.final_penalized_time,
    },
    {
      label: "კომენტარი",
      key: "comment",
      extractValue: (report) => report.comment,
    },
  ];

  const getRowClassName = (item) => {
    if (
      (item.final_penalized_time > 0 &&
        !item.day_type_id &&
        !item.forgive_type) ||
      (item.day_type == "გაცდენა" && !item.day_type_id && !item.forgive_type)
    ) {
      return "bg-yellow-300";
    } else if (
      (item.final_penalized_time > 0 &&
        item.forgive_type.forgive == 0 &&
        !item.day_type_id) ||
      (item.day_type == "გაცდენა" &&
        item.forgive_type.forgive == 0 &&
        !item.day_type_id) ||
      (item.final_penalized_time == null &&
        item.forgive_type.forgive == 0 &&
        !item.day_type_id)
    ) {
      return "bg-red-300";
    } else if (
      (item.final_penalized_time > 0 &&
        item.forgive_type.forgive == 1 &&
        !item.day_type_id) ||
      (item.day_type == "გაცდენა" &&
        item.forgive_type.forgive == 1 &&
        !item.day_type_id) ||
      (item.final_penalized_time == null &&
        item.forgive_type.forgive == 1 &&
        !item.day_type_id)
    ) {
      return "bg-green-300";
    } else {
      return "bg-white";
    }
  };

  const handleDepartmentSelect = (departmentId) => {
    setFormData((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  };

  const handleEmployeeSelect = (employee) => {
    setFormData((prevData) => ({
      ...prevData,
      employee_id: employee.id,
      employee: employee.fullname,
    }));
    setEmployeeModalOpen(false);
  };

  const handleEmployeeClear = () => {
    setFormData((prevData) => ({
      ...prevData,
      employee: "",
      employee_id: "",
    }));
  };

  const handleOpenFilterModal = (data, fieldName, rect) => {
    setFilterableData(data);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
    setIsFilterModalOpen(true);
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-10 py-4 flex flex-col gap-8 2xl:px-20">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            პერიოდის რეპორტი
          </h1>
          <button
            onClick={exportToExcel}
            className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
          >
            ჩამოტვირთვა
            <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <GeneralInputGroup
            name="start_date"
            placeholder="Start Date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
          />
          <GeneralInputGroup
            name="end_date"
            placeholder="End Date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
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
            onClear={handleEmployeeClear}
            onSearchClick={() => setEmployeeModalOpen(true)}
          />
          <button
            className="bg-[#1AB7C1] rounded-lg px-8 py-5"
            onClick={handleSubmit}
          >
            <img src={SearchIcon} className="w-[50px]" alt="Search Icon" />
          </button>
        </div>
        <div className="container mx-auto  overflow-x-auto">
          <Table
            data={filteredAndSortedData}
            headers={tableHeaders}
            filters={filters}
            sortConfig={sortConfig}
            onSort={handleSort}
            onFilterClick={handleOpenFilterModal}
            onFilterChange={handleFilterChange}
            rowClassName={getRowClassName}
            onRowDoubleClick={handleRowDoubleClick}
            filterableFields={[
              "fullname",
              "department",
              "position",
              "date",
              "come_time",
              "come_early",
              "come_late",
              "penalized_time",
              "leave_time",
              "leave_early",
              "leave_late",
              "worked_hours",
              "day_type",
              "week_day",
              "homorable_minutes",
              "schedule",
              "final_penalized_time",
              "comment",
            ]}
          />
        </div>

        {modalOpen && (
          <div className="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">კომენტარის დაწერა</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  სახელი და გვარი
                </label>
                <input
                  type="text"
                  name="employee_name"
                  value={editData.employee_name}
                  onChange={handleModalInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  readOnly
                />
                <input
                  type="hidden"
                  name="employee_id"
                  value={editData.employee_id}
                  onChange={handleModalInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  თარიღი
                </label>
                <input
                  type="date"
                  name="date"
                  value={editData.date}
                  onChange={handleModalInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  პატიების ტიპი
                </label>
                <select
                  name="forgive_type_id"
                  value={editData.forgive_type_id}
                  onChange={handleModalInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">აირჩიე პატიების ტიპი</option>
                  {forgiveTypeItems &&
                    forgiveTypeItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  კომენტარი
                </label>
                <textarea
                  name="comment"
                  value={editData.comment}
                  onChange={handleModalInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleModalClose}
                >
                  გამოსვლა
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleModalSave}
                >
                  შენახვა
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
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

export default GeneralReport;




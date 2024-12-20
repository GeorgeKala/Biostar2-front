// import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
// import ArrowDownIcon from '../../../assets/arrow-down-2.png';
// import GeneralInputGroup from '../../../components/GeneralInputGroup';
// import SearchIcon from '../../../assets/search.png';
// import EmployeeModal from '../../../components/employee/EmployeeModal';
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import DeleteIcon from "../../../assets/delete.png";
// import * as XLSX from "xlsx";
// import NestedDropdownModal from '../../../components/NestedDropdownModal';
// import DepartmentInput from '../../../components/DepartmentInput';
// import EmployeeInput from '../../../components/employee/EmployeeInput';
// import {fetchCommentedDetails, removeComment } from '../../../redux/commentSlice';
// import reportService from '../../../services/report';

// const CommentTable = () => {
//     const user = useSelector((state) => state.user.user);
//     const commentedDetails = useSelector((state) => state.comments.commentedDetails);
//     const { departments, nestedDepartments } = useSelector((state) => state.departments);
//     const forgiveTypeItems = useSelector((state) => state.forgiveTypes.forgiveTypes);
//     const [selectedComment, setSelectedComment] = useState(null)
//     const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
//     const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
//     const dispatch = useDispatch();
//     const [filters, setFilters] = useState({
//       start_date: "",
//       end_date: "",
//       department_id: user?.user_type?.has_full_access
//         ? ""
//         : user?.department?.id,
//       forgive_type_id: "",
//       employee_id: "",
//     });

    
    
    

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFilters({
//             ...filters,
//             [name]: value.trim()
//         });
//     };

//     const handleSubmit = async (e) => {
//         const data = {};
    
//         if (filters.start_date) {
//             data.start_date = filters.start_date;
//         }
    
//         if (filters.end_date) {
//             data.end_date = filters.end_date;
//         }
    
//         if (filters.department_id) {
//             data.department_id = filters.department_id;
//         }
    
//         if (filters.forgive_type_id) {
//             data.forgive_type_id = filters.forgive_type_id;
//         }
    
    
//         if (filters.employee_id) {
//             data.employee_id = filters.employee_id;
//         }
    
//         e.preventDefault();
//         try {
//           dispatch(fetchCommentedDetails())
//         } catch (error) {
//             console.error('Error fetching commented details:', error);
//         }
//     };

//     const openModal = () => {
//         setEmployeeModalOpen(true);
//     };

//     const closeModal = () => {
//         setEmployeeModalOpen(false);
//     };

//     const handleEmployeeSelect = (employee) => {
//         setFilters({
//             ...filters,
//             employee_id: employee.id,
//             employee: employee.fullname
//         });
//     }

   

//     const handleDelete = async () => {
//       try {
//          await reportService.deleteDayDetail(selectedComment.id );
//         dispatch(removeComment(selectedComment.id));
//       } catch (error) {
//         console.error("Error deleting comment:", error);
//       }
//     };
   

//     const exportToExcel = () => {
//       const dataToExport = [];

//       const header = columns;
//       dataToExport.push(header);

//       details.forEach((item) => {
//         const row = [
//           item.employee,
//           item.department,
//           item.forgive_type,
//           item.user,
//           item.created_at,
//           item.comment,
//         ];
//         dataToExport.push(row);
//       });

//       const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Comments");

//       XLSX.writeFile(workbook, "Comments.xlsx");
//     };

//     const handleDepartmentSelect = (departmentId, departmentName) => {
//       setFilters((prevData) => ({
//         ...prevData,
//         department_id: departmentId,
//       }));
//       setOpenNestedDropdown(false);
//     };

//     const handleClear = (field) => {
//       setFilters((prevData) => ({
//         ...prevData,
//         [field]: "",
//       }));
//     };

//     const filteredNestedDepartments = user?.user_type?.has_full_access
//       ? nestedDepartments
//       : nestedDepartments.filter(
//           (dept) =>
//             dept.id === user?.department?.id ||
//             dept.parent_id === user?.department?.id
//         );


//       const tableHeaders = [
//         {
//           label: "თანამშრომელი",
//           key: "employee",
//           extractValue: (comment) => comment.employee,
//         },
//         {
//           label: "დეპარტამენტი",
//           key: "department",
//           extractValue: (comment) => comment.department,
//         },
//         {
//           label: "პატიების ტიპი",
//           key: "forgive_type",
//           extractValue: (comment) => comment.forgive_type,
//         },
//         {
//           label: "მომხმარებელი",
//           key: "user",
//           extractValue: (comment) => comment.user,
//         },
//         {
//           label: "ჩაწერის თარიღი",
//           key: "created_at",
//           extractValue: (comment) => comment.created_at,
//         },
//         {
//           label: "კომენტარი",
//           key: "comment",
//           extractValue: (comment) => comment.comment,
//         },
//       ];

//     return (
//       <AuthenticatedLayout>
//         <div className="w-full px-20 py-4 flex flex-col gap-8">
//           <div className="flex justify-between w-full">
//             <h1 className="text-[#1976D2] font-medium text-[23px]">
//               კომენტარების ცხრილი
//             </h1>
//             <button
//               onClick={exportToExcel}
//               className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
//             >
//               ჩამოტვირთვა
//               <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
//               <span className="absolute inset-0 border border-white border-dashed rounded"></span>
//             </button>
//           </div>
//           <div className="flex items-center gap-4">
//             <GeneralInputGroup
//               name="start_date"
//               placeholder="Start Date"
//               type="date"
//               value={filters.start_date}
//               onChange={handleInputChange}
//             />
//             <GeneralInputGroup
//               name="end_date"
//               placeholder="End Date"
//               type="date"
//               value={filters.end_date}
//               onChange={handleInputChange}
//             />
//             <DepartmentInput
//               value={
//                 departments.find((d) => d.id === filters.department_id)?.name ||
//                 ""
//               }
//               onClear={() => handleClear("department_id")}
//               onSearchClick={() => setOpenNestedDropdown(true)}
//             />
//             <div className="w-full flex flex-col gap-2">
//               <select
//                 id="forgive_type_id"
//                 name="forgive_type_id"
//                 value={filters.forgive_type_id}
//                 onChange={handleInputChange}
//                 className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
//               >
//                 <option value="">აირჩიეთ პატიების ტიპი</option>
//                 {forgiveTypeItems &&
//                   forgiveTypeItems.map((item) => (
//                     <option key={item.id} value={item.id}>
//                       {item.name}
//                     </option>
//                   ))}
//               </select>
//             </div>
//             {/* <div className="w-full flex flex-col gap-2 relative">
//               <div className="flex">
//                 <input
//                   className="bg-white border border-[#105D8D] outline-none rounded-l py-3 px-4 w-full pr-10"
//                   placeholder="თანამშრომელი"
//                   value={filters.employee}
//                   onChange={handleInputChange}
//                   readOnly
//                 />
//                 {filters.employee && (
//                   <button
//                     type="button"
//                     onClick={() => handleClear("employee")}
//                     className="absolute right-12 top-[50%] transform -translate-y-1/2 mr-4"
//                   >
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="black"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M6 18L18 6M6 6l12 12"
//                       ></path>
//                     </svg>
//                   </button>
//                 )}
//                 <button
//                   onClick={openModal}
//                   className="bg-[#105D8D] px-4 rounded-r"
//                 >
//                   <img className="w-[20px]" src={SearchIcon} alt="" />
//                 </button>
//               </div>
//             </div> */}
//             <EmployeeInput
//               value={filters.employee}
//               onClear={() => handleClear("employee")}
//               onSearchClick={openModal}
//               onChange={handleInputChange}
//             />
//             <button
//               className="bg-[#1AB7C1] rounded-lg px-8 py-4"
//               onClick={handleSubmit}
//             >
//               <img src={SearchIcon} className="w-[100px]" alt="Search Icon" />
//             </button>
//           </div>
//           <div className="flex justify-end">
//             <button
//               onClick={handleDelete}
//               className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2"
//             >
//               <img src={DeleteIcon} alt="Delete" />
//               წაშლა
//             </button>
//           </div>
//           <div className="container mx-auto  overflow-x-auto">
//             <div className="min-w-max">
//               <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
//                 <thead className="bg-[#1976D2] text-white">
//                   <tr>
//                     {[
//                       "თანამშრომელი",
//                       "დეპარტამენტი",
//                       "პატიების ტიპი",
//                       "მომხმარებელი",
//                       "ჩაწერის თარიღი",
//                       "კომენტარი",
//                     ].map((header) => (
//                       <th
//                         key={header}
//                         className="px-4 py-2 border border-gray-200 w-1/6 truncate"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {commentedDetails &&
//                     commentedDetails.map((item) => (
//                       <tr
//                         key={item.id}
//                         onClick={() => setSelectedComment(item)}
//                         className={`${
//                           selectedComment && selectedComment.id === item.id
//                             ? "bg-blue-200"
//                             : ""
//                         }`}
//                       >
//                         <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
//                           {item.employee}
//                         </td>
//                         <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
//                           {item.department}
//                         </td>
//                         <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
//                           {item.forgive_type}
//                         </td>
//                         <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
//                           {item.user}
//                         </td>
//                         <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
//                           {item.created_at}
//                         </td>
//                         <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">
//                           {item.comment}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//               {/* <Table
//                 data={commentedDetails}
//                 headers={tableHeaders}
//                 onRowClick={(item) => setSelectedComment(item)}
//                 rowClassName={(item) =>
//                   selectedComment?.id === item.id ? "bg-blue-200" : ""
//                 }
//               /> */}
//             </div>
//           </div>
//         </div>
//         {openNestedDropdown && (
//           <NestedDropdownModal
//             header="დეპარტამენტები"
//             isOpen={openNestedDropdown}
//             onClose={() => setOpenNestedDropdown(false)}
//             onSelect={handleDepartmentSelect}
//             data={filteredNestedDepartments}
//             link={"/departments"}
//           />
//         )}
//         <EmployeeModal
//           isOpen={employeeModalOpen}
//           onClose={closeModal}
//           onSelectEmployee={handleEmployeeSelect}
//         />
//       </AuthenticatedLayout>
//     );
// };

// export default CommentTable;


import React, { useState, useCallback } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../../assets/arrow-down-2.png";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import SearchIcon from "../../../assets/search.png";
import EmployeeModal from "../../../components/employee/EmployeeModal";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "../../../assets/delete.png";
import * as XLSX from "xlsx";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import DepartmentInput from "../../../components/DepartmentInput";
import EmployeeInput from "../../../components/employee/EmployeeInput";
import {
  fetchCommentedDetails,
  removeComment,
} from "../../../redux/commentSlice";
import Table from "../../../components/Table";
import { useFilter } from "../../../hooks/useFilter";
import useFilterAndSort from "../../../hooks/useFilterAndSort";
import FilterModal from "../../../components/FilterModal";
import reportService from "../../../services/report";

const CommentTable = () => {
  const user = useSelector((state) => state.user.user);
  const commentedDetails = useSelector(
    (state) => state.comments.commentedDetails
  );
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const forgiveTypeItems = useSelector(
    (state) => state.forgiveTypes.forgiveTypes
  );
  const dispatch = useDispatch();

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
    forgive_type_id: "",
    employee_id: "",
  });

  const { filters, handleInputChange, applyModalFilters } = useFilter({
    employee: { text: formData.employee_id, selected: [] },
    department: { text: formData.department_id, selected: [] },
    forgive_type: { text: formData.forgive_type_id, selected: [] },
    user: { text: "", selected: [] },
    created_at: { text: "", selected: [] },
    comment: { text: "", selected: [] },
  });

  const {
    filteredAndSortedData: filteredComments,
    handleSort,
    sortConfig,
  } = useFilterAndSort(commentedDetails, filters, {
    key: "",
    direction: "ascending",
  });

  const handleOpenFilterModal = useCallback((data, fieldName, rect) => {
    const uniqueData = [...new Set(data)];
    setFilterableData(uniqueData);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  }, []);

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
            employee: employee.fullname
        });
    }

  const handleClear = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: "",
    }));
  };

  const handleSubmit = () => {
    dispatch(fetchCommentedDetails(formData));
  };

  const handleDelete = async () => {
    try {
      await reportService.deleteDayDetail(selectedComment.id);
      dispatch(removeComment(selectedComment.id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const exportToExcel = () => {
    const dataToExport = [
      [
        "თანამშრომელი",
        "დეპარტამენტი",
        "პატიების ტიპი",
        "მომხმარებელი",
        "ჩაწერის თარიღი",
        "კომენტარი",
      ],
      ...filteredComments.map((item) => [
        item.employee,
        item.department,
        item.forgive_type,
        item.user,
        item.created_at,
        item.comment,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comments");
    XLSX.writeFile(workbook, "Comments.xlsx");
  };

  const tableHeaders = [
    {
      label: "თანამშრომელი",
      key: "employee",
      extractValue: (comment) => comment.employee,
    },
    {
      label: "დეპარტამენტი",
      key: "department",
      extractValue: (comment) => comment.department,
    },
    {
      label: "პატიების ტიპი",
      key: "forgive_type",
      extractValue: (comment) => comment.forgive_type,
    },
    {
      label: "მომხმარებელი",
      key: "user",
      extractValue: (comment) => comment.user,
    },
    {
      label: "ჩაწერის თარიღი",
      key: "created_at",
      extractValue: (comment) => comment.created_at,
    },
    {
      label: "კომენტარი",
      key: "comment",
      extractValue: (comment) => comment.comment,
    },
  ];


  console.log(formData);
  

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            კომენტარების ცხრილი
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
          <select
            id="forgive_type_id"
            name="forgive_type_id"
            value={formData.forgive_type_id}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                forgive_type_id: e.target.value,
              }))
            }
            className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
          >
            <option value="">აირჩიეთ პატიების ტიპი</option>
            {forgiveTypeItems &&
              forgiveTypeItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <EmployeeInput
            value={formData.employee}
            onClear={() => handleClear("employee")}
            onSearchClick={() => setEmployeeModalOpen(true)}
          />
          <button
            className="bg-[#1AB7C1] rounded-lg px-8 py-6"
            onClick={handleSubmit}
          >
            <img src={SearchIcon}   alt="Search Icon" />
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <img src={DeleteIcon} alt="Delete" />
            წაშლა
          </button>
        </div>

        <Table
          data={filteredComments}
          headers={tableHeaders}
          filters={filters}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterClick={handleOpenFilterModal}
          onFilterChange={handleInputChange}
          rowClassName={(comment) =>
            selectedComment?.id === comment.id ? "bg-blue-200" : ""
          }
          onRowClick={(comment) => setSelectedComment(comment)}
          filterableFields={[
            "employee",
            "department",
            "forgive_type",
            "user",
            "created_at",
            "comment",
          ]}
        />

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
      </div>
    </AuthenticatedLayout>
  );
};

export default CommentTable;







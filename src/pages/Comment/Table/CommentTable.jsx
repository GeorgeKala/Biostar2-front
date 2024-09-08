import React, { useState, useCallback } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import SearchIcon from "../../../assets/search.png";
import EmployeeModal from "../../../components/employee/EmployeeModal";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "../../../assets/delete.png";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import DepartmentInput from "../../../components/DepartmentInput";
import EmployeeInput from "../../../components/employee/EmployeeInput";
import {
  fetchCommentedDetails,
  removeComment,
} from "../../../redux/commentSlice";
import Table from "../../../components/Table";
import { useFilterAndSort } from "../../../hooks/useFilterAndSort";
import FilterModal from "../../../components/FilterModal";
import reportService from "../../../services/report";
import ExcelJS from "exceljs";
import CustomSelect from "../../../components/CustomSelect";


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

  const initialFilters = {
    employee: { text: formData.employee_id, selected: [] },
    department: { text: formData.department_id, selected: [] },
    forgive_type: { text: formData.forgive_type_id, selected: [] },
    user: { text: "", selected: [] },
    created_at: { text: "", selected: [] },
    comment: { text: "", selected: [] },
  };

  const {
    filteredAndSortedData: filteredComments,
    handleInputChange,
    applyModalFilters,
    handleSort,
    filters,
    sortConfig,
  } = useFilterAndSort(commentedDetails, initialFilters, {
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
    setFormData((prevData) => ({
      ...prevData,
      employee_id: employee.id,
      employee: employee.fullname,
    }));
  };

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

  const exportToExcel = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Comments");

    // Set a uniform width for all columns
    const uniformWidth = 30;

    worksheet.columns = [
      { header: "თანამშრომელი", key: "employee", width: uniformWidth },
      { header: "დეპარტამენტი", key: "department", width: uniformWidth },
      { header: "პატიების ტიპი", key: "forgive_type", width: uniformWidth },
      { header: "მომხმარებელი", key: "user", width: uniformWidth },
      { header: "ჩაწერის თარიღი", key: "created_at", width: uniformWidth },
      { header: "კომენტარი", key: "comment", width: uniformWidth },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    filteredComments.forEach((comment) => {
      worksheet.addRow({
        employee: comment.employee,
        department: comment.department,
        forgive_type: comment.forgive_type,
        user: comment.user,
        created_at: comment.created_at,
        comment: comment.comment,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Comments.xlsx";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredComments]);

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
          {/* <select
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
          </select> */}
          <CustomSelect
            options={forgiveTypeItems}
            selectedValue={
              forgiveTypeItems.find(
                (item) => item.id === formData.forgive_type_id
              )?.name || "აირჩიეთ პატიების ტიპი"
            }
            onSelect={(e) =>
              setFormData((prev) => ({
                ...prev,
                forgive_type_id: e.target.value,
              }))
            }
            placeholder="აირჩიეთ პატიების ტიპი"
          />
          <EmployeeInput
            value={formData.employee}
            onClear={() => handleClear("employee")}
            onSearchClick={() => setEmployeeModalOpen(true)}
          />
          <button
            className="bg-[#1AB7C1] rounded-lg min-w-[75px] flex items-center justify-center py-2"
            onClick={handleSubmit}
          >
            <img src={SearchIcon} alt="Search Icon" />
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

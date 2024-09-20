import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import SearchIcon from "../../../assets/search.png";
import commentService from "../../../services/comment";
import EmployeeModal from "../../../components/employee/EmployeeModal";
import { useSelector } from "react-redux";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import DepartmentInput from "../../../components/DepartmentInput";
import EmployeeInput from "../../../components/employee/EmployeeInput";
import CustomSelect from "../../../components/CustomSelect";
import ExcelJS from "exceljs";
import { useFormData } from "../../../hooks/useFormData";  // Import the custom hook

const CommentAnalyze = () => {
  const user = useSelector((state) => state.user.user);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const forgiveTypes = useSelector(
    (state) => state.forgiveTypes.forgiveTypes
  );
  const [loading, setLoading] = useState(false);
  const [groupedComments, setGroupedComments] = useState({});
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);

  // Initialize formData using the custom useFormData hook
  const {
    formData: filters,
    handleFormDataChange,
    clearFormData,
    setFormData,
  } = useFormData({
    start_date: "",
    end_date: "",
    department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
    forgive_type_id: "",
    employee_id: "",
  });

  const monthNamesGeorgian = {
    January: "იანვარი",
    February: "თებერვალი",
    March: "მარტი",
    April: "აპრილი",
    May: "მაისი",
    June: "ივნისი",
    July: "ივლისი",
    August: "აგვისტო",
    September: "სექტემბერი",
    October: "ოქტომბერი",
    November: "ნოემბერი",
    December: "დეკემბერი",
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    const monthName = date.toLocaleString("en-US", { month: "long" });
    return monthNamesGeorgian[monthName];
  };

  const monthName = filters.start_date
    ? getMonthName(filters.start_date)
    : "თვე";

  const getAnalyzedComments = async () => {
    setLoading(true);
    try {
      const data = await commentService.fetchAnalyzedComments(filters);
      const groupedData = transformData(data);
      setGroupedComments(groupedData);
    } catch (error) {
      console.error("Failed to fetch analyzed comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const transformData = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const employee = item.employee_fullname;
      if (!groupedData[employee]) {
        groupedData[employee] = { count: 0, total: 0 };
      }
      groupedData[employee].count += 1;
      groupedData[employee].total += item.final_penalized_time;
    });
    return groupedData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getAnalyzedComments();
  };

  const totalCounts = Object.values(groupedComments).reduce(
    (acc, details) => acc + details.count,
    0
  );
  const totalMinutes = Object.values(groupedComments).reduce(
    (acc, details) => acc + details.total,
    0
  );

  const handleDepartmentSelect = (department) => {
    setFormData((prevFilters) => ({
      ...prevFilters,
      department_id: department.id,
    }));
    setOpenNestedDropdown(false);
  };

  const handleClear = (field) => {
    setFormData((prevFilters) => ({
      ...prevFilters,
      [field]: "",
    }));
  };

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Comments Analysis");

    worksheet.columns = [
      { header: "თანამშრომელი", key: "employee", width: 30 },
      { header: "რაოდენობა", key: "count", width: 20 },
      { header: "გაცდენილი წუთები", key: "total", width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    Object.entries(groupedComments).forEach(([employee, details]) => {
      worksheet.addRow({
        employee: employee,
        count: details.count,
        total: details.total,
      });
    });

    worksheet
      .addRow({
        employee: "ჯამი",
        count: totalCounts,
        total: totalMinutes,
      })
      .font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Comments_Analysis.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">კომენტარების ანალიზი</h1>
          <button
            onClick={handleExportToExcel}
            className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
          >
            ჩამოტვირთვა
            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
          </button>
        </div>
        <form className="flex items-center gap-4" onSubmit={handleSubmit}>
          <GeneralInputGroup
            name="start_date"
            placeholder="დაწყების თარიღი"
            type="date"
            value={filters.start_date}
            onChange={handleFormDataChange}
          />
          <GeneralInputGroup
            name="end_date"
            placeholder="დასრულების თარიღი"
            type="date"
            value={filters.end_date}
            onChange={handleFormDataChange}
          />
          <DepartmentInput
            value={departments.find((d) => d.id === filters.department_id)?.name || ""}
            onClear={() => handleClear("department_id")}
            onSearchClick={() => setOpenNestedDropdown(true)}
          />
          <CustomSelect
            options={forgiveTypes}
            selectedValue={forgiveTypes.find(
              (item) => item.id === filters.forgive_type_id
            )?.name || ""}
            onSelect={(option) =>
              setFormData((prev) => ({
                ...prev,
                forgive_type_id: option.id,
              }))
            }
            placeholder="აირჩიეთ პატიების ტიპი"
          />
          <EmployeeInput
            value={filters.employee_fullname}
            onClear={() => handleClear("employee_fullname")}
            onSearchClick={() => setIsEmployeeModalOpen(true)}
            placeholder="თანამშრომელი"
          />
          <button
            type="submit"
            className="bg-[#1AB7C1] rounded-lg min-w-[75px] flex items-center justify-center py-2"
          >
            <img src={SearchIcon} alt="ძიების ხატულა" />
          </button>
        </form>
        {/* Table rendering logic here */}
      </div>
      {isEmployeeModalOpen && (
        <EmployeeModal
          isOpen={isEmployeeModalOpen}
          onClose={() => setIsEmployeeModalOpen(false)}
          onSelectEmployee={(employee) =>
            setFormData({
              ...filters,
              employee_id: employee.id,
              employee_fullname: employee.fullname,
            })
          }
        />
      )}
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
    </AuthenticatedLayout>
  );
};

export default CommentAnalyze;

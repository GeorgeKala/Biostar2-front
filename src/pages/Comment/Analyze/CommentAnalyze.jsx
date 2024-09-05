import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import SearchIcon from "../../../assets/search.png";
import commentService from "../../../services/comment";
import EmployeeModal from "../../../components/employee/EmployeeModal";
  import ExcelJS from "exceljs";
import { useSelector } from "react-redux";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import DepartmentInput from "../../../components/DepartmentInput";
import EmployeeInput from "../../../components/employee/EmployeeInput";
import CustomSelect from "../../../components/CustomSelect";

const CommentAnalyze = () => {
  const user = useSelector((state) => state.user.user);
  const [commentedDetails, setCommentedDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupedComments, setGroupedComments] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const forgiveTypes = useSelector((state) => state.forgiveTypes.forgiveTypes);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
    forgive_type_id: "",
    employee_id: "",
    employee_fullname: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const getAnalyzedComments = async () => {
    setLoading(true);
    try {
      const data = await commentService.fetchAnalyzedComments(filters);
      const { groupedData, uniqueDates } = transformData(data);
      setCommentedDetails(data);
      setGroupedComments(groupedData);
      setUniqueDates(uniqueDates);
    } catch (error) {
      console.error("Error fetching analyzed comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getAnalyzedComments();
  };

  useEffect(() => {
    getAnalyzedComments();
  }, []);

  const transformData = (data) => {
    const groupedData = {};
    const uniqueDates = new Set();

    data.forEach((item) => {
      const date = new Date(item.date).getDate();
      uniqueDates.add(date);
      if (!groupedData[item.employee_fullname]) {
        groupedData[item.employee_fullname] = { times: {}, total: 0 };
      }
      groupedData[item.employee_fullname].times[date] =
        item.final_penalized_time;
      groupedData[item.employee_fullname].total += item.final_penalized_time;
    });

    return {
      groupedData,
      uniqueDates: Array.from(uniqueDates).sort((a, b) => a - b),
    };
  };

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

  const handleEmployeeSelect = (employee) => {
    setFilters({
      ...filters,
      employee_id: employee.id,
      employee_fullname: employee.fullname,
    });
  };


  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Comments Analysis");

    // Define the columns and add styles to the header
    worksheet.columns = [
      { header: "თანამშრომელი", key: "employee", width: 30 },
      ...uniqueDates.map((date) => ({
        header: date.toString(),
        key: `date_${date}`,
        width: 15,
      })),
      { header: monthName, key: "total", width: 15 },
    ];

    // Style for the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Adding data rows
    Object.keys(groupedComments).forEach((employeeFullname) => {
      const rowValues = {
        employee: employeeFullname,
        total: groupedComments[employeeFullname].total,
      };

      uniqueDates.forEach((date) => {
        rowValues[`date_${date}`] =
          groupedComments[employeeFullname].times[date] || "";
      });

      worksheet.addRow(rowValues);
    });

    // Style all data rows
    worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
      row.eachCell({ includeEmpty: true }, function (cell) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    // Write to Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Comments_Analysis.xlsx";
    link.click();
  };


  const handleDepartmentSelect = (departmentId) => {
    setFilters((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  };

  const handleClear = (field) => {
    setFilters((prevData) => ({
      ...prevData,
      [field]: "",
    }));
  };

  const filteredNestedDepartments = user?.user_type?.has_full_access
    ? nestedDepartments
    : nestedDepartments.filter(
        (dept) =>
          dept.id === user?.department?.id ||
          dept.parent_id === user?.department?.id
      );


    const handleForgiveTypeSelect = (option) => {
      setFilters({
        ...filters,
        forgive_type_id: option.id,
      });
    };
      

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            კომენტარების ანალიზი
          </h1>
          <button
            className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
            onClick={exportToExcel}
          >
            ჩამოტვირთვა
            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
          </button>
        </div>
        <form className="flex items-center gap-4" onSubmit={handleSubmit}>
          <GeneralInputGroup
            name="start_date"
            placeholder="Start Date"
            type="date"
            value={filters.start_date}
            onChange={handleInputChange}
          />
          <GeneralInputGroup
            name="end_date"
            placeholder="End Date"
            type="date"
            value={filters.end_date}
            onChange={handleInputChange}
          />
          <DepartmentInput
            value={
              departments.find((d) => d.id === filters.department_id)?.name ||
              ""
            }
            onClear={() => handleClear("department_id")}
            onSearchClick={() => setOpenNestedDropdown(true)}
          />
          {/* <div className="w-full flex flex-col gap-2">
            <select
              id="forgive_type_id"
              name="forgive_type_id"
              value={filters.forgive_type_id}
              onChange={handleInputChange}
              className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
            >
              <option value="">აირჩიეთ პატიების ტიპი</option>
              {forgiveTypes &&
                forgiveTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div> */}
          <CustomSelect
            options={forgiveTypes}
            selectedValue={
              forgiveTypes.find((item) => item.id === filters.forgive_type_id)
                ?.name || "აირჩიეთ პატიების ტიპი"
            }
            onSelect={handleForgiveTypeSelect}
            placeholder="აირჩიეთ პატიების ტიპი"
          />
          <EmployeeInput
            value={filters.employee_fullname}
            onClear={() => handleClear("employee_fullname")}
            onSearchClick={() => setIsEmployeeModalOpen(true)}
            placeholder="თანამშრომელი"
          />
          <button className="bg-[#1AB7C1] rounded-lg px-6 py-3">
            <img src={SearchIcon} className="w-[140px]" alt="Search Icon" />
          </button>
        </form>
        <div className="container mx-auto mt-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-collapse border border-gray-200">
            <thead className="bg-[#1976D2] text-white">
              <tr>
                <th className="w-24 border border-gray-200 px-3">
                  თანამშრომელი
                </th>
                {uniqueDates.map((date) => (
                  <th key={date} className="border border-gray-200">
                    {date}
                  </th>
                ))}
                <th className="border text-center border-gray-200">
                  {monthName}
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedComments).map((employeeFullname) => (
                <tr key={employeeFullname}>
                  <td className="w-24 border text-center border-gray-200">
                    {employeeFullname}
                  </td>
                  {uniqueDates.map((date) => (
                    <td
                      key={date}
                      className="border text-center border-gray-200"
                    >
                      {groupedComments[employeeFullname].times[date] !==
                      undefined
                        ? groupedComments[employeeFullname].times[date]
                        : ""}
                    </td>
                  ))}
                  <td className="border text-center border-gray-200">
                    {groupedComments[employeeFullname].total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSelectEmployee={handleEmployeeSelect}
      />
    </AuthenticatedLayout>
  );
};

export default CommentAnalyze;

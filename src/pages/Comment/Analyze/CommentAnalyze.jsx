import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../../assets/arrow-down-2.png";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import SearchButton from "../../../components/SearchButton";
import GeneralSelectGroup from "../../../components/GeneralSelectGroup";
import commentService from "../../../services/comment";
import departmentService from "../../../services/department";
import forgiveTypeService from "../../../services/forgiveType";
import EmployeeModal from "../../../components/employee/EmployeeModal";
import * as XLSX from "xlsx";

const CommentAnalyze = () => {
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    department_id: "",
    forgive_type_id: "",
    employee_id: "",
    employee_fullname: "",
  });
  const [commentedDetails, setCommentedDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupedComments, setGroupedComments] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [forgiveTypes, setForgiveTypes] = useState([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

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
      console.log(filters);
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
    : "Month";

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await departmentService.getAllDepartments();
      setDepartments(response);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchForgiveTypes = async () => {
      const response = await forgiveTypeService.getAllForgiveTypes();
      setForgiveTypes(response);
    };

    fetchForgiveTypes();
  }, []);

  const handleEmployeeSelect = (employee) => {
    setFilters({
      ...filters,
      employee_id: employee.id,
      employee_fullname: employee.fullname,
    });
  };

  const exportToExcel = () => {
    const dataToExport = [];

    // Add header row
    const header = ["თანამშრომელი", ...uniqueDates, monthName];
    dataToExport.push(header);

    Object.keys(groupedComments).forEach((employeeFullname) => {
      const row = [employeeFullname];
      uniqueDates.forEach((date) => {
        row.push(groupedComments[employeeFullname].times[date] || "");
      });
      row.push(groupedComments[employeeFullname].total);
      dataToExport.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comments Analysis");

    XLSX.writeFile(workbook, "Comments_Analysis.xlsx");
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
            ჩაოტვირთვა
            <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
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
          <div className="w-full flex flex-col gap-2">
            <select
              id="department_id"
              name="department_id"
              value={filters.department_id}
              onChange={handleInputChange}
              className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
            >
              <option value="">აირჩიეთ დეპარტამენტი</option>
              {departments &&
                departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-full flex flex-col gap-2">
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
          </div>
          <div className="w-full" onClick={() => setIsEmployeeModalOpen(true)}>
            {" "}
            <GeneralInputGroup
              name="employee_fullname"
              placeholder="თანამშრომელი"
              type="text"
              value={filters.employee_fullname}
              readOnly
            />
          </div>

          <SearchButton></SearchButton>
        </form>
        <div className="container mx-auto mt-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-collapse border border-gray-200">
            <thead className="bg-[#1976D2] text-white">
              <tr>
                <th className="w-24 border border-gray-200">თანამშრომელი</th>
                {uniqueDates.map((date) => (
                  <th key={date} className="border border-gray-200">
                    {date}
                  </th>
                ))}
                <th className="border border-gray-200">{monthName}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedComments).map((employeeFullname) => (
                <tr key={employeeFullname}>
                  <td className="w-24 border border-gray-200">
                    {employeeFullname}
                  </td>
                  {uniqueDates.map((date) => (
                    <td key={date} className="border border-gray-200">
                      {groupedComments[employeeFullname].times[date] !==
                      undefined
                        ? groupedComments[employeeFullname].times[date]
                        : ""}
                    </td>
                  ))}
                  <td className="border border-gray-200">
                    {groupedComments[employeeFullname].total}
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
    </AuthenticatedLayout>
  );
};

export default CommentAnalyze;

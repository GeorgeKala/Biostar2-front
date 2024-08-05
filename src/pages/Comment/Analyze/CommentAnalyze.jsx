import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../../assets/arrow-down-2.png";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import SearchButton from "../../../components/SearchButton";
import commentService from "../../../services/comment";
import EmployeeModal from "../../../components/employee/EmployeeModal";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import SearchIcon from '../../../assets/search.png';

const CommentAnalyze = () => {
  const user = useSelector((state) => state.user.user);
  const [commentedDetails, setCommentedDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupedComments, setGroupedComments] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
  const { departments, nestedDepartments } = useSelector((state) => state.departments);
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

  const exportToExcel = () => {
    const dataToExport = [];

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

  const handleDepartmentSelect = (departmentId, departmentName) => {
    setFilters((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  };


  const handleClearDepartment = () => {
    setFilters((prevData) => ({
      ...prevData,
      department_id: "",
    }));
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
           <div className="w-full flex flex-col gap-2 relative">
              <div className="flex">
                <input 
                  className="bg-white border border-[#105D8D] outline-none rounded-l py-3 px-4 w-full pr-10"
                  placeholder="დეპარტამენტი"
                  value={departments.find((d) => d.id === filters.department_id)?.name || ""}
                  readOnly
                />
                {filters.department_id && (
                  <button
                    type="button"
                    onClick={handleClearDepartment}
                    className="absolute right-12 top-[50%] transform -translate-y-1/2 mr-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
                <button onClick={() => setOpenNestedDropdown(true)} className="bg-[#105D8D] px-4 rounded-r">
                  <img className="w-[20px]" src={SearchIcon} alt="" />
                </button>
              </div>
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
                <th className="border text-center border-gray-200">{monthName}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedComments).map((employeeFullname) => (
                <tr key={employeeFullname}>
                  <td className="w-24 border text-center border-gray-200">
                    {employeeFullname}
                  </td>
                  {uniqueDates.map((date) => (
                    <td key={date} className="border text-center border-gray-200">
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
            data={nestedDepartments}
            link={'/departments'}
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

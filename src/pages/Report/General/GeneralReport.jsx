import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
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
import SearchIcon from "../../../assets/search.png";
import reportService from "../../../services/report";
import ExcelJS from "exceljs";
import { useFormData } from "../../../hooks/useFormData";


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

  // const [formData, setFormData] = useState({
  //   start_date: "",
  //   end_date: "",
  //   department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
  //   employee: "",
  // });


  const { formData, handleFormDataChange, setFormData } = useFormData({
    start_date: "",
    end_date: "",
    department_id: user?.user_type?.has_full_access == 1 ? "" : user?.department?.id,
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
          employee_id: editData.employee_id,
          date: editData.date,
          comment: response.data.comment,
          forgive_type: response.data.forgive_type,
          day_type_id: response.data.day_type_id,
          ...editData,
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

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("General Report");

    worksheet.columns = [
      { header: "სახელი/გვარი", key: "fullname", width: 30 },
      { header: "დეპარტამენტი", key: "department", width: 30 },
      { header: "თანამდებობა", key: "position", width: 20 },
      { header: "თარიღი", key: "date", width: 15 },
      { header: "მოსვლის დრო", key: "come_time", width: 15 },
      { header: "ადრე მოსვლა", key: "come_early", width: 15 },
      { header: "გვიან მოსვლა", key: "come_late", width: 15 },
      { header: "დაგვიანებული წუთები", key: "penalized_time", width: 20 },
      { header: "წასვლის დრო", key: "leave_time", width: 15 },
      { header: "ადრე წასვლა", key: "leave_early", width: 15 },
      { header: "გვიან წასვლა", key: "leave_late", width: 15 },
      { header: "ნამუშევარი საათები", key: "worked_hours", width: 20 },
      { header: "დღის ტიპი", key: "day_type", width: 15 },
      { header: "კვირის დღე", key: "week_day", width: 15 },
      { header: "საპატიო წუთები", key: "homorable_minutes", width: 20 },
      { header: "განრიგი", key: "schedule", width: 20 },
      { header: "საჯარიმო დრო", key: "final_penalized_time", width: 20 },
      { header: "კომენტარი", key: "comment", width: 40 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    filteredAndSortedData.forEach((report) => {
      worksheet.addRow({
        fullname: report.fullname,
        department: report.department,
        position: report.position,
        date: report.date,
        come_time: report.come_time,
        come_early: report.come_early,
        come_late: report.come_late,
        penalized_time: report.penalized_time,
        leave_time: report.leave_time,
        leave_early: report.leave_early,
        leave_late: report.leave_late,
        worked_hours: report.worked_hours,
        day_type: report.day_type,
        week_day: report.week_day,
        homorable_minutes: report.homorable_minutes,
        schedule: report.schedule,
        final_penalized_time: Number(report.final_penalized_time).toFixed(2),
        comment: report.comment,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "General_Report.xlsx";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        !item?.forgive_type) ||
      (item.day_type == "გაცდენა" && !item.day_type_id && !item?.forgive_type)
    ) {
      return "bg-yellow-300";
    } else if (
      (item.final_penalized_time > 0 &&
        item?.forgive_type?.forgive == 0 &&
        !item.day_type_id) ||
      (item.day_type == "გაცდენა" &&
        item?.forgive_type?.forgive == 0 &&
        !item.day_type_id) ||
      (item.final_penalized_time == null &&
        item?.forgive_type?.forgive == 0 &&
        !item.day_type_id)
    ) {
      return "bg-red-300";
    } else if (
      (item.final_penalized_time > 0 &&
        item?.forgive_type?.forgive == 1 &&
        !item.day_type_id) ||
      (item.day_type == "გაცდენა" &&
        item?.forgive_type?.forgive == 1 &&
        !item.day_type_id) ||
      (item.final_penalized_time == null &&
        item?.forgive_type?.forgive == 1 &&
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
  
  const handleClear = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: fieldName === 'department_id' ? '' : fieldName === 'employee_id' ? '' : prevData[fieldName],
    }));
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
            className="bg-[#1AB7C1] rounded-lg min-w-[75px] flex items-center justify-center py-2"
            onClick={handleSubmit}
          >
            <img src={SearchIcon}  alt="Search Icon" />
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




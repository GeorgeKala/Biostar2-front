import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../../assets/arrow-down-2.png";
import GeneralInputGroup from "../../../components/GeneralInputGroup";
import { useEffect, useState } from "react";
import reportService from "../../../services/report";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "../../../redux/departmentsSlice";
import { fetchForgiveTypes } from "../../../redux/forgiveTypeSlice";
import SearchIcon from "../../../assets/search.png";
import EmployeeModal from "../../../components/employee/EmployeeModal";
import { reportLogin } from "../../../services/auth";

const GeneralReport = () => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.departments);
  const forgiveTypeItems = useSelector(
    (state) => state.forgiveTypes.forgiveTypes
  );
  const forgiveTypeStatus = useSelector((state) => state.forgiveTypes.status);

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    department_id: "",
    employee: "",
  });

  const [reports, setReports] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    employee_id: "",
    employee_name: "",
    date: "",
    forgive_type_id: "",
    comment: "",
    final_penalized_time: "",
    comment_datetime: "",
  });
  const [EmployeeModalOpen, setEmployeeModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchForgiveTypes());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {};

      if (formData.start_date) {
        data.start_date = formData.start_date;
      }

      if (formData.end_date) {
        data.end_date = formData.end_date;
      }

      if (formData.department_id) {
        data.department_id = formData.department_id;
      }

      if (formData.employee_id) {
        data.employee_id = formData.employee_id;
      }

      const response = await reportService.fetchMonthlyReports(data);

      setReports(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const handleRowDoubleClick = (report) => {
    setEditData({
      employee_id: report.user_id,
      employee_name: report.fullname,
      date: report.date,
      forgive_type_id: "",
      comment: report.comment,
      final_penalized_time: report.final_penalized_time,
      comment_datetime: report.comment_datetime,
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditData({
      employee_id: "",
      employee_name: "",
      date: "",
      forgive_type_id: "",
      comment: "",
      final_penalized_time: "",
      comment_datetime: "",
    });
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

      setReports((prevReports) =>
        prevReports.map((report) =>
          report.user_id === editData.employee_id &&
          report.date === editData.date
            ? {
                ...report,
                forgive_type_id: editData.forgive_type_id,
                comment: response.data.comment,
                final_penalized_time: editData.final_penalized_time,
                comment_datetime: editData.comment_datetime,
              }
            : report
        )
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

  const openModal = (id) => {
    setEmployeeModalOpen(true);
  };

  const closeModal = () => {
    setEmployeeModalOpen(false);
  };

  const handleEmployeeSelect = (employee) => {
    setFormData({
      ...formData,
      employee_id: employee.id,
      employee: employee.fullname,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await reportLogin();
    };
    if (!sessionStorage.getItem("bs_id_token")) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await reportService.fetchMonthlyReports();
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            პერიოდის რეპორტი (ზოგადი)
          </h1>
          <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
            Download Data
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
          <div className="w-full flex flex-col gap-2">
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
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
          <div onClick={openModal} className="w-full">
            <GeneralInputGroup
              name="employee"
              placeholder="თანამშრომელი"
              type="text"
              value={formData.employee}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="bg-[#1AB7C1] rounded-lg px-8 py-4"
            onClick={handleSubmit}
          >
            <img src={SearchIcon} className="w-[100px]" alt="Search Icon" />
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
                {reports &&
                  reports.map((item, index) => (
                    <tr
                      key={index}
                      className={`px-2 py-1 border border-gray-200 w-20 ${
                        item.final_penalized_time > 0 ? "bg-yellow-300" : ""
                      }`}
                      onDoubleClick={() => handleRowDoubleClick(item)}
                    >
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.fullname}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.department}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.position}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.date}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.come_time}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.come_early}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.come_late}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.penalized_time}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.leave_time}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.leave_early}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.leave_late}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.worked_hours}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.day_type}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.week_day}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.homorable_minutes}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.schedule}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {Number(item.final_penalized_time).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 border border-gray-200 w-20">
                        {item.comment}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
      <EmployeeModal
        isOpen={EmployeeModalOpen}
        onClose={closeModal}
        onSelectEmployee={handleEmployeeSelect}
      />
    </AuthenticatedLayout>
  );
};

export default GeneralReport;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../redux/scheduleSlice";
import * as XLSX from "xlsx";

const Schedule = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const scheduleItems = useSelector((state) => state.schedules.items);
  const scheduleStatus = useSelector((state) => state.schedules.status);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    day_start: '',
    day_end: '',
    repetition_unit: '',
    interval: '',
    comment: ''
  });

  const [filters, setFilters] = useState({
    day_start: '',
    day_end: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (scheduleStatus === "idle") {
      dispatch(fetchSchedules());
    }
  }, [scheduleStatus, dispatch]);

  const openModal = (id) => {
    setEditItemId(id);
    setModalOpen(true);
    const editItem = scheduleItems.find(item => item.id === id);
    if (editItem) {
      setFormData({
        name: editItem.name,
        start_date: editItem.start_date,
        end_date: editItem.end_date,
        day_start: editItem.day_start,
        day_end: editItem.day_end,
        repetition_unit: editItem.repetition_unit,
        interval: editItem.interval,
        comment: editItem.comment
      });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItemId(null);
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      day_start: '',
      day_end: '',
      repetition_unit: '',
      interval: '',
      comment: ''
    });
    setErrors({});
  };

  const handleSaveSchedule = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editItemId) {
      dispatch(
        updateSchedule({ id: editItemId, scheduleData: formData })
      );
    } else {
      dispatch(createSchedule(formData));
    }
    closeModal();
  };

  const handleDeleteSchedule = (id) => {
    dispatch(deleteSchedule(id));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (scheduleItems.some(item => item.name === data.name && item.id !== editItemId)) {
      errors.name = "Name must be unique";
    }

    return errors;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredScheduleItems = scheduleItems.filter(item => {
    const startTimeFilter = filters.day_start ? new Date(`1970-01-01T${item.day_start}`) >= new Date(`1970-01-01T${filters.day_start}`) : true;
    const endTimeFilter = filters.day_end ? new Date(`1970-01-01T${item.day_end}`) <= new Date(`1970-01-01T${filters.day_end}`) : true;
    return startTimeFilter && endTimeFilter;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      scheduleItems.map((item) => ({
        "სახელი": item.name,
        "დაწყების თარიღი": item.start_date,
        "დასრულების თარიღი": item.end_date,
        "დაწყების დრო": item.day_start,
        "დამთავრების დრო": item.day_end,
        "გამეორების ერთეული": item.repetition_unit,
        "ინტერვალი": item.interval,
        "კომენტარი": item.comment,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedules");
    XLSX.writeFile(workbook, "Schedules.xlsx");
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">განრიგები</h1>
          {user.user_type.name == "ადმინისტრატორი" && (
            <div className="flex items-center gap-8">
              <button
                className="bg-[#FBD15B]  text-[#1976D2] px-4 py-4 rounded-md flex items-center gap-2"
                onClick={() => setModalOpen(true)}
              >
                + დაამატე ახალი განრიგი
              </button>
              <button
                onClick={exportToExcel}
                className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
              >
                ჩამოტვირთვა
                <img
                  src={ArrowDownIcon}
                  className="ml-3"
                  alt="Arrow Down Icon"
                />
                <span className="absolute inset-0 border border-white border-dashed rounded"></span>
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-4 mb-4"></div>
        <div className="overflow-x-auto">
          <table className=" w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                  განრიგის სახელი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                  დაწყების თარიღი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                  დასრულების თარიღი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                  დაწყების დრო
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                  დამთავრების დრო
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                  გამეორების ერთეული
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                  ინტერვალი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                  კომენტარი
                </th>
                {user.user_type.name == "ადმინისტრატორი" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider truncate w-1/9">
                    განახლება/წაშლა
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredScheduleItems.map((item) => (
                <tr key={item.id} className="cursor-pointer">
                  <td className="px-6 py-4 truncate w-1/9">
                    <input
                      type="text"
                      value={item.name}
                      className="w-full bg-transparent outline-none"
                      readOnly
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/9 truncate">
                    {item.start_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/9 truncate">
                    {item.end_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/9 truncate">
                    {item.day_start}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/9 truncate">
                    {item.day_end}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/9 truncate">
                    {item.repetition_unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/9 truncate">
                    {item.interval}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/9 truncate">
                    {item.comment}
                  </td>
                  {user.user_type.name == "ადმინისტრატორი" && (
                    <td className="px-6 py-4 flex justify-center gap-3 whitespace-nowrap text-center text-sm font-medium w-1/9">
                      <button
                        onClick={() => openModal(item.id)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none"
                      >
                        <img src={CreateIcon} alt="Edit" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(item.id)}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                      >
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          className="w-5 h-5"
                        />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full ">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {editItemId ? "შეცვალე განრიგი" : "დაამატე ახალი განრიგი"}
              </h2>
              <button
                onClick={closeModal}
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
            <form onSubmit={handleSaveSchedule} className="p-3">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  სახელი:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.name && "border-red-500"
                  }`}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  დაწყების თარიღი:
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  className={`mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.start_date && "border-red-500"
                  }`}
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.start_date}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  დამთავრების თარიღი:
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  className={`mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.end_date && "border-red-500"
                  }`}
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="day_start"
                  className="block text-sm font-medium text-gray-700"
                >
                  დაწყების დრო:
                </label>
                <input
                  type="time"
                  id="day_start"
                  name="day_start"
                  className={`mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.day_start && "border-red-500"
                  }`}
                  value={formData.day_start}
                  onChange={(e) =>
                    setFormData({ ...formData, day_start: e.target.value })
                  }
                />
                {errors.day_start && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.day_start}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="day_end"
                  className="block text-sm font-medium text-gray-700"
                >
                  დამთავრების დრო:
                </label>
                <input
                  type="time"
                  id="day_end"
                  name="day_end"
                  className={`mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.day_end && "border-red-500"
                  }`}
                  value={formData.day_end}
                  onChange={(e) =>
                    setFormData({ ...formData, day_end: e.target.value })
                  }
                />
                {errors.day_end && (
                  <p className="text-red-500 text-sm mt-1">{errors.day_end}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="repetition_unit"
                  className="block text-sm font-medium text-gray-700"
                >
                  გამეორების ერთეული:
                </label>
                <input
                  type="number"
                  id="repetition_unit"
                  name="repetition_unit"
                  className={`mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.repetition_unit && "border-red-500"
                  }`}
                  value={formData.repetition_unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      repetition_unit: e.target.value,
                    })
                  }
                />
                {errors.repetition_unit && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.repetition_unit}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="interval"
                  className="block text-sm font-medium text-gray-700"
                >
                  ინტერვალი:
                </label>
                <input
                  type="number"
                  id="interval"
                  name="interval"
                  className={`mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.interval && "border-red-500"
                  }`}
                  value={formData.interval}
                  onChange={(e) =>
                    setFormData({ ...formData, interval: e.target.value })
                  }
                />
                {errors.interval && (
                  <p className="text-red-500 text-sm mt-1">{errors.interval}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  კომენტარი:
                </label>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  className={`mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.comment && "border-red-500"
                  }`}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default Schedule;

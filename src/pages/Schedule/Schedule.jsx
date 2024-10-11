import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import EditIcon from "../../assets/edit.png";
import DeleteIcon from "../../assets/delete.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../redux/scheduleSlice";
import ExcelJS from "exceljs";
import { useFilterAndSort } from "../../hooks/useFilterAndSort";
import FilterModal from "../../components/FilterModal";
import Table from "../../components/Table";
import ScheduleForm from "../../components/schedule/ScheduleForm";

const Schedule = () => {
  const dispatch = useDispatch();
  const schedules = useSelector((state) => state.schedules.items);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    day_start: "",
    day_end: "",
    repetition_unit: "",
    interval: "",
    comment: "",
  });
  const [oldFormData, setOldFormData] = useState({}); // Store old form data

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");

  const {
    filteredAndSortedData: filteredSchedules,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    filters,
    sortConfig,
  } = useFilterAndSort(
    schedules,
    {
      name: { text: "", selected: [] },
      start_date: { text: "", selected: [] },
      end_date: { text: "", selected: [] },
      day_start: { text: "", selected: [] },
      day_end: { text: "", selected: [] },
      repetition_unit: { text: "", selected: [] },
      interval: { text: "", selected: [] },
      comment: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const openAddModal = () => {
    setIsModalOpen(true);
    setModalMode("create");
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      day_start: "",
      day_end: "",
      repetition_unit: "",
      interval: "",
      comment: "",
    });
    setOldFormData({}); // Reset old data when creating
  };

  const openUpdateModal = (schedule) => {
    setIsModalOpen(true);
    setModalMode("update");
    setSelectedScheduleId(schedule.id);

    const initialData = {
      name: schedule.name,
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      day_start: schedule.day_start,
      day_end: schedule.day_end,
      repetition_unit: schedule.repetition_unit,
      interval: schedule.interval,
      comment: schedule.comment,
    };

    setFormData(initialData); // Set form data for display
    setOldFormData(initialData); // Save old data for comparison
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedScheduleId(null);
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      day_start: "",
      day_end: "",
      repetition_unit: "",
      interval: "",
      comment: "",
    });
    setOldFormData({}); // Reset old form data
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Compare formData with oldFormData and send only changed fields
    const updatedFormData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== oldFormData[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    try {
      if (modalMode === "create") {
        await dispatch(createSchedule(updatedFormData));
        toast.success("განრიგი წარმატებით დაემატა!");
      } else if (modalMode === "update" && selectedScheduleId) {
        await dispatch(
          updateSchedule({ id: selectedScheduleId, scheduleData: updatedFormData })
        );
        toast.success("განრიგი წარმატებით განახლდა!");
      }
      closeAddModal();
    } catch (error) {
      toast.error("შეცდომა მოხდა. სცადეთ ხელახლა.");
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm("დარწმუმენული ხართ რომ გსურთ განრიგის წაშლა?")) {
      try {
        await dispatch(deleteSchedule(scheduleId));
        toast.success("განრიგი წარმატებით წაიშალა!");
      } catch (error) {
        toast.error("განრიგის წაშლისას მოხდა შეცდომა.");
      }
    }
  };

  const handleRowClick = (scheduleId) => {
    setSelectedScheduleId(
      scheduleId === selectedScheduleId ? null : scheduleId
    );
  };

  const handleOpenFilterModal = (data, fieldName, rect) => {
    const uniqueData = [...new Set(data)];
    setFilterableData(uniqueData);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schedules");

    const columnWidth = 25;
    worksheet.columns = [
      { header: "სახელი", key: "name", width: columnWidth },
      { header: "დაწყების თარიღი", key: "start_date", width: columnWidth },
      { header: "დასრულების თარიღი", key: "end_date", width: columnWidth },
      { header: "დაწყების დრო", key: "day_start", width: columnWidth },
      { header: "დამთავრების დრო", key: "day_end", width: columnWidth },
      {
        header: "გამეორების ერთეული",
        key: "repetition_unit",
        width: columnWidth,
      },
      { header: "ინტერვალი", key: "interval", width: columnWidth },
      { header: "კომენტარი", key: "comment", width: columnWidth },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "center",
    };

    filteredSchedules.forEach((schedule) => {
      worksheet.addRow({
        name: schedule.name,
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        day_start: schedule.day_start,
        day_end: schedule.day_end,
        repetition_unit: schedule.repetition_unit,
        interval: schedule.interval,
        comment: schedule.comment,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Schedules.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tableHeaders = [
    { label: "სახელი", key: "name", extractValue: (schedule) => schedule.name },
    { label: "დაწყების თარიღი", key: "start_date", extractValue: (schedule) => schedule.start_date },
    { label: "დასრულების თარიღი", key: "end_date", extractValue: (schedule) => schedule.end_date },
    { label: "დაწყების დრო", key: "day_start", extractValue: (schedule) => schedule.day_start },
    { label: "დამთავრების დრო", key: "day_end", extractValue: (schedule) => schedule.day_end },
    { label: "გამეორების ერთეული", key: "repetition_unit", extractValue: (schedule) => schedule.repetition_unit },
    { label: "ინტერვალი", key: "interval", extractValue: (schedule) => schedule.interval },
    { label: "კომენტარი", key: "comment", extractValue: (schedule) => schedule.comment },
  ];

  return (
    <AuthenticatedLayout>
      <div className="w-full px-10 py-4 flex flex-col gap-8">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">განრიგები</h1>
          <div className="flex items-center gap-8">
            <button className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={openAddModal}>
              <img src={NewIcon} alt="New" /> ახალი
            </button>
            <button onClick={() => openUpdateModal(schedules.find(schedule => schedule.id === selectedScheduleId))}
              className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
              <img src={EditIcon} alt="Edit" /> შეცვლა
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(selectedScheduleId); }}
              className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2">
              <img src={DeleteIcon} alt="Delete" /> წაშლა
            </button>
            <button onClick={exportToExcel} className="bg-[#105D8D] px-7 py-2 rounded flex items-center gap-3 text-white text-[16px] border relative">
              ჩამოტვირთვა
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <Table
          data={filteredSchedules}
          headers={tableHeaders}
          filters={filters}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterClick={handleOpenFilterModal}
          onFilterChange={handleFilterChange}
          rowClassName={(schedule) => schedule.id === selectedScheduleId ? "bg-blue-200" : ""}
          onRowClick={(schedule) => handleRowClick(schedule.id)}
          filterableFields={[
            "name", "start_date", "end_date", "day_start", "day_end", "repetition_unit", "interval", "comment"
          ]}
        />
      </div>

      {isModalOpen && (
        <ScheduleForm
          formData={formData}
          handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSave={handleSave}
          closeModal={closeAddModal}
          modalMode={modalMode}
        />
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterableData={filterableData}
        onApply={(selectedFilters) => applyModalFilters(currentFilterField, selectedFilters)}
        position={modalPosition}
      />
    </AuthenticatedLayout>
  );
};

export default Schedule;

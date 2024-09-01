import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import DeleteIcon from "../../assets/delete.png";
import EditIcon from "../../assets/edit.png";
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../redux/scheduleSlice";
import * as XLSX from "xlsx";
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



  const handleOpenFilterModal = (data, fieldName, rect) => {
    const uniqueData = [...new Set(data)];
    setFilterableData(uniqueData);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  };

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
  };

  const openUpdateModal = (schedule) => {
    setIsModalOpen(true);
    setModalMode("update");
    setSelectedScheduleId(schedule.id);
    setFormData({
      name: schedule.name,
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      day_start: schedule.day_start,
      day_end: schedule.day_end,
      repetition_unit: schedule.repetition_unit,
      interval: schedule.interval,
      comment: schedule.comment,
    });
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
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === "create") {
        dispatch(createSchedule(formData));
        closeAddModal();
      } else if (modalMode === "update" && selectedScheduleId) {
        dispatch(
          updateSchedule({ id: selectedScheduleId, scheduleData: formData })
        );
        closeAddModal();
      }
    } catch (error) {
      alert("Failed to save schedule: " + error.message);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      dispatch(deleteSchedule(scheduleId));
    }
  };

  const handleRowClick = (scheduleId) => {
    setSelectedScheduleId(
      scheduleId === selectedScheduleId ? null : scheduleId
    );
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredSchedules.map((schedule) => ({
        სახელი: schedule.name,
        "დაწყების თარიღი": schedule.start_date,
        "დასრულების თარიღი": schedule.end_date,
        "დაწყების დრო": schedule.day_start,
        "დამთავრების დრო": schedule.day_end,
        "გამეორების ერთეული": schedule.repetition_unit,
        ინტერვალი: schedule.interval,
        კომენტარი: schedule.comment,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedules");
    XLSX.writeFile(workbook, "Schedules.xlsx");
  };

  const tableHeaders = [
    {
      label: "სახელი",
      key: "name",
      extractValue: (schedule) => schedule.name,
    },
    {
      label: "დაწყების თარიღი",
      key: "start_date",
      extractValue: (schedule) => schedule.start_date,
    },
    {
      label: "დასრულების თარიღი",
      key: "end_date",
      extractValue: (schedule) => schedule.end_date,
    },
    {
      label: "დაწყების დრო",
      key: "day_start",
      extractValue: (schedule) => schedule.day_start,
    },
    {
      label: "დამთავრების დრო",
      key: "day_end",
      extractValue: (schedule) => schedule.day_end,
    },
    {
      label: "გამეორების ერთეული",
      key: "repetition_unit",
      extractValue: (schedule) => schedule.repetition_unit,
    },
    {
      label: "ინტერვალი",
      key: "interval",
      extractValue: (schedule) => schedule.interval,
    },
    {
      label: "კომენტარი",
      key: "comment",
      extractValue: (schedule) => schedule.comment,
    },
  ];

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">განრიგები</h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={openAddModal}
            >
              <img src={NewIcon} alt="New" />
              ახალი
            </button>
            <button
              onClick={() =>
                openUpdateModal(
                  schedules.find(
                    (schedule) => schedule.id === selectedScheduleId
                  )
                )
              }
              className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
            >
              <img src={EditIcon} alt="Edit" />
              შეცვლა
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(selectedScheduleId);
              }}
              className="bg-[#D9534F] text-white px-4 py-4 rounded-md flex items-center gap-2"
            >
              <img src={DeleteIcon} alt="Delete" />
              წაშლა
            </button>
            <button
              onClick={exportToExcel}
              className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
            >
              ჩამოტვირთვა
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
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
          rowClassName={(schedule) =>
            schedule.id === selectedScheduleId ? "bg-blue-200" : ""
          }
          onRowClick={(schedule) => handleRowClick(schedule.id)}
          filterableFields={[
            "name",
            "start_date",
            "end_date",
            "day_start",
            "day_end",
            "repetition_unit",
            "interval",
            "comment",
          ]}
        />
      </div>

      {isModalOpen && (
        <ScheduleForm
          formData={formData}
          handleChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          handleSave={handleSave}
          closeModal={closeAddModal}
          modalMode={modalMode}
        />
      )}

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

export default Schedule;

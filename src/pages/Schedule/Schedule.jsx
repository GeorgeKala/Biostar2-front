import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import Modal from "../../components/Modal";
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../redux/scheduleSlice";

const Schedule = () => {
  const dispatch = useDispatch();
  const scheduleItems = useSelector((state) => state.schedules.items);
  const scheduleStatus = useSelector((state) => state.schedules.status);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    if (scheduleStatus === "idle") {
      dispatch(fetchSchedules());
    }
  }, [scheduleStatus, dispatch]);

  const openModal = (id) => {
    setEditItemId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItemId(null);
  };

  const handleSaveSchedule = async (value) => {
    if (editItemId) {
      dispatch(
        updateSchedule({ id: editItemId, scheduleData: { name: value } })
      );
    } else {
      dispatch(createSchedule({ name: value }));
    }
    closeModal();
  };

  const handleDeleteSchedule = (id) => {
    dispatch(deleteSchedule(id));
  };

  if (scheduleStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (scheduleStatus === "failed") {
    return <p>Error loading schedules</p>;
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">განრიგები</h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#FBD15B]  text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={() => setModalOpen(true)}
            >
              <img src={NewIcon} alt="New Icon" />
              დაამატე ახალი განრიგი
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              Download Data
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {scheduleItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2 border-b py-2 border-black"
            >
              <div className="flex-1 text-sm text-gray-700 font-medium">
                {item.name}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => openModal(item.id)}>
                  <img src={CreateIcon} alt="Edit Icon" />
                </button>
                <button onClick={() => handleDeleteSchedule(item.id)}>
                  <img src={DeleteIcon} alt="Delete Icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSaveSchedule}
        title={editItemId ? "შეცვალე განრიგი" : "დაამატე ახალი განრიგი"}
        initialValue={
          editItemId
            ? scheduleItems.find((item) => item.id === editItemId)?.name
            : ""
        }
      />
    </AuthenticatedLayout>
  );
};

export default Schedule;

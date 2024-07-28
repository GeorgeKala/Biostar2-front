// src/pages/Group.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import Modal from "../../components/Modal";
import {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../../redux/groupSlice";
import * as XLSX from "xlsx";

const Group = () => {
  const dispatch = useDispatch();
  const groupItems = useSelector((state) => state.groups.items);
  const groupStatus = useSelector((state) => state.groups.status);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    if (groupStatus === "idle") {
      dispatch(fetchGroups());
    }
  }, [groupStatus, dispatch]);

  const openModal = (id) => {
    setEditItemId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItemId(null);
  };

  const handleSaveGroup = async (value) => {
    if (editItemId) {
      dispatch(updateGroup({ id: editItemId, groupData: { name: value } }));
    } else {
      dispatch(createGroup({ name: value }));
    }
    closeModal();
  };

  const handleDeleteGroup = (id) => {
    dispatch(deleteGroup(id));
  };


  const exportToExcel = () => {
    const dataToExport = [];
    const header = ["ID", "Name"];
    dataToExport.push(header);
    groupItems.forEach((item) => {
      const row = [item.id, item.name];
      dataToExport.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Groups");

    XLSX.writeFile(workbook, "Groups.xlsx");
  };


  if (groupStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (groupStatus === "failed") {
    return <p>Error loading groups</p>;
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">ჯგუფები</h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#FBD15B]  text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={() => setModalOpen(true)}
            >
              + დაამატე ახალი ჯგუფი
            </button>
            <button
              className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
              onClick={exportToExcel}
            >
              ჩამოტვირთვა
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {groupItems.map((item) => (
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
                <button onClick={() => handleDeleteGroup(item.id)}>
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
        onSave={handleSaveGroup}
        title={editItemId ? "Edit Group Item" : "Add Group Item"}
        initialValue={
          editItemId
            ? groupItems.find((item) => item.id === editItemId)?.name
            : ""
        }
      />
    </AuthenticatedLayout>
  );
};

export default Group;

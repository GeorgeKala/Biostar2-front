import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import Modal from "../../components/Modal";
import {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../../redux/groupSlice";
import ExcelJS from "exceljs";
import { useFormData } from "../../hooks/useFormData"; // Import the custom hook

const Group = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const groupItems = useSelector((state) => state.groups.items);
  const groupStatus = useSelector((state) => state.groups.status);

  // Use form data hook to manage search term and modal data
  const { formData, handleFormDataChange, setFormData } = useFormData({
    searchTerm: "",
    name: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    if (groupStatus === "idle") {
      dispatch(fetchGroups());
    }
  }, [groupStatus, dispatch]);

  const openModal = (id) => {
    setEditItemId(id);
    const item = groupItems.find((item) => item.id === id);
    setFormData({ ...formData, name: item ? item.name : "" });
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

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Groups");

    worksheet.columns = [
      { header: "#", key: "id", width: 10 },
      { header: "სახელი", key: "name", width: 30 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "center",
    };

    groupItems.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        name: item.name,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "ჯგუფები.xlsx";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter the group list based on the search term
  const filteredGroupItems = groupItems.filter((group) =>
    group.name.toLowerCase().includes(formData.searchTerm.toLowerCase())
  );

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">ჯგუფები</h1>
          {user.user_type.name === "ადმინისტრატორი" && (
            <div className="flex items-center gap-8">
              <button
                className="bg-[#FBD15B] text-[#1976D2] px-4 py-4 rounded-md flex items-center gap-2"
                onClick={() => setModalOpen(true)}
              >
                + დაამატე ახალი ჯგუფი
              </button>
              <button
                className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
                onClick={exportToExcel}
              >
                ჩამოტვირთვა
                <span className="absolute inset-0 border border-white border-dashed rounded"></span>
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            name="searchTerm"
            placeholder="ძებნა ჯგუფის მიხედვით"
            value={formData.searchTerm}
            onChange={handleFormDataChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
          />
          <svg
            className="absolute top-3 right-3 w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M16.65 10A6.65 6.65 0 1110 3.35 6.65 6.65 0 0116.65 10z"
            ></path>
          </svg>
        </div>

        {/* Group List */}
        <div>
          {filteredGroupItems.length > 0 ? (
            filteredGroupItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2 border-b py-2 border-black"
              >
                <div className="flex-1 text-sm text-gray-700 font-medium">
                  {item.name}
                </div>
                {user.user_type.name === "ადმინისტრატორი" && (
                  <div className="flex space-x-2">
                    <button onClick={() => openModal(item.id)}>
                      <img src={CreateIcon} alt="Edit Icon" />
                    </button>
                    <button onClick={() => handleDeleteGroup(item.id)}>
                      <img src={DeleteIcon} alt="Delete Icon" />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">მონაცემი ვერ მოიძებნა.</p>
          )}
        </div>
      </div>

      {/* Modal for Creating/Editing Groups */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={() => handleSaveGroup(formData.name)}
        title={editItemId ? "შეცვალე ჯგუფი" : "დაამატე ჯგუფი"}
        initialValue={formData.name}
      />
    </AuthenticatedLayout>
  );
};

export default Group;

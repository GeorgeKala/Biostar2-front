import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import Modal from "../../components/Modal";
import {
  fetchForgiveTypes,
  createForgiveType,
  updateForgiveType,
  deleteForgiveType,
} from "../../redux/forgiveTypeSlice";
import * as XLSX from "xlsx";

const ForgiveType = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const forgiveTypeItems = useSelector(
    (state) => state.forgiveTypes.forgiveTypes
  );
  const forgiveTypeStatus = useSelector((state) => state.forgiveTypes.status);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    dispatch(fetchForgiveTypes());
  }, [dispatch]);

  const openModal = (id) => {
    setEditItemId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItemId(null);
  };

  const handleSaveForgiveType = async (value) => {
    if (editItemId) {
      dispatch(
        updateForgiveType({ id: editItemId, forgiveTypeData: { name: value } })
      );
    } else {
      dispatch(createForgiveType({ name: value }));
    }
    closeModal();
  };

  const handleDeleteForgiveType = (id) => {
    dispatch(deleteForgiveType(id));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      forgiveTypeItems.map((item) => ({
        ID: item.id,
        Name: item.name,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ForgiveTypes");
    XLSX.writeFile(workbook, "ForgiveTypes.xlsx");
  };

  // Filter the forgiveTypeItems based on the search term
  const filteredForgiveTypeItems = forgiveTypeItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (forgiveTypeStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (forgiveTypeStatus === "failed") {
    return <p>Error loading forgive types</p>;
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            პატიების ტიპები
          </h1>
          {user.user_type.name === "ადმინისტრატორი" && (
            <div className="flex items-center gap-8">
              <button
                className="bg-[#FBD15B] text-[#1976D2] px-4 py-2 rounded-md flex items-center gap-2"
                onClick={() => setModalOpen(true)}
              >
                + დაამატე ახალი პატიების ტიპი
              </button>
              <button
                onClick={exportToExcel}
                className="bg-[#105D8D] px-7 py-2 rounded flex items-center gap-3 text-white text-[16px] border relative"
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
            placeholder="ძებნა პატიების ტიპის მიხედვით"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        <div >
          {filteredForgiveTypeItems.length > 0 ? (
            filteredForgiveTypeItems.map((item) => (
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
                    <button onClick={() => handleDeleteForgiveType(item.id)}>
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

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSaveForgiveType}
        title={editItemId ? "შეცვალე პატიების ტიპი" : "დაამატე პატიების ტიპი"}
        initialValue={
          editItemId
            ? forgiveTypeItems.find((item) => item.id === editItemId)?.name
            : ""
        }
      />
    </AuthenticatedLayout>
  );
};

export default ForgiveType;

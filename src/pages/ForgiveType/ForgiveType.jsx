
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import Modal from "../../components/Modal";
import {
  fetchForgiveTypes,
  createForgiveType,
  updateForgiveType,
  deleteForgiveType,
} from "../../redux/forgiveTypeSlice";
import forgiveTypeService from "../../services/forgiveType";

const ForgiveType = () => {
  const dispatch = useDispatch();
  const forgiveTypeItems = useSelector((state) => state.forgiveTypes.forgiveTypes);
  const forgiveTypeStatus = useSelector((state) => state.forgiveTypes.status);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);


  useEffect(() => {
      dispatch(fetchForgiveTypes());
  }, []);

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
      dispatch(updateForgiveType({ id: editItemId, forgiveTypeData: { name: value } }));
    } else {
      dispatch(createForgiveType({ name: value }));
    }
    closeModal();
  };

  const handleDeleteForgiveType = (id) => {
    dispatch(deleteForgiveType(id));
  };

  if (forgiveTypeStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (forgiveTypeStatus === "failed") {
    return <p>Error loading forgive types</p>;
  }

//  useEffect(() => {
//     const fetchData = async () => {
//         try{
//             const response = await forgiveTypeService.getAllForgiveTypes();
//             console.log(response)
//         }catch(e){
//             console.log(e)
//         }
//     }

//     fetchData()
//  }, [])

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">Forgive Types</h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#FBD15B]  text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={() => setModalOpen(true)}
            >
              + Add New Forgive Type
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              Download Data
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {forgiveTypeItems.map((item) => (
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
                <button onClick={() => handleDeleteForgiveType(item.id)}>
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
        onSave={handleSaveForgiveType}
        title={editItemId ? "Edit Forgive Type" : "Add Forgive Type"}
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

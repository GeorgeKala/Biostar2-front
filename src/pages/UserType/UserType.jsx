import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTypes } from "../../redux/userTypeSlice";
import userTypeService from "../../services/userType";
import * as XLSX from "xlsx";

const UserType = () => {
  const dispatch = useDispatch();
  const userTypes = useSelector((state) => state.userType.items);
  const [formData, setFormData] = useState({ name: "", id: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [userTypeList, setUserTypeList] = useState([]);
  const [selectedUserTypeId, setSelectedUserTypeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    dispatch(fetchUserTypes());
  }, [dispatch]);

  useEffect(() => {
    setUserTypeList(userTypes);
  }, [userTypes]);

  // Filter the user type list based on the search term
  const filteredUserTypeList = userTypeList.filter((userType) =>
    userType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setModalMode("create");
    setFormData({ name: "" });
    setSelectedUserTypeId(null);
  };

  const openEditModal = (userType) => {
    setIsAddModalOpen(true);
    setModalMode("update");
    setFormData({ name: userType.name });
    setSelectedUserTypeId(userType.id);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalMode("create");
    setFormData({ name: "" });
    setSelectedUserTypeId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        const response = await userTypeService.createUserType(formData);
        setUserTypeList([...userTypeList, response.data]);
        closeAddModal();
      } else if (modalMode === "update" && selectedUserTypeId) {
        await userTypeService.updateUserType(selectedUserTypeId, formData);
        const updatedUserTypes = userTypeList.map((ut) => {
          if (ut.id === selectedUserTypeId) {
            return { ...ut, name: formData.name };
          }
          return ut;
        });
        setUserTypeList(updatedUserTypes);
        closeAddModal();
      }
    } catch (error) {
      alert("Failed to save user type: " + error.message);
    }
  };

  const handleDelete = async (userTypeId) => {
    if (window.confirm("Are you sure you want to delete this user type?")) {
      try {
        await userTypeService.deleteUserType(userTypeId);
        setUserTypeList(userTypeList.filter((ut) => ut.id !== userTypeId));
      } catch (error) {
        alert("Failed to delete user type: " + error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      userTypeList.map((userType) => ({
        სახელი: userType.name,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserTypes");
    XLSX.writeFile(workbook, "UserTypes.xlsx");
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-10 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            მომხმარებლის ტიპები
          </h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#FBD15B] text-[#1976D2] px-4 py-2 rounded-md flex items-center gap-2"
              onClick={openAddModal}
            >
              + დაამატე ახალი მომხმარებლის ტიპი
            </button>
            <button
              onClick={exportToExcel}
              className="bg-[#105D8D] px-7 py-2 rounded flex items-center gap-3 text-white text-[16px] border relative"
            >
              ჩამოტვირთვა
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="ძებნა მომხმარებლის ტიპის მიხედვით"
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

        <div>
          {filteredUserTypeList.length > 0 ? (
            filteredUserTypeList.map((userType, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2 border-b py-2 border-black"
              >
                <div className="flex items-center gap-2 text-sm">
                  <p className="text-gray-700 font-medium">{userType.name}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openEditModal(userType)}>
                    <img src={CreateIcon} alt="Edit Icon" />
                  </button>
                  <button onClick={() => handleDelete(userType.id)}>
                    <img src={DeleteIcon} alt="Delete Icon" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">მონაცემი ვერ მოიძებნა.</p>
          )}
        </div>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {modalMode === "create"
                  ? "დაამატე მომხმარებლის ტიპი"
                  : "შეცვალე მომხმარებლის ტიპი"}
              </h2>
              <button
                onClick={closeAddModal}
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
            <form onSubmit={handleSave} className="p-3">
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
                  className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
                >
                  შენახვა
                </button>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                >
                  გაუქმება
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default UserType;

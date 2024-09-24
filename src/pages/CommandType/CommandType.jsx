import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import dayTypeService from "../../services/dayType";
import ExcelJS from "exceljs";
import { useSelector } from "react-redux";

const CommandType = () => {
  const user = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({ name: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [dayTypeList, setDayTypeList] = useState([]);
  const [selectedDayTypeId, setSelectedDayTypeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    fetchDayTypes();
  }, []);

  const fetchDayTypes = async () => {
    try {
      const data = await dayTypeService.getAllDayTypes();
      setDayTypeList(data);
    } catch (error) {
      alert("Failed to fetch day types: " + error.message);
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setModalMode("create");
    setFormData({ name: "" });
    setSelectedDayTypeId(null);
  };

  const openEditModal = (dayType) => {
    setIsAddModalOpen(true);
    setModalMode("update");
    setFormData({ name: dayType.name });
    setSelectedDayTypeId(dayType.id);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalMode("create");
    setFormData({ name: "" });
    setSelectedDayTypeId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        const newDayType = await dayTypeService.createDayType(formData);
        setDayTypeList([...dayTypeList, newDayType]);
        closeAddModal();
      } else if (modalMode === "update" && selectedDayTypeId) {
        await dayTypeService.updateDayType(selectedDayTypeId, formData);
        const updatedDayTypes = dayTypeList.map((dt) => {
          if (dt.id === selectedDayTypeId) {
            return { ...dt, name: formData.name };
          }
          return dt;
        });
        setDayTypeList(updatedDayTypes);
        closeAddModal();
      }
    } catch (error) {
      alert("Failed to save day type: " + error.message);
    }
  };

  const handleDelete = async (dayTypeId) => {
    if (window.confirm("Are you sure you want to delete this day type?")) {
      try {
        await dayTypeService.deleteDayType(dayTypeId);
        setDayTypeList(dayTypeList.filter((dt) => dt.id !== dayTypeId));
      } catch (error) {
        alert("Failed to delete day type: " + error.message);
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
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DayTypes");

    worksheet.addRow(["ID", "Name"]);

    dayTypeList.forEach((item) => {
      worksheet.addRow([item.id, item.name]);
    });

    worksheet.columns = [{ width: 20 }, { width: 20 }];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "ბრძანებები.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  // Filter the dayTypeList based on the search term
  const filteredDayTypeList = dayTypeList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            ბრძანების ტიპები
          </h1>
          {user.user_type.name === "ადმინისტრატორი" && (
            <div className="flex items-center gap-8">
              <button
                className="bg-[#FBD15B] text-[#1976D2] px-4 py-2 rounded-md flex items-center gap-2"
                onClick={openAddModal}
              >
                + დაამატე ბრძანების ტიპი
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
            placeholder="ძებნა ბრძანების ტიპის მიხედვით"
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
          {filteredDayTypeList.length > 0 ? (
            filteredDayTypeList.map((dayType, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2 border-b py-2 border-black"
              >
                <div className="flex items-center gap-2 text-sm">
                  <p className="text-gray-700 font-medium">{dayType.name}</p>
                </div>
                {user.user_type.name === "ადმინისტრატორი" && (
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(dayType)}>
                      <img src={CreateIcon} alt="Edit Icon" />
                    </button>
                    <button onClick={() => handleDelete(dayType.id)}>
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {modalMode === "create"
                  ? "დაამატე ახალი ბრძანების ტიპი"
                  : "შეცვალე ბრძანების ტიპი"}
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

export default CommandType;

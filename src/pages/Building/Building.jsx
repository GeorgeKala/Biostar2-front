import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import {
  fetchBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../../redux/buildingSlice";
import buildingService from "../../services/building";
import ExcelJS from "exceljs";

const Building = () => {
  const dispatch = useDispatch();
  const { buildings } = useSelector((state) => state.building);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    parent_id: null,
  });
  const [buildingIdToUpdate, setBuildingIdToUpdate] = useState(null);
  const [nestedBuildings, setNestedBuildings] = useState([]);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBuildings, setFilteredBuildings] = useState(nestedBuildings);

  useEffect(() => {
    fetchNestedBuildings();
  }, [dispatch]);

  const fetchNestedBuildings = async () => {
    try {
      const nestedData = await buildingService.getNestedBuildings();
      setNestedBuildings(nestedData);
      setFilteredBuildings(nestedData); // Set filteredBuildings initially
    } catch (error) {
      console.error("Failed to fetch nested buildings:", error);
    }
  };

  const searchItems = (items, term) => {
    return items.reduce((acc, item) => {
      if (
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        (item.children && searchItems(item.children, term).length > 0)
      ) {
        acc.push({
          ...item,
          children: item.children ? searchItems(item.children, term) : [],
        });
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    if (searchTerm) {
      setFilteredBuildings(searchItems(nestedBuildings, searchTerm));
    } else {
      setFilteredBuildings(nestedBuildings);
    }
  }, [searchTerm, nestedBuildings]);

  const openCreateModal = () => {
    setIsModalOpen(true);
    setModalMode("create");
    setFormData({ name: "", address: "", parent_id: null });
  };

  const openUpdateModal = (building) => {
    setIsModalOpen(true);
    setModalMode("update");
    setBuildingIdToUpdate(building.id);
    setFormData({
      name: building.name,
      address: building.address,
      parent_id: building.parent_id,
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setBuildingIdToUpdate(null);
    setFormData({ name: "", address: "", parent_id: null });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { name, address, parent_id } = formData;

    if (!name.trim()) {
      alert("Please enter name.");
      return;
    }

    const buildingData = {
      name: name.trim(),
      address: address.trim(),
      parent_id,
    };

    try {
      if (modalMode === "create") {
        await dispatch(createBuilding(buildingData));
      } else if (modalMode === "update" && buildingIdToUpdate) {
        await dispatch(
          updateBuilding({ id: buildingIdToUpdate, buildingData })
        );
      }
      closeModal();
      fetchNestedBuildings();
    } catch (error) {
      alert(
        `Failed to ${modalMode === "create" ? "create" : "update"} building: ${
          error.message
        }`
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        await dispatch(deleteBuilding(id));
        fetchNestedBuildings();
      } catch (error) {
        alert("Failed to delete building: " + error.message);
      }
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Buildings");

    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Name", key: "Name", width: 50 },
      { header: "Address", key: "Address", width: 50 },
    ];

    worksheet.getRow(1).font = { bold: true };

    const flattenData = (buildings, parentName = "") => {
      buildings.forEach((building) => {
        const fullName = parentName
          ? `${parentName} > ${building.name}`
          : building.name;
        worksheet.addRow({
          ID: building.id,
          Name: fullName,
          Address: building.address,
        });
        if (building.children && building.children.length > 0) {
          flattenData(building.children, fullName);
        }
      });
    };

    flattenData(nestedBuildings);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Buildings.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSubMenu = (subItemId) => {
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [subItemId]: !prevOpenSubmenus[subItemId],
    }));
  };

  const renderSubMenu = (subMenu) => (
    <ul
      className={`ml-10 transition-all ease-in-out duration-300 overflow-hidden ${
        openSubmenus[subMenu[0]?.parent_id]
          ? "max-h-[1000px] opacity-100"
          : "max-h-0 opacity-0"
      }`}
    >
      {subMenu.map((subItem, index) => (
        <li key={index} className="cursor-pointer">
          <div className="flex justify-between items-center mb-2 border-b py-2 border-black">
            <div className="flex items-center gap-2 text-sm">
              {subItem?.children?.length > 0 && (
                <button
                  onClick={() => toggleSubMenu(subItem.id)}
                  className="bg-[#00C7BE] text-white px-1 rounded w-[20px] py-[0.2px]"
                >
                  {openSubmenus[subItem.id] ? "-" : "+"}
                </button>
              )}
              <p className="text-gray-700 font-medium">{subItem.name}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => openUpdateModal(subItem)}>
                <img src={CreateIcon} alt="Edit Icon" />
              </button>
              <button onClick={() => handleDelete(subItem.id)}>
                <img src={DeleteIcon} alt="Delete Icon" />
              </button>
            </div>
          </div>
          {subItem?.children &&
            openSubmenus[subItem.id] &&
            renderSubMenu(subItem.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <AuthenticatedLayout>
      <div className="w-full px-10 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">შენობები</h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#FBD15B] text-[#1976D2] px-4 py-2 rounded-md flex items-center gap-2"
              onClick={openCreateModal}
            >
              + დაამატე ახალი შენობა
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

        <div className="relative">
          <input
            type="text"
            placeholder="ძებნა შენობის მიხედვით"
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
          {filteredBuildings &&
            filteredBuildings.map((item, index) => (
              <div key={index} className="cursor-pointer">
                <div className="flex justify-between items-center mb-2 border-b py-2 border-black">
                  <div className="flex items-center gap-2 text-sm">
                    {item?.children?.length > 0 && (
                      <button
                        onClick={() => toggleSubMenu(item.id)}
                        className="bg-[#00C7BE] text-white px-1 rounded w-[20px] py-[0.2px]"
                      >
                        {openSubmenus[item.id] ? "-" : "+"}
                      </button>
                    )}
                    <p className="text-gray-700 font-medium">{item.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => openUpdateModal(item)}>
                      <img src={CreateIcon} alt="Edit Icon" />
                    </button>
                    <button onClick={() => handleDelete(item.id)}>
                      <img src={DeleteIcon} alt="Delete Icon" />
                    </button>
                  </div>
                </div>
                {item.children && renderSubMenu(item.children)}
              </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {modalMode === "create"
                  ? "დაამატე ახალი შენობა"
                  : "განაახლე შენობა"}
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
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  მისამართი:
                </label>
                <input
                  type="text"
                  id="address"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="parent_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  მდებარეობს
                </label>
                <select
                  id="parent_id"
                  name="parent_id"
                  className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.parent_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, parent_id: e.target.value })
                  }
                >
                  <option value="">აირჩიე შენობა</option>
                  {buildings &&
                    buildings.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
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

export default Building;

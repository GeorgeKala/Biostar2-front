import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import SearchIcon from "../../assets/search.png";
import DeleteIcon from "../../assets/delete.png";
import EditIcon from "../../assets/edit.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import NewIcon from "../../assets/new.png";
import buildingService from "../../services/building";
import accessGroupService from "../../services/accessGroup";
import { useDispatch, useSelector } from "react-redux";
import { fetchBuildings } from "../../redux/buildingSlice";
import * as XLSX from 'xlsx';

const Device = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedAccessGroup, setSelectedAccessGroup] = useState(null);
  const [accessGroups, setAccessGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isKitchen, setIsKitchen] = useState(false); // State for kitchen checkbox

  const dispatch = useDispatch();
  const buildings = useSelector((state) => state.building.items);

  useEffect(() => {
    const fetchBuildingsWithAccessGroups = async () => {
      try {
        const data = await buildingService.getBuildingsWithAccessGroups();
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildingsWithAccessGroups();
  }, []);

  useEffect(() => {
    const fetchAccessGroups = async () => {
      try {
        const response = await accessGroupService.fetchAccessGroups();
        setAccessGroups(response);
      } catch (error) {
        console.error("Error fetching access groups:", error);
      }
    };

    fetchAccessGroups();
  }, []);

  const handleAddClick = () => {
    setShowModal(true);
    setSelectedBuildingId("");
    setSelectedAccessGroup(null);
    setSelectedItem(null);
    setIsKitchen(false); // Reset kitchen state
  };

  const handleEditClick = () => {
    if (selectedItem) {
      setShowModal(true);
      setSelectedBuildingId(selectedItem.building_id);
      setSelectedAccessGroup(selectedItem.access_group);
      setIsKitchen(selectedItem.type === 'kitchen'); // Set kitchen state
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedBuildingId("");
    setSelectedAccessGroup(null);
    setSelectedItem(null);
    setIsKitchen(false);
  };

  const handleAddAccessGroup = async () => {
    if (selectedBuildingId && selectedAccessGroup) {
      try {
        const buildingType = isKitchen ? 'kitchen' : 'other';
  
        await buildingService.addAccessGroup(
          selectedBuildingId,
          [selectedAccessGroup],
          buildingType
        );
  
        setShowModal(false);
        setSelectedBuildingId("");
        setSelectedAccessGroup(null);
        setIsKitchen(false);
  
        const updatedBuildings = await buildingService.getBuildingsWithAccessGroups();
        setData(updatedBuildings);
      } catch (error) {
        console.error("Error adding access group to building:", error);
      }
    } else {
      console.error("Please select both a building and an access group.");
    }
  };

  const handleDeleteAccessGroup = async () => {
    try {
      await buildingService.removeAccessGroup(
        selectedItem.building_id,
        selectedItem.access_group_id
      );
      const updatedBuildings = await buildingService.getBuildingsWithAccessGroups();
      setData(updatedBuildings);
    } catch (error) {
      console.error("Error removing access group from building:", error);
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const handleAccessGroupChange = (e) => {
    const selectedGroup = accessGroups.find(group => group.access_group_id === e.target.value);
    setSelectedAccessGroup(selectedGroup);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        "შენობა": item?.building_name,
        "მოწყობილობა": item?.access_group_name
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "მოწყობილობები");
    XLSX.writeFile(workbook, "მოწყობილობები.xlsx");
  };


  console.log(selectedAccessGroup);
  

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            შენობები და მოწყობილობები
          </h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#5CB85C] text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={handleAddClick}
            >
              <img src={NewIcon} alt="New Icon" />
              ახალი
            </button>
            <button
              onClick={handleDeleteAccessGroup}
              className="bg-[#D9534F] text-white px-4 py-4 rounded-md flex items-center gap-2"
              disabled={!selectedItem}
            >
              <img src={DeleteIcon} alt="Delete Icon" />
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
        <div className="container mx-auto mt-10 overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-2 gap-2 bg-[#1976D2] text-white py-6 px-4 min-w-max">
              <div>შენობა</div>
              <div>მოწყობილობა</div>
            </div>
            <div className="h-100 min-w-max">
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-2 gap-2 py-2 px-4 border-b min-w-max ${item?.building_id === selectedItem?.building_id && item?.access_group_id === selectedItem?.access_group_id ? 'bg-blue-300' : 'transparent'}`}
                  onClick={() => handleRowClick(item)}
                >
                  <div>{item.building_name}</div>
                  <div>{item.access_group_name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium mb-4">
              {selectedBuildingId ? "რედაქტირება" : "დამატება"} შენობების განაწილება
            </h2>
            <div className="mb-4">
              <label htmlFor="building_id" className="block text-sm font-medium text-gray-700">
                შენობა:
              </label>
              <select
                id="building_id"
                name="building_id"
                value={selectedBuildingId}
                onChange={(e) => setSelectedBuildingId(e.target.value)}
                className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="">შენობა</option>
                {buildings && buildings.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="access_group" className="block text-sm font-medium text-gray-700">
                ხელმისაწვდომი ჯგუფი:
              </label>
              <select
                id="access_group"
                name="access_group"
                value={selectedAccessGroup ? selectedAccessGroup.access_group_id : ""}
                onChange={handleAccessGroupChange}
                className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="">აირჩიე მოწყობილობა</option>
                {accessGroups.map((group) => (
                  <option key={group.access_group_id} value={group.access_group_id}>
                    {group.device_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isKitchen}
                  onChange={(e) => setIsKitchen(e.target.checked)}
                  className="mr-2"
                />
                Is Kitchen
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleAddAccessGroup}
              >
                {selectedBuildingId ? "რედაქტირება" : "დამატება"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default Device;

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

const Device = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedAccessGroups, setSelectedAccessGroups] = useState([]);
  const [accessGroups, setAccessGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item

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
    dispatch(fetchBuildings());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await accessGroupService.fetchAccessGroups();
        setAccessGroups(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setShowModal(true);
    setSelectedBuildingId("");
    setSelectedAccessGroups([]);
    setSelectedItem(null); // Reset selected item for new addition
  };

  const handleEditClick = () => {
    if (selectedItem) {
      setShowModal(true);
      setSelectedBuildingId(selectedItem.building_id);
      setSelectedAccessGroups(
        selectedItem.access_groups.map((group) => group.id)
      );
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedBuildingId("");
    setSelectedAccessGroups([]);
    setSelectedItem(null); // Reset selected item
  };

  const handleAddAccessGroup = async () => {
    if (selectedBuildingId && selectedAccessGroups.length > 0) {
      try {
        await buildingService.addAccessGroup(
          selectedBuildingId,
          selectedAccessGroups
        );
        setShowModal(false);
        setSelectedBuildingId("");
        setSelectedAccessGroups([]);
        const updatedBuildings =
          await buildingService.getBuildingsWithAccessGroups();
        setData(updatedBuildings);
      } catch (error) {
        console.error("Error adding access groups to building:", error);
      }
    }
  };


  const handleDeleteAccessGroup = async () => {
    try {
      await buildingService.removeAccessGroup(
        selectedItem.building_id,
        selectedItem.access_group_id
      );
      const updatedBuildings =
        await buildingService.getBuildingsWithAccessGroups();
      setData(updatedBuildings);
    } catch (error) {
      console.error("Error removing access group from building:", error);
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            შენობები და მოწყობილობები
          </h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={handleAddClick}
            >
              <img src={NewIcon} alt="New Icon" />
              New
            </button>
            <button
              className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={handleEditClick}
              disabled={!selectedItem} // Disable button if no item is selected
            >
              <img src={EditIcon} alt="Edit Icon" />
              Edit
            </button>
            <button onClick={handleDeleteAccessGroup} className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2">
              <img src={DeleteIcon} alt="Delete Icon" />
              Delete
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
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
              {data.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-2 gap-2 py-2 px-4 border-b min-w-max `}
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
              {selectedBuildingId ? "რედაქტირება" : "დამატება"} შენობების
              განაწილება
            </h2>
            <div className="mb-4">
              <label
                htmlFor="building_id"
                className="block text-sm font-medium text-gray-700"
              >
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
                {buildings &&
                  buildings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="access_groups"
                className="block text-sm font-medium text-gray-700"
              >
                ხელმისაწვდომი ჯგუფები:
              </label>
              <select
                id="access_groups"
                name="access_groups"
                value={selectedAccessGroups}
                onChange={(e) =>
                  setSelectedAccessGroups(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                {accessGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
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


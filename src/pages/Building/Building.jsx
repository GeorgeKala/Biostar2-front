import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import { fetchBuildings, createBuilding, updateBuilding, deleteBuilding } from "../../redux/buildingSlice"; 
import buildingService from "../../services/building";
import * as XLSX from "xlsx";

const Building = () => {
  const dispatch = useDispatch();
  const buildings = useSelector(state => state.building);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [buildingIdToUpdate, setBuildingIdToUpdate] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [parentId, setParentId] = useState(null);
  const [nestedBuildings, setNestedBuildings] = useState([]);

  useEffect(() => {
    fetchNestedBuildings();
  }, [dispatch]);

  const fetchNestedBuildings = async () => {
    try {
      const nestedData = await buildingService.getNestedBuildings();
      setNestedBuildings(nestedData);
    } catch (error) {
      console.error("Failed to fetch nested buildings:", error);
    }
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
    setModalMode('create');
    setName('');
    setAddress('');
    setParentId(null);
  };

  const openUpdateModal = (building) => {
    setIsModalOpen(true);
    setModalMode('update');
    setBuildingIdToUpdate(building.id);
    setName(building.name);
    setAddress(building.address);
    setParentId(building.parent_id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode('create'); 
    setBuildingIdToUpdate(null);
    setName('');
    setAddress('');
    setParentId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter name.");
      return;
    }

    const buildingData = {
      name: name.trim(),
      address: address.trim(),
      parent_id: parentId,
    };

    if (modalMode === 'create') {
      dispatch(createBuilding(buildingData))
        .then(() => {
          closeModal();
          fetchNestedBuildings(); // Refresh the nested buildings
        })
        .catch(error => {
          alert("Failed to create building: " + error.message);
        });
    } else if (modalMode === 'update' && buildingIdToUpdate) {
      dispatch(updateBuilding({ id: buildingIdToUpdate, buildingData }))
        .then(() => {
          closeModal();
          fetchNestedBuildings(); // Refresh the nested buildings
        })
        .catch(error => {
          alert("Failed to update building: " + error.message);
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      dispatch(deleteBuilding(id))
        .then(() => {
          fetchNestedBuildings(); // Refresh the nested buildings
        })
        .catch(error => {
          alert("Failed to delete building: " + error.message);
        });
    }
  };

  const toggleSubMenu = (e) => {
    e.stopPropagation();
    const submenu = e.currentTarget.querySelector("ul");
    if (!submenu) return;
    submenu.style.display = submenu.style.display === "none" || submenu.style.display === "" ? "block" : "none";
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      nestedBuildings.map((building) => ({
        "სახელი": building.name,
        "მისამართი": building.address,
        "ექვემდებარება": building.parent_id,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Buildings");
    XLSX.writeFile(workbook, "Buildings.xlsx");
  };

  const renderSubMenu = (subMenu, level = 1) => {
    return (
      <ul className={`ml-10 hidden`}>
        {subMenu.map((subItem, index) => (
          <li key={index} onClick={toggleSubMenu} className="cursor-pointer">
            <div className="flex justify-between items-center mb-2 border-b py-2 border-black">
              <div className="flex items-center gap-2 text-sm">
                {subItem?.children?.length > 0 && (<button className="bg-[#00C7BE] text-white px-1 rounded py-[0.2px]">+</button>)}
                <p className="text-gray-700 font-medium">{subItem.name}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => openUpdateModal(subItem)}>
                  <img src={CreateIcon} alt="Edit Icon" className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(subItem.id)}>
                  <img src={DeleteIcon} alt="Delete Icon" className="w-4 h-4" />
                </button>
              </div>
            </div>
            {subItem?.children && renderSubMenu(subItem?.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">შენობები</h1>
          <div className="flex items-center gap-8">
            <button className="bg-[#FBD15B] text-[#1976D2] px-4 py-4 rounded-md flex items-center gap-2" onClick={openCreateModal}>
              + დაამატე ახალი შენობა
            </button>
            <button onClick={exportToExcel} className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              ჩამოტვირთვა
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {nestedBuildings && nestedBuildings.map((item, index) => (
            <div key={index} onClick={toggleSubMenu} className="cursor-pointer">
              <div className="flex justify-between items-center mb-2 border-b py-2 border-black">
                <div className="flex items-center gap-2 text-sm">
                  {item?.children?.length > 0 && (<button className="bg-[#00C7BE] text-white px-1 rounded py-[0.2px]">+</button>)}
                  <p className="text-gray-700 font-medium">{item.name}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openUpdateModal(item)}>
                    <img src={CreateIcon} alt="Edit Icon" className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    <img src={DeleteIcon} alt="Delete Icon" className="w-4 h-4" />
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
              <h2 className="text-lg font-semibold">{modalMode === 'create' ? 'დაამატე ახალი შენობა' : 'განაახლე შენობა'}</h2>
              <button onClick={closeModal} className="hover:text-gray-200 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-3">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">სახელი:</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">მისამართი:</label>
                <input
                  type="text"
                  id="address"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">მდებარეობს</label>
                <select
                  id="parent_id"
                  name="parent_id"
                  className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">აირჩიე შენობა</option>
                  {buildings.items && buildings.items.map(building => (
                    <option key={building.id} value={building.id}>{building.name}</option>
                  ))}
                </select>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
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

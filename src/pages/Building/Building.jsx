import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import { fetchBuildings, createBuilding, updateBuilding, deleteBuilding } from "../../redux/buildingSlice"; 

const Building = () => {
  const dispatch = useDispatch();
  const buildings = useSelector(state => state.building);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [buildingIdToUpdate, setBuildingIdToUpdate] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  const openCreateModal = () => {
    setIsModalOpen(true);
    setModalMode('create');
    setName('');
    setAddress('');
  };

  const openUpdateModal = (building) => {
    setIsModalOpen(true);
    setModalMode('update');
    setBuildingIdToUpdate(building.id);
    setName(building.name);
    setAddress(building.address);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode('create'); 
    setBuildingIdToUpdate(null);
    setName('');
    setAddress('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter name.");
      return;
    }

    const buildingData = {
      name: name.trim(),
    };

    if (address.trim()) {
      buildingData.address = address.trim();
    }

    if (modalMode === 'create') {
      dispatch(createBuilding(buildingData))
        .then(() => {
          closeModal();
        })
        .catch(error => {
          alert("Failed to create building: " + error.message);
        });
    } else if (modalMode === 'update' && buildingIdToUpdate) {
      dispatch(updateBuilding({ id: buildingIdToUpdate, buildingData }))
        .then(() => {
          closeModal();
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
        })
        .catch(error => {
          alert("Failed to delete building: " + error.message);
        });
    }
  };

  console.log(buildingIdToUpdate)

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">შენობები</h1>
          <div className="flex items-center gap-8">
            <button className="bg-[#FBD15B] text-white px-4 py-4 rounded-md flex items-center gap-2" onClick={openCreateModal}>
              + დაამატე ახალი შენობა
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              Download Data
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {buildings && buildings.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 border-b py-2 border-black"
            >
              <div className="flex-1 text-sm text-gray-700 font-medium">
                {item?.name}
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
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white  rounded-lg max-w-md w-full ">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">{modalMode === 'create'? 'დაამატე': 'გაანახლე'} ახალი შენობა</h2>
              <button onClick={closeModal} className="hover:text-gray-200 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className='p-3'>
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

import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import CreateIcon from '../../assets/create.png';
import DeleteIcon from '../../assets/delete-2.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommandTypes } from '../../redux/commandTypeSlice';
import commandTypeService from '../../services/commandType';

const CommandType = () => {
  const dispatch = useDispatch();
  const commandTypes = useSelector(state => state.commandTypes.items);
  const [formData, setFormData] = useState({ name: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [commandTypeList, setCommandTypeList] = useState([]);
  const [selectedCommandTypeId, setSelectedCommandTypeId] = useState(null);

  
  useEffect(() => {
    dispatch(fetchCommandTypes());
  }, [dispatch]);

  useEffect(() => {
    setCommandTypeList(commandTypes);
  }, [commandTypes]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setModalMode('create');
    setFormData({ name: '' });
    setSelectedCommandTypeId(null);
  };

  const openEditModal = (commandType) => {
    setIsAddModalOpen(true);
    setModalMode('update');
    setFormData({ name: commandType.name });
    setSelectedCommandTypeId(commandType.id);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalMode('create');
    setFormData({ name: '' });
    setSelectedCommandTypeId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await commandTypeService.createCommandType(formData);
        setCommandTypeList([...commandTypeList, formData]);
        closeAddModal();
      } else if (modalMode === 'update' && selectedCommandTypeId) {
        await commandTypeService.updateCommandType(selectedCommandTypeId, formData);
        const updatedCommandTypes = commandTypeList.map(ct => {
          if (ct.id === selectedCommandTypeId) {
            return { ...ct, name: formData.name };
          }
          return ct;
        });
        setCommandTypeList(updatedCommandTypes);
        closeAddModal();
      }
    } catch (error) {
      alert('Failed to save command type: ' + error.message);
    }
  };

  const handleDelete = async (commandTypeId) => {
    if (window.confirm('Are you sure you want to delete this command type?')) {
      try {
        await commandTypeService.deleteCommandType(commandTypeId);
        setCommandTypeList(commandTypeList.filter((ct) => ct.id !== commandTypeId));
      } catch (error) {
        alert('Failed to delete command type: ' + error.message);
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

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">ბრძანების ტიპები</h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#FBD15B] text-[#1976D2] px-4 py-4 rounded-md flex items-center gap-2"
              onClick={openAddModal}
            >
              + დაამატე ახალი ბრძანება
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              Download Data
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {commandTypeList &&
            commandTypeList.map((commandType, index) => (
              <div key={index} className="flex justify-between items-center mb-2 border-b py-2 border-black">
                <div className="flex items-center gap-2 text-sm">
                  <p className="text-gray-700 font-medium">{commandType.name}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openEditModal(commandType)}>
                    <img src={CreateIcon} alt="Edit Icon" />
                  </button>
                  <button onClick={() => handleDelete(commandType.id)}>
                    <img src={DeleteIcon} alt="Delete Icon" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">{modalMode === 'create' ? 'დაამატე ახალი ბრძანება' : 'შეცვალე ბრძანების ტიპი'}</h2>
              <button onClick={closeAddModal} className="hover:text-gray-200 focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-3">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
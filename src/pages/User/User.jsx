import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import NewIcon from '../../assets/new.png';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import EditIcon from '../../assets/edit.png';
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import GeneralInputGroup from '../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../components/GeneralSelectGroup';
import SearchButton from '../../components/SearchButton';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../redux/userDataSlice';

const User = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users.items);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setModalMode('create');
    setName('');
    setUsername('');
    setUserType('');
    setDepartment('');
  };

  const openUpdateModal = (user) => {
    setIsAddModalOpen(true);
    setModalMode('update');
    setSelectedUserId(user.id);
    setName(user.name);
    setUsername(user.username);
    setUserType(user.user_type.name);
    setDepartment(user.department.name);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalMode('create');
    setSelectedUserId(null);
    setName('');
    setUsername('');
    setUserType('');
    setDepartment('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !userType.trim() || !department.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const userData = {
      name: name.trim(),
      username: username.trim(),
      user_type: userType.trim(),
      department: department.trim(),
    };

    if (modalMode === 'create') {
      dispatch(createUser(userData))
        .then(() => {
          closeAddModal();
        })
        .catch(error => {
          alert("Failed to create user: " + error.message);
        });
    } else if (modalMode === 'update' && selectedUserId) {
      dispatch(updateUser({ id: selectedUserId, userData }))
        .then(() => {
          closeAddModal();
        })
        .catch(error => {
          alert("Failed to update user: " + error.message);
        });
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId))
        .then(() => {
        })
        .catch(error => {
          alert("Failed to delete user: " + error.message);
        });
    }
  };

  const handleRowClick = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  return (
    <AuthenticatedLayout>
      <div className='w-full px-20 py-4 flex flex-col gap-8'>
        <div className="flex justify-between items-center w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            მომხმარებლები
          </h1>
          <div className='flex items-center gap-8'>
            <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={openAddModal}>
              <img src={NewIcon} alt="New" />
              New
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              Download Data
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <GeneralInputGroup
            name="employee"
            placeholder="თანამშრომელი"
            type="text"
          />
          <GeneralSelectGroup
            label="დეპარტამენტი"
            options={["Option 1", "Option 2", "Option 3"]}
          />
          <SearchButton />
        </div>
        <div className="container mx-auto mt-10 overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-6 gap-2 bg-[#1976D2] text-white py-6 px-4 min-w-max">
              <div>მომხმარებელი</div>
              <div>სახელი გვარი</div>
              <div>მომხმარებლის ტიპი</div>
              <div>დეპარტამენტი</div>
              <div>თანამშრომელი</div>
              <div className='flex gap-4 items-center justify-center'>განახლება/წაშლა</div> {/* Added for edit and delete icons */}
            </div>
            <div className="h-100 min-w-max">
              {users && users.map((user) => (
                <div
                  key={user?.id}
                  className={`grid grid-cols-6 gap-2 py-2 px-4 border-b min-w-max cursor-pointer ${user?.id === selectedUserId ? 'bg-gray-200' : ''}`}
                  onClick={() => handleRowClick(user.id)}
                >
                  <div>{user?.username}</div>
                  <div>{user?.name}</div>
                  <div>{user?.user_type.name}</div>
                  <div>{user?.department?.name}</div>
                  <div>{user?.employee}</div>
                  <div className="flex gap-4 items-center justify-center">
                    <button onClick={() => openUpdateModal(user)} className="hover:text-gray-600 focus:outline-none">
                      <img src={CreateIcon} alt="Edit" className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="hover:text-gray-600 focus:outline-none">
                      <img src={DeleteIcon} alt="Delete" className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full ">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">{modalMode === 'create' ? 'დაამატე ახალი მომხმარებელი' : 'განაახლე მომხმარებელი'}</h2>
              <button onClick={closeAddModal} className="hover:text-gray-200 focus:outline-none">
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
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">მომხმარებელი:</label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">მომხმარებლის ტიპი:</label>
                <input
                  type="text"
                  id="userType"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">დეპარტამენტი:</label>
                <input
                  type="text"
                  id="department"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2">Save</button>
                <button type="button" onClick={closeAddModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default User;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import NewIcon from '../../assets/new.png';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import GeneralInputGroup from '../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../components/GeneralSelectGroup';
import SearchButton from '../../components/SearchButton';
import { fetchUsers } from '../../redux/userDataSlice';
import { fetchUserTypes } from '../../redux/userTypeSlice';
import { fetchDepartments } from '../../redux/departmentsSlice';
import { fetchEmployees } from '../../redux/employeeSlice';
import userService from '../../services/users';
import EmployeeModal from '../../components/employee/EmployeeModal';
import * as XLSX from "xlsx";

const User = () => {
  const dispatch = useDispatch();
  const usersData = useSelector(state => state.user.users.items);
  const userTypes = useSelector(state => state.userType.items);
  const { departments } = useSelector((state) => state.departments);
  const employees = useSelector((state) => state.employees.items);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    userType: '',
    department: '',
    employeeId: ''
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUserTypes());
    dispatch(fetchDepartments());
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    setUsers(usersData);
  }, [usersData]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setModalMode('create');
    setFormData({
      name: '',
      username: '',
      userType: '',
      department: '',
      employeeId: ''
    });
  };

  const openUpdateModal = (user) => {
    setIsAddModalOpen(true);
    setModalMode('update');
    setSelectedUserId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      userType: user.user_type.id,
      department: user.department ? user.department.id : '',
      employeeId: user.employee ? user.employee.id : ''
    });
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalMode('create');
    setSelectedUserId(null);
    setFormData({
      name: '',
      username: '',
      userType: '',
      department: '',
      employeeId: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { name, username, userType, department, employeeId } = formData;

    const userData = {
      name: name,
      username: username,
      user_type_id: userType,
      department_id: department,
      employee_id: employeeId
    };

    try {
      if (modalMode === 'create') {
        const createdUser = await userService.createUser(userData);

        console.log(createdUser);
        setUsers([...users, createdUser]);
        closeAddModal();
      } else if (modalMode === 'update' && selectedUserId) {
        const updatedUser = await userService.updateUser(selectedUserId, userData);
        const updatedIndex = users.findIndex(user => user.id === selectedUserId);
        if (updatedIndex !== -1) {
          const updatedUsers = [...users];
          updatedUsers[updatedIndex] = updatedUser;
          setUsers(updatedUsers);
        }
        closeAddModal();
      }
    } catch (error) {
      alert("Failed to save user: " + error.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        alert("Failed to delete user: " + error.message);
      }
    }
  };

  const handleRowClick = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEmployeeInputClick = () => {
    setIsEmployeeModalOpen(true);
  };

  const handleSelectEmployee = (employee) => {
    setFormData(prevState => ({
      ...prevState,
      employeeId: employee.id
    }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        მომხმარებელი: user.username,
        "სახელი გვარი": user.name,
        "მომხმარებლის ტიპი": user.user_type.name,
        დეპარტამენტი: user.department?.name,
        თანამშრომელი: user.employee?.fullname,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users.xlsx");
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
            <button onClick={exportToExcel} className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              ჩამოტვირთვა
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <GeneralInputGroup
            name="name"
            placeholder="სახელი"
            type="text"
          />
          <GeneralInputGroup
            name="username"
            placeholder="მომხმარებელი"
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
              <div className='flex gap-4 items-center justify-center'>განახლება/წაშლა</div>
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
                  <div>{user?.user_type?.name}</div>
                  <div>{user?.department?.name}</div>
                  <div>{user?.employee?.fullname}</div>
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
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
                  name="name"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">მომხმარებელი:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">მომხმარებლის ტიპი:</label>
                <select
                  id="userType"
                  name="userType"
                  className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="">აირჩიე მომხმარებლის ტიპი</option>
                  {userTypes && userTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">დეპარტამენტი:</label>
                <select
                  id="department"
                  name="department"
                  className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">აირჩიე დეპარტამენტი</option>
                  {departments && departments.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">თანამშრომელი:</label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.employeeId}
                  onClick={handleEmployeeInputClick}
                  readOnly
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

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSelectEmployee={handleSelectEmployee}
      />
    </AuthenticatedLayout>
  );
};

export default User;

import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, fetchNestedDepartments } from "../../redux/departmentsSlice";
import departmentService from "../../services/department";

const Department = () => {
  const dispatch = useDispatch();
  const { nestedDepartments, departments } = useSelector((state) => state.departments);
  const [formData, setFormData] = useState({ name: "", parent_id: null });
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [nesteds, setNesteds] = useState([])

  useEffect(() => {
    dispatch(fetchNestedDepartments());
    dispatch(fetchDepartments())
  }, []);

  useEffect(() => {
    setNesteds(nestedDepartments);
  }, [nestedDepartments]);
  

  const toggleSubMenu = (e) => {
    e.stopPropagation();
    const submenu = e.currentTarget.querySelector("ul");

    if (!submenu) return;

    submenu.style.display = submenu.style.display === "none" || submenu.style.display === "" ? "block" : "none";
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setModalMode('create');
    setFormData({ name: "", parent_id: null });
  };

  const openUpdateModal = (department) => {
    setIsAddModalOpen(true);
    setModalMode('update');
    setSelectedDepartmentId(department.id);
    setFormData({ name: department.name, parent_id: department.parent_id });
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalMode('create');
    setSelectedDepartmentId(null);
    setFormData({ name: "", parent_id: null });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'create') {
        const createdDepartment = await departmentService.createDepartment(formData);
        setNesteds([...nesteds, createdDepartment]);
        closeAddModal();
      } else if (modalMode === 'update' && selectedDepartmentId) {
        const updatedDepartment = await departmentService.updateDepartment(selectedDepartmentId, formData);
        const updatedIndex = nesteds.findIndex(dep => dep.id === selectedDepartmentId);
        if (updatedIndex !== -1) {
          const updatedNesteds = [...nesteds];
          updatedNesteds[updatedIndex] = updatedDepartment;
          setNesteds(updatedNesteds); 
        }
        closeAddModal();
      }
    } catch (error) {
      alert("Failed to save department: " + error.message);
    }
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await departmentService.deleteDepartment(departmentId);
        setNesteds(nesteds.filter(dep => dep.id !== departmentId)); 
      } catch (error) {
        alert("Failed to delete department: " + error.message);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const renderSubMenu = (subMenu, level = 1) => {
    return (
      <ul className={`ml-10 hidden`}>
        {subMenu.map((subItem, index) => (
          <li key={index} onClick={toggleSubMenu} className="cursor-pointer">
            <div className="flex justify-between items-center mb-2 border-b py-2 border-black">
              <div className="flex items-center gap-2 text-sm">
                
                  {
                    subItem?.children?.length > 0 && (<button className="bg-[#00C7BE] text-white px-1 rounded py-[0.2px]">+</button>)
                  }
                <p className="text-gray-700 font-medium">{subItem.name}</p>
              </div>
              <div className="flex space-x-2">
                <button>
                  <img src={CreateIcon} alt="" onClick={() => openUpdateModal(subItem)}/>
                </button>
                <button>
                  <img src={DeleteIcon} alt="" onClick={() => handleDelete(subItem.id)} />
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
          <h1 className="text-[#1976D2] font-medium text-[23px]">დეპარტამენტები</h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#FBD15B] text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={openAddModal}
            >
              + დაამატე ახალი დეპარტამენტები
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              Download Data
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {nesteds && nesteds.map((item, index) => (
            <div key={index} onClick={toggleSubMenu} className="cursor-pointer">
              <div className="flex justify-between items-center mb-2 border-b py-2 border-black">
                <div className="flex items-center gap-2 text-sm">
                  {
                    item?.children?.length > 0 && (<button className="bg-[#00C7BE] text-white px-1 rounded py-[0.2px]">+</button>)
                  }
                  
                  <p className="text-gray-700 font-medium">{item.name}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openUpdateModal(item)}>
                    <img src={CreateIcon} alt="" />
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    <img src={DeleteIcon} alt="" />
                  </button>
                </div>
              </div>
              {item.children && renderSubMenu(item.children)}
            </div>
          ))}
        </div>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {modalMode === 'create' ? 'დაამატე ახალი დეპარტამენტი' : 'განაახლე დეპარტამენტი'}
              </h2>
              <button onClick={closeAddModal} className="hover:text-gray-200 focus:outline-none">
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
                  name="name"
                  className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">მომხმარებლის ტიპი:</label>
                <select
                  id="parent_id"
                  name="parent_id"
                  className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={formData.parent_id}
                  onChange={handleChange}
                >
                  <option value="">დაქვემდებარებული</option>
                  {departments && departments.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
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

export default Department;

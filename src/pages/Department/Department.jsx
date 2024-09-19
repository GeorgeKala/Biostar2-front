import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  fetchNestedDepartments,
} from "../../redux/departmentsSlice";
import departmentService from "../../services/department";
import ExcelJS from "exceljs";
import CustomSelect from "../../components/CustomSelect";
import { useFormData } from "../../hooks/useFormData";

const Department = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const { nestedDepartments, departments } = useSelector(
    (state) => state.departments
  );

  // UseFormData for both form and filter states
  const { formData, handleFormDataChange, setFormData } = useFormData({
    name: "",
    parent_id: null,
    searchTerm: "",
  });

  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [filteredDepartments, setFilteredDepartments] =
    useState(nestedDepartments);

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
    if (formData.searchTerm) {
      setFilteredDepartments(searchItems(nestedDepartments, formData.searchTerm));
    } else {
      setFilteredDepartments(nestedDepartments);
    }
  }, [formData.searchTerm, nestedDepartments]);

  useEffect(() => {
    dispatch(fetchNestedDepartments());
  }, [dispatch]);

  const toggleSubMenu = (subItemId) => {
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [subItemId]: !prevOpenSubmenus[subItemId],
    }));
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setModalMode("create");
    setFormData({ name: "", parent_id: null });
  };

  const openUpdateModal = (department) => {
    setIsAddModalOpen(true);
    setModalMode("update");
    setSelectedDepartmentId(department.id);
    setFormData({ name: department.name, parent_id: department.parent_id });
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalMode("create");
    setSelectedDepartmentId(null);
    setFormData({ name: "", parent_id: null });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await departmentService.createDepartment(formData);
        closeAddModal();
        dispatch(fetchNestedDepartments());
        dispatch(fetchDepartments());
      } else if (modalMode === "update" && selectedDepartmentId) {
        await departmentService.updateDepartment(
          selectedDepartmentId,
          formData
        );
        closeAddModal();
        dispatch(fetchNestedDepartments());
        dispatch(fetchDepartments());
      }
    } catch (error) {
      alert("Failed to save department: " + error.message);
    }
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm("დარწმუნებული ხართ რომ გინდათ დეპარტამენტის წაშლა?")) {
      try {
        await departmentService.deleteDepartment(departmentId);
        dispatch(fetchNestedDepartments());
        dispatch(fetchDepartments());
      } catch (error) {
        alert("Failed to delete department: " + error.message);
      }
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Departments");

    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Name", key: "Name", width: 50 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "center",
    };

    const flattenData = (departments, parentName = "") => {
      departments.forEach((department) => {
        const fullName = parentName
          ? `${parentName} > ${department.name}`
          : department.name;
        worksheet.addRow({
          ID: department.id,
          Name: fullName,
        });

        if (department.children && department.children.length > 0) {
          flattenData(department.children, fullName);
        }
      });
    };

    flattenData(nestedDepartments);

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Departments.xlsx";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-between items-center mb-2 border-b py-2 border-black"
          >
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
            {user.user_type.name === "ადმინისტრატორი" && (
              <div className="flex space-x-2">
                <button onClick={() => openUpdateModal(subItem)}>
                  <img src={CreateIcon} alt="Edit Icon" />
                </button>
                <button onClick={() => handleDelete(subItem.id)}>
                  <img src={DeleteIcon} alt="Delete Icon" />
                </button>
              </div>
            )}
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
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            დეპარტამენტები
          </h1>
          {user.user_type.name === "ადმინისტრატორი" && (
            <div className="flex items-center gap-8">
              <button
                className="bg-[#FBD15B] text-[#1976D2] px-4 py-4 rounded-md flex items-center gap-2"
                onClick={openAddModal}
              >
                + დაამატე ახალი დეპარტამენტი
              </button>
              <button
                onClick={exportToExcel}
                className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
              >
                ჩამოტვირთვა
                <span className="absolute inset-0 border border-white border-dashed rounded"></span>
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="ძებნა დეპარტამენტის მიხედვით"
            name="searchTerm"
            value={formData.searchTerm}
            onChange={handleFormDataChange}
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

        <div>
          {filteredDepartments &&
            filteredDepartments.map((item, index) => (
              <div key={index} className="cursor-pointer">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex justify-between items-center mb-2 border-b py-2 border-black"
                >
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
                  {user.user_type.name === "ადმინისტრატორი" && (
                    <div className="flex space-x-2">
                      <button onClick={() => openUpdateModal(item)}>
                        <img src={CreateIcon} alt="Edit Icon" />
                      </button>
                      <button onClick={() => handleDelete(item.id)}>
                        <img src={DeleteIcon} alt="Delete Icon" />
                      </button>
                    </div>
                  )}
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
                {modalMode === "create"
                  ? "დაამატე ახალი დეპარტამენტი"
                  : "განაახლე დეპარტამენტი"}
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
                  onChange={handleFormDataChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="parent_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  დაქვემდებარებული:
                </label>
                <CustomSelect
                  options={departments.map((item) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                  selectedValue={
                    departments.find((d) => d.id === formData.parent_id)?.name
                  }
                  onSelect={(selectedOption) =>
                    setFormData({ ...formData, parent_id: selectedOption.id })
                  }
                  placeholder="აირჩიე დეპარტამენტი"
                  className="bg-gray-300"
                />
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
                  onClick={closeAddModal}
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

export default Department;

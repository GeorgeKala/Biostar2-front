import { useState, useEffect, useCallback } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import NewIcon from "../../assets/new.png";
import SearchIcon from "../../assets/search.png";
import DeleteIcon from "../../assets/delete.png";
import EditIcon from "../../assets/edit.png";
import buildingService from "../../services/building";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "../../redux/departmentsSlice";
import { fetchBuildings } from "../../redux/buildingSlice";
import * as XLSX from "xlsx";
import { useFilter } from "../../hooks/useFilter";
import FilterModal from "../../components/FilterModal";
import Table from "../../components/Table";
import { useFilterAndSort } from "../../hooks/useFilterAndSort";

const DepartmentDistribution = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");
  const [filterableData, setFilterableData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const buildings = useSelector((state) => state.building.items);
  const { departments } = useSelector((state) => state.departments);

  const [formData, setFormData] = useState({
    department_id: "",
    building_id: "",
  });

  const { filters, handleInputChange, applyModalFilters } = useFilter({
    building_name: { text: "", selected: [] },
    department_name: { text: "", selected: [] },
  });

  const {
    filteredAndSortedData: filteredRecords,
    handleSort,
    sortConfig,
  } = useFilterAndSort(data, filters, { key: "", direction: "ascending" });

  useEffect(() => {
    fetchData();
    dispatch(fetchBuildings());
    dispatch(fetchDepartments());
  }, []);

  const fetchData = async () => {
    try {
      const response = await buildingService.getBuildingsWithDepartments();
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleItemClick = (itemId, departmentId, buildingId) => {
    setSelectedItemId(itemId);
    setFormData({
      department_id: departmentId,
      building_id: buildingId,
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedItemId(null);
    setFormData({
      department_id: "",
      building_id: "",
    });
  };

  const handleAddDepartmentToBuilding = async () => {
    if (formData.department_id && formData.building_id) {
      try {
        if (selectedItemId) {
          await buildingService.updateDepartmentBuilding(
            formData.building_id,
            formData.department_id
          );
        } else {
          await buildingService.attachDepartment(
            formData.building_id,
            formData.department_id
          );
        }

        setShowModal(false);
        setSelectedItemId(null);
        setFormData({
          department_id: "",
          building_id: "",
        });

        fetchData();
      } catch (error) {
        console.error("Error adding/editing department to building:", error);
      }
    } else {
      console.error("Please select both a building and a department.");
    }
  };

  const handleDelete = async () => {
    if (formData.department_id && formData.building_id) {
      try {
        await buildingService.detachDepartment(
          formData.building_id,
          formData.department_id
        );
        fetchData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map((item) => ({
        შენობა: item.building_name,
        დეპარტამენტი: item.department_name,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DepartmentDistribution");
    XLSX.writeFile(workbook, "DepartmentDistribution.xlsx");
  }, [filteredRecords]);

  const handleOpenFilterModal = useCallback((data, fieldName, rect) => {
    const uniqueData = [...new Set(data)];
    setFilterableData(uniqueData);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  }, []);

  const handleEditClick = () => {
    if (selectedItemId) {
      setShowModal(true); 
    } else {
      console.error("No item selected to edit");
    }
  };

  const recordHeaders = [
    {
      label: "შენობა",
      key: "building_name",
      extractValue: (record) => record.building_name,
    },
    {
      label: "დეპარტამენტი",
      key: "department_name",
      extractValue: (record) => record.department_name,
    },
  ];

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            დეპარტამენტების განაწილება
          </h1>
          <div className="flex items-center gap-8">
            <button
              className="bg-[#5CB85C] text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <img src={NewIcon} alt="New Icon" />
              ახალი
            </button>
            <button
              className="bg-[#1976D2] text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={handleEditClick} // Attach the edit click handler here
            >
              <img src={EditIcon} alt="Edit Icon" />
              შეცვლა
            </button>
            <button
              className="bg-[#D9534F] text-white px-4 py-4 rounded-md flex items-center gap-2"
              onClick={handleDelete}
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

        {/* Table */}
        <Table
          data={filteredRecords}
          headers={recordHeaders}
          filters={filters}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterClick={handleOpenFilterModal}
          onFilterChange={handleInputChange}
          rowClassName={(record) =>
            selectedItemId === record.id ? "bg-gray-200" : ""
          }
          onRowClick={(record) =>
            handleItemClick(record.id, record.department_id, record.building_id)
          }
          filterableFields={["building_name", "department_name"]}
        />
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium mb-4">
              დეპარტამენტების განაწილება
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
                value={formData.building_id}
                onChange={(e) =>
                  setFormData({ ...formData, building_id: e.target.value })
                }
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
                htmlFor="department_id"
                className="block text-sm font-medium text-gray-700"
              >
                დეპარტამენტი:
              </label>
              <select
                id="department_id"
                name="department_id"
                value={formData.department_id}
                onChange={(e) =>
                  setFormData({ ...formData, department_id: e.target.value })
                }
                className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="">დეპარტამენტი</option>
                {departments &&
                  departments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleModalClose}
              >
                გაუქმება
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleAddDepartmentToBuilding}
              >
                {selectedItemId ? "რედაქტირება" : "დამატება"}
              </button>
            </div>
          </div>
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterableData={filterableData}
        onApply={(selectedFilters) =>
          applyModalFilters(currentFilterField, selectedFilters)
        }
        position={modalPosition}
      />
    </AuthenticatedLayout>
  );
};

export default DepartmentDistribution;

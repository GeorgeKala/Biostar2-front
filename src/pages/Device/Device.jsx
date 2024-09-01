import React, { useEffect, useState, useCallback } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import buildingService from "../../services/building";
import accessGroupService from "../../services/accessGroup";
import { useDispatch, useSelector } from "react-redux";
import { fetchBuildings } from "../../redux/buildingSlice";
import * as XLSX from "xlsx";
import Table from "../../components/Table";
import FilterModal from "../../components/FilterModal";
import { useFilter } from "../../hooks/useFilter";
import { useFilterAndSort } from "../../hooks/useFilterAndSort";
import ExcelJS from "exceljs";

const Device = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedAccessGroup, setSelectedAccessGroup] = useState(null);
  const [accessGroups, setAccessGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isKitchen, setIsKitchen] = useState(false);

  const dispatch = useDispatch();
  const buildings = useSelector((state) => state.building.items);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState("");
  const [filterableData, setFilterableData] = useState([]);

  // const { filters, handleInputChange, applyModalFilters } = useFilter({
  //   building_name: { text: "", selected: [] },
  //   device_name: { text: "", selected: [] },
  // });

  const {
    filteredAndSortedData: filteredRecords,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    filters,
    sortConfig,
  } = useFilterAndSort(
    data,
    {
      building_name: { text: "", selected: [] },
      access_group_name: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

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
    setIsKitchen(false);
  };

  const handleEditClick = () => {
    if (selectedItem) {
      setShowModal(true);
      setSelectedBuildingId(selectedItem.building_id);
      setSelectedAccessGroup(selectedItem.access_group);
      setIsKitchen(selectedItem.type === "kitchen");
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
        const buildingType = isKitchen ? "kitchen" : null;
        const parsedBuildingId = parseInt(selectedBuildingId, 10);

        await buildingService.addAccessGroup(
          parsedBuildingId,
          [selectedAccessGroup],
          buildingType
        );

        setShowModal(false);
        setSelectedBuildingId("");
        setSelectedAccessGroup(null);
        setIsKitchen(false);

        setData((prevData) =>
          prevData
            .map((building) => {
              if (building.building_id === parsedBuildingId) {
                const updatedAccessGroups = [
                  ...(Array.isArray(building.access_groups)
                    ? building.access_groups
                    : []),
                  {
                    access_group_id: selectedAccessGroup.access_group_id,
                    access_group_name: selectedAccessGroup.device_name,
                    device_name: selectedAccessGroup.device_name,
                    building_id: parsedBuildingId,
                    building_name: building.building_name,
                  },
                ];

                return updatedAccessGroups.map((group) => ({
                  building_id: building.building_id,
                  building_name: building.building_name,
                  access_group_id: group.access_group_id,
                  access_group_name: group.access_group_name,
                  device_name: group.device_name,
                }));
              }
              return building;
            })
            .flat()
        );
      } catch (error) {
        console.error("Error adding access group to building:", error);
      }
    } else {
      console.error("Please select both a building and an access group.");
    }
  };

  const handleDeleteAccessGroup = async () => {
    if (selectedItem) {
      try {
        const parsedBuildingId = parseInt(selectedItem.building_id, 10);

        await buildingService.removeAccessGroup(
          parsedBuildingId,
          selectedItem.access_group_id
        );

        setData((prevData) =>
          prevData
            .map((building) => {
              if (building.building_id === parsedBuildingId) {
                const updatedAccessGroups = (
                  building.access_groups || []
                ).filter(
                  (group) =>
                    group.access_group_id !== selectedItem.access_group_id
                );

                if (updatedAccessGroups.length > 0) {
                  return updatedAccessGroups.map((group) => ({
                    building_id: building.building_id,
                    building_name: building.building_name,
                    access_group_id: group.access_group_id,
                    access_group_name: group.access_group_name,
                    device_name: group.device_name,
                  }));
                } else {
                  return {
                    building_id: building.building_id,
                    building_name: building.building_name,
                    access_group_id: null,
                    access_group_name: null,
                    device_name: null,
                  };
                }
              }
              return building;
            })
            .flat()
        );

        setSelectedItem(null);
      } catch (error) {
        console.error("Error removing access group from building:", error);
      }
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const handleAccessGroupChange = (e) => {
    const selectedGroup = accessGroups.find(
      (group) => group.access_group_id === e.target.value
    );
    setSelectedAccessGroup(selectedGroup);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("მოწყობილობები");

    worksheet.columns = [
      { header: "შენობა", key: "building_name", width: 30 },
      { header: "მოწყობილობა", key: "access_group_name", width: 30 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    const dataToExport = [];

    filteredRecords.forEach((item) => {
      const existingBuilding = dataToExport.find(
        (entry) => entry.building_name === item.building_name
      );

      if (existingBuilding) {
        existingBuilding.access_group_name += `, ${item.access_group_name}`;
      } else {
        dataToExport.push({
          building_name: item.building_name,
          access_group_name: item.access_group_name,
        });
      }
    });

    dataToExport.forEach((item) => {
      worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "მოწყობილობები.xlsx";
    document.body.appendChild(link);
    link.click();

    // Clean up the URL.createObjectURL object
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenFilterModal = useCallback((data, fieldName, rect) => {
    const uniqueData = [...new Set(data)];
    setFilterableData(uniqueData);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  }, []);

  const recordHeaders = [
    {
      label: "შენობა",
      key: "building_name",
      extractValue: (record) => record.building_name,
    },
    {
      label: "მოწყობილობა",
      key: "access_group_name",
      extractValue: (record) => record.access_group_name,
    },
  ];

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
              ახალი
            </button>
            <button
              onClick={handleDeleteAccessGroup}
              className="bg-[#D9534F] text-white px-4 py-4 rounded-md flex items-center gap-2"
              disabled={!selectedItem}
            >
              წაშლა
            </button>
            <button
              onClick={exportToExcel}
              className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
            >
              ჩამოტვირთვა
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
          onFilterChange={handleFilterChange}
          rowClassName={(record) =>
            selectedItem?.building_id === record.building_id &&
            selectedItem?.access_group_id === record.access_group_id
              ? "bg-blue-300"
              : ""
          }
          onRowClick={(record) => handleRowClick(record)}
          filterableFields={["building_name", "access_group_name"]}
        />

        {/* Modals */}
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
                  htmlFor="access_group"
                  className="block text-sm font-medium text-gray-700"
                >
                  ხელმისაწვდომი ჯგუფი:
                </label>
                <select
                  id="access_group"
                  name="access_group"
                  value={
                    selectedAccessGroup
                      ? selectedAccessGroup.access_group_id
                      : ""
                  }
                  onChange={handleAccessGroupChange}
                  className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="">აირჩიე მოწყობილობა</option>
                  {accessGroups.map((group) => (
                    <option
                      key={group.access_group_id}
                      value={group.access_group_id}
                    >
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
                  სამზარეულოს აპარტი
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

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filterableData={filterableData}
          onApply={(selectedFilters) =>
            applyModalFilters(currentFilterField, selectedFilters)
          }
          position={modalPosition}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default Device;

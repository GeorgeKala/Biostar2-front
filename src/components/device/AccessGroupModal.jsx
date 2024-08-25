import React from "react";

const AccessGroupModal = ({
  show,
  buildings,
  accessGroups,
  selectedBuildingId,
  selectedAccessGroup,
  isKitchen,
  onClose,
  onSubmit,
  onBuildingChange,
  onAccessGroupChange,
  onIsKitchenChange,
}) => {
  return (
    show && (
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
              onChange={onBuildingChange}
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
                selectedAccessGroup ? selectedAccessGroup.access_group_id : ""
              }
              onChange={onAccessGroupChange}
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
                onChange={onIsKitchenChange}
                className="mr-2"
              />
              Is Kitchen
            </label>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={onSubmit}
            >
              {selectedBuildingId ? "რედაქტირება" : "დამატება"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AccessGroupModal;

import axiosInstance from "../Config/axios";

const buildingService = {
  getAllBuildings: async () => {
    try {
      const response = await axiosInstance.get("/buildings");

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBuildingById: async (id) => {
    try {
      const response = await axiosInstance.get(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBuilding: async (buildingData) => {
    try {
      const response = await axiosInstance.post("/buildings", buildingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBuilding: async (id, buildingData) => {
    try {
      const response = await axiosInstance.put(
        `/buildings/${id}`,
        buildingData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBuilding: async (id) => {
    try {
      await axiosInstance.delete(`/buildings/${id}`);
    } catch (error) {
      throw error;
    }
  },

  attachDepartment: async (buildingId, departmentId) => {
    try {
      const response = await axiosInstance.post(
        `/buildings/${buildingId}/attach-department`,
        { department_id: departmentId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  detachDepartment: async (buildingId, departmentId) => {
    try {
      const response = await axiosInstance.post(
        `/buildings/${buildingId}/detach-department`,
        { department_id: departmentId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDepartmentBuilding: async (buildingId, departmentId) => {
    try {
      const response = await axiosInstance.post(
        `/buildings/${buildingId}/update-department`,
        { department_id: departmentId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBuildingsWithDepartments: async () => {
    try {
      const response = await axiosInstance.get("/buildings/departments");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNestedBuildings: async () => {
    try {
      const response = await axiosInstance.get("/buildings/nested");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getBuildingsWithAccessGroups: async () => {
    try {
      const response = await axiosInstance.get(
        "/buildings-with-access-groups",
        {
          headers: {
            "bs-session-id": sessionStorage.getItem("sessionToken"),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addAccessGroup: async (buildingId, accessGroups, type) => {
    try {
      const response = await axiosInstance.put(
        `/buildings/${buildingId}/access-groups`,
        {
          access_group: accessGroups,
          type: type,  
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeAccessGroup: async (buildingId, accessGroupId) => {
    try {
      const response = await axiosInstance.delete(
        `/buildings/${buildingId}/access-groups`,
        {
          data: { access_group_id: accessGroupId },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default buildingService;

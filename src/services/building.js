import axiosInstance from "../Config/axios";

const buildingService = {
  getAllBuildings: async () => {
    try {
      const response = await axiosInstance.get("/buildings");
      return response.data.buildings;
    } catch (error) {
      throw error;
    }
  },

  getBuildingById: async (id) => {
    try {
      const response = await axiosInstance.get(`/buildings/${id}`);
      return response.data.building;
    } catch (error) {
      throw error;
    }
  },

  createBuilding: async (buildingData) => {
    try {
      const response = await axiosInstance.post("/buildings", buildingData);
      return response.data.building;
    } catch (error) {
      throw error;
    }
  },

  updateBuilding: async (id, buildingData) => {
    try {
      const response = await axiosInstance.put(`/buildings/${id}`, buildingData);
      return response.data.building;
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
};

export default buildingService;

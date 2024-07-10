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
      const response = await axiosInstance.put(`/buildings/${id}`, buildingData);
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
      const response = await axiosInstance.post(`/buildings/${buildingId}/attach-department`, { department_id: departmentId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  detachDepartment: async (buildingId, departmentId) => {
    try {
      const response = await axiosInstance.post(`/buildings/${buildingId}/detach-department`, { department_id: departmentId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDepartmentBuilding: async (buildingId, departmentId) => {
    try {
      const response = await axiosInstance.post(`/buildings/${buildingId}/update-department`, { department_id: departmentId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBuildingsWithDepartments: async () => {
    try {
      const response = await axiosInstance.get("/buildings/departments");
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


};

export default buildingService;

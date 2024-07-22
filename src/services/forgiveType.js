import axiosInstance from "../Config/axios";

const forgiveTypeService = {
  getAllForgiveTypes: async () => {
    try {
      const response = await axiosInstance.get("/forgive-types");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getForgiveTypeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/forgive-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createForgiveType: async (forgiveTypeData) => {
    try {
      const response = await axiosInstance.post("/forgive-types", forgiveTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateForgiveType: async (id, forgiveTypeData) => {
    try {
      const response = await axiosInstance.put(`/forgive-types/${id}`, forgiveTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteForgiveType: async (id) => {
    try {
      await axiosInstance.delete(`/forgive-types/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default forgiveTypeService;

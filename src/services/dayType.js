import axiosInstance from "../Config/axios";

const dayTypeService = {
  getAllDayTypes: async () => {
    try {
      const response = await axiosInstance.get("/day-types");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDayTypeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/day-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createDayType: async (dayTypeData) => {
    try {
      const response = await axiosInstance.post("/day-types", dayTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDayType: async (id, dayTypeData) => {
    try {
      const response = await axiosInstance.put(`/day-types/${id}`, dayTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDayType: async (id) => {
    try {
      await axiosInstance.delete(`/day-types/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default dayTypeService;

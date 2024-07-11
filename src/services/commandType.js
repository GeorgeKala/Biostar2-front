import axiosInstance from "../Config/axios";

const commandTypeService = {
  getAllCommandTypes: async () => {
    try {
      const response = await axiosInstance.get("/command-types");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCommandTypeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/command-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCommandType: async (commandTypeData) => {
    try {
      const response = await axiosInstance.post("/command-types", commandTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCommandType: async (id, commandTypeData) => {
    try {
      const response = await axiosInstance.put(`/command-types/${id}`, commandTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCommandType: async (id) => {
    try {
      await axiosInstance.delete(`/command-types/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default commandTypeService;

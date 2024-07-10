import axiosInstance from "../Config/axios";

const userTypeService = {
  getAllUserTypes: async () => {
    try {
      const response = await axiosInstance.get("/user-types");
     
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserTypeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/user-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUserType: async (userTypeData) => {
    try {
      const response = await axiosInstance.post("/user-types", userTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserType: async (id, userTypeData) => {
    try {
      const response = await axiosInstance.put(`/user-types/${id}`, userTypeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUserType: async (id) => {
    try {
      await axiosInstance.delete(`/user-types/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default userTypeService;

import axiosInstance from "../Config/axios";

const userService = {
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },

  startImpersonation: async (userId) => {
    try {
        const response = await axiosInstance.post(`/impersonate/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
},

};

export default userService;

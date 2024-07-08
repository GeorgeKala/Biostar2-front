import axiosInstance from "../Config/axios";


const groupService = {
  getAllGroups: async () => {
    try {
      const response = await axiosInstance.get("/groups");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getGroupById: async (id) => {
    try {
      const response = await axiosInstance.get(`/groups/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createGroup: async (groupData) => {
    try {
      const response = await axiosInstance.post("/groups", groupData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateGroup: async (id, groupData) => {
    try {
      const response = await axiosInstance.put(`/groups/${id}`, groupData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteGroup: async (id) => {
    try {
      await axiosInstance.delete(`/groups/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default groupService;

import axiosInstance from "../Config/axios";

const departmentService = {
  getAllDepartments: async () => {
    try {
      const response = await axiosInstance.get("/departments");
      return response.data.departments;
    } catch (error) {
      throw error;
    }
  },

  getDepartmentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/departments/${id}`);
      return response.data.department;
    } catch (error) {
      throw error;
    }
  },

  createDepartment: async (departmentData) => {
    try {
      const response = await axiosInstance.post("/departments", departmentData);
      return response.data.department;
    } catch (error) {
      throw error;
    }
  },

  updateDepartment: async (id, departmentData) => {
    try {
      const response = await axiosInstance.put(
        `/departments/${id}`,
        departmentData
      );
      return response.data.department;
    } catch (error) {
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      await axiosInstance.delete(`/departments/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default departmentService;

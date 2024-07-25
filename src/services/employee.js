import axiosInstance from "../Config/axios";

const employeeService = {
  getAllEmployees: async () => {
    try {
      const response = await axiosInstance.get("/employees");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmployeeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/employees/${id}`);
      return response.data.employee;
    } catch (error) {
      throw error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await axiosInstance.post("/employees", employeeData);
      return response.data.employee;
    } catch (error) {
      throw error;
    }
  },

  updateEmployee: async (id, employeeData) => {
    try {
      const response = await axiosInstance.put(
        `/employees/${id}`,
        employeeData
      );
      return response.data.employee;
    } catch (error) {
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await axiosInstance.delete(`/employees/${id}`, {
        headers: {
          'bs-session-id': sessionStorage.getItem('sessionToken')
        }
    });
    } catch (error) {
      throw error;
    }
  },

  
};

export default employeeService;
import axiosInstance from "../Config/axios";

const employeeService = {
  getAllEmployees: async (filters) => {
    try {
      const response = await axiosInstance.get("/employees", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmployeeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/employees/${id}`);
      return response.data;
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
      return response;
    } catch (error) {
      throw error;
    }
  },

  // deleteEmployee: async (id) => {
  //   try {
  //     const response = await axiosInstance.delete(`/employees/${id}`, {
  //       headers: {
  //         "bs-session-id": sessionStorage.getItem("sessionToken"),
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  deleteEmployee: async (id, expiryDatetime) => {
    try {
      const response = await axiosInstance.put(
        `/employees/${id}/update-expiry`, 
        { expiry_datetime: expiryDatetime },
        {
          headers: {
            "bs-session-id": sessionStorage.getItem("sessionToken"),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getArchivedEmployees: async () => {
    try {
      const response = await axiosInstance.get("/employees/archived");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmployeesWithBuildings: async (employee_id, building_id) => {
    try {
      const params = {};
      if (employee_id) params.employee_id = employee_id;
      if (building_id) params.building_id = building_id;

      const response = await axiosInstance.get("/employees/buildings", {
        headers: {
          "bs-session-id": sessionStorage.getItem("sessionToken"),
        },
        params: params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAccessGroups: async (accessGroup, employeeId) => {
    try {
      const response = await axiosInstance.put(
        `/employees/access_groups/${employeeId}`,
        {
          access_groups: accessGroup,
        },
        {
          headers: {
            "bs-session-id": sessionStorage.getItem("sessionToken"),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeAccessGroups: async (accessGroupsToRemove, employeeId) => {
    try {
      const response = await axiosInstance.put(
        `/employees/access_groups/${employeeId}/remove`,
        {
          access_groups_to_remove: accessGroupsToRemove,
        },
        {
          headers: {
            "bs-session-id": sessionStorage.getItem("sessionToken"),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  removeUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/employees/${id}/remove`, {
        headers: {
          "bs-session-id": sessionStorage.getItem("sessionToken"),
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};




export default employeeService;

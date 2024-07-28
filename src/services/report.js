import axiosInstance from "../Config/axios";

const reportService = {
  fetchMonthlyReports: async (data) => {
    try {
      const sessionToken = sessionStorage.getItem("sessionToken");
      const response = await axiosInstance.post("/reports/monthly", data, {
        headers: {
          "bs-session-id": sessionToken,
        },
      });
      if (response.status === 200) {
        return response;
      } else {
        throw new Error("Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  updateOrCreateDayDetail: async (data) => {
    try {
      const response = await axiosInstance.post("/employee-day-detail", data);

      if (response.status === 200) {
        return response;
      } else {
        throw new Error("Failed to update or create day detail");
      }
    } catch (error) {
      console.error("Error updating or creating day detail:", error);
      throw error;
    }
  },

  fetchReports: async (data) => {
    try {
      const sessionToken = sessionStorage.getItem("bs_id_token");
      const response = await axiosInstance.post("/fetch-report", data, {
        headers: {
          "Bs-Session-Id": sessionToken,
        },
      });
      if (response.status === 200) {
        return response;
      } else {
        throw new Error("Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  deleteDayDetail: async (id) => {
    try {
      const response = await axiosInstance.delete(`/employee-day-detail/${id}`);
      if (response.status === 200) {
        return response;
      } else {
        throw new Error("Failed to delete day detail");
      }
    } catch (error) {
      console.error("Error deleting day detail:", error);
      throw error;
    }
  },

  updateDayTypeForDateRange: async (data) => {
    try {
      const response = await axiosInstance.post(
        "/employee-day-detail/update-day-type",
        data
      );
      if (response.status === 200) {
        return response;
      } else {
        throw new Error("Failed to update day type for date range");
      }
    } catch (error) {
      console.error("Error updating day type for date range:", error);
      throw error;
    }
  },

  deleteDayTypeForDateRange: async (data) => {
    try {
      const response = await axiosInstance.post(
        "/employee-day-detail/delete-day-type",
        data
      );
      if (response.status === 200) {
        return response;
      } else {
        throw new Error("Failed to delete day type for date range");
      }
    } catch (error) {
      console.error("Error deleting day type for date range:", error);
      throw error;
    }
  },
};
  
export default reportService;
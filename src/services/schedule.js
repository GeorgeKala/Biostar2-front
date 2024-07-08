import axiosInstance from "../Config/axios";

const scheduleService = {
  getAllSchedules: async () => {
    try {
      const response = await axiosInstance.get("/schedules");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getScheduleById: async (id) => {
    try {
      const response = await axiosInstance.get(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSchedule: async (scheduleData) => {
    try {
      const response = await axiosInstance.post("/schedules", scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await axiosInstance.put(
        `/schedules/${id}`,
        scheduleData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSchedule: async (id) => {
    try {
      await axiosInstance.delete(`/schedules/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default scheduleService;

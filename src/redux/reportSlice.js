import { createSlice } from "@reduxjs/toolkit";
import reportService from "../services/report";

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [],
    fullRecords: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setReports(state, action) {
      state.reports = action.payload;
      state.status = "succeeded";
    },
    setFullRecords(state, action) {
      state.fullRecords = action.payload;
      state.status = "succeeded";
    },
    setLoading(state) {
      state.status = "loading";
    },
    setError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearReports(state) {
      state.reports = [];
      state.fullRecords = [];
      state.status = "idle";
      state.error = null;
    },

    updateOrAddReport(state, action) {
      const { employee_id, date } = action.payload;

      // Find the index of the report that matches the employee_id and date
      const reportIndex = state.reports.findIndex(
        (report) => report.user_id === employee_id && report.date === date
      );

      if (reportIndex !== -1) {
        state.reports[reportIndex] = {
          ...state.reports[reportIndex],
          ...action.payload,
        };
      } else {
        // If no matching report exists, add it to the state
        state.reports.push(action.payload);
      }
    },
  },
});

export const fetchReports = (filters) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await reportService.fetchMonthlyReports(filters);
    dispatch(setReports(response.data));
  } catch (error) {
    dispatch(setError(error.toString()));
  }
};

export const fetchFullRecords = (filters) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await reportService.fetchFullRecords(filters);
    dispatch(setFullRecords(response));
  } catch (error) {
    dispatch(setError(error.toString()));
  }
};

export const {
  setReports,
  setFullRecords,
  setLoading,
  setError,
  clearReports,
  updateOrAddReport,
} = reportSlice.actions;

export default reportSlice.reducer;

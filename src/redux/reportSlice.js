import { createSlice } from "@reduxjs/toolkit";
import reportService from "../services/report";

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [],
    fullRecords: [],
    status: "idle",
    error: null,
    hasMore: true, // New property to track if there are more reports
  },
  reducers: {
    setReports(state, action) {
      // Append new reports to existing ones
      state.reports = [...state.reports, ...action.payload.data];
      state.status = "succeeded";
      state.hasMore = action.payload.hasMore; // Set hasMore based on the response
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
      state.hasMore = true; // Reset hasMore on clear
    },
    updateOrAddReport(state, action) {
      const { employee_id, date } = action.payload;

      const reportIndex = state.reports.findIndex(
        (report) => report.user_id === employee_id && report.date === date
      );

      if (reportIndex !== -1) {
        state.reports[reportIndex] = {
          ...state.reports[reportIndex],
          ...action.payload,
        };
      } else {
        state.reports.push(action.payload);
      }
    },
  },
});

export const fetchReports = (filters) => async (dispatch, getState) => {
  const { reports } = getState().reports;
  const currentPage = Math.ceil(reports.length / 100) + 1; 

  dispatch(setLoading());
  try {
    const response = await reportService.fetchMonthlyReports({ ...filters, page: currentPage });

    console.log(response);
    
    dispatch(setReports({
      data: response.data.data,
      hasMore: response.data.data.length > 0, 
    }));
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

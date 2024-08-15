import { createSlice } from '@reduxjs/toolkit';
import reportService from '../services/report';

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setReports(state, action) {
      state.reports = action.payload;
      state.status = 'succeeded';
    },
    setLoading(state) {
      state.status = 'loading';
    },
    setError(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearReports(state) {
      state.reports = [];
      state.status = 'idle';
      state.error = null;
    },

    updateOrAddReport(state, action) {
      const index = state.reports.findIndex(
        (report) =>
          report.user_id === action.payload.user_id &&
          report.date === action.payload.date
      );

      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...action.payload };
      } else {
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

export const { setReports, setLoading, setError, clearReports, updateOrAddReport } = reportSlice.actions;

export default reportSlice.reducer;

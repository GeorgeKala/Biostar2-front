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

export const { setReports, setLoading, setError, clearReports } = reportSlice.actions;

export default reportSlice.reducer;

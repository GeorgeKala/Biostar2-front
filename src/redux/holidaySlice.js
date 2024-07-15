import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../Config/axios';

// Define initial state
const initialState = {
  holidays: [],
  loading: false,
  error: null,
};

export const fetchHolidays = createAsyncThunk(
  'holidays/fetchHolidays',
  async () => {
    try {
      const response = await axiosInstance.get('/holidays');
      return response.data;
    } catch (error) {
      throw Error(error.response.data.error || error.message);
    }
  }
);

const holidaysSlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectHolidays = (state) => state.holidays.holidays;
export const selectLoading = (state) => state.holidays.loading;
export const selectError = (state) => state.holidays.error;

export default holidaysSlice.reducer;

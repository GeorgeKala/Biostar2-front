import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import departmentService from '../services/department';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const departments = await departmentService.getAllDepartments();
      return departments;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchNestedDepartments = createAsyncThunk(
  'departments/fetchNestedDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const nestedDepartments = await departmentService.getNestedDepartments();
      return nestedDepartments;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    departments: [],
    nestedDepartments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNestedDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNestedDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.nestedDepartments = action.payload;
      })
      .addCase(fetchNestedDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default departmentsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import employeeService from "../services/employee";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (filters = {}, { getState }) => {
    const { items } = getState().employees;
    const currentPage = Math.ceil(items.length / 100) + 1;

    const response = await employeeService.getAllEmployees({
      ...filters,
      page: currentPage,
    });

    return response;
  }
);

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData) => {
    const response = await employeeService.createEmployee(employeeData);
    return response;
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, employeeData }) => {
    const response = await employeeService.updateEmployee(id, employeeData);
    return response.data;
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async ({ id, expiryDatetime }, { rejectWithValue }) => {
    try {
      const response = await employeeService.deleteEmployee(id, expiryDatetime);
      return { id, expiryDatetime };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeUser = createAsyncThunk(
  "employees/removeUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeService.removeUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    hasMore: true,
  },
  reducers: {
    clearEmployees(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [...state.items, ...action.payload.data];
        state.hasMore = action.payload.data.length > 0;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        const { id, expiryDatetime } = action.payload;

        const index = state.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            card_number: null,
            active: false,
            expiry_datetime: expiryDatetime,
          };
          state.items.splice(index, 1);
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
          state.items.splice(index, 1);
        }
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearEmployees } = employeeSlice.actions;

export default employeeSlice.reducer;

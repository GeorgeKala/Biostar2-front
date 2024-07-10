import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userTypeService from "../services/userType";

export const fetchUserTypes = createAsyncThunk(
  "userTypes/fetchUserTypes",
  async () => {
    const response = await userTypeService.getAllUserTypes();
    return response.data;
  }
);

export const createUserType = createAsyncThunk(
  "userTypes/createUserType",
  async (userTypeData) => {
    const response = await userTypeService.createUserType(userTypeData);
    return response.data;
  }
);

export const updateUserType = createAsyncThunk(
  "userTypes/updateUserType",
  async ({ id, userTypeData }) => {
    const response = await userTypeService.updateUserType(id, userTypeData);
    return response.data; 
  }
);

export const deleteUserType = createAsyncThunk(
  "userTypes/deleteUserType",
  async (id) => {
    await userTypeService.deleteUserType(id);
    return id;
  }
);

const userTypeSlice = createSlice({
  name: "userTypes",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUserTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createUserType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(updateUserType.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedUserType = action.payload;
        const index = state.items.findIndex((item) => item.id === updatedUserType.id);
        if (index !== -1) {
          state.items[index] = updatedUserType;
        }
      })
      .addCase(deleteUserType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default userTypeSlice.reducer;

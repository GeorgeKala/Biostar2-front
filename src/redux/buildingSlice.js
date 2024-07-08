import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import buildingService from "../services/buildingService";

export const fetchBuildings = createAsyncThunk(
  "buildings/fetchBuildings",
  async () => {
    const response = await buildingService.getAllBuildings();
    return response;
  }
);

export const createBuilding = createAsyncThunk(
  "buildings/createBuilding",
  async (buildingData) => {
    const response = await buildingService.createBuilding(buildingData);
    return response;
  }
);

export const updateBuilding = createAsyncThunk(
  "buildings/updateBuilding",
  async ({ id, buildingData }) => {
    const response = await buildingService.updateBuilding(id, buildingData);
    return response;
  }
);

export const deleteBuilding = createAsyncThunk(
  "buildings/deleteBuilding",
  async (id) => {
    await buildingService.deleteBuilding(id);
    return id;
  }
);

const buildingSlice = createSlice({
  name: "buildings",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBuilding.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBuilding.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default buildingSlice.reducer;


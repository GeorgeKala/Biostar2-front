import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import buildingService from "../services/building";

export const fetchBuildings = createAsyncThunk(
  "buildings/fetchBuildings",
  async () => {
    const response = await buildingService.getAllBuildings();
    return response.data;
  }
);

export const createBuilding = createAsyncThunk(
  "buildings/createBuilding",
  async (buildingData) => {
    const response = await buildingService.createBuilding(buildingData);
    return response.data;
  }
);

export const updateBuilding = createAsyncThunk(
  "buildings/updateBuilding",
  async ({ id, buildingData }) => {
    const response = await buildingService.updateBuilding(id, buildingData);
    return response.data; 
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
        state.status = "succeeded";
        state.items.push(action.payload); // Add the newly created building to the state
      })
      .addCase(updateBuilding.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedBuilding = action.payload;
        const index = state.items.findIndex((item) => item.id === updatedBuilding.id);
        if (index !== -1) {
          state.items[index] = updatedBuilding; // Update the building in the state
        }
      })
      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default buildingSlice.reducer;

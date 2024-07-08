
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import scheduleService from "../services/schedule";

export const fetchSchedules = createAsyncThunk(
  "schedules/fetchSchedules",
  async () => {
    const response = await scheduleService.getAllSchedules();
    return response;
  }
);

export const createSchedule = createAsyncThunk(
  "schedules/createSchedule",
  async (scheduleData) => {
    const response = await scheduleService.createSchedule(scheduleData);
    return response;
  }
);

export const updateSchedule = createAsyncThunk(
  "schedules/updateSchedule",
  async ({ id, scheduleData }) => {
    const response = await scheduleService.updateSchedule(id, scheduleData);
    return response;
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedules/deleteSchedule",
  async (id) => {
    await scheduleService.deleteSchedule(id);
    return id;
  }
);


const scheduleSlice = createSlice({
  name: "schedules",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items[index] = action.payload;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default scheduleSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groupService from "../services/group";


export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
  const response = await groupService.getAllGroups();
  return response;
});

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData) => {
    const response = await groupService.createGroup(groupData);
    return response;
  }
);

export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async ({ id, groupData }) => {
    const response = await groupService.updateGroup(id, groupData);
    return response;
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (id) => {
    await groupService.deleteGroup(id);
    return id;
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items[index] = action.payload;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default groupSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import forgiveTypeService from '../services/forgiveType';
 

const initialState = {
  forgiveTypes: [],
  loading: false,
  error: null,
};

export const fetchForgiveTypes = createAsyncThunk(
  'forgiveTypes/fetchForgiveTypes',
  async () => {
    try {
      const response = await forgiveTypeService.getAllForgiveTypes();
      console.log(response);
      return response;
    } catch (error) {
      throw Error(error.response.data.error || error.message);
    }
  }
);

export const createForgiveType = createAsyncThunk(
  'forgiveTypes/createForgiveType',
  async (forgiveTypeData) => {
    try {
      const response = await forgiveTypeService.createForgiveType(forgiveTypeData);
      return response;
    } catch (error) {
      throw Error(error.response.data.error || error.message);
    }
  }
);

export const updateForgiveType = createAsyncThunk(
  'forgiveTypes/updateForgiveType',
  async ({ id, forgiveTypeData }) => {
    try {
      const response = await forgiveTypeService.updateForgiveType(id, forgiveTypeData);
      return response;
    } catch (error) {
      throw Error(error.response.data.error || error.message);
    }
  }
);

export const deleteForgiveType = createAsyncThunk(
  'forgiveTypes/deleteForgiveType',
  async (id) => {
    try {
      await forgiveTypeService.deleteForgiveType(id);
      return id;
    } catch (error) {
      throw Error(error.response.data.error || error.message);
    }
  }
);

const forgiveTypesSlice = createSlice({
  name: 'forgiveTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForgiveTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForgiveTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.forgiveTypes = action.payload;
      })
      .addCase(fetchForgiveTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createForgiveType.fulfilled, (state, action) => {
        state.forgiveTypes.push(action.payload);
      })
      .addCase(updateForgiveType.fulfilled, (state, action) => {
        const index = state.forgiveTypes.findIndex((type) => type.id === action.payload.id);
        if (index !== -1) {
          state.forgiveTypes[index] = action.payload;
        }
      })
      .addCase(deleteForgiveType.fulfilled, (state, action) => {
        state.forgiveTypes = state.forgiveTypes.filter((type) => type.id !== action.payload);
      });
  },
});

export const selectForgiveTypes = (state) => state.forgiveTypes.forgiveTypes;
export const selectForgiveTypesLoading = (state) => state.forgiveTypes.loading;
export const selectForgiveTypesError = (state) => state.forgiveTypes.error;

export default forgiveTypesSlice.reducer;

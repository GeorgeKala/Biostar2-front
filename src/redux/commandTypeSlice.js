import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commandTypeService from '../services/commandType';

// Async thunk to fetch command types
export const fetchCommandTypes = createAsyncThunk(
  'commandTypes/fetchCommandTypes',
  async () => {
    try {
      const response = await commandTypeService.getAllCommandTypes(); 
      return response; 
    } catch (error) {
      throw new Error('Failed to fetch command types: ' + error.message);
    }
  }
);

// Create slice for command types
const commandTypeSlice = createSlice({
  name: 'commandTypes',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommandTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommandTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data; // Assuming action.payload contains the data array
      })
      .addCase(fetchCommandTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default commandTypeSlice.reducer;

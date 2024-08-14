import { createSlice } from '@reduxjs/toolkit';
import orderService from '../services/order';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    error: null,
  },
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const fetchEmployeeOrders = (filters) => async (dispatch) => {
  try {
    const response = await orderService.fetchEmployeeOrders(filters);
    dispatch(setOrders(response.data));
  } catch (error) {
    dispatch(setError(error.toString()));
  }
};

export const { setOrders, setError } = orderSlice.actions;

export default orderSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUser, login } from "../services/auth";

const initialData = {
  loading: false,
  user: null,
  error: "",
  isAuthenticated: false,
};

export const fetchAsyncUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const response = await fetchUser();
    return response; 
  } catch (error) {
    throw error;
  }
});


export const loginAsync = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    try {
      const response = await login(email, password);
      return response; 
    } catch (error) {
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialData,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAsyncUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchAsyncUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      })
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      });
  },
});

export const selectUser = (state) => state.user

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

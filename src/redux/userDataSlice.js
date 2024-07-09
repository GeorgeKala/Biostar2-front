import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUser, login } from "../services/auth";
import userService from "../services/users";

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

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const response = await userService.getAllUsers();
    return response;
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData) => {
    const response = await userService.createUser(userData);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }) => {
    const response = await userService.updateUser(id, userData);
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id) => {
    await userService.deleteUser(id);
    return id;
  }
);

const initialUserState = {
  loading: false,
  user: null,
  error: "",
  isAuthenticated: false,
};

const initialUserDataState = {
  items: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    ...initialUserState,
    users: initialUserDataState,
  },
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
      })
      .addCase(fetchUsers.pending, (state) => {
        state.users.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.status = "succeeded";
        state.users.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.status = "failed";
        state.users.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.items.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.users.items[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users.items = state.users.items.filter((item) => item.id !== action.payload);
      });
  },
});
export const selectUser = (state) => state.user;
export const selectUsers = (state) => state.user.users.items;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

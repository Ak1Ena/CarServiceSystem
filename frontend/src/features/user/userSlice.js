import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./services"; 

// ASYNC THUNKS (Actions)
export const login = createAsyncThunk("user/login", async (data, thunkAPI) => {
  try {
    const res = await loginUser(data);
    return res;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Login failed';
    return thunkAPI.rejectWithValue(message);
  }
});

export const register = createAsyncThunk("user/register", async (data, thunkAPI) => {
  try {
    const res = await registerUser(data);
    return res;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Registration failed';
    return thunkAPI.rejectWithValue(message);
  }
});

//Redux Slice (State Management)
const initialToken = localStorage.getItem('userToken');
const initialUser = localStorage.getItem('currentUser') 
    ? JSON.parse(localStorage.getItem('currentUser')) 
    : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUser, 
    token: initialToken, 
    status: "idle",
    error: null,
    isRegistered: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      localStorage.removeItem('userToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userId'); 
      localStorage.removeItem('userRole');
      state.isRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "success";

        const { id, status: role } = action.payload.user;
        localStorage.setItem('userToken', action.payload.token);
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        localStorage.setItem('userId', id); 
        localStorage.setItem('userRole', role);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
        state.user = null;
        state.token = null;
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
      })

      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.isRegistered = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "idle";
        state.isRegistered = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
        state.isRegistered = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
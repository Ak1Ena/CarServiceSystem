import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "../../store/actions/userActions";

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
        localStorage.setItem('userToken', action.payload.token);
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload; 
        state.user = null;
        state.token = null;
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
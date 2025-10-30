import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./services/api.jsx";

// REDUX SLICE (State Management)
const initialUser = localStorage.getItem('currentUser') 
    ? JSON.parse(localStorage.getItem('currentUser')) 
    : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUser, 
    status: "idle",
    error: null,
    isRegistered: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
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
        const userDto = action.payload;
        
        // 1. ดึง ID และ Role: Backend ใช้ userId และ userRole
        const userId = userDto.userId || userDto.id; 
        const userRole = userDto.role; 
        
        // 2. อัปเดต State
        state.user = userDto;
        state.status = "success";

        // 3. เก็บข้อมูลใน localStorage
        localStorage.setItem('currentUser', JSON.stringify(userDto));
        
        // เก็บ UserId และ UserRole
        if (userId) localStorage.setItem('userId', userId); 
        if (userRole) localStorage.setItem('userRole', userRole);

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
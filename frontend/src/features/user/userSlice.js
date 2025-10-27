import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./services/authService"; 

// ASYNC THUNKS (Actions)
export const login = createAsyncThunk("user/login", async (data, thunkAPI) => {
  try {
    // loginUser จะคืนค่า UserDto
    const res = await loginUser(data);
    return res; // คืนค่า UserDto
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

// REDUX SLICE (State Management)
const initialToken = localStorage.getItem('userToken');
const initialUser = localStorage.getItem('currentUser') 
    ? JSON.parse(localStorage.getItem('currentUser')) 
    : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUser, 
    token: initialToken, // จะเป็น 'DUMMY_TOKEN' หรือ null ถ้าไม่มี Token จริงจาก Backend
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
        const userDto = action.payload;
        
        // 1. ดึง ID และ Role: Backend ใช้ userId และ userRole
        const userId = userDto.userId || userDto.id; 
        const userRole = userDto.userRole; 
        
        // 2. อัปเดต State
        state.user = userDto;
        state.token = "DUMMY_TOKEN"; // Backend ไม่คืน Token จริง
        state.status = "success";

        // 3. เก็บข้อมูลใน localStorage
        localStorage.setItem('userToken', "DUMMY_TOKEN"); // ใช้ Dummy Token
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
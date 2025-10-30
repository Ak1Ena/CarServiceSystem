import axios from 'axios';
import { createAsyncThunk } from "@reduxjs/toolkit";

// - AXIOS SETUP -
const API_BASE_URL = import.meta.env.REACT_APP_USER_SERVICE || 'http://localhost:8085';
const finalBaseURL = `${API_BASE_URL}/users`;

const api = axios.create({
  baseURL: finalBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// - BASE API CALLS (Axios Functions) -

// POST /users
export const registerUser = async (userData) => {
  const response = await api.post('/', userData);
  return response.data; // UserDto
};

// POST /users/login
export const loginUser = async (credentials) => {
  const response = await api.post('/login', credentials); 
  return response.data; // UserDto
};

// - ASYNC THUNKS (Export Actions) -
// THUNK FOR LOGIN
export const login = createAsyncThunk("user/login", async (data, thunkAPI) => {
  try {
    const res = await loginUser(data); // เรียกใช้ Axios Function
    return res; 
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Login failed';
    return thunkAPI.rejectWithValue(message);
  }
});

// THUNK FOR REGISTER
export const register = createAsyncThunk("user/register", async (data, thunkAPI) => {
  try {
    const res = await registerUser(data); // เรียกใช้ Axios Function
    return res;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Registration failed';
    return thunkAPI.rejectWithValue(message);
  }
});
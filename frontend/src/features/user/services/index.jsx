import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_USER_SERVICE || 'http://localhost:8085';

const api = axios.create({
  baseURL: API_BASE_URL, // http://localhost:8085
  headers: {
    'Content-Type': 'application/json',
  },
});

// POST /users
export const registerUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data; // UserDto
};

// POST /users/login
export const loginUser = async (credentials) => {
  // ใช้ '/login' เรียก http://localhost:8085/users/login
  const response = await api.post('/login', credentials); 
  return response.data; // UserDto
};
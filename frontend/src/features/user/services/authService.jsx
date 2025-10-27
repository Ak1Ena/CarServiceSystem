import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_USER_SERVICE || 'http://localhost:8085';

const finalBaseURL = `${API_BASE_URL}/users`;

const api = axios.create({
  baseURL: finalBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
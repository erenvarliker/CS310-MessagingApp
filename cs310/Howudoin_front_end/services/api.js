import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080', // Replace with the backend's correct URL
  timeout: 10000, // 10 seconds timeout
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to add Authorization header if token exists
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request Config:', config.baseURL, config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);


// Function to handle login
export const login = async (email, password) => {
  try {
    // Make a POST request to /login
    const response = await api.post('/login', { email, password });
    console.log('Login Response:', response.data);

    // Save the token to AsyncStorage
    const { token } = response.data; // Adjust this to match your backend response structure
    await AsyncStorage.setItem('token', token);

    return response.data; // Return the full response to the caller
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error; // Rethrow the error to be handled in the component
  }
};
export const register = async (name, lastName, email, password) => {
  try {
    const response = await api.post('/register', { name, lastName, email, password });
    console.log('Registration Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
    throw error;
  }
};
export default api;

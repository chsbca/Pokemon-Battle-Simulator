// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',  // Your API base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically attach the token to requests
const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`;
}

export default axiosInstance;

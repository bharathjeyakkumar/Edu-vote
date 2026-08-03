import axios from 'axios';

const API = axios.create({
  // 🚀 USE HTTPS AND YOUR EXACT RENDER LINK
  baseURL: "https://edu-back-lymz.onrender.com/api" 
});

// Add the token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default API;

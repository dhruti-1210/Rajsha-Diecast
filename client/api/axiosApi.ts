import axios from 'axios';

const api = axios.create({
  baseURL: (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  ).replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;

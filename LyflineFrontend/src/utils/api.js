import axios from 'axios';
import config from '../config';

// Create an axios instance with base URL from config
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token when available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API utility functions
export const api = {
  // Auth
  login: (data) => apiClient.post(config.auth, data),
  
  // Patients
  getPatients: () => apiClient.get(config.getPatients),
  getPatientsForDoctor: () => apiClient.get(config.getPatientsForDoctor),
  addPatient: (data) => apiClient.post(config.addPatient, data),
  
  // User management
  getUsersForAdmin: (id) => apiClient.get(`${config.getUsersForAdmin}/${id}`),
  getUserName: (userId) => apiClient.get(`${config.getName}/${userId}`),
  addUser: (data) => apiClient.post(config.addUser, data),
  deleteUser: (userId) => apiClient.delete(`${config.deleteUser}/${userId}`),
  
  // Hospital management
  addHospital: (data) => apiClient.post(config.addHospital, data),
  
  // Pathology
  addPathologyReport: (data) => apiClient.post(config.addPathologyReport, data),
  
  // Patient status
  setCritical: (data) => apiClient.put(config.setCritical, data),
  setStable: (data) => apiClient.put(config.setStable, data),
  attendPatient: (data) => apiClient.put(config.attend, data),
  
  // ML predictions
  predictHeart: (data) => apiClient.post(config.predictHeart, data),
  predictCHD: (data) => apiClient.post(config.predictCHD, data),
};

export default api; 
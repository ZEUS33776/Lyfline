import axios from 'axios';

// Create an axios instance with base URL from environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
  login: (data) => apiClient.post('/auth', data),
  
  // Patients
  getPatients: () => apiClient.get('/get-patients-for-dashboard'),
  getPatientsForDoctor: () => apiClient.get('/get-patients-for-doctor'),
  addPatient: (data) => apiClient.post('/add-patient', data),
  
  // User management
  getUsersForAdmin: (id) => apiClient.get(`/get-users-for-admin/${id}`),
  getUserName: (userId) => apiClient.get(`/get-name/${userId}`),
  addUser: (data) => apiClient.post('/add-user', data),
  deleteUser: (userId) => apiClient.delete(`/delete-user/${userId}`),
  
  // Hospital management
  addHospital: (data) => apiClient.post('/add-hospital', data),
  
  // Pathology
  addPathologyReport: (data) => apiClient.post('/add-pathology-report', data),
  
  // Patient status
  setCritical: (data) => apiClient.put('/critical', data),
  setStable: (data) => apiClient.put('/stable', data),
  attendPatient: (data) => apiClient.put('/attend', data),
  
  // ML predictions
  predictHeart: (data) => apiClient.post('/predict/heart', data),
  predictCHD: (data) => apiClient.post('/predict/chd', data),
};

export default api; 
// Configuration file for LyfLine Frontend

const config = {
  // API server URLs
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // Auth endpoints
  auth: '/auth',
  
  // Patient endpoints
  getPatients: '/get-patients-for-dashboard',
  addPatient: '/add-patient',
  getPatientsForDoctor: '/get-patients-for-doctor',
  
  // User management endpoints
  getUsersForAdmin: '/get-users-for-admin',
  addUser: '/add-user',
  deleteUser: '/delete-user',
  getName: '/get-name',
  
  // Hospital endpoints
  addHospital: '/add-hospital',
  
  // Pathology endpoints
  addPathologyReport: '/add-pathology-report',
  
  // Patient status endpoints
  setCritical: '/critical',
  setStable: '/stable',
  attend: '/attend',
  
  // ML prediction endpoints
  predictHeart: '/predict/heart',
  predictCHD: '/predict/chd',
};

export default config; 
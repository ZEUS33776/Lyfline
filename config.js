// Configuration file for LyfLine Project

// Server URLs
const config = {
  // Backend API server
  API_BASE_URL: 'http://localhost:3000',
  
  // ML service 
  ML_SERVICE_URL: 'http://localhost:5001',
  
  // Endpoints
  endpoints: {
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
  }
};

export default config; 
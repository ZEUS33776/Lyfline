import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Plus, FileText, X, Heart, Activity, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../src/components/DasboardNavbar";
import axios from 'axios';
import HealthFormModal from "../src/components/HealthModal"
import {toast,Toaster} from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';



const ReceptionistDashboard = () => {
  
  const navigate=useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const id = useParams()
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [patients,setPatients]=useState([])
  const handleSignOut = () => {
    localStorage.removeItem('token')
    navigate("/signin")
  }
  if (id.id !== localStorage.getItem('hospitalId')) {
    localStorage.removeItem('token')
    localStorage.removeItem('hospitalId')
 }
  // Mock data updated to match schema
  const getPatients = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-patients-for-dashboard`);
      setPatients(response.data.patients);
    } catch (error) {
      toast.error("Error fetching patients");
    }
  };
  const getHospitalIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const decoded = jwtDecode(token);
      return decoded.hospitalId;
    } catch (error) {
      return null;
    }
  };
  const allowedHospital = getHospitalIdFromToken()
  const checkHospitalAccess = () => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
      toast.error('Authentication required');
      navigate("/signin");
      return false;
    }

    if (hospitalId !== parseInt(id.id)) {
      toast.error('Unauthorized access');
      localStorage.removeItem('token')
      navigate("/signin");
      return false;
    }

    return true;
  };
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.');
        navigate("/signin");
        return false;
      }

      return true;
    } catch (error) {
      toast.error('Authentication error');
      navigate("/signin");
      return false;
    }
  };
  // useEffect(() => {
  //   const init = async () => {
  //     if (checkAuth() && checkHospitalAccess()) {
  //       await getPatients();
  //     }
      
      
  //   };
  //   init();
  // }, [id]);
  
  useEffect(() => {

    
    const fetchData = async () => {
      if (id.id == localStorage.getItem('hospitalId')) {
        await getPatients();
      }
      else {
        localStorage.removeItem('token')
        localStorage.removeItem('hospitalId')
        navigate('/signin')
      }
      
    };
    fetchData();
  }, []);
  

  const openPatientProfile = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };
console.log(patients)
  const filteredPatients = patients.filter(patient => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = patient.first_name.toLowerCase().includes(searchTerm) ||
                         patient.last_name.toLowerCase().includes(searchTerm);
    
    // Filter based on selected role
    switch (selectedRole) {
      case 'Critical':
        return matchesSearch && patient.iscritical;
      case 'Heart':
        return matchesSearch && patient.is_heart_patient;
      case 'Diabetes':
        return matchesSearch && patient.Diabetes;
      default:
        return matchesSearch;
    }
  });

  const getLatestVitals = (reports) => {
    if (!reports || reports.length === 0) return null;
    return reports[0];
  };

  const StatusBadge = ({ icon: Icon, text, bgColor, textColor }) => (
    <span className={`inline-flex items-center px-2.5 py-1.5 ${bgColor} ${textColor} text-xs font-medium rounded-md`}>
      {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
      {text}
    </span>
  );
    
  const ReportDetailModal = ({ report, patient, onClose }) => {
    if (!report || !patient) return null;

    const getECGDescription = (result) => {
      const ecgResults = {
        0: "Normal",
        1: "ST-T Wave abnormality",
        2: "Left ventricular hypertrophy"
      };
      return ecgResults[result] || "Unknown";
    };

    const getChestPainType = (type) => {
      const painTypes = {
        1: "Typical Angina",
        2: "Atypical Angina",
        3: "Non-Anginal Pain",
        4: "Asymptomatic"
      };
      return painTypes[type] || "Unknown";
    };

    const getThalDescription = (thal) => {
      const thalTypes = {
        1: "Normal",
        2: "Fixed Defect",
        3: "Reversible Defect"
      };
      return thalTypes[thal] || "Unknown";
    };

    const VitalCard = ({ icon: Icon, title, value, unit, description, isAlert }) => (
      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${isAlert ? 'bg-red-100' : 'bg-blue-100'} mr-3`}>
              <Icon className={`w-5 h-5 ${isAlert ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-lg font-semibold">
                {value} {unit}
              </p>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
          {isAlert && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pathology Report #{report.report_id}</h2>
              <p className="text-sm text-gray-500">
                Patient: {patient.first_name} {patient.last_name} (ID: {patient.patient_id})
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Report Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{report.report_date}</span>
                </div>
                {report.is_critical && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Critical
                  </span>
                )}
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <VitalCard
                icon={Activity}
                title="Blood Pressure"
                value={`${report.sys_bp}/${report.dia_bp}`}
                unit="mmHg"
                isAlert={report.sys_bp > 140 || report.dia_bp > 90}
                description={report.sys_bp > 140 || report.dia_bp > 90 ? "Elevated" : "Normal Range"}
              />
              
              <VitalCard
                icon={Heart}
                title="Heart Rate"
                value={report.heart_rate}
                unit="bpm"
                isAlert={report.heart_rate > 100 || report.heart_rate < 60}
                description={`Max: ${report.max_heart_rate} bpm`}
              />

              <VitalCard
                icon={Activity}
                title="BMI"
                value={report.bmi.toFixed(1)}
                unit="kg/m²"
                isAlert={report.bmi > 30 || report.bmi < 18.5}
                description={
                  report.bmi < 18.5 ? "Underweight" :
                  report.bmi < 25 ? "Normal" :
                  report.bmi < 30 ? "Overweight" : "Obese"
                }
              />
            </div>

            {/* Detailed Metrics */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Cardiac Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chest Pain Type</p>
                  <p className="mt-1">{getChestPainType(report.chest_pain_type)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">ECG Results</p>
                  <p className="mt-1">{getECGDescription(report.resting_ecg_result)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Exercise Induced Angina</p>
                  <p className="mt-1">{report.exercise_induced_angina ? "Yes" : "No"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">ST Depression (Oldpeak)</p>
                  <p className="mt-1">{report.oldpeak}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Number of Major Vessels</p>
                  <p className="mt-1">{report.major_vessels}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Thalassemia</p>
                  <p className="mt-1">{getThalDescription(report.thal)}</p>
                </div>
              </div>
            </div>

            {/* Laboratory Results */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Laboratory Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Glucose Level</p>
                  <p className="mt-1">{report.glucose} mg/dL</p>
                  <p className="text-sm text-gray-500">
                    {report.fasting_blood_sugar ? "High" : "Normal"} fasting blood sugar
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Cholesterol</p>
                  <p className="mt-1">{report.serum_cholestoral} mg/dL</p>
                  <p className="text-sm text-gray-500">
                    {report.serum_cholestoral > 200 ? "Above optimal level" : "Normal range"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
    
    
    
  const ProfileModal = ({ patient, onClose }) => {
    if (!patient) return null;
    
      const latestVitals = getLatestVitals(patient.pathologyReports);
      const openReport = (report) => {
        setSelectedReport(report);
        setShowReportModal(true);
      };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Patient Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Patient ID:</span> {patient.patient_id}</p>
                  <p><span className="font-medium">Name:</span> {patient.first_name} {patient.last_name}</p>
                  <p><span className="font-medium">Age:</span> {patient.age}</p>
                  <p><span className="font-medium">Gender:</span> {patient.male ? 'Male' : 'Female'}</p>
                  <p><span className="font-medium">Education Level:</span> {patient.education}</p>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-4">Risk Factors</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Smoking Status:</span> {patient.current_smoker ? `Current Smoker (${patient.cigsperday} per day)` : 'Non-smoker'}</p>
                  <p><span className="font-medium">BP Medication:</span> {patient.bpmeds ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Stroke History:</span> {patient.prevalentstroke ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Hypertension:</span> {patient.prevalenthyp ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Diabetes:</span> {patient.Diabetes ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {latestVitals ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Latest Vitals</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Blood Pressure:</span> {latestVitals.sys_bp}/{latestVitals.dia_bp} mmHg</p>
                    <p><span className="font-medium">Heart Rate:</span> {latestVitals.heart_rate} bpm</p>
                    <p><span className="font-medium">BMI:</span> {latestVitals.bmi}</p>
                    <p><span className="font-medium">Glucose:</span> {latestVitals.glucose} mg/dL</p>
                    <p><span className="font-medium">Cholesterol:</span> {latestVitals.serum_cholestoral} mg/dL</p>
                    <p><span className="font-medium">Max Heart Rate:</span> {latestVitals.max_heart_rate} bpm</p>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-4">Cardiac Assessment</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Chest Pain Type:</span> Type {latestVitals.chest_pain_type}</p>
                    <p><span className="font-medium">ECG Result:</span> {latestVitals.resting_ecg_result}</p>
                    <p><span className="font-medium">Exercise Induced Angina:</span> {latestVitals.exercise_induced_angina ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium">Major Vessels:</span> {latestVitals.major_vessels}</p>
                    <p><span className="font-medium">Thalassemia:</span> {latestVitals.thal}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No vitals data available</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Pathology Reports History</h3>
              {patient.pathologyReports.length > 0 ? (
                <div className="grid grid-col---s-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patient.pathologyReports.map(report => (
                    <div 
                      key={report.report_id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      onClick={() => openReport(report)}
                      >
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-blue-500 mt-1 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-900">Report #{report.report_id}</h4>
                          <p className="text-sm text-gray-500">{report.report_date}</p>
                          <p className="text-sm text-gray-500">BP: {report.sys_bp}/{report.dia_bp}</p>
                          {report.is_critical && (
                            <StatusBadge
                              text="Critical"
                              bgColor="bg-red-100"
                              textColor="text-red-800"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No pathology reports available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
    };
    


const [name,setName]=useState("") 
  useEffect(() => {
    const getName = async () => {
      const user_id = localStorage.getItem("user_id")
      // alert(user_id)
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-name/${user_id}`);
      setName(res.data.first_name )
      
    }
    getName()
      
    },[])
  
  return (
    <div>
      <Toaster />
      <Navbar handleSignOut={handleSignOut} />
      <div className="w-full max-w-screen mx-auto p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
          
            <h1 className="text-2xl font-bold text-gray-700">Welcome {name}!</h1>
            
            <HealthFormModal hid={ id.id} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="All">All Patients</option>
              <option value="Critical">Critical</option>
              <option value="Heart">Heart Patients</option>
              <option value="Diabetes">Diabetic Patients</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
          
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Patient ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Latest Vitals</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(patient => {
                    const latestVitals = getLatestVitals(patient.pathologyReports);
                    return (
                      <tr key={patient.patient_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{patient.patient_id}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.first_name} {patient.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.male ? 'Male' : 'Female'}, {patient.age} years
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {patient.iscritical==1 && (
                              <StatusBadge
                                icon={Activity}
                                text="Critical"
                                bgColor="bg-red-100"
                                textColor="text-red-800"
                              />
                            )}
                            {patient.is_heart_patient==1 && (
                              <StatusBadge
                                icon={Heart}
                                text="Heart Patient"
                                bgColor="bg-orange-100"
                                textColor="text-orange-800"
                              />
                            )}
                            {patient.Diabetes==1 && (
                              <StatusBadge
                                text="Diabetic"
                                bgColor="bg-blue-100"
                                textColor="text-blue-800"
                              />
                            )}
                            {patient.iscritical==0 && patient.is_heart_patient==0 && patient.Diabetes==0 && (
                              <StatusBadge
                              text="Normal"
                              bgColor="bg-green-100"
                              textColor="text-green-700"
                            />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {latestVitals ? (
                            <div className="space-y-1">
                                        <p>BP: {latestVitals.sys_bp}/{latestVitals.dia_bp} mmHg</p>
                                        <p>HR: {latestVitals.heart_rate} bpm</p>
                              <p>Glucose: {latestVitals.glucose} mg/dL</p>
                            </div>
                          ) : (
                            <span className="text-sm italic text-gray-400">No vitals recorded</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openPatientProfile(patient)}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition-colors"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      {searchQuery || selectedRole !== 'All' ? (
                        <div>
                          <p className="text-lg font-medium">No matching patients found</p>
                          <p className="text-sm mt-1">Try adjusting your search criteria</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium">No patients in the system</p>
                          <p className="text-sm mt-1">Click "Add New Patient" to get started</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <ProfileModal 
            patient={selectedPatient} 
            onClose={() => {
              setShowModal(false);
              setSelectedPatient(null);
                      }} 
                      
          />
              )}
               {showReportModal && (
        <ReportDetailModal
          report={selectedReport}
          patient={selectedPatient}
          onClose={() => {
            setShowReportModal(false);
            setSelectedReport(null);
          }}
        />
      )}
              
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
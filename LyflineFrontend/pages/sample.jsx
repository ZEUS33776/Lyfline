import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Plus, FileText, X, Heart, Activity, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../src/components/DasboardNavbar";
import axios from 'axios';
import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';

const DoctorDashboard = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const getName = async () => {
            const loadingToast = toast.loading('Fetching doctor details...');
            try {
                const user_id = localStorage.getItem("user_id");
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-name/${user_id}`);
                setName(res.data.first_name);
                toast.success('Welcome, Dr. ' + res.data.first_name, { id: loadingToast });
            } catch (error) {
                toast.error('Failed to fetch doctor details', { id: loadingToast });
            }
        };
        getName();
    }, []);
  
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const id = useParams();
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [patients, setPatients] = useState([]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        toast.success('Signed out successfully');
        navigate("/signin");
    };

    if (id.id !== localStorage.getItem('hospitalId')) {
        localStorage.removeItem('token');
        localStorage.removeItem('hospitalId');
        toast.error('Invalid hospital access');
        navigate('/signin');
    }

    const getPatients = async () => {
        setLoading(true);
        const loadingToast = toast.loading('Fetching patient data...');
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-patients-for-doctor`);
            setPatients(response.data.patients);
            toast.success('Patient data loaded successfully', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to fetch patients', { id: loadingToast });
        } finally {
            setLoading(false);
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

    const attend = async (patient) => {
        const loadingToast = toast.loading('Updating patient status...');
        try {
            const patient_id = patient.patient_id;
            const user_id = localStorage.getItem("user_id");
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/attend`, { patient_id, user_id });
            toast.success('Patient status updated successfully', { id: loadingToast });
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update patient status', { id: loadingToast });
        }
    };

    const stable = async (patient) => {
        const loadingToast = toast.loading('Updating patient status to stable...');
        try {
            const patient_id = patient.patient_id;
            const user_id = localStorage.getItem("user_id");
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/stable`, { patient_id, user_id });
            toast.success('Patient marked as stable', { id: loadingToast });
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update patient status', { id: loadingToast });
        }
    };

    const critical = async (patient) => {
        const loadingToast = toast.loading('Updating patient status to critical...');
        try {
            const patient_id = patient.patient_id;
            const user_id = localStorage.getItem("user_id");
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/critical`, { patient_id, user_id });
            toast.success('Patient marked as critical', { id: loadingToast });
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update patient status', { id: loadingToast });
        }
    };

    const allowedHospital = getHospitalIdFromToken();
    
    const checkHospitalAccess = () => {
        const hospitalId = getHospitalIdFromToken();
        if (!hospitalId) {
            toast.error('Authentication required');
            navigate("/signin");
            return false;
        }

        if (hospitalId !== parseInt(id.id)) {
            toast.error('Unauthorized access');
            localStorage.removeItem('token');
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
  
    useEffect(() => {
        const fetchData = async () => {
            if (id.id == localStorage.getItem('hospitalId')) {
                const loadingToast = toast.loading('Loading dashboard...');
                try {
                    await getPatients();
                    toast.success('Dashboard loaded successfully', { id: loadingToast });
                } catch (error) {
                    toast.error('Failed to load dashboard', { id: loadingToast });
                }
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('hospitalId');
                toast.error('Invalid hospital access');
                navigate('/signin');
            }
        };
        fetchData();
    }, []);

    const openPatientProfile = (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const filteredPatients = patients.filter(patient => {
        const searchTerm = searchQuery.toLowerCase();
        const matchesSearch = patient.first_name.toLowerCase().includes(searchTerm) ||
                            patient.last_name.toLowerCase().includes(searchTerm);
        
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
}
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, X, Search } from 'lucide-react';
import Navbar from '../src/components/DasboardNavbar';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserManagementDashboard = () => {
  const navigate=useNavigate()
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState(''); // Filter by role

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: '',
    hospital_id: '',
  });
  const handleSignOut = () => {
    localStorage.removeItem('token')
    navigate("/signin")
  }
  
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      console.error('Error getting hospital ID:', error);
      return null;
    }
  };
  const checkHospitalAccess = () => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
      toast.error('Authentication required');
      navigate("/signin");
      return false;
    }

    if (hospitalId !== parseInt(id)) {
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








  const usersForAdmin = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/get-users-for-admin/${id}`);
      setUsers(response.data.rows);
    } catch (error) {
      showAlertMessage('Failed to fetch users', 'error');
    }
  };
 

  useEffect(() => {
    const init = async () => {
      if (checkAuth() && checkHospitalAccess()) {
        await usersForAdmin();
      }
      
    };
    init();
  }, [id]);

  const addUser = async () => {
    try {
      await axios.post('http://localhost:3000/add-user', {
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role.charAt(0).toUpperCase() + form.role.slice(1),
        hospital_id: id,
      });

      return true;
    } catch (error) {
      showAlertMessage('Failed to add user: ' + (error.response?.data?.message || error.message), 'error');
      return false;
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await addUser();
    if (success) {
      await usersForAdmin();
      setIsAddModalOpen(false);
      setForm({ email: '', password: '', first_name: '', last_name: '', role: '' });
      showAlertMessage('User added successfully!', 'success');
    }
    setIsLoading(false);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/delete-user/${userId}`);
      return true;
    } catch (error) {
      showAlertMessage('Failed to delete user: ' + (error.response?.data?.message || error.message), 'error');
      return false;
    }
  };

  const handleDeleteUser = async (userId) => {
    setIsLoading(true);
    const success = await deleteUser(userId);
    if (success) {
      await usersForAdmin();
      setIsDeleteModalOpen(false);
      showAlertMessage('User deleted successfully!', 'success');
    }
    setIsLoading(false);
  };

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Filtered users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === '' || user.role.toLowerCase() === filterRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar handleSignOut={handleSignOut} />
      <div className="p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700">User Management</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors"
            disabled={isLoading}
          >
            <PlusCircle size={18} />
            Add New User
          </button>
        </div>

        {/* Alert Message */}
        {showAlert && (
          <div 
            className={`mb-4 border-l-4 p-4 rounded-md ${
              alertType === 'success' 
                ? 'bg-green-100 border-green-500 text-green-700' 
                : 'bg-red-100 border-red-500 text-red-700'
            }`}
          >
            {alertMessage}
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
            <Search size={20} className="absolute top-2 right-3 text-gray-500" />
          </div>

          {/* Filter by Role */}
          <div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="">All Roles</option>
              <option value="Pathologist">Pathologist</option>
              <option value="Doctor">Doctor</option>
              <option value="Receptionist">Receptionist</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 font-semibold text-gray-600">
            <div>Email</div>
            <div>Name</div>
            <div>Role</div>
            <div>Actions</div>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found. Add a new user to get started.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.user_id} className="grid grid-cols-4 gap-4 p-4 border-t items-center hover:bg-gray-50">
                <div className="text-sm font-medium">{user.email}</div>
                <div>{`${user.first_name} ${user.last_name}`}</div>
                <div className="capitalize">{user.role}</div>
                <div>
                  <button
                    onClick={() => {
                      setUserToDelete(user);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add User Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New User</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="pathologist">Pathologist</option>
                    <option value="doctor">Doctor</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add User'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Delete User</h2>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  <X size={24} />
                </button>
              </div>

              <p className="mb-4">Are you sure you want to delete {userToDelete?.email}?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(userToDelete.user_id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementDashboard;
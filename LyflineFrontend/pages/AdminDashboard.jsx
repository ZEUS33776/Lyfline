import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, X, Search } from 'lucide-react';
import Navbar from '../src/components/DasboardNavbar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const UserManagementDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: '',
  });

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate("/signin");
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getHospitalIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const decoded = jwtDecode(token);
      return decoded.hospitalId;
    } catch (error) {
      console.error('Error getting hospital ID:', error);
      return null;
    }
  };

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
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

  const checkHospitalAccess = () => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
      toast.error('Authentication required');
      navigate("/signin");
      return false;
    }
    if (hospitalId !== parseInt(id)) {
      toast.error('Unauthorized access');
      localStorage.removeItem('token');
      navigate("/signin");
      return false;
    }
    return true;
  };

  const usersForAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-users-for-admin/${id}`);
      setUsers(response.data.rows);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (checkAuth() && checkHospitalAccess()) {
      usersForAdmin();
    }
  }, [id]);

  const addUser = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/add-user`, {
        ...form,
        role: form.role.charAt(0).toUpperCase() + form.role.slice(1),
        hospital_id: id,
      });
      toast.success('User added successfully!');
      await usersForAdmin();
      setIsAddModalOpen(false);
      setForm({ email: '', password: '', first_name: '', last_name: '', role: '' });
    } catch (error) {
      toast.error('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/delete-user/${userId}`);
      toast.success('User deleted successfully!');
      await usersForAdmin();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-gray-100 relative">
      <Toaster position="top-center" reverseOrder={false} />
      {isLoading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"><div className="loader"></div></div>}
      <Navbar handleSignOut={handleSignOut} />
      
      <div className="p-8">
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

        <div className="flex justify-between items-center mb-4">
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

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 font-semibold text-gray-600">
            <div>Email</div>
            <div>Name</div>
            <div>Role</div>
            <div>Actions</div>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found. Add a new user to get started.</div>
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
              
              <form onSubmit={(e) => { e.preventDefault(); addUser(); }} className="space-y-4">
                <input type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email" className="w-full px-4 py-2 border rounded-md" required />
                <input type="password" name="password" value={form.password} onChange={handleInputChange} placeholder="Password" className="w-full px-4 py-2 border rounded-md" required />
                <input type="text" name="first_name" value={form.first_name} onChange={handleInputChange} placeholder="First Name" className="w-full px-4 py-2 border rounded-md" required />
                <input type="text" name="last_name" value={form.last_name} onChange={handleInputChange} placeholder="Last Name" className="w-full px-4 py-2 border rounded-md" required />
                <select name="role" value={form.role} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" required>
                  <option value="">Select Role</option>
                  <option value="Pathologist">Pathologist</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                </select>

                <button type="submit" className="w-full bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors" disabled={isLoading}>Add User</button>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Delete User</h2>
              <p>Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}?</p>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" disabled={isLoading}>Cancel</button>
                <button onClick={() => deleteUser(userToDelete?.user_id)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700" disabled={isLoading}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementDashboard;

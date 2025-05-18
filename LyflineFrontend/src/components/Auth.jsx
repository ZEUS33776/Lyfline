import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth = async () => {
    try {
      const response = await api.login({
        email,
        password,
        role
      });
      
      // Use auth context login (now async)
      const loginSuccess = await login({
        token: response.data.token,
        hospitalId: response.data.hospitalId,
        userId: response.data.user_id,
        role
      });
      
      if (!loginSuccess) {
        throw new Error('Failed to set login data');
      }
      
      toast.success('Login successful!');
      return response.data.hospitalId;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Authentication failed. Please check your credentials.');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const hospitalId = await handleAuth();
      
      toast.success("Credentials verified!");
      
      // Double-check that the login data is set
      if (!localStorage.getItem('token')) {
        throw new Error('Login data not set properly');
      }
      
      // Delay navigation slightly to ensure token is properly saved
      setTimeout(() => { 
        // Final verification before navigation
        if (localStorage.getItem('token')) {
          navigate(`/${role.toLowerCase()}-dashboard/${hospitalId}`);
        } else {
          toast.error('Login failed. Please try again.');
        }
      }, 100); // Reduced timeout for better UX
    } catch (error) {
      console.error('Login submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = ['Admin', 'Pathologist', 'Doctor', 'Receptionist'];

  // Sample credentials mapped by role
  const sampleCredentials = {
    Doctor: { email: 'michael.brown@example.com', password: 'password1' },
    Pathologist: { email: 'elizabeth.jackson@example.com', password: 'password1' },
    Receptionist: { email: 'nancy.hill@example.com', password: 'password1' },
    Admin: { email: 'info@centralcityhospital.com', password: 'password1' }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen relative bg-gradient-to-br from-red-50 via-white to-blue-50">
        {/* Animated background blobs */}
        <div className="absolute inset-0 z-0 opacity-40 overflow-hidden">
          <div 
            className="absolute -top-24 -right-24 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl"
            style={{ animation: 'blob 7s infinite' }}
          />
          <div 
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"
            style={{ animation: 'blob 7s infinite', animationDelay: '2s' }}
          />
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl"
            style={{ animation: 'blob 7s infinite', animationDelay: '4s' }}
          />
        </div>

        <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-100">
            <div className="px-4 py-8 sm:px-10">
              <div className="flex justify-center mb-8">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-0.5 transform hover:scale-105 transition-transform duration-300">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                    <LogIn className="h-10 w-10 text-red-500" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                Welcome to Lyfline
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Please sign in to continue to your dashboard
              </p>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="bg-gray-50/50 p-1.5 rounded-xl backdrop-blur-sm">
                  <div className="flex justify-between items-center gap-1">
                    {roles.map((r) => (
                      <button
                        type="button"
                        key={r}
                        className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                          ${role === r 
                            ? 'bg-white text-red-600 shadow-lg ring-1 ring-gray-100 transform scale-105' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                          }`}
                        onClick={() => setRole(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                      transition duration-200 text-gray-900 text-sm bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                        transition duration-200 text-gray-900 text-sm pr-12 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400
                        hover:text-gray-600 transition duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent
                    rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500
                    hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-red-500 transition duration-300 transform hover:scale-[1.02] disabled:opacity-50
                    disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign in as {role}
                    </>
                  )}
                </button>
              </form>
              
              {/* Test Credentials Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Test Credentials:</p>
                <div className="mt-2 text-xs text-gray-400">
                  <p>Email: {sampleCredentials[role].email}</p>
                  <p>Password: {sampleCredentials[role].password}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;

import React, { useState } from 'react';
import { Heart, Activity, ThermometerSun } from 'lucide-react';

const HealthForm = () => {
  const [formData, setFormData] = useState({
    gender: '', age: '', education: '', currentSmoker: false, cigsPerDay: '',
    BPMeds: false, prevalentStroke: false, prevalentHyp: false, diabetes: false,
    totChol: '', sysBP: '', diaBP: '', BMI: '', heartRate: '', glucose: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Here you would typically send the data to your backend
  };

    return (
    <div className='w-[100vw] h-[80vh] bg-slate-50 '>
    <div className="max-w-6xl mx-auto my-12 p-8 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-2xl">
      <h2 className="text-red-500 text-3xl font-bold text-center  mb-12">Your Health Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="mr-2 text-red-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Education (years)</label>
                <input
                  type="number"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="mr-2 text-red-500" /> Lifestyle Factors
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="currentSmoker"
                  checked={formData.currentSmoker}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Current Smoker</label>
              </div>
              {formData.currentSmoker && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cigarettes per Day</label>
                  <input
                    type="number"
                    name="cigsPerDay"
                    value={formData.cigsPerDay}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  />
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="BPMeds"
                  checked={formData.BPMeds}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">On BP Medication</label>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <ThermometerSun className="mr-2 text-red-500" /> Medical History
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="prevalentStroke"
                  checked={formData.prevalentStroke}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Prevalent Stroke</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="prevalentHyp"
                  checked={formData.prevalentHyp}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Prevalent Hypertension</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="diabetes"
                  checked={formData.diabetes}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Diabetes</label>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Health Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Cholesterol</label>
                <input
                  type="number"
                  name="totChol"
                  value={formData.totChol}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Systolic BP</label>
                <input
                  type="number"
                  name="sysBP"
                  value={formData.sysBP}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Diastolic BP</label>
                <input
                  type="number"
                  name="diaBP"
                  value={formData.diaBP}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">BMI</label>
                <input
                  type="number"
                  name="BMI"
                  value={formData.BMI}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Heart Rate</label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Glucose</label>
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white text-lg font-semibold rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Submit Health Profile
          </button>
        </div>
      </form>
            </div>
            </div>
  );
};

export default HealthForm;
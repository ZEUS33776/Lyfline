import React, { useState } from 'react';
import { Heart, Activity, X } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const PathologyReportForm = ({ onClose, onSubmit, age, sex, pid, fname, lname }) => {
  const [formData, setFormData] = useState({
    patient_id: pid,
    pathologist_id: parseInt(localStorage.getItem('user_id')),
    sys_bp: '',
    dia_bp: '',
    resting_blood_pressure: '',
    heart_rate: '',
    bmi: '',
    chest_pain_type: '0',
    resting_ecg_result: '0',
    max_heart_rate: '',
    exercise_induced_angina: false,
    glucose: 0.0,
    oldpeak: '',
    major_vessels: '',
    thal: '0',
    fasting_blood_sugar: false,
    slope: '',
    serum_cholestoral: '',
    is_critical: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' 
      ? checked 
      : type === 'number' 
        ? value === '' ? '' : parseFloat(value)
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    console.log(`Field ${name} updated to:`, newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === '' ? null : value
      ])
    );
    
    console.log('Submitting data:', submitData);
    
    try {
      // First, get the prediction
      const predictionRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/predict/heart`, {
        "age": age,
        "sex": sex,
        "cp": formData.chest_pain_type,
        "trtbps": formData.resting_blood_pressure,
        "chol": formData.serum_cholestoral,
        "fbs": formData.fasting_blood_sugar,
        "restecg": formData.resting_ecg_result,
        "thalachh": formData.max_heart_rate,
        "exng": formData.exercise_induced_angina,
        "oldpeak": formData.oldpeak,
        "slp": formData.slope,
        "caa": formData.chest_pain_type,
        "thall": formData.thal
      });

      // Update is_critical based on prediction
      if (predictionRes.data.prediction === 1) {
        // Update local state
        submitData.is_critical = true;
        
        // Update critical status in backend
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/critical`, { "patient_id": pid });
        
        toast.error("Patient is critical. Please consult a Specialist.");
      }

      // Submit the report with updated is_critical status
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/add-pathology-report`, submitData);
      console.log("Report submitted successfully:", response.data);
      onSubmit?.(submitData);
      onClose();
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.log("Error submitting the report:", error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Toaster />
      <form onSubmit={handleSubmit} className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 flex justify-between items-start border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">New Pathology Report</h2>
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={`${fname} ${lname}`}
                readOnly
                className="w-full p-2 border rounded text-gray-800"
              />
              <input
                type="text"
                value={formData.patient_id}
                readOnly
                className="w-full p-2 border text-gray-800 rounded"
              />
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Vital Signs Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Blood Pressure</h3>
              </div>
              <div className="space-y-2">
                <input
                  type="number"
                  name="sys_bp"
                  placeholder="Systolic"
                  value={formData.sys_bp}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  step="0.1"
                />
                <input
                  type="number"
                  name="dia_bp"
                  placeholder="Diastolic"
                  value={formData.dia_bp}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  step="0.1"
                />
                <input
                  type="number"
                  name="resting_blood_pressure"
                  placeholder="Resting"
                  value={formData.resting_blood_pressure}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Heart Rate</h3>
              </div>
              <input
                type="number"
                name="heart_rate"
                placeholder="BPM"
                value={formData.heart_rate}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="number"
                name="max_heart_rate"
                placeholder="Max BPM"
                value={formData.max_heart_rate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">BMI</h3>
              </div>
              <input
                type="number"
                name="bmi"
                placeholder="BMI"
                value={formData.bmi}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="0.1"
              />
            </div>
          </div>

          {/* Cardiac Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cardiac Assessment</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Chest Pain Type</p>
                  <select
                    name="chest_pain_type"
                    value={formData.chest_pain_type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="0">At ease</option>
                    <option value="1">Mild</option>
                    <option value="2">Moderate</option>
                    <option value="3">Severe</option>
                    <option value="4">Very Severe</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exercise Induced Angina</p>
                  <input
                    type="checkbox"
                    name="exercise_induced_angina"
                    checked={formData.exercise_induced_angina}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Number of Major Vessels</p>
                  <input
                    type="number"
                    name="major_vessels"
                    value={formData.major_vessels}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="4"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">ECG Results</p>
                  <select
                    name="resting_ecg_result"
                    value={formData.resting_ecg_result}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="0">Normal</option>
                    <option value="1">ST-T Wave Abnormality</option>
                    <option value="2">Left Ventricular Hypertrophy</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ST Depression (Oldpeak)</p>
                  <input
                    type="number"
                    name="oldpeak"
                    value={formData.oldpeak}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    step="0.1"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thalassemia</p>
                  <select
                    name="thal"
                    value={formData.thal}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="0">Normal</option>
                    <option value="1">Fixed Defect</option>
                    <option value="2">Reversible Defect</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Laboratory Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Laboratory Results</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div>
                  <p className="text-sm text-gray-600">Fasting blood sugar{'>'}120</p>
                  <input
                    type="checkbox"
                    name="fasting_blood_sugar"
                    checked={formData.fasting_blood_sugar}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
                <p className="text-sm text-gray-600">Glucose Level</p>
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="mg/dL"
                  step="0.1"
                />
                <p className="text-sm text-gray-600 mt-3">Slope</p>
                <input
                  type="number"
                  name="slope"
                  value={formData.slope}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cholesterol</p>
                <input
                  type="number"
                  name="serum_cholestoral"
                  value={formData.serum_cholestoral}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="mg/dL"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Report
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PathologyReportForm;
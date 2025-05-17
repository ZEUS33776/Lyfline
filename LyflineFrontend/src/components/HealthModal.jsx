import React, { useState,useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import {toast} from 'react-hot-toast';



const HealthFormModal = ({hid}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [BMI,setBMI]=useState(0)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    male: 0,
    age: 0,
    education: 0,
    current_smoker: 0,
    cigsPerDay: 0,
    BPMeds: 0,
    prevalentStroke: 0,
    diabetes: 0,
    prevalentHyp: 0,
    sysBP: 0,
    diaBP: 0,
    weight: 0,
    height:0,
    BMI:0,
    heartRate:0,
    
      is_heart_patient: 0,
      hospital_id:hid
  });
  useEffect(() => {
    if (formData.height !== 0 && formData.weight !== 0) {
      setBMI(formData.weight/(formData.height*formData.height));
    }
}, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
   
  };
    const handleAddPatient = async () => {
        try {
            const response = await axios.post("http://localhost:3000/add-patient", formData)
        }
        catch (error) {
            console.log(error)
        }
    
  }
  // # curl -X POST -H "Content-Type: application/json" -d '{
//   #    "male": 0,
//   #     "age": 61,
//   #     "education": 3,
//   #     "currentSmoker": 1,
//   #     "cigsPerDay": 30,
//   #     "BPMeds": 0,
//   #     "prevalentStroke": 0,
//   #     "prevalentHyp": 1,
//   #     "diabetes": 0,
//   #     "totChol": 225,
//   #     "sysBP": 150,
//   #     "diaBP": 95,
//   #     "BMI": 28.58,
//   #     "heartRate": 65,
//   #     "glucose": 103
//   #  }' http://localhost:5001/predict/chd
const handlePreModel = async () => {
  try {
    const response = await axios.post("http://localhost:3000/predict/chd", {
      male: formData.male,
      age: formData.age,
      education: formData.education,
      currentSmoker: formData.current_smoker,
      cigsPerDay: formData.cigsPerDay,
      BPMeds: formData.BPMeds,
      prevalentStroke: formData.prevalentStroke,
      prevalentHyp: formData.prevalentHyp,
      diabetes: formData.diabetes,
      totChol: 225,
      sysBP: formData.sysBP,
      diaBP: formData.diaBP,
      BMI: formData.BMI,
      heartRate: formData.heartRate,
      glucose: 103
    });
    
    console.log(response.data); // Log the response data
    
    if (response.data.prediction === 1) { // Access prediction from response.data
      toast((t) => (
        <div className="flex items-center">
          <span>You are prone to get a heart-related disease in the future. Kindly consult a specialist.</span>
          <button
            className="ml-4 bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </div>
      ), {
        duration: Infinity, // Keep the toast open until dismissed
      });
    }
    
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error in prediction:", error);
    toast.error("Error getting prediction");
    throw error; // Rethrow the error to handle it in handleSubmit
  }
};

const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission
  
  try {
    console.log('Form submitted:', formData);
    toast.success("Successfully submitted!")
    setTimeout(() => {
      setIsOpen(false)
    },1000)
    
    
    // Wait for both operations to complete
    await handleAddPatient();
    await handlePreModel();
    // window.location.reload()
    

    
  } catch (error) {
    console.error("Error in form submission:", error);
    toast.error("Error submitting form");
    // Don't reload if there was an error
  }
};

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
        <Plus className="w-4 h-4 mr-2" />
        Add New Patient
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Health Information Form</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education(level)
                </label>
                <input
                  type="number"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Systolic BP 
                </label>
                <input
                  type="number"
                  name="sysBP"
                  value={formData.sysBP}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diastolic BP
                </label>
                <input
                  type="number"
                  name="diaBP"
                  value={formData.diaBP}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heart Rate
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Weight(kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (m)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BMI
                </label>
                <input
                  type="number"
                  name="BMI"
                  value={parseFloat(BMI.toFixed(2))}
                   
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="male"
                  checked={formData.male === 1}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Male</label>
                <input
                  type="checkbox"
                  name="female"
                  
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Female</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="current_smoker"
                  checked={formData.current_smoker === 1}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Current Smoker</label>
              </div>
            </div>

            {formData.current_smoker === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cigarettes Per Day
                </label>
                <input
                  type="number"
                  name="cigsPerDay"
                  value={formData.cigsPerDay}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="BPMeds"
                  checked={formData.BPMeds === 1}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">BP Medication</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="prevalentStroke"
                  checked={formData.prevalentStroke === 1}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Prevalent Stroke</label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="prevalentHyp"
                  checked={formData.prevalentHyp === 1}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Prevalent Hypertension</label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="diabetes"
                  checked={formData.diabetes === 1}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Diabetes</label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_heart_patient"
                checked={formData.is_heart_patient === 1}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">Heart Patient</label>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthFormModal;

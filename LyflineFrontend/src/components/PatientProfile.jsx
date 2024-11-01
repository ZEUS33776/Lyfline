const PatientProfile = ({ patient, onBack }) => {
    return (
      <div className="p-6">
        <button onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded mb-6">
          Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold">{patient.name}'s Profile</h2>
        <p className="mt-2">Age: {patient.age}</p>
        <p>Sex: {patient.sex}</p>
        <p>Education: {patient.education}</p>
        <p>Current Smoker: {patient.current_smoker}</p>
        <p>Diabetes: {patient.diabetes}</p>
        <p>Hospital ID: {patient.hospital_id}</p>
        <h3 className="text-xl font-semibold mt-6">Previous Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {patient.reports.map((report, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold">{report}</h4>
              <button
                onClick={() => alert(`Viewing ${report}`)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Open Report
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  export default PatientProfile
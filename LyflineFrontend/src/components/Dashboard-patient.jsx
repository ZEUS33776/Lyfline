const Dashboard = ({ patients, onViewProfile }) => {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">{patient.name}</h3>
              <p>Age: {patient.age}</p>
              <p>Sex: {patient.sex}</p>
              <p>Check-in: {patient.checkInTime}</p>
              <button
                onClick={() => onViewProfile(patient)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    );
};
  export default Dashboard
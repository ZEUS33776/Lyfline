# Lyfline 🫀  
**Lyfline** is an advanced heart condition prediction system that leverages machine learning to provide **predictive health insights**. It helps healthcare professionals assess **future risks for new patients** and monitor **currently admitted heart patients** to predict the likelihood of a heart attack based on routine health data.

This system serves as an essential tool for **preventive healthcare**, enabling hospitals to act swiftly based on real-time data, ensuring better outcomes for patients.

---

## 🌟 Key Features

- **New Patient Risk Prediction Model**:  
  Analyzes the **initial health reports** of new patients, even those with no prior heart-related history, to predict the **possibility of developing heart conditions** in the future.
  
- **Current Patient Monitoring Model**:  
  Continuously **monitors the health reports** of admitted patients collected by healthcare professionals during rounds to detect the **likelihood of an imminent heart attack**.

- **Hospital Database Integration**:  
  Works seamlessly with **existing hospital systems** to pull patient reports for analysis.

- **Real-Time Alerts**:  
  Notifies healthcare professionals when a patient shows signs of high risk.

---

## 🔧 Technology Stack

- **Frontend**: React.js  
- **Backend**: Node.js, Express  
- **Machine Learning Models**: Python (scikit-learn, TensorFlow)  
- **Database**: MongoDB / SQL (for patient data storage)  


---

## 🏥 Use Cases

### 1. **New Patient Risk Assessment**  
Doctors can upload initial reports, and Lyfline will predict if the patient is at risk of developing a heart condition in the future. This allows for **early interventions**.

### 2. **Current Patient Monitoring**  
The system monitors the reports of **currently admitted heart patients** (like ECG readings, blood pressure, etc.). Nurses upload these regularly, and the system evaluates the **possibility of a heart attack**, providing alerts for **timely medical response**.

---

## 🚀 Getting Started

### Prerequisites  
Ensure you have the following installed:  
- **Node.js**: [Download](https://nodejs.org/)  
- **Python 3.8+**: [Download](https://www.python.org/)  
- **MongoDB or SQL database** for storing patient data.

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ZEUS33776/Lyfline.git
   cd Lyfline
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Set up Python environment for machine learning models**:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   DB_CONNECTION=<your-database-url>
   PORT=5000
   ```

5. **Start the backend server**:
   ```bash
   npm start
   ```

6. **Navigate to the frontend** (React app):
   ```bash
   cd client
   npm install
   npm start
   ```

---

## 📈 Machine Learning Models

### 1. **New Patient Model**  
- **Purpose**: Predicts the likelihood of new patients developing heart conditions in the future.  
- **Inputs**: Patient reports (age, cholesterol, blood pressure, glucose levels, etc.).  
- **Algorithm**: Logistic Regression / Random Forest.  
- **Output**: Risk score indicating if the patient might develop a heart-related issue.

### 2. **Current Patient Monitoring Model**  
- **Purpose**: Evaluates the reports of **admitted heart patients** to predict if a heart attack may occur soon.  
- **Inputs**: Time-series data like ECG readings, heart rate, and blood pressure.  
- **Algorithm**: LSTM (Long Short-Term Memory) for time-series prediction.  
- **Output**: Alert if the patient is at risk of a heart attack.

---

## 🧪 Model Training

To train the models, follow these steps:

1. **Train the New Patient Model**:
   ```bash
   python models/new_patient_model.py --train
   ```

2. **Train the Current Patient Monitoring Model**:
   ```bash
   python models/current_patient_monitoring.py --train
   ```

3. **Evaluate Models**:
   ```bash
   python evaluate_models.py
   ```

---

## 🚀 Configuration Instructions

The application now uses a configuration system to manage server URLs and endpoints:

### Backend Configuration
The server uses a configuration file located at `server/config/config.js` that loads environment variables from `.env`:

```js
# Server Configuration
PORT=3000

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=lyfline
DB_PASSWORD=your_password
DB_PORT=5432

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# ML Service
ML_SERVICE_URL=http://localhost:5001
```

### Frontend Configuration
Frontend configuration is managed in `src/config.js` and uses environment variables with fallbacks:

```js
// API server URLs
API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
```

Create a `.env.local` file in the frontend directory with:
```
VITE_API_BASE_URL=http://localhost:3000
```

### Automated Setup Scripts
For convenience, the project includes automated setup scripts:

- **Linux/Mac**: Use `deploy.sh` to set up the environment
- **Windows**: Use `deploy.bat` to set up the environment

These scripts will create configuration files, install dependencies, and offer to start the services.

---

## 🛡️ Security and Privacy

- **Access Control**: Only authorized hospital staff can access patient data.  
- **GDPR Compliance**: The system ensures the privacy and security of all personal data.

---

## 🛠️ Future Improvements

- **Mobile App for Doctors and Nurses**: Provide real-time notifications and easy report uploads via a mobile app.  
- **More Predictive Features**: Incorporate genetic and lifestyle data for even more accurate predictions.  
- **AI Explainability**: Implement techniques like SHAP to help doctors understand how the models make predictions.

---

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps to contribute:

1. **Fork the repository**.
2. **Create a new branch** (`git checkout -b feature-branch`).
3. **Commit your changes** (`git commit -m "Add feature"`).
4. **Push to your branch** (`git push origin feature-branch`).
5. **Open a pull request**.

---

## 📧 Contact

For questions or support, please reach out to:  
**Email**: [desh.arjun3@gmail.com](mailto:desh.arjun3@gmail.com)  
**GitHub**: [ZEUS33776](https://github.com/ZEUS33776)

---

This README provides an in-depth overview of your **Lyfline** project and serves as a comprehensive guide for users and contributors. Let me know if you'd like to add or modify anything!

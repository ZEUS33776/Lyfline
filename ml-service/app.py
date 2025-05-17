# ml-service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load heart disease models
HEART_MODEL_PATH = 'models/heart_model.joblib'
HEART_SCALER_PATH = 'models/heart_scaler.joblib'
HEART_IMPUTER_PATH = 'models/heart_imputer.joblib'

heart_classifier = joblib.load(HEART_MODEL_PATH)
heart_scaler = joblib.load(HEART_SCALER_PATH)
heart_imputer = joblib.load(HEART_IMPUTER_PATH)

# Load CHD models
CHD_MODEL_PATH = 'models/chd_model.joblib'
CHD_SCALER_PATH = 'models/chd_scaler.joblib'
CHD_IMPUTER_PATH = 'models/chd_imputer.joblib'

chd_classifier = joblib.load(CHD_MODEL_PATH)
chd_scaler = joblib.load(CHD_SCALER_PATH)
chd_imputer = joblib.load(CHD_IMPUTER_PATH)

@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    try:
        data = request.json
        
        # Create feature array in correct order
        features = np.array([
            float(data['age']),          # age
            float(data['sex']),          # sex
            float(data['cp']),           # chest pain type
            float(data['trtbps']),       # resting blood pressure
            float(data['chol']),         # cholesterol
            float(data['fbs']),          # fasting blood sugar
            float(data['restecg']),      # resting ECG
            float(data['thalachh']),     # maximum heart rate
            float(data['exng']),         # exercise induced angina
            float(data['oldpeak']),      # ST depression
            float(data['slp']),          # slope
            float(data['caa']),          # number of major vessels
            float(data['thall'])         # thalassemia
        ]).reshape(1, -1)
        
        # Handle missing values and scale
        features = heart_imputer.transform(features)
        features_scaled = heart_scaler.transform(features)
        
        # Make prediction
        prediction = heart_classifier.predict(features_scaled)
        prediction_proba = heart_classifier.predict_proba(features_scaled)
        
        return jsonify({
            'prediction': int(prediction[0]),  # 0: No risk, 1: Risk
            'probability': float(prediction_proba[0][1]),
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/predict/chd', methods=['POST'])
def predict_chd():
    try:
        data = request.json
        
        # Create feature array in correct order for Framingham dataset
        features = np.array([
            float(data['male']),           # male
            float(data['age']),            # age
            float(data['education']),      # education
            float(data['currentSmoker']),  # currentSmoker
            float(data['cigsPerDay']),     # cigsPerDay
            float(data['BPMeds']),         # BPMeds
            float(data['prevalentStroke']), # prevalentStroke
            float(data['prevalentHyp']),   # prevalentHyp
            float(data['diabetes']),       # diabetes
            float(data['totChol']),        # totChol
            float(data['sysBP']),          # sysBP
            float(data['diaBP']),          # diaBP
            float(data['BMI']),            # BMI
            float(data['heartRate']),      # heartRate
            float(data['glucose'])         # glucose
        ]).reshape(1, -1)
        
        # Handle missing values and scale
        features = chd_imputer.transform(features)
        features_scaled = chd_scaler.transform(features)
        
        # Make prediction
        prediction = chd_classifier.predict(features_scaled)
        prediction_proba = chd_classifier.predict_proba(features_scaled)
        
        return jsonify({
            'prediction': int(prediction[0]),  # 0: No risk, 1: Risk of CHD in 10 years
            'probability': float(prediction_proba[0][1]),
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    # Get port from environment variable or default to 5001
    port = int(os.environ.get('PORT', 5001))
    # Important: bind to 0.0.0.0 to make the app accessible outside the container
    app.run(host='0.0.0.0', port=port)
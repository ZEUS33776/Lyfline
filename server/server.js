import express, { query, response } from "express";
import cors from "cors";
import pkg from 'pg';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import axios from "axios";
import config from './config/config.js';

const app = express();
const port = config.port;

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  family: 4,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Patients route - Add patient
app.post('/add-patient', async (req, res) => {
  const {
    first_name,           // Added first_name
    last_name,            // Changed second_name to last_name
    male,
    age,
    education,
    current_smoker,       // Updated column name to match the database
    cigsPerDay,
    BPMeds,
    prevalentStroke,
    prevalentHyp,
    diabetes,
    is_heart_patient,     // Correct column name
    hospital_id           // Include hospital_id
  } = req.body;

  try {
    const query = `
      INSERT INTO patients (first_name, last_name, male, age, education, current_smoker, cigsPerDay, BPMeds, prevalentStroke, prevalentHyp, diabetes, is_heart_patient, hospital_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING patient_id;
    `;

    const values = [
      first_name,           // Added first_name to values
      last_name,            // Added last_name to values
      male,
      age,
      education,
      current_smoker,
      cigsPerDay,
      BPMeds,
      prevalentStroke,
      prevalentHyp,
      diabetes,
      is_heart_patient,
      hospital_id
    ];

    const result = await pool.query(query, values);
    const newPatientId = result.rows[0].patient_id;

    res.status(201).json({
      message: 'Patient added successfully',
      patientId: newPatientId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add patient' });
  }
});
//get patients for dashboard
app.get('/get-patients-for-dashboard', async (req, res) => {
  try {
    // First, get all patients with their pathology reports
    const query = `
      SELECT 
        p.patient_id,
        p.first_name,
        p.last_name,
        p.male,
        p.age,
        p.education,
        p.Diabetes,
        p.current_smoker,
        p.cigsperday,
        p.bpmeds,
        p.prevalentstroke,
        p.prevalenthyp,
        p.diabetes,
        p.is_heart_patient,
        p.hospital_id,
        p.created_at,
        p.updated_at,
        p.iscritical,
        pr.report_id,
        pr.sys_bp,
        pr.dia_bp,
        pr.glucose,
        pr.bmi,
        pr.heart_rate,
        pr.chest_pain_type,
        pr.resting_blood_pressure,
        pr.serum_cholestoral,
        pr.fasting_blood_sugar,
        pr.resting_ecg_result,
        pr.max_heart_rate,
        pr.exercise_induced_angina,
        pr.oldpeak,
        pr.slope,
        pr.major_vessels,
        pr.thal,
        pr.is_critical,
        pr.report_date
      FROM patients p
      LEFT JOIN pathologyreports pr ON p.patient_id = pr.patient_id
      ORDER BY p.patient_id, pr.report_date DESC`;

    const { rows } = await pool.query(query);

    // Transform the flat data into nested structure
    const patientsMap = new Map();

    rows.forEach(row => {
      const patientId = row.patient_id;

      if (!patientsMap.has(patientId)) {
        // Create new patient object
        const patient = {
          patient_id: row.patient_id,
          first_name: row.first_name,
          last_name: row.last_name,
          male: row.male,
          age: row.age,
          education: row.education,
          Diabetes: row.diabetes,
          current_smoker: row.current_smoker,
          cigsperday: row.cigsperday,
          bpmeds: row.bpmeds,
          prevalentstroke: row.prevalentstroke,
          prevalenthyp: row.prevalenthyp,
          diabetes: row.diabetes,
          is_heart_patient: row.is_heart_patient,
          hospital_id: row.hospital_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          iscritical: row.iscritical,
          pathologyReports: []
        };
        patientsMap.set(patientId, patient);
      }

      // Add pathology report if it exists
      if (row.report_id) {
        const pathologyReport = {
          report_id: row.report_id,
          sys_bp: row.sys_bp,
          dia_bp: row.dia_bp,
          glucose: row.glucose,
          bmi: row.bmi,
          heart_rate: row.heart_rate,
          chest_pain_type: row.chest_pain_type,
          resting_blood_pressure: row.resting_blood_pressure,
          serum_cholestoral: row.serum_cholestoral,
          fasting_blood_sugar: row.fasting_blood_sugar,
          resting_ecg_result: row.resting_ecg_result,
          max_heart_rate: row.max_heart_rate,
          exercise_induced_angina: row.exercise_induced_angina,
          oldpeak: row.oldpeak,
          slope: row.slope,
          major_vessels: row.major_vessels,
          thal: row.thal,
          is_critical: row.is_critical,
          report_date: row.report_date
        };
        patientsMap.get(patientId).pathologyReports.push(pathologyReport);
      }
    });

    // Convert map to array
    const patients = Array.from(patientsMap.values());

    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});



//add user for hospital
app.post('/add-user', async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    role,
    hospital_id
    
  } = req.body
  const values= [
    email,
    password,
    first_name,
    last_name,
    role,
    hospital_id
    
  ]
  try {
    const query = `INSERT INTO users(email,password,first_name,last_name,role,hospital_id) VALUES ($1, $2, $3, $4,$5,$6) RETURNING user_id`
    const result = await pool.query(query, values);
    const newUserId = result.rows[0].user_id;

    res.status(201).json({
      message: 'User added successfully',
      user_id: newUserId
    });
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
})

//add hospital route
app.post('/add-hospital', async (req, res) => {
 
    const {
      name,
      address,
      phone,
      email,
      
  } = req.body
  try {
    const query = `INSERT INTO hospitals(name,address,phone,email) VALUES ($1, $2, $3, $4) RETURNING hospital_id`
    const values = [
      name,
      address,
      phone,
      email
    ];
    const result = await pool.query(query, values);
    const hospitalId = result.rows[0].hospital_id;
    res.status(201).json({
      message: 'Hospital added successfully',
      hospitalId: hospitalId
    });
    
  }
  catch (error) {
     res.status(500).json({ error: 'Failed to add hospital' });
  }
})
app.get('/get-users-for-admin/:id', async (req, res) => {
  const { id } = req.params;
  const query = "SELECT user_id, email, password, first_name,last_name,role FROM users WHERE (hospital_id=$1 AND role!='Admin')"
  const result = await pool.query(query, [id])

  res.json(  result )
})
app.delete('/delete-user/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const query='DELETE FROM users WHERE user_id=$1'
    const result = await pool.query(query, [userId])
    res.status(201).json({
      message: 'User deleted successfully',
      
    });
  }
  catch (error) {
    res.status(500).json({error:'Failed to delete user'})
  }

})


//handle authentication
app.post('/auth', async (req, res) => {
  const {
    email,
    password,
    role
  } = req.body
  const query = 'SELECT password,hospital_id,user_id FROM users where email=$1 AND role=$2'
  try {
    const result = await pool.query(query, [email,role])
    var token=null
    if (result.rows[0].password == password) {
      token = jwt.sign({ email:email, role: role,hospitalId:result.rows[0].hospital_id }, process.env.SECRET_KEY, {
        expiresIn: '7d',
      });
      res.status(201).json({ token:token,hospitalId:result.rows[0].hospital_id,user_id:result.rows[0].user_id })
    }
    else {
      res.status(401).json({message:"Invalid credentials."})
    }
  }
  catch (error) {
    res.status(500).json({error:"Trouble signing in."})
  }
})
app.post('/add-pathology-report', async (req, res) => {
  const {
    report_id,
    patient_id,
    pathologist_id,
    sys_bp,
    dia_bp,
    glucose,
    bmi,
    heart_rate,
    chest_pain_type,
    resting_blood_pressure,
    serum_cholestoral,
    fasting_blood_sugar,
    resting_ecg_result,
    max_heart_rate,
    exercise_induced_angina,
    oldpeak,
    slope,
    major_vessels,
    thal,
    is_critical,
    report_date
  } = req.body;

  try {
    const query = `
      INSERT INTO pathologyreports ( patient_id, pathologist_id, sys_bp, dia_bp, glucose, bmi, heart_rate, chest_pain_type, resting_blood_pressure, serum_cholestoral, fasting_blood_sugar, resting_ecg_result, max_heart_rate, exercise_induced_angina, oldpeak, slope, major_vessels, thal, is_critical)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING report_id;
    `;

    const values = [
      
      patient_id,
      pathologist_id,
      sys_bp,
      dia_bp,
      glucose,
      bmi,
      heart_rate,
      chest_pain_type,
      resting_blood_pressure,
      serum_cholestoral,
      fasting_blood_sugar,
      resting_ecg_result,
      max_heart_rate,
      exercise_induced_angina,
      oldpeak,
      slope,
      major_vessels,
      thal,
      is_critical,
      
    ];

    const result = await pool.query(query, values);
    const newReportId = result.rows[0].report_id;

    res.status(201).json({
      message: 'Pathology report added successfully',
      reportId: newReportId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add pathology report' });
  }
});
app.get('/get-patients-for-doctor', async (req, res) => {
  try {
    // First, get all patients with their pathology reports
    const query = `
     SELECT 
    p.patient_id,
    p.first_name,
    p.last_name,
    p.male,
    p.age,
    p.education,
    p.Diabetes,
    p.current_smoker,
    p.cigsperday,
    p.bpmeds,
    p.prevalentstroke,
    p.prevalenthyp,
    p.diabetes,
    p.is_heart_patient,
    p.hospital_id,
    p.created_at,
    p.updated_at,
    p.iscritical,
    pr.report_id,
    pr.sys_bp,
    pr.dia_bp,
    pr.glucose,
    pr.bmi,
    pr.heart_rate,
    pr.chest_pain_type,
    pr.resting_blood_pressure,
    pr.serum_cholestoral,
    pr.fasting_blood_sugar,
    pr.resting_ecg_result,
    pr.max_heart_rate,
    pr.exercise_induced_angina,
    pr.oldpeak,
    pr.slope,
    pr.major_vessels,
    pr.thal,
    pr.is_critical,
    pr.report_date
FROM patients p
LEFT JOIN pathologyreports pr ON p.patient_id = pr.patient_id
WHERE p.iscritical >0
ORDER BY p.patient_id, pr.report_date DESC;
`;

    const { rows } = await pool.query(query);

    // Transform the flat data into nested structure
    const patientsMap = new Map();

    rows.forEach(row => {
      const patientId = row.patient_id;

      if (!patientsMap.has(patientId)) {
        // Create new patient object
        const patient = {
          patient_id: row.patient_id,
          first_name: row.first_name,
          last_name: row.last_name,
          male: row.male,
          age: row.age,
          education: row.education,
          Diabetes: row.diabetes,
          current_smoker: row.current_smoker,
          cigsperday: row.cigsperday,
          bpmeds: row.bpmeds,
          prevalentstroke: row.prevalentstroke,
          prevalenthyp: row.prevalenthyp,
          diabetes: row.diabetes,
          is_heart_patient: row.is_heart_patient,
          hospital_id: row.hospital_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          iscritical: row.iscritical,
          pathologyReports: []
        };
        patientsMap.set(patientId, patient);
      }

      // Add pathology report if it exists
      if (row.report_id) {
        const pathologyReport = {
          report_id: row.report_id,
          sys_bp: row.sys_bp,
          dia_bp: row.dia_bp,
          glucose: row.glucose,
          bmi: row.bmi,
          heart_rate: row.heart_rate,
          chest_pain_type: row.chest_pain_type,
          resting_blood_pressure: row.resting_blood_pressure,
          serum_cholestoral: row.serum_cholestoral,
          fasting_blood_sugar: row.fasting_blood_sugar,
          resting_ecg_result: row.resting_ecg_result,
          max_heart_rate: row.max_heart_rate,
          exercise_induced_angina: row.exercise_induced_angina,
          oldpeak: row.oldpeak,
          slope: row.slope,
          major_vessels: row.major_vessels,
          thal: row.thal,
          is_critical: row.is_critical,
          report_date: row.report_date
        };
        patientsMap.get(patientId).pathologyReports.push(pathologyReport);
      }
    });

    // Convert map to array
    const patients = Array.from(patientsMap.values());

    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});
app.put("/attend", async (req, res) => {
  const { patient_id,user_id } = req.body;

  try {
    const q1 = `SELECT iscritical FROM patients WHERE patient_id = $1 `
    const res1 = await pool.query(q1, [patient_id]);
    if (res1.rows[0].iscritical == 1){
      const query = `UPDATE patients SET iscritical = $2 WHERE patient_id = $1`;
    const result = await pool.query(query, [patient_id, 5 * user_id]); // Renamed res to result

    res.status(200).json({ message: "Patient attended successfully." });
  }
  } catch (error) {
    res.status(500).json({ error: "Failed to attend" });
  }
});
app.get("/get-name/:user_id", async (req, res) => {
  const { user_id } = req.params;
  
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const query = `SELECT first_name, last_name FROM users WHERE user_id = $1`;
    const response = await pool.query(query, [user_id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(response.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error getting name" });
  }
});
app.post("/predict/heart", async (req, res) => {
  try {
    console.log('🩺 [Heart Prediction] Request received:', JSON.stringify(req.body, null, 2));
    
    const mlEndpoint = `${config.mlService.url}${config.mlService.endpoints.predictHeart}`;
    console.log('🔗 [Heart Prediction] ML endpoint:', mlEndpoint);
    
    // Try the ML service first
    try {
      const response = await axios.post(mlEndpoint, req.body, { timeout: 5000 });
      console.log('✅ [Heart Prediction] ML Service Success:', response.data);
      return res.json(response.data);
    } catch (mlError) {
      console.warn('⚠️ [Heart Prediction] ML Service unavailable, using fallback prediction');
      
      // Fallback: Simple rule-based prediction
      const { age, sex, cp, trtbps, chol, fbs, restecg, thalachh, exng, oldpeak, slp, caa, thall } = req.body;
      
      let riskScore = 0;
      
      // Age factor (higher age = higher risk)
      if (age > 65) riskScore += 3;
      else if (age > 55) riskScore += 2;
      else if (age > 45) riskScore += 1;
      
      // Sex factor (male = higher risk)
      if (sex === 1) riskScore += 1;
      
      // Chest pain type (higher = more concerning)
      if (cp >= 3) riskScore += 2;
      else if (cp >= 2) riskScore += 1;
      
      // Blood pressure (hypertension)
      if (trtbps > 140) riskScore += 2;
      else if (trtbps > 120) riskScore += 1;
      
      // Cholesterol
      if (chol > 240) riskScore += 2;
      else if (chol > 200) riskScore += 1;
      
      // Fasting blood sugar
      if (fbs === 1) riskScore += 1;
      
      // Max heart rate (lower = concerning for age)
      const expectedMaxHR = 220 - age;
      if (thalachh < expectedMaxHR * 0.7) riskScore += 2;
      else if (thalachh < expectedMaxHR * 0.8) riskScore += 1;
      
      // Exercise induced angina
      if (exng === 1) riskScore += 2;
      
      // Old peak (ST depression)
      if (oldpeak > 2) riskScore += 2;
      else if (oldpeak > 1) riskScore += 1;
      
      // Major vessels
      if (caa >= 2) riskScore += 2;
      else if (caa >= 1) riskScore += 1;
      
      // Thalassemia
      if (thall === 3) riskScore += 2; // Reversible defect
      else if (thall === 2) riskScore += 1; // Fixed defect
      
      // Calculate prediction (risk if score >= 7)
      const prediction = riskScore >= 7 ? 1 : 0;
      const probability = Math.min(riskScore / 15, 1); // Normalize to 0-1
      
      const fallbackResult = {
        prediction: prediction,
        probability: probability,
        status: 'success',
        fallback: true,
        riskScore: riskScore,
        message: 'Prediction generated using fallback rule-based system'
      };
      
      console.log('✅ [Heart Prediction] Fallback Success:', fallbackResult);
      return res.json(fallbackResult);
    }
    
  } catch (error) {
    console.error('❌ [Heart Prediction] Complete failure:');
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to get prediction - both ML service and fallback failed',
      details: error.message
    });
  }
});
app.post("/predict/chd", async (req, res) => {
  try {
    const mlEndpoint = `${config.mlService.url}${config.mlService.endpoints.predictCHD}`;
    const response = await axios.post(mlEndpoint, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to get prediction'
    });
  }
});
app.put("/critical", async (req, res) => {
  const { patient_id } = req.body;

  try {
    const query = `UPDATE patients SET iscritical = 1 WHERE patient_id = $1`;
    const result = await pool.query(query, [patient_id]); // Renamed res to result

    res.status(200).json({ message: "Updated patient is critical." }); // Send success response
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});
app.put("/stable", async (req, res) => {
  const { patient_id } = req.body;

  try {
    const query = `UPDATE patients SET iscritical = 0 WHERE patient_id = $1`;
    const result = await pool.query(query, [patient_id]); // Renamed res to result

    res.status(200).json({ message: "Updated patient is critical." }); // Send success response
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});
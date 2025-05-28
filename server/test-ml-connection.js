import axios from 'axios';
import config from './config/config.js';

async function testMLConnection() {
  console.log('🔍 Testing ML Service Connection...');
  console.log('📍 ML Service URL:', config.mlService.url);
  console.log('📍 Heart Endpoint:', `${config.mlService.url}${config.mlService.endpoints.predictHeart}`);
  
  const testData = {
    "age": 65,
    "sex": 1,
    "cp": 0,
    "trtbps": 110,
    "chol": 248,
    "fbs": 0,
    "restecg": 0,
    "thalachh": 158,
    "exng": 0,
    "oldpeak": 0.6,
    "slp": 2,
    "caa": 2,
    "thall": 1
  };
  
  try {
    console.log('📤 Sending test data:', testData);
    
    const response = await axios.post(
      `${config.mlService.url}${config.mlService.endpoints.predictHeart}`,
      testData,
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ ML Service Response:', response.data);
    console.log('✅ ML Service is working correctly!');
    
  } catch (error) {
    console.error('❌ ML Service Error:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔥 Connection refused - ML service might not be running');
      console.error('💡 Make sure the ML service is started on:', config.mlService.url);
    }
  }
}

// Run the test
testMLConnection(); 
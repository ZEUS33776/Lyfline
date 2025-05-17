import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file (or env.example if .env doesn't exist)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  
  // Database Configuration
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'lyfline',
    password: process.env.DB_PASSWORD || 'your_password',
    port: process.env.DB_PORT || 5432,
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: '1d',
  },
  
  // ML Service
  mlService: {
    url: process.env.ML_SERVICE_URL || 'http://localhost:5001',
    endpoints: {
      predictHeart: '/predict/heart',
      predictCHD: '/predict/chd',
    }
  }
};

export default config; 
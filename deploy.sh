#!/bin/bash

# LyfLine Deployment Script
# This script helps automate the setup and deployment of LyfLine components

set -e # Exit on error

echo "=========================="
echo "LyfLine Deployment Script"
echo "=========================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before continuing."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm before continuing."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    if ! command -v python3 &> /dev/null; then
        echo "Python is not installed. Please install Python before continuing."
        exit 1
    else
        PY_CMD="python3"
    fi
else
    PY_CMD="python"
fi

# Create configuration files
setup_configs() {
    echo -e "\n[1/5] Setting up configuration files..."

    # Create server config directory if it doesn't exist
    mkdir -p LyfLine-Project/server/config

    # Create server environment file
    cat > LyfLine-Project/server/config/env.example <<EOL
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
EOL

    # Create frontend environment file
    cat > LyfLine-Project/LyflineFrontend/.env.local <<EOL
# API Server URL
VITE_API_BASE_URL=http://localhost:3000

# Other environment-specific configurations
VITE_APP_TITLE=LyfLine - Healthcare Management System
EOL

    echo "✅ Configuration files created successfully!"
}

# Install server dependencies
setup_server() {
    echo -e "\n[2/5] Setting up backend server..."
    
    cd LyfLine-Project/server
    
    # Install dependencies
    echo "Installing server dependencies..."
    npm install
    
    # Create .env file from example if it doesn't exist
    if [ ! -f .env ]; then
        cp config/env.example .env
        echo "Created .env file from template. Please update with your database credentials."
    fi
    
    cd ../..
    
    echo "✅ Server setup completed!"
}

# Install frontend dependencies
setup_frontend() {
    echo -e "\n[3/5] Setting up frontend..."
    
    cd LyfLine-Project/LyflineFrontend
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm install
    
    cd ../..
    
    echo "✅ Frontend setup completed!"
}

# Setup ML service
setup_ml_service() {
    echo -e "\n[4/5] Setting up ML service..."
    
    cd LyfLine-Project/ml-service
    
    # Check if we need to create a virtual environment
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        $PY_CMD -m venv venv
        
        # Activate virtual environment based on OS
        if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
            source venv/Scripts/activate
        else
            source venv/bin/activate
        fi
        
        # Install dependencies
        echo "Installing ML service dependencies..."
        pip install flask flask-cors numpy pandas scikit-learn joblib
    fi
    
    cd ../..
    
    echo "✅ ML service setup completed!"
}

# Start the services
start_services() {
    echo -e "\n[5/5] Starting services..."
    
    # Start backend server in a new terminal
    echo "Starting backend server..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start cmd /k "cd LyfLine-Project/server && npm run dev"
    else
        gnome-terminal -- bash -c "cd LyfLine-Project/server && npm run dev; exec bash" &
    fi
    
    # Start ML service in a new terminal
    echo "Starting ML service..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start cmd /k "cd LyfLine-Project/ml-service && venv/Scripts/python app.py"
    else
        gnome-terminal -- bash -c "cd LyfLine-Project/ml-service && source venv/bin/activate && python app.py; exec bash" &
    fi
    
    # Start frontend in a new terminal
    echo "Starting frontend..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start cmd /k "cd LyfLine-Project/LyflineFrontend && npm run dev"
    else
        gnome-terminal -- bash -c "cd LyfLine-Project/LyflineFrontend && npm run dev; exec bash" &
    fi
    
    echo "✅ All services started!"
}

# Main execution
main() {
    echo "Starting LyfLine deployment..."
    
    setup_configs
    setup_server
    setup_frontend
    setup_ml_service
    
    echo -e "\n✅ Setup completed successfully!"
    
    # Ask if user wants to start the services
    read -p "Do you want to start all services now? (y/n): " start_now
    if [[ $start_now == "y" || $start_now == "Y" ]]; then
        start_services
        echo -e "\n🚀 LyfLine is now running!"
        echo "Frontend: http://localhost:5173"
        echo "Backend API: http://localhost:3000"
        echo "ML Service: http://localhost:5001"
    else
        echo -e "\nTo start services manually:"
        echo "1. Start the backend: cd LyfLine-Project/server && npm run dev"
        echo "2. Start the ML service: cd LyfLine-Project/ml-service && source venv/bin/activate && python app.py"
        echo "3. Start the frontend: cd LyfLine-Project/LyflineFrontend && npm run dev"
    fi
    
    echo -e "\nThank you for using LyfLine!"
}

# Run the main function
main 
@echo off
SETLOCAL EnableDelayedExpansion

echo ==========================
echo LyfLine Deployment Script
echo ==========================
echo.

REM Check if Node.js is installed
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js before continuing.
    exit /b 1
)

REM Check if npm is installed
WHERE npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please install npm before continuing.
    exit /b 1
)

REM Check if Python is installed
WHERE python >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Please install Python before continuing.
    exit /b 1
)

REM Create configuration files
echo [1/5] Setting up configuration files...

REM Create server config directory if it doesn't exist
IF NOT EXIST "LyfLine-Project\server\config" mkdir "LyfLine-Project\server\config"

REM Create server environment file
echo # Server Configuration > "LyfLine-Project\server\config\env.example"
echo PORT=3000 >> "LyfLine-Project\server\config\env.example"
echo. >> "LyfLine-Project\server\config\env.example"
echo # Database Configuration >> "LyfLine-Project\server\config\env.example"
echo DB_USER=postgres >> "LyfLine-Project\server\config\env.example"
echo DB_HOST=localhost >> "LyfLine-Project\server\config\env.example"
echo DB_NAME=lyfline >> "LyfLine-Project\server\config\env.example"
echo DB_PASSWORD=your_password >> "LyfLine-Project\server\config\env.example"
echo DB_PORT=5432 >> "LyfLine-Project\server\config\env.example"
echo. >> "LyfLine-Project\server\config\env.example"
echo # JWT Secret >> "LyfLine-Project\server\config\env.example"
echo JWT_SECRET=your_jwt_secret_key >> "LyfLine-Project\server\config\env.example"
echo. >> "LyfLine-Project\server\config\env.example"
echo # ML Service >> "LyfLine-Project\server\config\env.example"
echo ML_SERVICE_URL=http://localhost:5001 >> "LyfLine-Project\server\config\env.example"

REM Create frontend environment file
echo # API Server URL > "LyfLine-Project\LyflineFrontend\.env.local"
echo VITE_API_BASE_URL=http://localhost:3000 >> "LyfLine-Project\LyflineFrontend\.env.local"
echo. >> "LyfLine-Project\LyflineFrontend\.env.local"
echo # Other environment-specific configurations >> "LyfLine-Project\LyflineFrontend\.env.local"
echo VITE_APP_TITLE=LyfLine - Healthcare Management System >> "LyfLine-Project\LyflineFrontend\.env.local"

echo Configuration files created successfully!

REM Install server dependencies
echo [2/5] Setting up backend server...

cd LyfLine-Project\server

echo Installing server dependencies...
call npm install

REM Create .env file from example if it doesn't exist
IF NOT EXIST .env (
    copy config\env.example .env
    echo Created .env file from template. Please update with your database credentials.
)

cd ..\..

echo Server setup completed!

REM Install frontend dependencies
echo [3/5] Setting up frontend...

cd LyfLine-Project\LyflineFrontend

echo Installing frontend dependencies...
call npm install

cd ..\..

echo Frontend setup completed!

REM Setup ML service
echo [4/5] Setting up ML service...

cd LyfLine-Project\ml-service

REM Check if we need to create a virtual environment
IF NOT EXIST venv (
    echo Creating Python virtual environment...
    python -m venv venv
    
    REM Install dependencies
    echo Installing ML service dependencies...
    call venv\Scripts\activate.bat
    pip install flask flask-cors numpy pandas scikit-learn joblib
)

cd ..\..

echo ML service setup completed!

echo.
echo Setup completed successfully!

REM Ask if user wants to start the services
SET /P start_now="Do you want to start all services now? (y/n): "
IF /I "%start_now%"=="y" (
    echo [5/5] Starting services...
    
    REM Start backend server in a new terminal
    echo Starting backend server...
    start cmd /k "cd LyfLine-Project\server && npm run dev"
    
    REM Start ML service in a new terminal
    echo Starting ML service...
    start cmd /k "cd LyfLine-Project\ml-service && venv\Scripts\activate && python app.py"
    
    REM Start frontend in a new terminal
    echo Starting frontend...
    start cmd /k "cd LyfLine-Project\LyflineFrontend && npm run dev"
    
    echo All services started!
    
    echo.
    echo LyfLine is now running!
    echo Frontend: http://localhost:5173
    echo Backend API: http://localhost:3000
    echo ML Service: http://localhost:5001
) ELSE (
    echo.
    echo To start services manually:
    echo 1. Start the backend: cd LyfLine-Project\server ^&^& npm run dev
    echo 2. Start the ML service: cd LyfLine-Project\ml-service ^&^& venv\Scripts\activate ^&^& python app.py
    echo 3. Start the frontend: cd LyfLine-Project\LyflineFrontend ^&^& npm run dev
)

echo.
echo Thank you for using LyfLine!

ENDLOCAL 
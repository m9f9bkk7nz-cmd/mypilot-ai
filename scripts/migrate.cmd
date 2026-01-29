@echo off
REM Database Migration Script for MyPilot
REM This script runs Prisma migrations using CMD to avoid PowerShell execution policy issues

echo ========================================
echo MyPilot Database Migration Script
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: node_modules not found!
    echo Please run 'npm install' first.
    echo.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and configure your database connection.
    echo.
    pause
    exit /b 1
)

echo Checking database connection...
echo.

REM Run the migration
echo Running Prisma migration...
echo.
node_modules\.bin\prisma.cmd migrate dev --name init

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Run 'npm run dev' to start the development server
    echo 2. Visit http://localhost:3000
    echo 3. Use 'npm run prisma:studio' to view your database
    echo.
) else (
    echo.
    echo ========================================
    echo Migration failed!
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Database server is not running
    echo    - If using Docker: Run 'docker-compose up -d'
    echo    - If using local PostgreSQL: Start the PostgreSQL service
    echo.
    echo 2. Database connection string is incorrect
    echo    - Check your DATABASE_URL in .env file
    echo.
    echo 3. Database does not exist
    echo    - Create the database: CREATE DATABASE mypilot;
    echo.
    echo For detailed setup instructions, see DATABASE_SETUP.md
    echo.
)

pause

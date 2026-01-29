# Database Migration Script for MyPilot
# This script runs Prisma migrations

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MyPilot Database Migration Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "ERROR: node_modules not found!" -ForegroundColor Red
    Write-Host "Please run 'npm install' first." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and configure your database connection." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Checking database connection..." -ForegroundColor Yellow
Write-Host ""

# Run the migration
Write-Host "Running Prisma migration..." -ForegroundColor Yellow
Write-Host ""

& node_modules\.bin\prisma.cmd migrate dev --name init

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Migration completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run 'npm run dev' to start the development server"
    Write-Host "2. Visit http://localhost:3000"
    Write-Host "3. Use 'npm run prisma:studio' to view your database"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Migration failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Database server is not running"
    Write-Host "   - If using Docker: Run 'docker-compose up -d'"
    Write-Host "   - If using local PostgreSQL: Start the PostgreSQL service"
    Write-Host ""
    Write-Host "2. Database connection string is incorrect"
    Write-Host "   - Check your DATABASE_URL in .env file"
    Write-Host ""
    Write-Host "3. Database does not exist"
    Write-Host "   - Create the database: CREATE DATABASE mypilot;"
    Write-Host ""
    Write-Host "For detailed setup instructions, see DATABASE_SETUP.md" -ForegroundColor Cyan
    Write-Host ""
}

Read-Host "Press Enter to exit"

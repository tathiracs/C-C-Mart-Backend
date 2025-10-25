# ============================================================
# C&C Mart Database Setup Script (PowerShell)
# ============================================================
# This script will create the MySQL database for C&C Mart
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "C&C Mart Database Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is accessible
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlPath) {
    Write-Host "[ERROR] MySQL not found in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure MySQL is installed and added to your PATH." -ForegroundColor Yellow
    Write-Host "Common MySQL installation paths:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 8.0\bin" -ForegroundColor Gray
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 9.0\bin" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] MySQL found in PATH" -ForegroundColor Green
Write-Host ""

# Set database credentials
$DB_USER = "root"
$DB_PASS = ""
$DB_NAME = "ccmart_db"

Write-Host "[INFO] Database Configuration:" -ForegroundColor Cyan
Write-Host "  - Database Name: $DB_NAME" -ForegroundColor Gray
Write-Host "  - Username: $DB_USER" -ForegroundColor Gray
Write-Host "  - Password: (no password)" -ForegroundColor Gray
Write-Host "  - Host: localhost" -ForegroundColor Gray
Write-Host "  - Port: 3306" -ForegroundColor Gray
Write-Host ""

# Prompt for password if different
$customPass = Read-Host "Enter MySQL root password (or press Enter if no password)"
if ($customPass) {
    $DB_PASS = $customPass
}

Write-Host ""
Write-Host "[STEP 1/3] Testing MySQL connection..." -ForegroundColor Yellow
$testConnection = & mysql -u$DB_USER -p$DB_PASS -e "SELECT VERSION();" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Cannot connect to MySQL!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. MySQL Server is running" -ForegroundColor Gray
    Write-Host "  2. Username and password are correct" -ForegroundColor Gray
    Write-Host "  3. MySQL service is started in Services" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[SUCCESS] MySQL connection successful!" -ForegroundColor Green
Write-Host ""

Write-Host "[STEP 2/3] Creating database and tables..." -ForegroundColor Yellow
Get-Content "database-schema.sql" | & mysql -u$DB_USER -p$DB_PASS 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to create database schema!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[SUCCESS] Database schema created!" -ForegroundColor Green
Write-Host ""

Write-Host "[STEP 3/3] Loading initial data..." -ForegroundColor Yellow
Get-Content "database-seed.sql" | & mysql -u$DB_USER -p$DB_PASS $DB_NAME 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Failed to load initial data (this is optional)" -ForegroundColor Yellow
} else {
    Write-Host "[SUCCESS] Initial data loaded!" -ForegroundColor Green
}
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Database Setup Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: $DB_NAME" -ForegroundColor Cyan
Write-Host "Username: $DB_USER" -ForegroundColor Cyan
Write-Host "Host: localhost:3306" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now start your Spring Boot application!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the backend, run:" -ForegroundColor Yellow
Write-Host "  java -jar backend\target\backend-spring-0.0.1-SNAPSHOT.jar" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"

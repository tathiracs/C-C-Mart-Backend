@echo off
REM ============================================================
REM C&C Mart Database Setup Script
REM ============================================================
REM This script will create the MySQL database for C&C Mart
REM 
REM Prerequisites:
REM   - MySQL Server must be installed
REM   - MySQL Server must be running
REM 
REM Default Credentials (change if needed):
REM   - Username: root
REM   - Password: Root123@
REM ============================================================

echo.
echo ============================================================
echo C^&C Mart Database Setup
echo ============================================================
echo.

REM Check if MySQL is accessible
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] MySQL not found in PATH!
    echo.
    echo Please ensure MySQL is installed and added to your PATH.
    echo Common MySQL installation paths:
    echo   - C:\Program Files\MySQL\MySQL Server 8.0\bin
    echo   - C:\Program Files\MySQL\MySQL Server 9.0\bin
    echo.
    echo Add MySQL bin directory to your system PATH and try again.
    echo.
    pause
    exit /b 1
)

echo [INFO] MySQL found in PATH
echo.

REM Set database credentials
set DB_USER=root
set DB_PASS=
set DB_NAME=ccmart_db

echo [INFO] Database Configuration:
echo   - Database Name: %DB_NAME%
echo   - Username: %DB_USER%
echo   - Password: (no password)
echo   - Host: localhost
echo   - Port: 3306
echo.

REM Prompt for password if different
set /p CUSTOM_PASS="Enter MySQL root password (or press Enter if no password): "
if not "%CUSTOM_PASS%"=="" set DB_PASS=%CUSTOM_PASS%

echo.
echo [STEP 1/3] Testing MySQL connection...
mysql -u%DB_USER% -p%DB_PASS% -e "SELECT VERSION();" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Cannot connect to MySQL!
    echo.
    echo Please check:
    echo   1. MySQL Server is running
    echo   2. Username and password are correct
    echo   3. MySQL service is started in Services
    echo.
    pause
    exit /b 1
)
echo [SUCCESS] MySQL connection successful!
echo.

echo [STEP 2/3] Creating database and tables...
mysql -u%DB_USER% -p%DB_PASS% < database-schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create database schema!
    pause
    exit /b 1
)
echo [SUCCESS] Database schema created!
echo.

echo [STEP 3/3] Loading initial data...
mysql -u%DB_USER% -p%DB_PASS% %DB_NAME% < database-seed.sql
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Failed to load initial data (this is optional)
)
echo [SUCCESS] Initial data loaded!
echo.

echo ============================================================
echo Database Setup Complete!
echo ============================================================
echo.
echo Database: %DB_NAME%
echo Username: %DB_USER%
echo Host: localhost:3306
echo.
echo You can now start your Spring Boot application!
echo.
echo To start the backend, run:
echo   java -jar backend\target\backend-spring-0.0.1-SNAPSHOT.jar
echo.
pause

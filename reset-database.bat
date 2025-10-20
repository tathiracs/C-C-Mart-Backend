@echo off
REM ============================================================
REM Quick Database Reset Script
REM ============================================================
REM WARNING: This will delete all data and recreate the database
REM ============================================================

echo.
echo ============================================================
echo C^&C Mart Database Reset
echo ============================================================
echo.
echo WARNING: This will DELETE ALL DATA in the database!
echo.
set /p CONFIRM="Are you sure you want to continue? (yes/no): "
if /i not "%CONFIRM%"=="yes" (
    echo Operation cancelled.
    pause
    exit /b 0
)

set DB_USER=root
set /p DB_PASS="Enter MySQL root password (or press Enter for 'Root123@'): "
if "%DB_PASS%"=="" set DB_PASS=Root123@

echo.
echo [INFO] Dropping existing database...
mysql -u%DB_USER% -p%DB_PASS% -e "DROP DATABASE IF EXISTS ccmart_db;"

echo [INFO] Recreating database schema...
mysql -u%DB_USER% -p%DB_PASS% < database-schema.sql

echo [INFO] Loading sample data...
mysql -u%DB_USER% -p%DB_PASS% ccmart_db < database-seed.sql

echo.
echo ============================================================
echo Database Reset Complete!
echo ============================================================
echo.
pause

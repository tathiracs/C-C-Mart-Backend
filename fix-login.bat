@echo off
echo =========================================
echo C&C Mart - Login Issue Quick Fix
echo =========================================
echo.

cd /d "%~dp0backend"

echo Checking and fixing login issues...
node server-checker.js --quick

echo.
echo Press any key to exit...
pause > nul


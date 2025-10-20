@echo off
REM ============================================================
REM Start C&C Mart Application (Backend + Frontend)
REM ============================================================

echo.
echo ============================================================
echo Starting C^&C Mart Application
echo ============================================================
echo.

REM Check if Java is installed
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java not found! Please install Java 21 or later.
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found! Please install Node.js.
    pause
    exit /b 1
)

echo [INFO] Starting Backend Server (Spring Boot)...
echo.
start "C&C Mart Backend" cmd /k "cd /d %~dp0backend && java -jar target\backend-spring-0.0.1-SNAPSHOT.jar"

timeout /t 5 /nobreak >nul

echo [INFO] Starting Frontend Server (React)...
echo.
start "C&C Mart Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ============================================================
echo Application Started!
echo ============================================================
echo.
echo Backend:  http://localhost:8081
echo Frontend: http://localhost:3000
echo.
echo Two command windows have been opened:
echo   1. Backend Server (Spring Boot)
echo   2. Frontend Server (React)
echo.
echo Close those windows to stop the servers.
echo.
echo The browser should open automatically.
echo If not, navigate to: http://localhost:3000
echo.
pause

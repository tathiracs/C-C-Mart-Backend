@echo off
echo C&C Mart Backend Setup and Run Script
echo =====================================
echo.

echo Checking Java installation...
java -version
echo.

echo Current directory: %cd%
echo.

echo Note: This script requires Maven to be installed.
echo If Maven is not installed, please:
echo 1. Download Maven from https://maven.apache.org/download.cgi
echo 2. Extract to a folder (e.g., C:\apache-maven-3.9.0)
echo 3. Add the bin folder to your PATH environment variable
echo 4. Restart command prompt and run this script again
echo.

echo Alternatively, you can run the application using your IDE:
echo 1. Import the project into IntelliJ IDEA or Eclipse
echo 2. Run the CcMartBackendApplication.java main method
echo.

echo If Maven is installed, the following commands will run:
echo mvn clean install
echo mvn spring-boot:run
echo.

pause

if exist mvn (
    echo Maven found, building project...
    mvn clean install
    if %errorlevel% equ 0 (
        echo Build successful, starting application...
        mvn spring-boot:run
    ) else (
        echo Build failed. Please check the errors above.
    )
) else (
    echo Maven not found in PATH. Please install Maven first.
)
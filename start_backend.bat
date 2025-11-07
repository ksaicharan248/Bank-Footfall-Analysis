@echo off
echo Starting ABC Bank Backend Service...
cd /d "c:\Users\2432015\OneDrive - Cognizant\Desktop\AMAZON Q\backend"
echo Current directory: %CD%
echo.
echo Starting Spring Boot application...
call mvnw.cmd spring-boot:run
pause

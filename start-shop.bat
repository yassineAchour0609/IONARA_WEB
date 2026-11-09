@echo off
cd /d "%~dp0"
call npm.cmd run setup
if errorlevel 1 goto failed
echo Open http://localhost:3000 when the server is ready.
call npm.cmd run dev
:failed
pause

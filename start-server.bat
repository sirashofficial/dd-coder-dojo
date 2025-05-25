@echo off
echo Starting local server for DD Coder Dojo website...
echo.
echo Opening http://localhost:8000 in your default browser...
echo Press Ctrl+C to stop the server
echo.
start http://localhost:8000
python -m http.server 8000
pause

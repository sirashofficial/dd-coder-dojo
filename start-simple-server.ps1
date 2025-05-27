# Simple PowerShell HTTP Server for testing
# Navigate to the script directory and run: .\start-simple-server.ps1

$Port = 8000
$Path = Get-Location

Write-Host "Starting web server on port $Port..." -ForegroundColor Green
Write-Host "Serving files from: $Path" -ForegroundColor Yellow
Write-Host "Open your browser to: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

try {
    # Try to use Python's built-in server first
    if (Get-Command python -ErrorAction SilentlyContinue) {
        Write-Host "Using Python HTTP server..." -ForegroundColor Green
        python -m http.server $Port
    } 
    elseif (Get-Command py -ErrorAction SilentlyContinue) {
        Write-Host "Using Python HTTP server (py command)..." -ForegroundColor Green
        py -m http.server $Port
    }
    else {
        Write-Host "Python not found. Please install Python or use another web server." -ForegroundColor Red
        Write-Host "Alternative: Use VS Code Live Server extension" -ForegroundColor Yellow
        pause
    }
}
catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    pause
}

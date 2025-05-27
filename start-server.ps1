# PowerShell HTTP Server for DD Coder Dojo
Write-Host "Starting DD Coder Dojo local server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    # Try python3 first
    if (Get-Command python3 -ErrorAction SilentlyContinue) {
        Write-Host "Using python3..." -ForegroundColor Cyan
        python3 -m http.server 8000
    }
    # Fallback to python
    elseif (Get-Command python -ErrorAction SilentlyContinue) {
        Write-Host "Using python..." -ForegroundColor Cyan
        python -m http.server 8000
    }
    # Try node if available
    elseif (Get-Command node -ErrorAction SilentlyContinue) {
        Write-Host "Using Node.js..." -ForegroundColor Cyan
        npx http-server -p 8000
    }
    else {
        Write-Host "No suitable HTTP server found. Please install Python or Node.js" -ForegroundColor Red
        Write-Host "You can install Python from: https://www.python.org/downloads/" -ForegroundColor Yellow
        Write-Host "Or open the files directly in your browser by double-clicking community.html" -ForegroundColor Yellow
        pause
    }
}
catch {
    Write-Host "Error starting server: $($_.Exception.Message)" -ForegroundColor Red
    pause
}

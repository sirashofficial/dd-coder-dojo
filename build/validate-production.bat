@echo off
echo ========================================
echo DD Coder Dojo - Production Validation
echo ========================================
echo.

echo 1. Checking file structure...
if exist "dist\index.html" (echo ✓ index.html exists) else (echo ✗ index.html missing)
if exist "dist\about.html" (echo ✓ about.html exists) else (echo ✗ about.html missing)
if exist "dist\community.html" (echo ✓ community.html exists) else (echo ✗ community.html missing)
if exist "dist\contact.html" (echo ✓ contact.html exists) else (echo ✗ contact.html missing)
if exist "dist\programs.html" (echo ✓ programs.html exists) else (echo ✗ programs.html missing)
if exist "dist\gallery.html" (echo ✓ gallery.html exists) else (echo ✗ gallery.html missing)
if exist "dist\resources.html" (echo ✓ resources.html exists) else (echo ✗ resources.html missing)
if exist "dist\register.html" (echo ✓ register.html exists) else (echo ✗ register.html missing)
if exist "dist\offline.html" (echo ✓ offline.html exists) else (echo ✗ offline.html missing)
echo.

echo 2. Checking CSS files...
if exist "dist\css\main.css" (echo ✓ main.css exists) else (echo ✗ main.css missing)
if exist "dist\css\production-optimizations.css" (echo ✓ production-optimizations.css exists) else (echo ✗ production-optimizations.css missing)
if exist "dist\css\enhancements.css" (echo ✓ enhancements.css exists) else (echo ✗ enhancements.css missing)
if exist "dist\css\mobile-accessibility.css" (echo ✓ mobile-accessibility.css exists) else (echo ✗ mobile-accessibility.css missing)
echo.

echo 3. Checking JavaScript files...
if exist "dist\js\main.js" (echo ✓ main.js exists) else (echo ✗ main.js missing)
if exist "dist\js\critical-optimizations.js" (echo ✓ critical-optimizations.js exists) else (echo ✗ critical-optimizations.js missing)
if exist "dist\js\performance-analytics.js" (echo ✓ performance-analytics.js exists) else (echo ✗ performance-analytics.js missing)
if exist "dist\js\enhancedAnimations.js" (echo ✓ enhancedAnimations.js exists) else (echo ✗ enhancedAnimations.js missing)
echo.

echo 4. Checking PWA files...
if exist "dist\manifest.json" (echo ✓ manifest.json exists) else (echo ✗ manifest.json missing)
if exist "dist\sw.js" (echo ✓ sw.js exists) else (echo ✗ sw.js missing)
echo.

echo 5. Checking data files...
if exist "dist\data" (echo ✓ data directory exists) else (echo ✗ data directory missing)
echo.

echo 6. File sizes summary...
echo Main CSS: 
dir /b dist\css\main.css 2>nul && for %%f in (dist\css\main.css) do echo   %%~zf bytes
echo Production CSS: 
dir /b dist\css\production-optimizations.css 2>nul && for %%f in (dist\css\production-optimizations.css) do echo   %%~zf bytes
echo Main JS: 
dir /b dist\js\main.js 2>nul && for %%f in (dist\js\main.js) do echo   %%~zf bytes
echo Critical JS: 
dir /b dist\js\critical-optimizations.js 2>nul && for %%f in (dist\js\critical-optimizations.js) do echo   %%~zf bytes
echo.

echo ========================================
echo Production validation complete!
echo ========================================
pause

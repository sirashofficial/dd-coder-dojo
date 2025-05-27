# DD Coder Dojo - Production Build Script
# Optimizes all assets for production deployment

Write-Host "🚀 Starting DD Coder Dojo Production Build..." -ForegroundColor Green

# Create production directories
Write-Host "📁 Creating production directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "dist" | Out-Null
New-Item -ItemType Directory -Force -Path "dist/css" | Out-Null
New-Item -ItemType Directory -Force -Path "dist/js" | Out-Null
New-Item -ItemType Directory -Force -Path "dist/css/pages" | Out-Null
New-Item -ItemType Directory -Force -Path "dist/js/pages" | Out-Null
New-Item -ItemType Directory -Force -Path "dist/data" | Out-Null

# Check if Node.js is available for minification
$nodeAvailable = $false
try {
    $null = Get-Command node -ErrorAction Stop
    $nodeAvailable = $true
    Write-Host "✅ Node.js found - will use for advanced minification" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Node.js not found - using basic optimization" -ForegroundColor Yellow
}

# Function to minify CSS (basic)
function Minify-CSS {
    param($inputFile, $outputFile)
    
    $content = Get-Content $inputFile -Raw
    # Remove comments
    $content = $content -replace '/\*[\s\S]*?\*/', ''
    # Remove extra whitespace
    $content = $content -replace '\s+', ' '
    # Remove whitespace around specific characters
    $content = $content -replace '\s*{\s*', '{'
    $content = $content -replace '\s*}\s*', '}'
    $content = $content -replace '\s*;\s*', ';'
    $content = $content -replace '\s*:\s*', ':'
    $content = $content -replace '\s*,\s*', ','
    
    $content | Set-Content $outputFile -NoNewline
}

# Function to minify JavaScript (basic)
function Minify-JS {
    param($inputFile, $outputFile)
    
    $content = Get-Content $inputFile -Raw
    # Remove single-line comments (be careful not to remove URLs)
    $content = $content -replace '(?<!:)//.*$', '' -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" } | Join-String -Separator "`n"
    # Remove multi-line comments
    $content = $content -replace '/\*[\s\S]*?\*/', ''
    # Basic whitespace removal (conservative)
    $content = $content -replace '\s+', ' '
    
    $content | Set-Content $outputFile -NoNewline
}

# Minify CSS files
Write-Host "🎨 Minifying CSS files..." -ForegroundColor Cyan

$cssFiles = @(
    "css/main.css",
    "css/production-optimizations.css",
    "css/enhancements.css",
    "css/mobile-accessibility.css",
    "css/pages/home.css",
    "css/pages/about.css",
    "css/pages/community.css",
    "css/pages/contact.css",
    "css/pages/gallery.css",
    "css/pages/programs.css",
    "css/pages/resources.css",
    "css/pages/register.css"
)

foreach ($cssFile in $cssFiles) {
    if (Test-Path $cssFile) {
        $outputPath = "dist/$cssFile"
        $outputDir = Split-Path $outputPath -Parent
        New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
        
        if ($nodeAvailable) {
            # Use Node.js for better minification if available
            try {
                & node -e "
                const fs = require('fs');
                const css = fs.readFileSync('$cssFile', 'utf8');
                const minified = css
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/\s+/g, ' ')
                    .replace(/\s*{\s*/g, '{')
                    .replace(/\s*}\s*/g, '}')
                    .replace(/\s*;\s*/g, ';')
                    .replace(/\s*:\s*/g, ':')
                    .replace(/\s*,\s*/g, ',')
                    .trim();
                fs.writeFileSync('$outputPath', minified);
                " 2>$null
                Write-Host "  ✓ $cssFile → $outputPath" -ForegroundColor Green
            } catch {
                Minify-CSS $cssFile $outputPath
                Write-Host "  ✓ $cssFile → $outputPath (basic)" -ForegroundColor Green
            }
        } else {
            Minify-CSS $cssFile $outputPath
            Write-Host "  ✓ $cssFile → $outputPath" -ForegroundColor Green
        }
    }
}

# Minify JavaScript files
Write-Host "⚡ Minifying JavaScript files..." -ForegroundColor Cyan

$jsFiles = @(
    "js/main.js",
    "js/critical-optimizations.js",
    "js/performance-analytics.js",
    "js/enhancedAnimations.js",
    "js/formHandler.js",
    "js/pages/home.js",
    "js/pages/about.js",
    "js/pages/community.js",
    "js/pages/contact.js",
    "js/pages/gallery.js",
    "js/pages/programs.js",
    "js/pages/resources.js",
    "js/pages/register.js"
)

foreach ($jsFile in $jsFiles) {
    if (Test-Path $jsFile) {
        $outputPath = "dist/$jsFile"
        $outputDir = Split-Path $outputPath -Parent
        New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
        
        if ($nodeAvailable) {
            # Use Node.js for better minification if available
            try {
                & node -e "
                const fs = require('fs');
                const js = fs.readFileSync('$jsFile', 'utf8');
                const minified = js
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/\/\/.*$/gm, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                fs.writeFileSync('$outputPath', minified);
                " 2>$null
                Write-Host "  ✓ $jsFile → $outputPath" -ForegroundColor Green
            } catch {
                Minify-JS $jsFile $outputPath
                Write-Host "  ✓ $jsFile → $outputPath (basic)" -ForegroundColor Green
            }
        } else {
            Minify-JS $jsFile $outputPath
            Write-Host "  ✓ $jsFile → $outputPath" -ForegroundColor Green
        }
    }
}

# Copy and optimize HTML files
Write-Host "📄 Optimizing HTML files..." -ForegroundColor Cyan

$htmlFiles = @(
    "index.html",
    "about.html",
    "community.html",
    "contact.html",
    "gallery.html",
    "programs.html",
    "resources.html",
    "register.html",
    "offline.html"
)

foreach ($htmlFile in $htmlFiles) {
    if (Test-Path $htmlFile) {
        $content = Get-Content $htmlFile -Raw
        
        # Update CSS/JS paths to point to minified versions
        $content = $content -replace 'href="css/', 'href="dist/css/'
        $content = $content -replace 'src="js/', 'src="dist/js/'
        
        # Basic HTML minification
        $content = $content -replace '>\s+<', '><'
        $content = $content -replace '\s+', ' '
        
        $content | Set-Content "dist/$htmlFile" -NoNewline
        Write-Host "  ✓ $htmlFile → dist/$htmlFile" -ForegroundColor Green
    }
}

# Copy other essential files
Write-Host "📋 Copying essential files..." -ForegroundColor Cyan

$essentialFiles = @(
    "manifest.json",
    "sw.js",
    "favicon.ico"
)

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Copy-Item $file "dist/$file"
        Write-Host "  ✓ $file → dist/$file" -ForegroundColor Green
    }
}

# Copy data files
if (Test-Path "data") {
    Copy-Item "data" "dist/data" -Recurse -Force
    Write-Host "  ✓ data/ → dist/data/" -ForegroundColor Green
}

# Generate build report
Write-Host "📊 Generating build report..." -ForegroundColor Cyan

$buildReport = @"
# DD Coder Dojo - Production Build Report
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Build Statistics
- Total HTML files optimized: $($htmlFiles.Count)
- Total CSS files minified: $($cssFiles.Count)
- Total JS files minified: $($jsFiles.Count)
- Minification method: $(if ($nodeAvailable) { "Node.js (Advanced)" } else { "PowerShell (Basic)" })

## Optimizations Applied
✅ CSS minification (comments removed, whitespace optimized)
✅ JavaScript minification (comments removed, whitespace optimized)
✅ HTML optimization (whitespace reduction)
✅ Asset path updates for production
✅ Service Worker and PWA files included
✅ Performance monitoring scripts included

## File Sizes (Before → After)
"@

# Calculate file size savings
$totalOriginalSize = 0
$totalMinifiedSize = 0

foreach ($cssFile in $cssFiles) {
    if (Test-Path $cssFile) {
        $originalSize = (Get-Item $cssFile).Length
        $minifiedSize = (Get-Item "dist/$cssFile").Length
        $totalOriginalSize += $originalSize
        $totalMinifiedSize += $minifiedSize
        $savings = [math]::Round((1 - $minifiedSize / $originalSize) * 100, 1)
        $buildReport += "`n- $cssFile`: $([math]::Round($originalSize/1KB, 1))KB → $([math]::Round($minifiedSize/1KB, 1))KB ($savings% smaller)"
    }
}

$totalSavings = [math]::Round((1 - $totalMinifiedSize / $totalOriginalSize) * 100, 1)
$buildReport += "`n`n## Overall Savings"
$buildReport += "`n- Total original size: $([math]::Round($totalOriginalSize/1KB, 1))KB"
$buildReport += "`n- Total minified size: $([math]::Round($totalMinifiedSize/1KB, 1))KB"
$buildReport += "`n- Total savings: $totalSavings%"

$buildReport += "`n`n## Deployment Instructions"
$buildReport += "`n1. Upload the entire 'dist' folder to your web server"
$buildReport += "`n2. Configure your server to serve from the 'dist' directory"
$buildReport += "`n3. Ensure HTTPS is enabled for PWA functionality"
$buildReport += "`n4. Test all functionality after deployment"
$buildReport += "`n5. Monitor performance using the built-in analytics"

$buildReport | Set-Content "dist/BUILD-REPORT.md"

Write-Host "`n🎉 Production build completed successfully!" -ForegroundColor Green
Write-Host "📁 Output directory: dist/" -ForegroundColor Yellow
Write-Host "📊 Build report: dist/BUILD-REPORT.md" -ForegroundColor Yellow
Write-Host "💾 Total size savings: $totalSavings%" -ForegroundColor Green

if ($nodeAvailable) {
    Write-Host "`n💡 Tip: For even better minification, consider using dedicated tools like:" -ForegroundColor Cyan
    Write-Host "   - UglifyJS for JavaScript" -ForegroundColor White
    Write-Host "   - CleanCSS for CSS" -ForegroundColor White
    Write-Host "   - HTMLMinifier for HTML" -ForegroundColor White
}

Write-Host "`n🚀 Your website is now production-ready!" -ForegroundColor Green

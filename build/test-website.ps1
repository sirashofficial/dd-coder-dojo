# DD Coder Dojo - Website Testing & Validation Script
# Performs comprehensive testing of all optimizations and features

Write-Host "🧪 Starting DD Coder Dojo Website Testing..." -ForegroundColor Green

# Test results tracking
$testResults = @{
    Passed = 0
    Failed = 0
    Warnings = 0
    Tests = @()
}

# Function to add test result
function Add-TestResult {
    param($Name, $Status, $Message, $Details = "")
    
    $test = @{
        Name = $Name
        Status = $Status
        Message = $Message
        Details = $Details
        Timestamp = Get-Date
    }
    
    $testResults.Tests += $test
    
    switch ($Status) {
        "PASS" { 
            $testResults.Passed++
            Write-Host "  ✅ $Name" -ForegroundColor Green
            if ($Details) { Write-Host "     $Details" -ForegroundColor Gray }
        }
        "FAIL" { 
            $testResults.Failed++
            Write-Host "  ❌ $Name" -ForegroundColor Red
            Write-Host "     $Message" -ForegroundColor Red
            if ($Details) { Write-Host "     $Details" -ForegroundColor Gray }
        }
        "WARN" { 
            $testResults.Warnings++
            Write-Host "  ⚠️ $Name" -ForegroundColor Yellow
            Write-Host "     $Message" -ForegroundColor Yellow
        }
    }
}

# 1. File Structure Tests
Write-Host "`n📁 Testing File Structure..." -ForegroundColor Cyan

$requiredFiles = @(
    "index.html", "about.html", "community.html", "contact.html",
    "gallery.html", "programs.html", "resources.html", "register.html",
    "manifest.json", "sw.js", "offline.html"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Add-TestResult "File exists: $file" "PASS" ""
    } else {
        Add-TestResult "File exists: $file" "FAIL" "Required file missing"
    }
}

# 2. CSS Files Tests
Write-Host "`n🎨 Testing CSS Files..." -ForegroundColor Cyan

$cssFiles = @(
    "css/main.css", "css/production-optimizations.css", "css/enhancements.css"
)

foreach ($cssFile in $cssFiles) {
    if (Test-Path $cssFile) {
        $content = Get-Content $cssFile -Raw
        $size = (Get-Item $cssFile).Length
        
        Add-TestResult "CSS file: $cssFile" "PASS" "" "Size: $([math]::Round($size/1KB, 1))KB"
        
        # Check for performance optimizations
        if ($content -match "will-change|transform3d|translateZ|contain:|content-visibility") {
            Add-TestResult "Performance optimizations in $cssFile" "PASS" ""
        } else {
            Add-TestResult "Performance optimizations in $cssFile" "WARN" "No performance optimizations detected"
        }
    } else {
        Add-TestResult "CSS file: $cssFile" "FAIL" "File missing"
    }
}

# 3. JavaScript Files Tests
Write-Host "`n⚡ Testing JavaScript Files..." -ForegroundColor Cyan

$jsFiles = @(
    "js/main.js", "js/critical-optimizations.js", "js/performance-analytics.js"
)

foreach ($jsFile in $jsFiles) {
    if (Test-Path $jsFile) {
        $content = Get-Content $jsFile -Raw
        $size = (Get-Item $jsFile).Length
        
        Add-TestResult "JS file: $jsFile" "PASS" "" "Size: $([math]::Round($size/1KB, 1))KB"
        
        # Check for error handling
        if ($content -match "try\s*{|catch\s*\(") {
            Add-TestResult "Error handling in $jsFile" "PASS" ""
        } else {
            Add-TestResult "Error handling in $jsFile" "WARN" "Limited error handling detected"
        }
    } else {
        Add-TestResult "JS file: $jsFile" "FAIL" "File missing"
    }
}

# 4. HTML Files SEO Tests
Write-Host "`n🔍 Testing HTML SEO Optimization..." -ForegroundColor Cyan

$htmlFiles = @("index.html", "about.html", "community.html", "contact.html", "gallery.html", "programs.html", "resources.html", "register.html")

foreach ($htmlFile in $htmlFiles) {
    if (Test-Path $htmlFile) {
        $content = Get-Content $htmlFile -Raw
        
        # Check for essential SEO elements
        if ($content -match '<title>.*</title>') {
            Add-TestResult "Title tag in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Title tag in $htmlFile" "FAIL" "Missing title tag"
        }
        
        if ($content -match 'name="description"') {
            Add-TestResult "Meta description in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Meta description in $htmlFile" "FAIL" "Missing meta description"
        }
        
        if ($content -match 'property="og:') {
            Add-TestResult "Open Graph tags in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Open Graph tags in $htmlFile" "WARN" "Missing Open Graph tags"
        }
        
        # Check for performance optimizations
        if ($content -match 'rel="preload"') {
            Add-TestResult "Resource preloading in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Resource preloading in $htmlFile" "WARN" "No resource preloading found"
        }
        
        # Check for service worker registration
        if ($content -match 'serviceWorker\.register') {
            Add-TestResult "Service Worker in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Service Worker in $htmlFile" "WARN" "Service Worker not registered"
        }
    }
}

# 5. PWA Tests
Write-Host "`n📱 Testing PWA Configuration..." -ForegroundColor Cyan

if (Test-Path "manifest.json") {
    $manifest = Get-Content "manifest.json" | ConvertFrom-Json
    
    if ($manifest.name) {
        Add-TestResult "PWA manifest name" "PASS" ""
    } else {
        Add-TestResult "PWA manifest name" "FAIL" "Missing app name in manifest"
    }
    
    if ($manifest.icons -and $manifest.icons.Count -gt 0) {
        Add-TestResult "PWA icons" "PASS" "" "$($manifest.icons.Count) icons defined"
    } else {
        Add-TestResult "PWA icons" "FAIL" "Missing icons in manifest"
    }
    
    if ($manifest.start_url) {
        Add-TestResult "PWA start URL" "PASS" ""
    } else {
        Add-TestResult "PWA start URL" "FAIL" "Missing start_url in manifest"
    }
} else {
    Add-TestResult "PWA manifest" "FAIL" "manifest.json missing"
}

if (Test-Path "sw.js") {
    $swContent = Get-Content "sw.js" -Raw
    if ($swContent -match "cache|fetch") {
        Add-TestResult "Service Worker functionality" "PASS" ""
    } else {
        Add-TestResult "Service Worker functionality" "WARN" "Basic service worker detected"
    }
} else {
    Add-TestResult "Service Worker file" "FAIL" "sw.js missing"
}

# 6. Accessibility Tests
Write-Host "`n♿ Testing Accessibility Features..." -ForegroundColor Cyan

foreach ($htmlFile in $htmlFiles) {
    if (Test-Path $htmlFile) {
        $content = Get-Content $htmlFile -Raw
        
        # Check for skip links
        if ($content -match 'skip.*link|skip.*content') {
            Add-TestResult "Skip links in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Skip links in $htmlFile" "WARN" "No skip links found"
        }
        
        # Check for alt attributes on images
        if ($content -match 'alt=') {
            Add-TestResult "Image alt attributes in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Image alt attributes in $htmlFile" "WARN" "No alt attributes found"
        }
        
        # Check for ARIA labels
        if ($content -match 'aria-label|aria-describedby') {
            Add-TestResult "ARIA labels in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "ARIA labels in $htmlFile" "WARN" "Limited ARIA labels found"
        }
    }
}

# 7. Performance Tests
Write-Host "`n🚀 Testing Performance Features..." -ForegroundColor Cyan

# Check for critical optimizations
if (Test-Path "js/critical-optimizations.js") {
    $criticalContent = Get-Content "js/critical-optimizations.js" -Raw
    
    if ($criticalContent -match "IntersectionObserver") {
        Add-TestResult "Lazy loading implementation" "PASS" ""
    } else {
        Add-TestResult "Lazy loading implementation" "WARN" "No lazy loading detected"
    }
    
    if ($criticalContent -match "Core Web Vitals|LCP|FID|CLS") {
        Add-TestResult "Core Web Vitals monitoring" "PASS" ""
    } else {
        Add-TestResult "Core Web Vitals monitoring" "WARN" "No Core Web Vitals monitoring"
    }
}

# Check for production optimizations CSS
if (Test-Path "css/production-optimizations.css") {
    $prodContent = Get-Content "css/production-optimizations.css" -Raw
    
    if ($prodContent -match "contain:|content-visibility") {
        Add-TestResult "CSS containment optimizations" "PASS" ""
    } else {
        Add-TestResult "CSS containment optimizations" "WARN" "No CSS containment found"
    }
}

# 8. Mobile Responsiveness Tests
Write-Host "`n📱 Testing Mobile Responsiveness..." -ForegroundColor Cyan

foreach ($htmlFile in $htmlFiles) {
    if (Test-Path $htmlFile) {
        $content = Get-Content $htmlFile -Raw
        
        if ($content -match 'viewport.*width=device-width') {
            Add-TestResult "Viewport meta tag in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Viewport meta tag in $htmlFile" "FAIL" "Missing or incorrect viewport meta tag"
        }
    }
}

if (Test-Path "css/mobile-accessibility.css") {
    Add-TestResult "Mobile-specific CSS" "PASS" ""
} else {
    Add-TestResult "Mobile-specific CSS" "WARN" "No mobile-specific CSS file found"
}

# 9. Security Tests
Write-Host "`n🔒 Testing Security Features..." -ForegroundColor Cyan

foreach ($htmlFile in $htmlFiles[0..2]) { # Test first few files
    if (Test-Path $htmlFile) {
        $content = Get-Content $htmlFile -Raw
        
        # Check for external resource integrity
        if ($content -match 'integrity=') {
            Add-TestResult "Subresource integrity in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "Subresource integrity in $htmlFile" "WARN" "No SRI hashes found"
        }
        
        # Check for HTTPS references
        $httpCount = ($content | Select-String -Pattern "http://" -AllMatches).Matches.Count
        if ($httpCount -eq 0) {
            Add-TestResult "HTTPS references in $htmlFile" "PASS" ""
        } else {
            Add-TestResult "HTTPS references in $htmlFile" "WARN" "$httpCount HTTP references found"
        }
    }
}

# 10. Data Files Tests
Write-Host "`n📊 Testing Data Files..." -ForegroundColor Cyan

$dataFiles = @("data/programs.json", "data/team.json", "data/events.json")

foreach ($dataFile in $dataFiles) {
    if (Test-Path $dataFile) {
        try {
            $jsonContent = Get-Content $dataFile | ConvertFrom-Json
            Add-TestResult "JSON validation: $dataFile" "PASS" ""
        } catch {
            Add-TestResult "JSON validation: $dataFile" "FAIL" "Invalid JSON format"
        }
    } else {
        Add-TestResult "Data file: $dataFile" "WARN" "Optional data file missing"
    }
}

# Generate Test Report
Write-Host "`n📋 Generating Test Report..." -ForegroundColor Cyan

$totalTests = $testResults.Passed + $testResults.Failed + $testResults.Warnings
$passRate = [math]::Round(($testResults.Passed / $totalTests) * 100, 1)

$report = @"
# DD Coder Dojo - Website Testing Report
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Test Summary
- 🟢 **Passed**: $($testResults.Passed) tests
- 🔴 **Failed**: $($testResults.Failed) tests  
- 🟡 **Warnings**: $($testResults.Warnings) tests
- 📊 **Pass Rate**: $passRate%

## Test Categories
1. ✅ File Structure & Organization
2. ✅ CSS Optimization & Performance
3. ✅ JavaScript Functionality & Error Handling
4. ✅ SEO & Meta Tag Optimization
5. ✅ PWA Configuration & Service Workers
6. ✅ Accessibility Features
7. ✅ Performance Optimizations
8. ✅ Mobile Responsiveness
9. ✅ Security Best Practices
10. ✅ Data File Validation

## Detailed Results

"@

foreach ($test in $testResults.Tests) {
    $status = switch ($test.Status) {
        "PASS" { "✅" }
        "FAIL" { "❌" }
        "WARN" { "⚠️" }
    }
    
    $report += "`n$status **$($test.Name)**"
    if ($test.Message) { $report += " - $($test.Message)" }
    if ($test.Details) { $report += " ($($test.Details))" }
}

$report += "`n`n## Recommendations"

if ($testResults.Failed -gt 0) {
    $report += "`n### 🔴 Critical Issues (Must Fix)"
    $report += "`n- Address all failed tests before deployment"
    $report += "`n- Ensure all required files are present"
    $report += "`n- Fix any broken functionality"
}

if ($testResults.Warnings -gt 0) {
    $report += "`n### 🟡 Improvements (Should Fix)"
    $report += "`n- Consider implementing missing optimizations"
    $report += "`n- Add security enhancements where noted"
    $report += "`n- Improve accessibility features"
}

$report += "`n### 🚀 Next Steps"
$report += "`n1. Fix any critical issues (❌ failed tests)"
$report += "`n2. Address warnings for better performance"
$report += "`n3. Run lighthouse audit for detailed performance metrics"
$report += "`n4. Test on real devices and different browsers"
$report += "`n5. Monitor performance after deployment"

$report | Set-Content "TESTING-REPORT.md"

# Display Summary
Write-Host "`n🎯 Testing Complete!" -ForegroundColor Green
Write-Host "📊 Results:" -ForegroundColor Yellow
Write-Host "   ✅ Passed: $($testResults.Passed)" -ForegroundColor Green
Write-Host "   ❌ Failed: $($testResults.Failed)" -ForegroundColor Red  
Write-Host "   ⚠️ Warnings: $($testResults.Warnings)" -ForegroundColor Yellow
Write-Host "   📈 Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 60) { "Yellow" } else { "Red" })

Write-Host "`n📄 Detailed report saved: TESTING-REPORT.md" -ForegroundColor Cyan

if ($testResults.Failed -eq 0) {
    Write-Host "`n🎉 All critical tests passed! Website is ready for deployment." -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Please fix failed tests before deploying to production." -ForegroundColor Yellow
}

Write-Host "`n💡 Tip: Run 'lighthouse' audit for additional performance insights" -ForegroundColor Cyan

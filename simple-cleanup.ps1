# Simple Cleanup - Remove unnecessary files
# Run this to clean up your project folder

Write-Host "Cleaning up project folder..." -ForegroundColor Cyan

# 1. Delete log files
Write-Host "`n[1/4] Removing log files..."
Get-ChildItem -Path . -Filter "*.log" -File | ForEach-Object {
    Write-Host "  Removing: $($_.Name)" -ForegroundColor Gray
    Remove-Item $_.FullName -Force
}

# 2. Move old docs to archive
Write-Host "`n[2/4] Archiving old documentation..."
if (!(Test-Path "docs-archive")) {
    New-Item -ItemType Directory -Path "docs-archive" | Out-Null
}

$oldDocs = @(
    "IMAGE-FIX-GUIDE.md",
    "IMAGE-UPLOAD-GUIDE.md", 
    "INTEGRATION-TEST-REPORT.md",
    "JAVA-21-UPGRADE-SUMMARY.md",
    "JOIN-US-BUTTON-FIX.md",
    "LOGIN-FIX-GUIDE.md",
    "LOGIN-TROUBLESHOOTING.md",
    "PRODUCT-ADD-DELETE-FIX.md",
    "PRODUCT-CRUD-FIXES-COMPLETE.md",
    "PRODUCT-DETAILS-TESTING.md",
    "PRODUCT-MODULE-COMPLETE.md",
    "PRODUCT-MODULE-STATUS.md",
    "PRODUCT-TESTING-GUIDE.md",
    "PRODUCTS-FIX-APPLIED.md",
    "PRODUCTS-NOT-SHOWING-DEBUG.md",
    "STOCK-DISPLAY-FIX.md",
    "SYSTEM-STATUS-CHECK.md",
    "CATEGORY-DEBUGGING-GUIDE.md",
    "CATEGORY-DROPDOWN-FIX.md",
    "CATEGORY_UPDATE_SUMMARY.md",
    "CART-ORDER-MODULE-COMPLETE.md",
    "FINAL-FIX-INSTRUCTIONS.md"
)

foreach ($doc in $oldDocs) {
    if (Test-Path $doc) {
        Write-Host "  Moving: $doc" -ForegroundColor Gray
        Move-Item $doc -Destination "docs-archive\" -Force
    }
}

# 3. Move old scripts to archive
Write-Host "`n[3/4] Archiving old scripts..."
if (!(Test-Path "scripts-archive")) {
    New-Item -ItemType Directory -Path "scripts-archive" | Out-Null
}

$oldScripts = @(
    "add-products-simple.ps1",
    "add-sample-products.ps1",
    "curate-products.ps1",
    "fix-all-images.ps1",
    "fix-broken-images.ps1",
    "fix-images.ps1",
    "fix-onions.ps1",
    "fix-product-images.ps1",
    "quick-fix-products.ps1",
    "seed-products-simple.ps1",
    "seed-sample-products.ps1",
    "activate-products.ps1"
)

foreach ($script in $oldScripts) {
    if (Test-Path $script) {
        Write-Host "  Moving: $script" -ForegroundColor Gray
        Move-Item $script -Destination "scripts-archive\" -Force
    }
}

# 4. Remove test files
Write-Host "`n[4/4] Removing test files..."
$testFiles = @(
    "fix-products.html",
    "fix-login.bat",
    "test-categories-api.html"
)

foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Write-Host "  Removing: $file" -ForegroundColor Gray
        Remove-Item $file -Force
    }
}

# 5. Remove build artifacts
Write-Host "`n[5/5] Removing build artifacts..."
if (Test-Path "backend\target") {
    Write-Host "  Removing: backend\target" -ForegroundColor Gray
    Remove-Item "backend\target" -Recurse -Force
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "`nYour root folder now has only essential files:" -ForegroundColor Cyan
Write-Host "  - README.md"
Write-Host "  - QUICK-START-GUIDE.md"
Write-Host "  - ORDER-MANAGEMENT-SUMMARY.md"
Write-Host "  - ORDER-PLACEMENT-FIX.md"
Write-Host "  - simple-cleanup.ps1 (this file)"
Write-Host "  - test-full-stack.ps1"
Write-Host "`nOld files moved to:" -ForegroundColor Cyan
Write-Host "  - docs-archive/"
Write-Host "  - scripts-archive/"
Write-Host "`nYou can delete these archive folders anytime."

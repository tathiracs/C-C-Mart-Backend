# Cleanup Script - Reduce Project Size
# This script removes unnecessary files and folders to reduce project size

Write-Host "=== C&C Mart Project Cleanup ===" -ForegroundColor Cyan
Write-Host ""

$projectPath = "c:\Users\imax.computer\OneDrive\Desktop\OOAD Project - Copy\Chamika\C-C_Mart"
Set-Location $projectPath

# Function to calculate folder size
function Get-FolderSize {
    param($path)
    $size = (Get-ChildItem $path -Recurse -Force -ErrorAction SilentlyContinue | 
             Measure-Object -Property Length -Sum).Sum / 1MB
    return [math]::Round($size, 2)
}

Write-Host "Current project size before cleanup..." -ForegroundColor Yellow
$sizeBefore = Get-FolderSize $projectPath
Write-Host "Total Size: $sizeBefore MB" -ForegroundColor Yellow
Write-Host ""

# 1. Clean backend target directory
Write-Host "[1/6] Cleaning backend/target directory..." -ForegroundColor Green
if (Test-Path "backend\target") {
    $targetSize = Get-FolderSize "backend\target"
    Write-Host "  - backend/target: $targetSize MB"
    Remove-Item "backend\target" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed" -ForegroundColor Green
}

# 2. Clean frontend node_modules (largest culprit usually)
Write-Host "[2/6] Cleaning frontend/node_modules directory..." -ForegroundColor Green
if (Test-Path "frontend\node_modules") {
    $nodeSize = Get-FolderSize "frontend\node_modules"
    Write-Host "  - frontend/node_modules: $nodeSize MB"
    Write-Host "  ! This is usually the largest folder (100-500 MB)" -ForegroundColor Yellow
    $response = Read-Host "  Remove node_modules? You'll need to run 'npm install' later (y/n)"
    if ($response -eq 'y') {
        Remove-Item "frontend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed" -ForegroundColor Green
    } else {
        Write-Host "  - Skipped" -ForegroundColor Yellow
    }
}

# 3. Clean Java crash logs
Write-Host "[3/6] Cleaning Java crash log files..." -ForegroundColor Green
$logFiles = Get-ChildItem -Path . -Filter "hs_err_pid*.log" -File
if ($logFiles.Count -gt 0) {
    Write-Host "  - Found $($logFiles.Count) crash log files"
    foreach ($file in $logFiles) {
        Remove-Item $file.FullName -Force
    }
    Write-Host "  ✓ Removed" -ForegroundColor Green
}

# 4. Clean Java replay logs
Write-Host "[4/6] Cleaning Java replay log files..." -ForegroundColor Green
$replayFiles = Get-ChildItem -Path . -Filter "replay_pid*.log" -File
if ($replayFiles.Count -gt 0) {
    Write-Host "  - Found $($replayFiles.Count) replay log files"
    foreach ($file in $replayFiles) {
        Remove-Item $file.FullName -Force
    }
    Write-Host "  ✓ Removed" -ForegroundColor Green
}

# 5. Archive old documentation (optional)
Write-Host "[5/6] Handling documentation files..." -ForegroundColor Green
$docFiles = Get-ChildItem -Path . -Filter "*.md" -File | Where-Object { $_.Name -ne "README.md" -and $_.Name -ne "QUICK-START-GUIDE.md" -and $_.Name -ne "ORDER-MANAGEMENT-SUMMARY.md" -and $_.Name -ne "ORDER-PLACEMENT-FIX.md" }
if ($docFiles.Count -gt 0) {
    Write-Host "  - Found $($docFiles.Count) documentation files"
    Write-Host "  ! These contain important troubleshooting info" -ForegroundColor Yellow
    $docResponse = Read-Host "  Move to 'docs' folder for organization? (y/n)"
    if ($docResponse -eq 'y') {
        if (!(Test-Path "docs")) {
            New-Item -ItemType Directory -Path "docs" | Out-Null
        }
        foreach ($file in $docFiles) {
            Move-Item $file.FullName -Destination "docs\" -Force
        }
        Write-Host "  ✓ Moved to docs/ folder" -ForegroundColor Green
    } else {
        Write-Host "  - Skipped" -ForegroundColor Yellow
    }
}

# 6. Clean PowerShell scripts (archive old ones)
Write-Host "[6/6] Handling PowerShell script files..." -ForegroundColor Green
$scriptFiles = Get-ChildItem -Path . -Filter "*.ps1" -File
if ($scriptFiles.Count -gt 5) {
    Write-Host "  - Found $($scriptFiles.Count) PowerShell scripts"
    $scriptResponse = Read-Host "  Move old scripts to 'scripts' folder? (y/n)"
    if ($scriptResponse -eq 'y') {
        if (!(Test-Path "scripts")) {
            New-Item -ItemType Directory -Path "scripts" | Out-Null
        }
        # Keep only essential scripts
        $keepScripts = @("test-full-stack.ps1", "cleanup.ps1")
        foreach ($file in $scriptFiles) {
            if ($file.Name -notin $keepScripts) {
                Move-Item $file.FullName -Destination "scripts\" -Force
            }
        }
        Write-Host "  ✓ Moved to scripts/ folder" -ForegroundColor Green
    } else {
        Write-Host "  - Skipped" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Cyan
Write-Host ""

# Calculate size after cleanup
$sizeAfter = Get-FolderSize $projectPath
$saved = $sizeBefore - $sizeAfter
Write-Host "Size Before: $sizeBefore MB" -ForegroundColor Yellow
Write-Host "Size After:  $sizeAfter MB" -ForegroundColor Green
Write-Host "Space Saved: $saved MB" -ForegroundColor Cyan
Write-Host ""

# Provide instructions
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "⚠ To restore frontend dependencies:" -ForegroundColor Yellow
    Write-Host "  cd frontend"
    Write-Host "  npm install"
    Write-Host ""
}
if (!(Test-Path "backend\target")) {
    Write-Host "⚠ To rebuild backend:" -ForegroundColor Yellow
    Write-Host "  cd backend"
    Write-Host "  mvn clean compile"
    Write-Host ""
}

Write-Host "✓ Project cleaned successfully!" -ForegroundColor Green
Write-Host ""

# Create .gitignore if it doesn't have these entries
Write-Host "Updating .gitignore to prevent large files..." -ForegroundColor Cyan
$gitignoreContent = @"
# Dependencies
node_modules/
frontend/node_modules/

# Build outputs
target/
backend/target/
frontend/build/
*.class

# Logs
*.log
hs_err_pid*.log
replay_pid*.log

# IDE
.vscode/
.idea/
*.iml

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.bak
*.swp
"@

$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
    Add-Content $gitignorePath "`n# Auto-added by cleanup script"
    Add-Content $gitignorePath $gitignoreContent
    Write-Host "✓ Updated .gitignore" -ForegroundColor Green
} else {
    Set-Content $gitignorePath $gitignoreContent
    Write-Host "✓ Created .gitignore" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Recommended Git Operations ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If using Git, run these commands to clean up tracked files:"
Write-Host "  git rm -r --cached backend/target" -ForegroundColor Gray
Write-Host "  git rm -r --cached frontend/node_modules" -ForegroundColor Gray
Write-Host "  git rm --cached hs_err_pid*.log" -ForegroundColor Gray
Write-Host "  git rm --cached replay_pid*.log" -ForegroundColor Gray
Write-Host "  git add .gitignore" -ForegroundColor Gray
Write-Host "  git commit -m 'Clean up large files and update .gitignore'" -ForegroundColor Gray
Write-Host ""

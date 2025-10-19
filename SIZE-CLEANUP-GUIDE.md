# Project Size Analysis & Cleanup Guide

## Current Issue
The C&C Mart project folder is taking up significant disk space, especially problematic for OneDrive sync.

## Main Space Consumers

### 1. **frontend/node_modules** (Largest - Usually 150-500 MB)
- Contains all npm package dependencies
- Required for frontend to run
- **Can be regenerated** with `npm install`
- **Recommendation**: Delete and exclude from Git

### 2. **backend/target** (50-100 MB)
- Contains compiled Java classes
- Build artifacts from Maven
- **Can be regenerated** with `mvn clean compile`
- **Recommendation**: Delete and exclude from Git

### 3. **Log Files** (1-10 MB each)
Files like:
- `hs_err_pid*.log` - Java crash reports
- `replay_pid*.log` - Java replay logs
- **Not needed** for development
- **Recommendation**: Delete immediately

### 4. **Documentation Files** (10-50 MB total)
Multiple .md files:
- CATEGORY-DEBUGGING-GUIDE.md
- CART-ORDER-MODULE-COMPLETE.md
- INTEGRATION-TEST-REPORT.md
- JAVA-21-UPGRADE-SUMMARY.md
- ORDER-MANAGEMENT-SUMMARY.md
- ORDER-PLACEMENT-FIX.md
- And many more...

While these are useful, having 30+ documentation files in the root is cluttered.
- **Recommendation**: Keep essential docs, move others to `docs/` folder

### 5. **PowerShell Scripts** (Small, but many files)
Multiple .ps1 scripts:
- add-products-simple.ps1
- curate-products.ps1
- fix-all-images.ps1
- seed-sample-products.ps1
- And many more...

- **Recommendation**: Keep active ones, archive old ones in `scripts/` folder

### 6. **.git Folder** (Can grow large over time)
Contains entire Git history
- **Recommendation**: If needed, can be cleaned with `git gc --aggressive`

## Size Breakdown (Typical)

```
Total Project Size: ~200-600 MB

Breakdown:
├── frontend/node_modules/  [150-400 MB] ⚠️ LARGEST
├── backend/target/         [50-100 MB]  ⚠️ LARGE
├── .git/                   [20-50 MB]
├── Documentation files     [10-30 MB]
├── Log files              [5-20 MB]    ⚠️ DELETE
├── Source code            [5-10 MB]
└── Other files            [5-10 MB]
```

## Quick Cleanup Solution

I've created a **cleanup.ps1** script that will:

### What It Does:
1. ✅ Removes `backend/target/` (can rebuild with Maven)
2. ✅ Optionally removes `frontend/node_modules/` (can reinstall with npm)
3. ✅ Deletes all Java crash/replay logs
4. ✅ Organizes documentation files into `docs/` folder
5. ✅ Moves old scripts to `scripts/` folder
6. ✅ Updates `.gitignore` to prevent re-adding these files

### How to Use:

```powershell
# Navigate to project folder
cd "c:\Users\imax.computer\OneDrive\Desktop\OOAD Project - Copy\Chamika\C-C_Mart"

# Run cleanup script
.\cleanup.ps1
```

The script will:
- Show you current size
- Ask for confirmation before deleting large folders
- Show you how much space was saved
- Provide instructions to restore dependencies

## Manual Cleanup (Alternative)

If you prefer manual cleanup:

### Step 1: Delete Build Artifacts
```powershell
# Remove backend build files
Remove-Item backend\target -Recurse -Force

# Remove frontend dependencies (optional)
Remove-Item frontend\node_modules -Recurse -Force
```

### Step 2: Delete Log Files
```powershell
# Remove Java crash logs
Remove-Item hs_err_pid*.log -Force
Remove-Item replay_pid*.log -Force
```

### Step 3: Organize Documentation
```powershell
# Create docs folder
New-Item -ItemType Directory -Path docs

# Move non-essential docs
Move-Item *-GUIDE.md docs\
Move-Item *-SUMMARY.md docs\
Move-Item *-FIX.md docs\
# Keep README.md and QUICK-START-GUIDE.md in root
```

### Step 4: Organize Scripts
```powershell
# Create scripts folder
New-Item -ItemType Directory -Path scripts

# Move old scripts
Move-Item add-*.ps1 scripts\
Move-Item fix-*.ps1 scripts\
Move-Item seed-*.ps1 scripts\
# Keep cleanup.ps1 and test-full-stack.ps1 in root
```

## Restoring Dependencies

### After Cleanup - Frontend:
```powershell
cd frontend
npm install
```
This will restore all node_modules (takes 2-5 minutes).

### After Cleanup - Backend:
```powershell
cd backend
mvn clean compile
```
This will restore target folder (takes 1-2 minutes).

## Git Configuration

### Update .gitignore
Ensure these lines are in `.gitignore`:

```gitignore
# Dependencies
node_modules/
frontend/node_modules/

# Build outputs
target/
backend/target/
*.class

# Logs
*.log
hs_err_pid*.log
replay_pid*.log

# IDE files
.vscode/
.idea/
*.iml
```

### Remove from Git Tracking
If these files are already tracked by Git:

```bash
# Remove from Git but keep locally
git rm -r --cached backend/target
git rm -r --cached frontend/node_modules
git rm --cached *.log

# Commit changes
git add .gitignore
git commit -m "Remove large files from Git tracking"
```

## Expected Size Reduction

After cleanup:
- **Before**: 200-600 MB
- **After**: 10-50 MB
- **Savings**: 150-550 MB (70-90% reduction!)

## OneDrive Optimization

If using OneDrive:

### Option 1: Exclude from Sync
Right-click project folder → "Free up space"
- Keeps files in cloud only
- Downloads on demand

### Option 2: Move Large Folders
Move `node_modules` and `target` outside OneDrive:
```powershell
# Not recommended - breaks project structure
# Better to just exclude them with .gitignore
```

### Option 3: Use Selective Sync
OneDrive Settings → Sync and backup → Manage backup
- Uncheck large folders

## Best Practices Going Forward

### 1. Never Commit These:
- ❌ node_modules/
- ❌ target/
- ❌ *.log files
- ❌ Build artifacts

### 2. Always Commit These:
- ✅ Source code (.js, .java, .jsx)
- ✅ Configuration files (package.json, pom.xml)
- ✅ Essential docs (README.md)
- ✅ .gitignore

### 3. Regular Cleanup:
Run cleanup script monthly or when folder exceeds 100 MB.

### 4. Documentation Management:
- Keep 3-5 essential docs in root
- Archive older docs in `docs/` folder
- Consider creating a wiki instead

## Recommended File Structure

After cleanup, your project should look like:

```
C-C_Mart/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── (no target/)
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── (no node_modules/)
├── docs/                    [NEW]
│   ├── old-guides/
│   └── archived-docs/
├── scripts/                 [NEW]
│   ├── cleanup/
│   └── utilities/
├── .gitignore              [UPDATED]
├── README.md
├── QUICK-START-GUIDE.md
├── cleanup.ps1             [NEW]
└── (no log files)
```

## Summary

**Action Plan:**
1. ✅ Run `cleanup.ps1` script
2. ✅ Confirm deletions when prompted
3. ✅ Verify .gitignore is updated
4. ✅ Test: Run `npm install` and `mvn compile` to verify everything works
5. ✅ Commit changes to Git (if using version control)

**Expected Result:**
- 📉 Project size reduced by 70-90%
- 📁 Better organized folder structure
- ⚡ Faster OneDrive sync
- 🎯 Cleaner repository

**Time Required:**
- Cleanup: 2-5 minutes
- Restore dependencies: 5-10 minutes
- Total: ~15 minutes

Run the cleanup script now and enjoy a much smaller, faster project! 🚀

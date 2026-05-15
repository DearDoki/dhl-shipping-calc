@echo off
echo ============================================
echo   Push updated code to GitHub
echo ============================================
echo.

cd /d "C:\Users\Administrator\WorkBuddy\20260331142200\dhl-shipping-calc"

echo [1/4] Setting proxy (127.0.0.1:10809)...
set http_proxy=http://127.0.0.1:10809
set https_proxy=http://127.0.0.1:10809

echo [2/4] Adding changes...
git add .
echo.

echo [3/4] Committing...
git commit -m "feat: auto git push after fuel surcharge update + cleanup"
echo.

echo [4/4] Pushing to origin main...
git push origin main
echo.

echo ============================================
echo   Done!
echo ============================================

set http_proxy=
set https_proxy=
pause

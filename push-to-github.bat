@echo off
echo ============================================
echo   DHL Shipping Calc - Push to GitHub
echo ============================================
echo.

cd /d "C:\Users\Administrator\WorkBuddy\20260331142200\dhl-shipping-calc"

echo [1/5] Checking current branch...
git branch
echo.

echo [2/5] Setting proxy (127.0.0.1:10809)...
set http_proxy=http://127.0.0.1:10809
set https_proxy=http://127.0.0.1:10809
echo Proxy set.
echo.

echo [3/5] Adding all changes...
git add -A
echo.

echo [4/5] Committing (if there are changes)...
git commit -m "Deploy: GitHub Pages setup with deploy.yml"
echo.

echo [5/5] Pushing to origin main...
git push -u origin main
echo.

echo ============================================
echo   Done! Check https://github.com/DearDoki/dhl-shipping-calc
echo ============================================
echo.

echo Unsetting proxy...
set http_proxy=
set https_proxy=
echo.
pause

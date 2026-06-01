@echo off
set http_proxy=http://127.0.0.1:10809
set https_proxy=http://127.0.0.1:10809
git add .
git commit -m "fix: fuel surcharge 2 decimal places 48.75%"
git push origin main

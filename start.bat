@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "APP_DIR=%ROOT_DIR%app"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run this project.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is required to run this project.
  exit /b 1
)

if not exist "%APP_DIR%\node_modules" (
  echo Installing missing dependencies...
  pushd "%APP_DIR%"
  npm install --no-fund --no-audit
  if errorlevel 1 (
    popd
    exit /b 1
  )
  popd
)

pushd "%APP_DIR%"
npm run dev -- --host 127.0.0.1
popd
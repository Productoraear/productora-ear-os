@echo off
set "PATH=C:\Users\Productora Ear\Downloads\node-lts\node-v26.12.1-win-x64;C:\Users\Productora Ear\Downloads\git-portable\cmd;%PATH%"
cd /d d:\EAR_OS_V2\EAR_OS_V2
echo BUILD_START=%DATE% %TIME% > d:\EAR_OS_V2\EAR_OS_V2\build_seal.log
npm run build >> d:\EAR_OS_V2\EAR_OS_V2\build_seal.log 2>&1
echo BUILD_EXIT_CODE=%ERRORLEVEL% >> d:\EAR_OS_V2\EAR_OS_V2\build_seal.log

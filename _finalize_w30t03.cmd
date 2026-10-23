@echo off
set "PATH=C:\Users\Productora Ear\Downloads\git-portable\cmd;%PATH%"
cd /d "D:\EAR_OS_V2\EAR_OS_V2"

echo ===[1] GIT ADD agents fix===
git add src/lib/agents/agentBus.ts src/lib/agents/sectorAgents.ts

echo ===[2] GIT COMMIT AMEND===
git commit --amend --no-edit

echo ===[3] GIT LOG===
git log -1 --oneline

echo ===[4] OMEGA COMPLETE===
call RUN_OMEGA.bat complete W30_T03_PRODUCTION_BUILD_SEAL

echo ===[5] DONE EXITCODE=%ERRORLEVEL%===

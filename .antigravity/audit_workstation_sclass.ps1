# ════════════════════════════════════════════════════════════════════════
# AUDIT_WORKSTATION_SCLASS — read-only forensic inventory (no writes/deletes)
# ════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = 'SilentlyContinue'
$sec = '=' * 70

Write-Output "$sec`n1) DRIVES`n$sec"
Get-CimInstance Win32_LogicalDisk | ForEach-Object {
    [PSCustomObject]@{
        Drive = $_.DeviceID
        Label  = $_.VolumeName
        FS     = $_.FileSystem
        TotalGB = [math]::Round($_.Size/1GB,1)
        FreeGB  = [math]::Round($_.FreeSpace/1GB,1)
        PctUsed = [math]::Round((($_.Size - $_.FreeSpace)/$_.Size)*100,1)
    }
} | Format-Table -AutoSize | Out-String -Width 120 | Write-Output

Write-Output "$sec`n2) HARDWARE`n$sec"
Get-CimInstance Win32_Processor | ForEach-Object { Write-Output ("CPU: " + $_.Name + " | " + $_.NumberOfCores + "c/" + $_.NumberOfLogicalProcessors + "t") }
Get-CimInstance Win32_PhysicalMemory | ForEach-Object { Write-Output ("RAM: " + [math]::Round($_.Capacity/1GB,0) + "GB @" + $_.Speed + "MHz " + $_.Manufacturer) }
Get-CimInstance Win32_VideoController | ForEach-Object { Write-Output ("GPU: " + $_.Name + " | VRAM_AdapterRAM=" + [math]::Round($_.AdapterRAM/1GB,1) + "GB | Driver " + $_.DriverVersion) }

Write-Output "$sec`n3) OLLAMA INSTALL & MODELS`n$sec"
$ollamaExe = Get-Command ollama -ErrorAction SilentlyContinue
if ($ollamaExe) {
    Write-Output ("Ollama PATH: " + $ollamaExe.Source)
    & ollama --version 2>&1 | Write-Output
    Write-Output "--- ollama list (registered models) ---"
    & ollama list 2>&1 | Write-Output
} else {
    Write-Output "Ollama NOT found on PATH"
}
Write-Output "--- OLLAMA_MODELS env ---"
$om = [Environment]::GetEnvironmentVariable('OLLAMA_MODELS','User')
Write-Output ("OLLAMA_MODELS(User) = " + $om)
$omM = [Environment]::GetEnvironmentVariable('OLLAMA_MODELS','Machine')
Write-Output ("OLLAMA_MODELS(Machine) = " + $omM)
Write-Output "--- default model blobs ---"
$defBlobs = Join-Path $env:USERPROFILE '.ollama\models'
if (Test-Path $defBlobs) {
    Get-ChildItem $defBlobs -Recurse -File | Measure-Object Length -Sum | ForEach-Object { Write-Output ("Default .ollama/models: " + [math]::Round($_.Sum/1GB,2) + " GB, " + $_.Count + " files") }
} else {
    Write-Output "No default .ollama\models dir"
}

Write-Output "$sec`n4) H:\AI_MODELS_HUB`n$sec"
if (Test-Path 'H:\AI_MODELS_HUB') {
    $hubTotal = (Get-ChildItem 'H:\AI_MODELS_HUB' -Recurse -File | Measure-Object Length -Sum).Sum
    Write-Output ("TOTAL H:\AI_MODELS_HUB = " + [math]::Round($hubTotal/1GB,2) + " GB")
    Write-Output "--- top-level items (name | size GB) ---"
    Get-ChildItem 'H:\AI_MODELS_HUB' -Force | Sort-Object -Descending -Property @{Expression={ if($_.PSIsContainer){ (Get-ChildItem $_.FullName -Recurse -File | Measure-Object Length -Sum).Sum } else { $_.Length } }} | Select-Object -First 60 | ForEach-Object {
        if ($_.PSIsContainer) {
            $s = (Get-ChildItem $_.FullName -Recurse -File | Measure-Object Length -Sum).Sum
            Write-Output ("[DIR]  " + [math]::Round($s/1GB,2).ToString('0.00') + " GB  " + $_.Name)
        } else {
            Write-Output ("[FILE] " + [math]::Round($_.Length/1GB,3).ToString('0.000') + " GB  " + $_.Name)
        }
    }
} else {
    Write-Output "H:\AI_MODELS_HUB does NOT exist"
}

Write-Output "$sec`n5) LLAMA.CPP SEARCH`n$sec"
$found = Get-ChildItem -Path 'C:\','H:\','D:\' -Recurse -File -Include 'llama*.exe','llama-server*','llama-cli*','main.exe' -Depth 5 -ErrorAction SilentlyContinue
if ($found) { $found | Select-Object -ExpandProperty FullName -Unique } else { Write-Output "No llama.cpp binaries found at shallow depth" }

Write-Output "$sec`n6) C: USER DATA FOLDERS`n$sec"
$candidates = @(
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\Documents",
    "$env:USERPROFILE\Downloads",
    "$env:USERPROFILE\Music",
    "$env:USERPROFILE\Pictures",
    "$env:USERPROFILE\Videos",
    "$env:USERPROFILE\OneDrive"
)
foreach ($c in $candidates) {
    if (Test-Path $c) {
        $s = (Get-ChildItem $c -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
        Write-Output ([math]::Round($s/1GB,2).ToString('0.00') + " GB  " + $c)
    }
}
Write-Output "--- C:\ top-level dirs ---"
Get-ChildItem 'C:\' -Directory -Force | ForEach-Object {
    $s = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
    Write-Output ([math]::Round($s/1GB,2).ToString('0.00') + " GB  C:\" + $_.Name)
} | Sort-Object -Descending

Write-Output "$sec`n7) D: FLAC COLLECTION`n$sec"
$flac = 'D:\MUSICA_PERSONAL_(Coleccion_FLAC)'
if (Test-Path $flac) {
    $s = (Get-ChildItem $flac -Recurse -File | Measure-Object Length -Sum).Sum
    $n = (Get-ChildItem $flac -Recurse -File).Count
    Write-Output ("SIZE = " + [math]::Round($s/1GB,2) + " GB | FILES = " + $n)
} else {
    Write-Output "FLAC folder not at expected path (checking alternatives)..."
    Get-ChildItem 'D:\' -Directory -Force | Where-Object { $_.Name -match 'MUSIC|FLAC|MUSICA' } | ForEach-Object {
        $s = (Get-ChildItem $_.FullName -Recurse -File | Measure-Object Length -Sum).Sum
        Write-Output ([math]::Round($s/1GB,2).ToString('0.00') + " GB  D:\" + $_.Name)
    }
}

Write-Output "$sec`n8) VRAM PROBE (GPU detection)`n$sec"
$gpuInfo = Get-CimInstance Win32_VideoController | Select-Object -First 1
Write-Output ("GPU Name: " + $gpuInfo.Name)
Write-Output ("AdapterRAM reported: " + [math]::Round($gpuInfo.AdapterRAM/1GB,1) + " GB (WMI truncates >4GB; RX 7900 XTX is 24GB)")
Write-Output "DONE"
<#
.SYNOPSIS
    Deep Storage & Codebase Inventory Crawler for EAR OS V2
.DESCRIPTION
    Scans local drives for project code files, documentation, components,
    and assets to build a structured audit manifest.
#>

[CmdletBinding()]
param(
    [string[]]$SearchPaths = @("C:\EAR_OS_V2", "D:\", "H:\"),
    [string]$OutputFile = "C:\EAR_OS_V2\docs\release\COMPREHENSIVE_FORENSIC_INVENTORY.json"
)

$ErrorActionPreference = "SilentlyContinue"

Write-Output "[$(Get-Date -Format 'u')] Starting Forensic Inventory Crawler..."

$validExtensions = @(".ts", ".tsx", ".js", ".jsx", ".json", ".py", ".md", ".sql", ".prisma")
$targetFiles = [System.Collections.Generic.List[PSCustomObject]]::new()

foreach ($path in $SearchPaths) {
    if (Test-Path -LiteralPath $path) {
        Write-Output "Scanning path: $path"
        try {
            $files = Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue | 
                Where-Object { 
                    $ext = $_.Extension.ToLower()
                    ($validExtensions -contains $ext) -and 
                    ($_.FullName -notmatch "node_modules|\.git|\.next|AppData|temp|cache")
                }

            foreach ($file in $files) {
                $targetFiles.Add([PSCustomObject]@{
                    Name      = $file.Name
                    FullPath  = $file.FullName
                    Extension = $file.Extension.ToLower()
                    SizeBytes = $file.Length
                    LastWrite = $file.LastWriteTimeUtc.ToString("o")
                    Directory = $file.DirectoryName
                })
            }
        } catch {
            Write-Warning "Failed scanning $path : $_"
        }
    }
}

$summary = [PSCustomObject]@{
    GeneratedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
    TotalFiles     = $targetFiles.Count
    SearchPaths    = $SearchPaths
    Files          = $targetFiles
}

$outputDir = Split-Path -Parent $OutputFile
if (-not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$summary | ConvertTo-Json -Depth 5 | Out-File -LiteralPath $OutputFile -Encoding utf8

Write-Output "[$(Get-Date -Format 'u')] Crawl complete. Indexed $($targetFiles.Count) files into $OutputFile"

# 🏛️ S-CLASS CTA WELDING ENGINE (V3 OMEGA COMPATIBLE)
$TargetDirs = @("C:\EAR_OS_V2\src\app", "C:\EAR_OS_V2\src\components", "C:\EAR_OS_V2\src\modules")

Write-Host "Iniciando Soldadura de CTAs..."

foreach ($dir in $TargetDirs) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -Recurse -Include *.tsx, *.js, *.jsx | ForEach-Object {
            $filePath = $_.FullName
            try {
                $content = [System.IO.File]::ReadAllText($filePath)
                $original = $content
                $changed = $false

                if ($content.Contains('href="#"')) {
                    $content = $content.Replace('href="#"', 'href="/admin/configurador"')
                    $changed = $true
                }
                
                if ($content.Contains('/lp/lujo-madrid')) {
                    $content = $content.Replace('/lp/lujo-madrid', '/madrid')
                    $changed = $true
                }

                $patterns = @(
                    "Adquirir Licencia Full",
                    "Iniciar Campaña Autónoma",
                    "Activar Protocolo",
                    "Configurar Ahora",
                    "Ver Detalles"
                )

                foreach ($p in $patterns) {
                    $btnSearch = ">$p</button>"
                    if ($content.Contains($btnSearch) -and -not $content.Contains("onClick")) {
                        $content = $content.Replace($btnSearch, " onClick={() => window.location.href='/admin/configurador'}>$p</button>")
                        $changed = $true
                    }
                }

                if ($changed) {
                    [System.IO.File]::WriteAllText($filePath, $content)
                    Write-Host "WELDED: $($_.Name)"
                }
            } catch {
                Write-Host "ERROR: $($_.Name)"
            }
        }
    }
}

Write-Host "Soldadura de CTAs Completada."

# audit_forensic_deep.ps1
# Script para auditoría forense profunda del sistema

# Inicializar variables
$summaryFile = "H:\EAR_OS_V2\EAR_OS_V2\docs\DEEP_AUDIT_MASTER_REPORT.json"
$results = @()

# Función para auditar archivos grandes
function Audit-LargeFiles {
    $largeFiles = Get-ChildItem -Path H:\EAR_OS_V2\EAR_OS_V2 -Recurse | Where-Object { $_.Length -gt 500KB }
    foreach ($file in $largeFiles) {
        $results += [PSCustomObject]@{
            Path      = $file.FullName
            SizeMB    = [math]::Round($file.Length / 1MB, 2)
            LastWrite = $file.LastWriteTime
        }
    }
}
# Función para auditar dependencias y configuraciones
function Audit-Dependencies {
    $dependencies = Get-ChildItem -Path H:\EAR_OS_V2\EAR_OS_V2\package.json | Select-Object FullName, LastWriteTime
    foreach ($dep in $dependencies) {
        $results += [PSCustomObject]@{
            Path      = $dep.FullName
            LastWrite = $dep.LastWriteTime
        }
    }
}
# Ejecutar funciones de auditoría
Audit-LargeFiles
Audit-Dependencies

# Guardar resultados en un archivo JSON resumen
$results | ConvertTo-Json -Depth 10 | Out-File -FilePath $summaryFile

# Imprimir tabla sintetizada en la terminal
$results | Format-Table -AutoSize
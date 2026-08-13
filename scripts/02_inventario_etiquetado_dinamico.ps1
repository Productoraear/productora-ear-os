param(
    [string]$OutRoot = 'C:\EAR_OS_V2\_auditoria',
    [string[]]$WantedLetters = @('C','D','E','G','L')
)

$ErrorActionPreference = 'Stop'

New-Item -ItemType Directory -Path $OutRoot -Force | Out-Null

$vols = Get-Volume | Where-Object { $WantedLetters -contains $_.DriveLetter } |
    Select-Object DriveLetter, FileSystemLabel, FileSystem, HealthStatus, SizeRemaining, Size

$parts = Get-Partition | Where-Object { $_.DriveLetter -and ($WantedLetters -contains $_.DriveLetter) } |
    Select-Object DiskNumber, PartitionNumber, DriveLetter, Size, Type

$phys = Get-PhysicalDisk |
    Select-Object FriendlyName, MediaType, OperationalStatus, Size, SerialNumber

$volCsv  = Join-Path $OutRoot 'volumenes_actuales.csv'
$partCsv = Join-Path $OutRoot 'particiones_actuales.csv'
$physCsv = Join-Path $OutRoot 'discos_fisicos_actuales.csv'

$vols  | Export-Csv $volCsv  -NoTypeInformation -Encoding UTF8
$parts | Export-Csv $partCsv -NoTypeInformation -Encoding UTF8
$phys  | Export-Csv $physCsv -NoTypeInformation -Encoding UTF8

$map = @()

foreach ($v in $vols) {
    $role = switch ($v.DriveLetter) {
        'C' { 'Sistema y programas' }
        'D' { 'Datos personales / archivo' }
        'E' { 'Volumen de trabajo secundario' }
        'G' { 'Datos mecánicos / almacenamiento' }
        'L' { 'Volumen de proyectos' }
        default { 'Pendiente de definir' }
    }

    $map += [pscustomobject]@{
        DriveLetter    = $v.DriveLetter
        FileSystemLabel= $v.FileSystemLabel
        Role           = $role
        FileSystem     = $v.FileSystem
        HealthStatus   = $v.HealthStatus
        SizeGB         = [math]::Round($v.Size/1GB,2)
        FreeGB         = [math]::Round($v.SizeRemaining/1GB,2)
    }
}

$mapCsv = Join-Path $OutRoot 'mapa_funcional_discos.csv'
$mapMd  = Join-Path $OutRoot 'mapa_funcional_discos.md'

$map | Export-Csv $mapCsv -NoTypeInformation -Encoding UTF8

$lines = @()
$lines += '# Mapa funcional de discos'
$lines += ''
$lines += "Generado: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$lines += ''

foreach ($row in $map) {
    $lines += "- $($row.DriveLetter): $($row.FileSystemLabel) -> $($row.Role)"
}

$lines | Set-Content $mapMd -Encoding UTF8

$log = @"
Volumenes: $volCsv
Particiones: $partCsv
Fisicos: $physCsv
Mapa: $mapCsv
Markdown: $mapMd
"@

$logPath = Join-Path $OutRoot 'seguimiento_ejecucion.txt'
$log | Set-Content $logPath -Encoding UTF8
$ErrorActionPreference = 'Stop'

$body = @{
    id          = 'PRUNE-PLACEHOLDER-INVENTORY'
    title       = 'Poda quirurgica inventario: placeholder centralita -> verified:false + edge lean verified'
    status      = 'QUEUED'
    files       = @('public/data/providers/finca.json', 'src/data/all_providers_database.json')
    action      = 'Marcar verified:false los registros con telefono placeholder (+34 693 693 048) o vacio y regenerar particiones edge solo con telefonos reales (anti-bloat < 1MB).'
    scaffold    = '1) node scripts/prune_placeholder_verified.cjs 2) node scripts/build_lean_verified_edge.cjs 3) npx tsc --noEmit = 0'
    done_when   = 'Edge sin placeholders (0), tsc Exit Code 0'
    validation  = 'npx tsc --noEmit'
}

$json = $body | ConvertTo-Json -Depth 5

try {
    $r = Invoke-RestMethod -Uri 'http://localhost:3007/api/admin/tasks/inject' -Method Post -ContentType 'application/json' -Body $json -TimeoutSec 30
    $r | ConvertTo-Json -Depth 5
} catch {
    Write-Output ('ERROR: ' + $_.Exception.Message)
}
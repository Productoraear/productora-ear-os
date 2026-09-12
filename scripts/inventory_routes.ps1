# Inventario de rutas (page.tsx) — resumen sintético
$ErrorActionPreference = 'Stop'
$root = 'H:\EAR_OS_V2\EAR_OS_V2\src\app'

$pages = Get-ChildItem -LiteralPath $root -Recurse -Filter 'page.tsx' | ForEach-Object {
  $_.FullName.Substring($root.Length).Replace('\','/').Replace('/page.tsx','')
}

$pages | Sort-Object | ForEach-Object {
  Write-Output ('ROUTE: /' + $_.TrimStart('/'))
}

Write-Output ('TOTAL_ROUTES: ' + $pages.Count)
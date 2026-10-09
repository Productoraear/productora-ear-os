# ============================================================
# PURGA DE MODELOS LEGACY PELIGROSOS (contexto 100k desbordante)
# Los blobs de pesos son compartidos con ear-27b-flow,
# ear-32b-architect y ear-14b-speed, por lo que eliminar estos
# aliases solo borra manifiestos/metadatos, NO los pesos.
# ============================================================
$ErrorActionPreference = 'Continue'

$legacy = @(
  'ear-32b-arquitectura-ctx20480:latest',
  'ear-14b-textos-ctx16384:latest',
  'ear-27b-apis-ctx20480:latest'
)

Write-Host "=== MODELOS ANTES DE LA PURGA ==="
ollama list 2>&1 | Out-String -Width 200

foreach ($m in $legacy) {
  Write-Host ""
  Write-Host ("Eliminando alias legacy: {0}" -f $m)
  $out = ollama rm $m 2>&1 | Out-String
  Write-Host $out.Trim()
}

Write-Host ""
Write-Host "=== MODELOS DESPUES DE LA PURGA ==="
ollama list 2>&1 | Out-String -Width 200

Write-Host "=== OLLAMA PS (debe estar vacio, sin residencia) ==="
ollama ps 2>&1 | Out-String -Width 200

Write-Host "==== FIN PURGA ===="
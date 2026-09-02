# ==============================================================================
# SCRIPT MAESTRO DE VAMPIRIZACIÓN S-CLASS (RESCATE INTEGRAL DEL 99%+)
# ==============================================================================

Set-Location "H:\EAR_OS_V2\EAR_OS_V2"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   INICIANDO PROTOCOLO DE VAMPIRIZACIÓN S-CLASS E HISTÓRICA           " -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Crear directorios canónicos de destino
$Dirs = @(
    "src\components\pricing",
    "src\components\search",
    "src\features\finance\ui",
    "src\features\finance\types",
    "src\lib\constants",
    "src\lib\matchmaker",
    "src\app\(public)\cotizador",
    "src\app\(public)\matcher"
)

foreach ($Dir in $Dirs) {
    if (-not (Test-Path $Dir)) {
        New-Item -ItemType Directory -Path $Dir -Force | Out-Null
        Write-Host "-> Creado directorio: $Dir" -ForegroundColor DarkGray
    }
}

# 2. Función de rescate atómico
function Rescatar-Activo ($RutaOrigen, $RutaDestino) {
    if (Test-Path $RutaOrigen) {
        Copy-Item -Path $RutaOrigen -Destination $RutaDestino -Force
        Write-Host "  [✓] Copiado desde local: $RutaDestino" -ForegroundColor Green
        return
    }
    $NombreArchivo = Split-Path $RutaDestino -Leaf
    $ArchivoEncontrado = Get-ChildItem -Path "src", "scripts" -Recurse -Filter $NombreArchivo -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($ArchivoEncontrado) {
        Copy-Item -Path $ArchivoEncontrado.FullName -Destination $RutaDestino -Force
        Write-Host "  [✓] Recuperado desde copia local: $RutaDestino" -ForegroundColor Green
    } else {
        Write-Host "  [X] No localizado: $NombreArchivo" -ForegroundColor Red
    }
}

Write-Host "`n[1/3] Vampirizando componentes y motores transaccionales..." -ForegroundColor Cyan

# Rescate de Motores y Tipos
Rescatar-Activo "src/personal-y-artista/edwin-agudelo/repertorio-y-ip/pricing-catalog.ts" "src/lib/constants/pricing-catalog.ts"
Rescatar-Activo "src/personal-y-artista/edwin-agudelo/repertorio-y-ip/pricing-engine.ts" "src/lib/pricing-engine.ts"
Rescatar-Activo "src/empresa/productora-ear-core/hungarianAlgorithm.ts" "src/lib/matchmaker/hungarianAlgorithm.ts"
Rescatar-Activo "src/personal-y-artista/edwin-agudelo/repertorio-y-ip/filters.ts" "src/features/finance/types/filters.ts"
Rescatar-Activo "src/empresa/productora-ear-core/PriceLockBadge.tsx" "src/features/finance/ui/PriceLockBadge.tsx"
Rescatar-Activo "src/personal-y-artista/edwin-agudelo/repertorio-y-ip/AirbnbUltraFiltersModal.tsx" "src/features/finance/ui/AirbnbUltraFiltersModal.tsx"

# Rescate de Componentes Interactivos Maestros
Rescatar-Activo "src/personal-y-artista/edwin-agudelo/repertorio-y-ip/MultiPricer.tsx" "src/components/pricing/MultiPricer.tsx"
Rescatar-Activo "src/app/components/public/TinderMatcherClient.tsx" "src/components/pricing/TinderMatcherClient.tsx"
Rescatar-Activo "src/app/components/public/DiscoverySearch.tsx" "src/components/search/DiscoverySearch.tsx"

Write-Host "`n[2/3] Creando portales dedicados a pantalla completa (/cotizador y /matcher)..." -ForegroundColor Cyan

# Crear página /cotizador
$CotizadorPageCode = @'
import MultiPricer from "@/components/pricing/MultiPricer";

export const metadata = {
  title: "Cotizador S-Class & MultiPricer | Productora EAR",
  description: "Calculadora interactiva en tiempo real para eventos, festivales, bodas y contratos municipales con Price-Lock garantizado 72h."
};

export default function CotizadorPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <MultiPricer />
      </div>
    </main>
  );
}
'@
Set-Content -Path "src\app\(public)\cotizador\page.tsx" -Value $CotizadorPageCode -Encoding UTF8
Write-Host "  [✓] Portal /cotizador generado." -ForegroundColor Green

# Crear página /matcher
$MatcherPageCode = @'
import TinderMatcherClient from "@/components/pricing/TinderMatcherClient";

export const metadata = {
  title: "Artistas & Formatos Matcher | Productora EAR",
  description: "Encuentra el ensamble artístico perfecto según aforo, acústica y formato para tu evento o celebración municipal."
};

export default function MatcherPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <TinderMatcherClient />
      </div>
    </main>
  );
}
'@
Set-Content -Path "src\app\(public)\matcher\page.tsx" -Value $MatcherPageCode -Encoding UTF8
Write-Host "  [✓] Portal /matcher generado." -ForegroundColor Green

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host "   VAMPIRIZACIÓN COMPLETADA: REVISIÓN DE INTEGRIDAD                   " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green

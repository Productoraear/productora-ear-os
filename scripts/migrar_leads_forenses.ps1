# scripts/migrar_leads_forenses.ps1
Write-Host "[EAR OS] Iniciando ingesta forense con persistencia en disco..." -ForegroundColor Cyan

$jsonPath = "H:\EAR_OS_V2\EAR_OS_V2\bodas_dossier_atomico.json"
if (-not (Test-Path $jsonPath)) {
    Write-Error "No se encontro bodas_dossier_atomico.json."
    return
}

$rawDossier = Get-Content $jsonPath -Raw -Encoding utf8 | ConvertFrom-Json
$requestsCards = $rawDossier.sections.solicitudes.structuredCards

# Filtrar tarjetas con actividad de fechas reales
$validLeads = $requestsCards | Where-Object { $_ -match "\b(2025|2026|2027)\b" -and $_ -match "El \d{2}/\d{2}/\d{4}" }
Write-Host "-> Leads estructurados a procesar: $($validLeads.Count)" -ForegroundColor Green

$normalizedLeads = @()

foreach ($leadText in $validLeads) {
    Write-Host "`n[EAR OS AI] Normalizando lead..." -ForegroundColor DarkGray
    $prompt = @"
Toma este texto de solicitud extraido de Bodas.net:
`"$leadText`"

Devuelve UNICAMENTE un objeto JSON valido (sin markdown, sin texto adicional) con esta estructura exacta:
{
  "name": "Nombre detectado",
  "category": "Musica / Produccion Integral",
  "stage": "identified",
  "rating": 5,
  "quoted_price": 0.00,
  "date_requested": "AAAA-MM-DD o null",
  "pax": "Numero de comensales o null",
  "snippet": "Texto relevante del mensaje"
}
"@

    $cleanJsonStr = & "H:\EAR_OS_V2\EAR_OS_V2\scripts\ia_admin_worker.ps1" -Prompt $prompt
    
    try {
        # Limpieza de posibles bloques markdown residuales
        $cleanJsonStr = $cleanJsonStr -replace '```json', '' -replace '```', ''
        $leadObj = $cleanJsonStr.Trim() | ConvertFrom-Json
        $normalizedLeads += $leadObj
        Write-Host " [OK] $($leadObj.name) | Fecha: $($leadObj.date_requested) | Pax: $($leadObj.pax)" -ForegroundColor Cyan
    } catch {
        Write-Host " [WARN] No se pudo parsear el JSON generado para esta tarjeta." -ForegroundColor Yellow
    }
}

# 1. Guardar consolidado JSON en disco
$outputJsonPath = "H:\EAR_OS_V2\EAR_OS_V2\src\data\leads_sourcing_normalizados.json"
$normalizedLeads | ConvertTo-Json -Depth 5 | Set-Content -Path $outputJsonPath -Encoding utf8
Write-Host "`n[EAR OS] Consolidador JSON guardado en: $outputJsonPath" -ForegroundColor Green

# 2. Generar sentencias SQL para Supabase
$sqlLines = @("-- Insercion masiva de leads extraidos hacia sourcing_suppliers")
foreach ($lead in $normalizedLeads) {
    $escName = $lead.name -replace "'", "''"
    $escCat = $lead.category -replace "'", "''"
    $sqlLines += "INSERT INTO sourcing_suppliers (name, category, stage, rating, quoted_price, created_at) VALUES ('$escName', '$escCat', 'identified', 5, 0.00, NOW());"
}

$outputSqlPath = "H:\EAR_OS_V2\EAR_OS_V2\supabase\migrations\20260909_insert_forensic_leads.sql"
$sqlLines | Set-Content -Path $outputSqlPath -Encoding utf8
Write-Host "[EAR OS] Script SQL de insercion generado en: $outputSqlPath" -ForegroundColor Green

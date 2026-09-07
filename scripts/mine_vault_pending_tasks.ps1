<#
.SYNOPSIS
  Mines HISTORIC_AI_CHATS vault for pending/unimplemented tasks.
  Outputs a condensed JSON report (< 300 tokens per section) per ZTM protocol.
#>

$vaultPath = "H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\HISTORIC_AI_CHATS"
$outputPath = "H:\EAR_OS_V2\EAR_OS_V2\scripts\vault_pending_tasks_report.json"

# Patterns that indicate promised/planned but potentially unimplemented work
$taskPatterns = @(
    'TODO',
    'PENDIENTE',
    'FALTA',
    'HAY QUE',
    'NECESITA',
    'IMPLEMENTAR',
    'CREAR',
    'AÑADIR',
    'AGREGAR',
    'NO FUNCIONA',
    'NO ESTÁ',
    'SIGUIENTE PASO',
    'PRÓXIMO PASO',
    'QUEDA POR',
    'FALTAN',
    'SIN IMPLEMENTAR',
    'PLACEHOLDER',
    'STUB',
    'MOCK',
    'HARDCODED',
    'WORKAROUND',
    'HACK',
    'TEMPORAL',
    'PROVISORIO',
    'CORREGIR',
    'ARREGLAR',
    'FIX',
    'BUG',
    'BROKEN',
    'ROTO',
    'MIGRAR',
    'REFACTOR',
    'DEPLOY',
    'DESPLEGAR',
    'STRIPE',
    'WEBHOOK',
    'CRON',
    'ENDPOINT',
    'API ROUTE',
    'MIDDLEWARE',
    'AUTH',
    'LOGIN',
    'DASHBOARD',
    'BLOG',
    'SEO',
    'LANDING',
    'ONBOARDING',
    'B2G',
    'VIMUME',
    'ASTRA',
    'ARSENAL',
    'NEURAL',
    'GRAFO',
    'CRM',
    'LEAD',
    'FUNNEL',
    'EMAIL',
    'NOTIFICACIÓN',
    'ANALYTICS',
    'MONITOREO',
    'TEST',
    'PRUEBA',
    'CI/CD',
    'VERCEL'
)

$results = @{
    scan_date = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    total_files_scanned = 0
    total_task_hits = 0
    categories = @{}
}

# Define categories for grouping
$categoryMap = @{
    "STRIPE_PAYMENTS" = @('STRIPE', 'WEBHOOK', 'CHECKOUT', 'DEPÓSITO', 'PAGO', 'PAYMENT')
    "AUTH_LOGIN" = @('AUTH', 'LOGIN', 'SESIÓN', 'TOKEN', 'CLAIM')
    "SEO_BLOG" = @('SEO', 'BLOG', 'LANDING', 'GEO', 'METADATA', 'SITEMAP')
    "B2G_INSTITUCIONAL" = @('B2G', 'LCSP', 'FACE', 'DIR3', 'CONTRATO MENOR', 'AYUNTAMIENTO', 'INSTITUCIONAL')
    "VIMUME_NEURO" = @('VIMUME', 'NEUROACÚSTIC', '40 HZ', 'ALZHEIMER', 'GAMMA', 'RESIDENCIA')
    "ASTRA_IA" = @('ASTRA', 'ORÁCULO', 'ORACLE', 'IA ', 'INFERENCIA', 'RAG', 'LLM')
    "ARSENAL_AUDIO" = @('ARSENAL', 'RIDER', 'BOSE', 'SHURE', 'ACÚSTIC', 'SPL', 'AUDIO')
    "CRM_LEADS" = @('CRM', 'LEAD', 'FUNNEL', 'EMBUDO', 'CONVERSIÓN', 'RETENCIÓN')
    "DEPLOYMENT" = @('DEPLOY', 'VERCEL', 'CI/CD', 'BUILD', 'PRODUCCIÓN')
    "ARTISTAS_ROSTER" = @('ARTISTA', 'ROSTER', 'EDWIN', 'SOLISTA', 'SPLIT', 'CACHÉ')
    "EMPRESAS_B2B" = @('EMPRESA', 'FINCA', 'B2B', 'HOMOLOGACIÓN', 'AFILIADO', 'COMISIÓN')
    "NEURAL_GRAPH" = @('NEURAL', 'GRAFO', 'NODO', 'CANVAS', 'HUD', 'INSPECTOR')
    "DASHBOARD_ADMIN" = @('DASHBOARD', 'ADMIN', 'PANEL', 'CONTROL', 'MONITOR')
    "ONBOARDING" = @('ONBOARDING', 'BIENVENIDA', 'REGISTRO', 'WIZARD', 'TUTORIAL')
    "EMAIL_NOTIF" = @('EMAIL', 'NOTIFICACIÓN', 'CORREO', 'RESEND', 'SMTP')
    "TESTING" = @('TEST', 'PRUEBA', 'JEST', 'PLAYWRIGHT', 'E2E', 'UNIT TEST')
}

$files = Get-ChildItem -Path $vaultPath -File -Filter "*.md" | Sort-Object Length -Descending | Select-Object -First 100

$allHits = @()

foreach ($file in $files) {
    $results.total_files_scanned++
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
        if (-not $content) { continue }

        # Split into lines for context
        $lines = $content -split "`n"
        
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i].Trim()
            if ($line.Length -lt 10 -or $line.Length -gt 500) { continue }
            
            foreach ($pattern in $taskPatterns) {
                if ($line -match [regex]::Escape($pattern)) {
                    # Determine category
                    $category = "UNCATEGORIZED"
                    foreach ($cat in $categoryMap.Keys) {
                        foreach ($kw in $categoryMap[$cat]) {
                            if ($line -match [regex]::Escape($kw)) {
                                $category = $cat
                                break
                            }
                        }
                        if ($category -ne "UNCATEGORIZED") { break }
                    }

                    $hit = @{
                        file = $file.Name
                        line_num = $i + 1
                        content = if ($line.Length -gt 200) { $line.Substring(0, 200) + "..." } else { $line }
                        pattern = $pattern
                        category = $category
                    }
                    $allHits += $hit
                    $results.total_task_hits++
                    
                    if (-not $results.categories.ContainsKey($category)) {
                        $results.categories[$category] = @()
                    }
                    # Limit to 20 hits per category for condensed output
                    if ($results.categories[$category].Count -lt 20) {
                        $results.categories[$category] += $hit
                    }
                    break  # Only count one pattern per line
                }
            }
        }
    }
    catch {
        # Skip files that can't be read
    }
}

# Generate summary statistics
$results.summary = @{}
foreach ($cat in $results.categories.Keys) {
    $catHits = ($allHits | Where-Object { $_.category -eq $cat }).Count
    $results.summary[$cat] = $catHits
}

$results | ConvertTo-Json -Depth 5 | Set-Content -Path $outputPath -Encoding UTF8
Write-Host "✅ Scan complete: $($results.total_files_scanned) files, $($results.total_task_hits) task hits"
Write-Host "📄 Report saved to: $outputPath"

# Also output top-level summary
Write-Host "`n=== CATEGORY SUMMARY ==="
foreach ($cat in ($results.summary.GetEnumerator() | Sort-Object Value -Descending)) {
    Write-Host "$($cat.Key): $($cat.Value) hits"
}

$activeFiles = @(
    "C:\EAR_OS_V2\01_SSOT_Y_KERNELS\CLINE_OMEGA_KERNEL.md",
    "C:\EAR_OS_V2\01_SSOT_Y_KERNELS\EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md"
)

$quarantinedFiles = @(
    "H:\99_CUARENTENA\vault_purged_2026_05_18\About.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\AdditionalServices.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\AdvancedSearchGrid.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\AeoRadar.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\AnimatedStats.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\ArtistPortal.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\ArtistsSection.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\Blog.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\BusinessServices.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\Contact.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\EarLogo.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\EventsSection.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\Features.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\Hero.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\MarketingSkills.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\PricingTable.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\ProfesorIA.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\RentalSection.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\SocialImpactHome.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\SocialProjects.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\Stats.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\Testimonials.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\VideoServices.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\WeddingsSection.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\_quarantine",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\api",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\events",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\hunter",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\ingestion",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\leads",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\position",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\scan",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\status",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\vampirizer",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\boe_predator.ts",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\EarCommandCenter.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\layout.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\LogisticsService.ts",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\marketActions.ts",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\OmnibusTracker.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\OmnibusVertical.tsx",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\purga_2026_05_18\SClass.d.ts",
    "H:\99_CUARENTENA\vault_purged_2026_05_18\NUCLEO_DATA\imageScraperWithScroll.js"
)

$results = @()

foreach ($file in $activeFiles) {
    $exists = Test-Path $file
    $results += [PSCustomObject]@{
        Path = $file
        Category = "Active Document"
        Status = if ($exists) { "Active & Verified" } else { "Missing!" }
        DuplicateInRoot = "N/A"
    }
}

foreach ($file in $quarantinedFiles) {
    $exists = Test-Path $file
    $fileName = Split-Path $file -Leaf
    
    # Check if duplicate exists in active workspace
    $duplicatePath = "C:\EAR_OS_V2\$fileName"
    
    if ($file -like "*\purga_2026_05_18\purga_2026_05_18\*") {
        $relativePath = $file.Substring("H:\99_CUARENTENA\vault_purged_2026_05_18\".Length)
        $duplicatePath = "C:\EAR_OS_V2\$relativePath"
    }
    
    $hasDuplicate = Test-Path $duplicatePath
    
    $results += [PSCustomObject]@{
        Path = $file
        Category = "Quarantined Legacy"
        Status = if ($exists) { "Quarantined" } else { "Not Quarantined / Missing from Quarantine!" }
        DuplicateInRoot = if ($hasDuplicate) { "DUPLICATED IN LIVE ROOT! ($duplicatePath)" } else { "Clean (Extracted)" }
    }
}

# Ensure logs dir exists
$logDir = "C:\EAR_OS_V2\logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force
}

$results | Export-Csv -Path "C:\EAR_OS_V2\logs\inventory_audit.csv" -NoTypeInformation -Encoding UTF8
$results | Format-Table -AutoSize

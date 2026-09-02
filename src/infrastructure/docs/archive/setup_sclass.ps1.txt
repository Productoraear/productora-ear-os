# 🔱 EAR OS GOLD - S-CLASS SETUP SCRIPT
# Objetivo: Blindaje de Credenciales y Preparación de Nodos

$PROJECT_ROOT = "C:\EAR_OS_V2"
$KEY_SOURCE = "H:\EAR_OS_GOLD\productora-ear-backend-4726251604ef.json"
$CONFIG_DIR = "$PROJECT_ROOT\src\config"
$SCRIPTS_DIR = "$PROJECT_ROOT\scripts_predators"

Write-Host "🚀 INICIANDO PROTOCOLO DE SELLADO S-CLASS..." -ForegroundColor Gold

# 1. Creación de directorios tácticos
if (!(Test-Path $CONFIG_DIR)) { 
    New-Item -ItemType Directory -Path $CONFIG_DIR 
    Write-Host "✅ Directorio de Configuración creado."
}
if (!(Test-Path $SCRIPTS_DIR)) { 
    New-Item -ItemType Directory -Path $SCRIPTS_DIR 
    Write-Host "✅ Nido de Predators creado."
}

# 2. Inyección de la Llave Maestra
if (Test-Path $KEY_SOURCE) {
    Copy-Item -Path $KEY_SOURCE -Destination "$CONFIG_DIR\serviceAccountKey.json" -Force
    Write-Host "🔐 LLAVE MAESTRA INYECTADA: src/config/serviceAccountKey.json" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: No se encuentra la llave en H:. Verifique la conexión del disco." -ForegroundColor Red
}

# 3. Blindaje Anti-Filtración (GitHub)
$GITIGNORE = "$PROJECT_ROOT\.gitignore"
$PROTECTED_FILES = @("*.json", ".env.local", "serviceAccountKey.json")

foreach ($file in $PROTECTED_FILES) {
    if (!(Select-String -Path $GITIGNORE -Pattern [regex]::Escape($file) -Quiet)) {
        Add-Content -Path $GITIGNORE -Value $file
        Write-Host "🛡️ BLINDAJE: '$file' añadido a .gitignore."
    }
}

# 4. Verificación de Entorno
Write-Host "🌀 SINCRONIZANDO .ENV.LOCAL..."
$ENV_CONTENT = @"
# --- FIREBASE ADMIN SDK ---
FIREBASE_SERVICE_ACCOUNT_PATH=./src/config/serviceAccountKey.json
"@
Add-Content -Path "$PROJECT_ROOT\.env.local" -Value $ENV_CONTENT

Write-Host "🔥 MISIÓN CUMPLIDA. EL PORTAAVIONES ESTÁ LISTO PARA EL NIVEL 8." -ForegroundColor Cyan
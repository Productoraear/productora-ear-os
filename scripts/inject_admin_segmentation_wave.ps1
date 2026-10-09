# ════════════════════════════════════════════════════════════════════════════════
# INYECCIÓN WAVE "ADMIN-SEGMENTATION" (S-CLASS) — CONTROL EXHAUSTIVO DEL CEO
# --------------------------------------------------------------------------------
# Convierte la doctrina de segmentación total (Artistas / Proveedores / Terapeutas
# / Flota / Afiliados / Tesorería) en tareas atómicas para el Omega Engine.
#
# Uso:
#   pwsh -NoProfile -File scripts/inject_admin_segmentation_wave.ps1 [-Port 3007]
#
# Requiere el dev server de Next.js activo en $Port (endpoint sancionado
# /api/admin/tasks/inject). PROHIBIDO tocar tasks_queue.json a mano.
#
# Cada tarea se ejecuta en UNA sesión de Cline (Pacto Anti-Sobrecostes), validando
# SIEMPRE con `npx tsc --noEmit` = Exit Code 0.
# ════════════════════════════════════════════════════════════════════════════════
param(
    [int]$Port = 3007
)

$ErrorActionPreference = 'Stop'
$EndPoint = "http://localhost:$Port/api/admin/tasks/inject"

function Invoke-InjectTask($task) {
    $json = $task | ConvertTo-Json -Depth 8
    try {
        $r = Invoke-RestMethod -Uri $EndPoint -Method Post -ContentType 'application/json' -Body $json -TimeoutSec 30
        Write-Output ("OK  " + $r.task.id + "  " + $r.task.title)
    } catch {
        Write-Output ("FAIL (" + $task.id + "): " + $_.Exception.Message)
    }
}

# ════════════════════════════════════════════════════════════════════════════════
# TAREA 1: Dominio segmentado en Prisma (TherapistProfile + Role.THERAPIST)
# ════════════════════════════════════════════════════════════════════════════════
$t1 = @{
    id       = 'ADMIN-SEG-01-DOMAIN'
    title    = 'Anadir TherapistProfile y Role.THERAPIST a prisma/schema.prisma (terapeutas VIMUME)'
    status   = 'QUEUED'
    files    = @('prisma/schema.prisma')
    action   = 'Crear el modelo TherapistProfile relacionado con User (role THERAPIST) para gobernar la red de musicoterapeutas VIMUME. Sin tocar SSOT ni motores protegidos.'
    scaffold = "1. En prisma/schema.prisma, anadir al enum Role (junto a los demas roles) el literal: THERAPIST\n2. Anadir un nuevo modelo al final del archivo (antes del cierre) con esta firma EXACTA:\n\nmodel TherapistProfile {\n  id          String   @id @default(cuid())\n  userId      String   @unique\n  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  slug        String?  @unique\n  specialty   String?  // musicoterapia | neuroacustica | estimulacion_cognitiva | ocupacional\n  credentials String?  @db.Text\n  status      String   @default(""ACTIVE"") // ACTIVE | SUSPENDED | INACTIVE\n  isActive    Boolean  @default(true)\n  bio         String?  @db.Text\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  @@index([specialty], name: ""idx_therapist_specialty"")\n  @@index([status], name: ""idx_therapist_status"")\n}\n\n3. Anadir la relacion inversa en el modelo User: therapists TherapistProfile[]\n4. npx tsc --noEmit = 0.\n5. NO ejecutar prisma migrate/db push (lo sanciona Antigravity tras validar)."
    done_when = "Schema ampliado con TherapistProfile + Role.THERAPIST + relacion User, tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ════════════════════════════════════════════════════════════════════════════════
# TAREA 2: API blindada de ARTISTAS (roster/flota artistica)
# ════════════════════════════════════════════════════════════════════════════════
$t2 = @{
    id       = 'ADMIN-SEG-02-ARTISTS'
    title    = 'API CRUD segmentada de Artistas (artistProfile) con defensa en profundidad'
    status   = 'QUEUED'
    files    = @('src/app/api/admin/artists/route.ts')
    action   = 'Crear /api/admin/artists con GET (listado paginado/busqueda por stageName/genros/status) y PATCH (status, displayName, slug canonico). Zero any implicito, try/catch hermetico y sanitizacion.'
    scaffold = "1. Crear src/app/api/admin/artists/route.ts con runtime='nodejs' y dynamic='force-dynamic'.\n2. Importar el cliente prisma EXACTO con: import { prisma } from '@/lib/prisma' (singleton ya existente, NO crear otro). Revisa src/lib/prisma.ts solo si el import falla.\n3. GET: leer query params page/size/q; sanitizar q (String(x).slice(0,80)); devolver { ok, data, total } con artistProfile.findMany({ include: { user: { select: { email, name } } }, orderBy: { updatedAt: 'desc' } }).\n4. PATCH: body { id, status?, displayName?, slug? }; validar id string no vacio; tipar strict body como { id: string; status?: string; displayName?: string; slug?: string }; usar prisma.artistProfile.update; capturar P2025 (no encontrado) y devolver 404.\n5. Envolver TODO en try/catch y devolver 500 con { ok:false, error: message }.\n6. npx tsc --noEmit = 0."
    done_when = "GET y PATCH de /api/admin/artists operativos y tipados, tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ════════════════════════════════════════════════════════════════════════════════
# TAREA 3: API blindada de PROVEEDORES (doctrina dato verificado)
# ════════════════════════════════════════════════════════════════════════════════
$t3 = @{
    id       = 'ADMIN-SEG-03-PROVIDERS'
    title    = 'API CRUD segmentada de Proveedores (providerProfile) con verified real'
    status   = 'QUEUED'
    files    = @('src/app/api/admin/providers/route.ts')
    action   = 'Crear /api/admin/providers con GET filtrable por category/status/claimStatus y PATCH que jamas fuerce verified:true con telefono centralita/vacio (doctrina Zona Cero). Sanitizacion y try/catch.'
    scaffold = "1. Crear src/app/api/admin/providers/route.ts con runtime='nodejs' y dynamic='force-dynamic'.\n2. Importar con: import { prisma } from '@/lib/prisma'.\n3. GET: query category, status, search; sanitizar entradas; devolver { ok, data, total } con findMany + include { quota, calibration, packages }.\n4. PATCH: body { id, status?, rating? }. PROHIBIDO exponer o escribir isVerified/verified:true desde este endpoint si phone en ('+34 693 693 048','',null) o es placeholder (regex /^\\+?34693|central|placeholder|fake/i). Regla de negocio: todo telefono centralita/vacio => verified:false.\n5. Capturar P2025 => 404. try/catch => 500.\n6. npx tsc --noEmit = 0."
    done_when = "GET/PATCH proveedores operativos sin hueco para re-hardcodear verified:true, tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ════════════════════════════════════════════════════════════════════════════════
# TAREA 4: API blindada de TERAPEUTAS (TherapistProfile)
# ════════════════════════════════════════════════════════════════════════════════
$t4 = @{
    id       = 'ADMIN-SEG-04-THERAPISTS'
    title    = 'API CRUD segmentada de Terapeutas VIMUME (TherapistProfile)'
    status   = 'QUEUED'
    files    = @('src/app/api/admin/therapists/route.ts')
    action   = 'Crear /api/admin/therapists sobre TherapistProfile con GET listado y PATCH de status/specialty/credentials. Mismo blindaje: try/catch, sanitizacion, zero any.'
    scaffold = "1. Crear src/app/api/admin/therapists/route.ts (runtime='nodejs', dynamic='force-dynamic').\n2. Importar con: import { prisma } from '@/lib/prisma'.\n3. GET: query specialty y status; findMany({ include: { user: { select: { email, name } } } }) devolviendo { ok, data, total }.\n4. PATCH: body { id, status?, specialty?, isActive? }; validar id y status dentro de ('ACTIVE','SUSPENDED','INACTIVE'); prisma.therapistProfile.update.\n5. Capturar P2025 => 404; try/catch => 500.\n6. npx tsc --noEmit = 0."
    done_when = "CRUD terapeutas operativo y tipado, tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ════════════════════════════════════════════════════════════════════════════════
# TAREA 5: API de FLOTA y logistica (fleetUnit + posiciones)
# ════════════════════════════════════════════════════════════════════════════════
$t5 = @{
    id       = 'ADMIN-SEG-05-FLEET'
    title    = 'API de Flota/Logistica (fleetUnit + FleetPosition) con estado y ubicacion'
    status   = 'QUEUED'
    files    = @('src/app/api/admin/fleet/route.ts')
    action   = 'Crear /api/admin/fleet con GET de unidades y PATCH de status/currentLocation. Sin tocar la tarifa SSOT (1.50/km desde km 50 + 120 hotel); solo lectura/estado operativo.'
    scaffold = "1. Crear src/app/api/admin/fleet/route.ts (runtime='nodejs', dynamic='force-dynamic').\n2. Importar con: import { prisma } from '@/lib/prisma'.\n3. GET: findMany fleetUnit incluyendo la ultima FleetPosition por unidad (orderBy timestamp desc, take 1). Devolver { ok, data, total }.\n4. PATCH: body { id, status?, currentLocation? }; validar id; prisma.fleetUnit.update. No recalcular precios ni tocar SSOT de logistica.\n5. Capturar P2025 => 404; try/catch => 500.\n6. npx tsc --noEmit = 0."
    done_when = "Lectura/estado de flota operativo y tipado, tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ════════════════════════════════════════════════════════════════════════════════
# TAREA 6: Panel maestro de CONTROL SEGMENTADO (una sola URL canonica)
# ════════════════════════════════════════════════════════════════════════════════
$t6 = @{
    id       = 'ADMIN-SEG-06-CONTROL'
    title    = 'Panel maestro segmentado /admin/control con tabs por entidad (sin doorway)'
    status   = 'QUEUED'
    files    = @('src/app/(admin)/admin/control/page.tsx')
    action   = 'Crear la vista unica /admin/control con tabs: Artistas, Proveedores, Terapeutas, Flota, Afiliados, Tesoreria. Consume las APIs creadas. Un solo metadata canonical para /admin/control y robots noindex.'
    scaffold = "1. Crear src/app/(admin)/admin/control/page.tsx como 'use client' (es interactivo).\n2. Exportar metadata con alternates.canonical = '/admin/control' y robots: { index: false, follow: false }.\n3. Implementar barra de tabs (array [{id:'artistas'|'proveedores'|'terapeutas'|'flota'|'afiliados'|'tesoreria', label, icono de lucide-react}]).\n4. Cada tab renderiza una tabla leyendo del endpoint correspondiente vía fetch a /api/admin/{entidad} (artistas, providers, therapists, fleet). Para afiliados y tesoreria reutilizar estados ya existentes en /admin/afiliados y /admin/tesoreria como enlaces internos, no duplicar logica.\n5. Estetica OLED obligatoria: rounded-3xl bg-[#09090d]/80 border-white/10, fondo #030305, acento #ecb613, w-full overflow-x-hidden (prohibido w-screen). transiciones transition-all duration-300.\n6. npx tsc --noEmit = 0."
    done_when = "/admin/control renderiza las 6 tabs, canonical unico y noindex, tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ════════════════════════════════════════════════════════════════════════════════
# TAREA 7: Integrar la MasterTab "Control Soberano" en el layout (sin duplicar)
# ════════════════════════════════════════════════════════════════════════════════
$t7 = @{
    id       = 'ADMIN-SEG-07-NAV'
    title    = 'Anadir MasterTab "Control Soberano" al layout admin sin duplicar URLs'
    status   = 'QUEUED'
    files    = @('src/app/(admin)/admin/layout.tsx')
    action   = 'Registrar la nueva ruta /admin/control en MASTER_TABS como entrada unica (sin generar variantes ni doorway). Mantener las 22 URLs existentes intactas.'
    scaffold = "1. En src/app/(admin)/admin/layout.tsx, anadir al array MASTER_TABS una nueva MasterTab:  { id:'control', title:'Ctrl Soberano', shortTitle:'Control', icon: Sliders, badge:'SEGMENTADO', subTabs:[ { id:'control-panel', name:'Panel Segmentado', href:'/admin/control', icon: LayoutDashboard, badge:'6 ENTIDADES', description:'Artistas, Proveedores, Terapeutas, Flota, Afiliados y Tesoreria' } ] }.\n2. Reutilizar iconos ya importados (Sliders y LayoutDashboard ya estan en imports). No duplicar ninguna ruta existente.\n3. Confirmar que no crea canonicales alternos ni doorway: /admin/control es la unica URL.\n4. npx tsc --noEmit = 0."
    done_when = "MasterTab control visible y apuntando a /admin/control (unica URL), tsc = 0."
    validation = 'npx tsc --noEmit'
}

$tasks = @($t1, $t2, $t3, $t4, $t5, $t6, $t7)

Write-Output ("Inyectando Wave ADMIN-SEGMENTATION en " + $EndPoint + " ...")
foreach ($t in $tasks) {
    Invoke-InjectTask $t
}
Write-Output "Wave inyectada. Ejecutar: node .antigravity/omega.js next  (una tarea por sesion)."
# ═══════════════════════════════════════════════════════════════════════════════
# MANDATO SUPREMO DEL ARQUITECTO ANTIGRAVITY (S-CLASS v4.0)
# DOCTRINA: "NO CONSTRUYAS; COMPÓN"
# ═══════════════════════════════════════════════════════════════════════════════
#
# Obrero: Lee esto UNA VEZ. Tu trabajo NO es pensar la arquitectura. Tu trabajo
# es picar código a máxima velocidad siguiendo instrucciones atómicas.
#
# ═══════════════════════════════════════════════════════════════════════════════

## PROTOCOLO DE EJECUCIÓN (BUCLE INFINITO HASTA WAVE COMPLETADA)

```
1. Ejecuta: node .antigravity/omega.js next
2. Lee la tarea asignada (ID, título, action, engine_source, files)
3. ABRE el archivo citado en 'engine_source' y LEE sus exports/interfaces
4. Modifica/Crea EXACTAMENTE los archivos citados en 'files'
5. Tu código DEBE importar del motor real. PROHIBIDO hardcodear datos
6. Ejecuta: node .antigravity/omega.js complete <W0X-00Y>
7. Si falla (Exit Code ≠ 0), corrige y reintenta UNA vez
8. Vuelve al paso 1
9. Si el terminal dice "🏁 WAVE COMPLETADA", DETENTE
```

## REGLAS INMUTABLES (ROMPER = VETO ESTRATÉGICO)

1. **SPLIT 80/10/10** — 80% Artista, 10% EAR OS, 10% VIMUME. NUNCA alterar.
2. **Depósito Stripe**: 100 € (Price-Lock SHA-256). NUNCA alterar.
3. **Logística**: 1,50 €/km desde km 50. Hotel 120 € si >200km o fin ≥ 3AM.
4. **B2G**: Tope 14.250 € (Art. 118 LCSP). NUNCA superar.
5. **Estética OLED**: `#030305` fondo, `#ecb613` oro, `#FF2B44` rubí, `#00E5FF` cyan.
6. **Tipografía**: Syne (títulos/h1-h3), Inter (cuerpo), JetBrains Mono (números/KPIs).
7. **TypeScript**: `npx tsc --noEmit` → Exit Code 0. Cero `any` implícitos.
8. **Git**: NUNCA commitear archivos >1MB. Repo <50MB.

## SSOT DE IMPORTS (COPIAR DIRECTAMENTE)

```typescript
// PRICING
import { calculateSovereignQuote, BASE_SOLISTA, DEPOSITO_STRIPE } from '@/lib/pricing/sovereign-pricing';
import { verifyAndSignStripeSession } from '@/lib/pricing/price-lock-verifier';

// SPLIT & COMISIONES
import { computeSplit, SSOT_SPLIT, IMMUTABLE_DEPOSIT_EUR, computeLogisticsFee } from '@/lib/affiliate/affiliateCommissionEngine';

// DISPONIBILIDAD (ACID)
import { checkDateAvailability, lockDateAtomically } from '@/lib/availability/atomicDateLockEngine';

// ASTRA (IA VENDEDORA)
import { AstraConversationEngine } from '@/lib/astra/astra-conversation-engine';

// DEAL CLOSER
import { parseLeadIntent, orchestrateDealClosure } from '@/lib/orchestrators/deal-closer';

// GEO-ACÚSTICA
import { calculateAcousticSetup } from '@/lib/geo/geo-acoustic-radar';

// B2B
import { MultiServiceOrchestrator } from '@/lib/engines/multiServiceOrchestrator';

// B2G
import { /* tipos */ } from '@/lib/b2g-tender-engine';
import { /* tipos */ } from '@/lib/vimume/b2gArsenalTenderRadar';

// VIMUME
import { /* tipos */ } from '@/lib/vimume/vimumePatientEngine';
import { /* tipos */ } from '@/lib/vimume-mecenazgo-engine';

// GOBERNANZA
import { generateSplitJustification } from '@/lib/governance/splitJustificationEngine';

// WALLET
import { /* tipos */ } from '@/lib/aura-wallet';

// STRIKES
import { addStrike, MAX_STRIKES_BEFORE_BAN } from '@/lib/vendor/strikeSystem';

// AUDIO / VOZ
import { /* tipos */ } from '@/lib/audio/voiceStudioEngine';
import { /* tipos */ } from '@/lib/audio/sunoKillerEngine';

// PRISMA
import { prisma } from '@/lib/prisma';
```

## DISEÑO S-CLASS (CHEATSHEET)

```tsx
// Contenedor principal
<main className="min-h-screen bg-[#030305] text-zinc-100 font-sans p-6 sm:p-12 overflow-x-hidden relative">

// Glow OLED de fondo
<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />

// Título S-Class
<h1 className="text-4xl sm:text-5xl font-syne font-black tracking-tight text-white">

// Subtítulo sistema
<p className="text-[10px] font-mono text-[#ecb613] font-bold tracking-widest uppercase">

// Card KPI
<article className="bg-[#050508] border border-white/5 rounded-2xl p-6 backdrop-blur-md">

// Valor monetario
<span className="text-3xl font-mono font-bold text-[#ecb613]">

// Badge alerta
<span className="bg-[#FF2B44]/10 text-[#FF2B44] px-2 py-0.5 rounded-full text-xs font-mono">

// Botón primario
<button className="px-6 py-2.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-all font-mono text-xs uppercase tracking-wider font-bold">
```

## ARRANQUE

Ejecuta este comando en la terminal y no pares hasta que la WAVE esté completa:

```bash
node .antigravity/omega.js next
```

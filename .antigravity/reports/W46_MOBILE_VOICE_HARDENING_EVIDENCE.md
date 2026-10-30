# W46 · BLINDAJE DEL MOTOR DE VOZ EN MÓVIL — EVIDENCIA MÁQUINA

**Fecha**: 2026-10-30 · **HEAD de partida**: `71cba0789` (== `origin/main`)
**Origen**: queja del CEO — *"en mi móvil no hay sonido"* + purga de atajos locales (Alaquàs).
**Veredicto**: el saneamiento de copy del commit `71cba0789` era correcto; su **blindaje de audio NO**.
Tres defectos reales, corregidos y medidos aquí.

---

## 1. Hallazgo forense (lo que el informe anterior daba por hecho y no lo era)

| # | Defecto verificado en disco | Evidencia | Consecuencia en móvil |
|---|---|---|---|
| 1 | El "heartbeat continuo en cada frase" era **código muerto**: `if (synth.paused) synth.resume()` ejecutado síncronamente justo después de `synth.speak()` | `naturalVoice.ts` (antes: l.101-104) | `paused` es `false` en ese instante → el motor nunca se reanuda → silencio irrecuperable |
| 2 | **Sin watchdog en el bucle de frases**: `await` colgado esperando un `onend` que iOS no dispara | `naturalVoice.ts` (antes: l.90-105) | La conversación se congela para siempre; el asistente "se queda" |
| 3 | **Gestión del gesto roto**: `speak()` hace `await fetch('/api/voice/synthesize')` (l.470) y sólo **después** crea `new Audio()` y llama `play()` (l.491-517) | `OmniAgentConsoleModal.tsx` | iOS Safari / Chrome Android exigen activación de usuario en el mismo tick → `play()` descartado en silencio |
| 4 | `fallbackToBrowser` sin guardia de arranque: si `onstart` no llega, el estado queda "reproduciendo" indefinidamente | `OmniAgentConsoleModal.tsx` (antes: l.420-441) | Fachada de UI: el botón late pero no suena nada |

---

## 2. Corrección aplicada (rutas y mecanismos)

**`src/lib/voice/naturalVoice.ts`**
- `primeSpeechSynthesis()` (**nuevo, exportado**): locución de activación con `volume = 0` para desbloquear el motor dentro del gesto.
- `waitForVoices()`: espera real con `onvoiceschanged` + sondeo cada 150 ms, techo `VOICES_WAIT_MS = 1200` (antes 250 ms fijos, insuficiente en WebKit).
- `speakSentence()`: **tres guardias** —
  * `UTTERANCE_START_GUARD_MS = 2500` (si no arranca, `cancel()` y se suelta el turno),
  * latido real `SPEECH_HEARTBEAT_MS = 600` (`setInterval` → `resume()` si `paused`),
  * techo duro `max(6000, len × 110 ms)`; **si sigue hablando no se cancela** (no se trunca la locución).

**`src/components/agents/OmniAgentConsoleModal.tsx`**
- `buildSilentWavUrl()`: WAV silencioso generado en código (PCM 8 kHz, 50 ms, `DataView`) — **sin base64 opaco ni binarios en el repo**.
- `primeMobileAudio()`: `primeSpeechSynthesis()` + `play()` del WAV silencioso **síncrono en el gesto**; devuelve el elemento ya desbloqueado.
- Llamado en `sendMessage()` (chips / Enter / botón) y en el botón 🔊 de cada mensaje.
- Audio cloud reutiliza **el mismo elemento desbloqueado** (`primedAudioRef`), no uno nuevo.
- `fallbackToBrowser()`: latido + guardia de arranque de 2500 ms que declara `browser-blocked` en la telemetría `[lastPlaybackSource]` en lugar de fingir reproducción.

**`src/components/chat/AIConciergeDock.tsx`** — `primeSpeechSynthesis()` dentro del `onClick` antes del `await speakNatural()`.

**`scripts/verify_voice_watchdog.ts`** (nuevo) · **`package.json`** (`verify:voice` + dentro de `gate:prepush`) · **`eslint.config.mjs`** (bloque real para `scripts/**/*.ts`: antes `eslint --no-ignore` devolvía "File ignored because no matching configuration").

---

## 3. Verificación ejecutable (`npm run verify:voice`)

Simula motores móviles hostiles con un `speechSynthesis` falso. **Exit 0 · 5/5 [OK]**:

```
✅ A SILENT_START libera el turno · 2619 ms · cancel=2 (cuelgue erradicado)
✅ B NO_END corta por techo duro · 6106 ms · cancel=1 (sin truncar: sólo el inicial)
✅ C NORMAL locuta todas las frases · 3 frases · 488 ms
✅ D PAUSED_MID latido reanuda · resume=1 · paused=false
✅ E PRIME sin motor no lanza · return limpio
RESUMEN: 5/5 [OK] · motor de voz
```

Prueba negativa del verificador: si `speakSentence` se revierte a `utterance.onend = resolve` sin guardias, el caso A no resuelve y el proceso aborta con `CUELGUE: speakNatural no resolvió` → Exit 1.

---

## 4. Validaciones (Exit Code visto, no supuesto)

| Comando | Resultado |
|---|---|
| `node ./node_modules/typescript/bin/tsc --noEmit` | **Exit 0** |
| `eslint src/lib/voice/naturalVoice.ts src/components/agents/OmniAgentConsoleModal.tsx src/components/chat/AIConciergeDock.tsx --max-warnings=0` | **Exit 0** |
| `eslint --no-ignore --max-warnings=0 --rule '{"prefer-const":"error"}' scripts/verify_voice_watchdog.ts` | **Exit 0** (con reglas reales, no falso verde) |
| `node ./node_modules/tsx/dist/cli.mjs scripts/verify_voice_watchdog.ts` | **Exit 0** · 5/5 |
| `node scripts/audit_ci_gate_wiring.cjs` | **Exit 0** · 4 jobs · 2 gates bloqueantes · 0 fugas |
| `node scripts/audit_admin_control_forensics.cjs --strict` | **Exit 0** · 0 fachadas |

---

## 5. Límites declarados (sin maquillaje)

- **No hay verificación en dispositivo real.** Este entorno no tiene iOS/Android ni navegador con salida de audio. Lo medido es determinista (cuelgues, latido, arranque, número de locuciones); **la audibilidad final en el iPhone del CEO es SOSPECHOSO hasta prueba humana**. Indicador honesto: la telemetría `[browser-blocked]` aparece en la cabecera del modal si el motor fue silenciado.
- `next.config.ts:37` sigue con `ignoreBuildErrors: true` (W46_T03 pendiente): el riesgo de tipo se tapa en CI por delante, no en el build de Docker.
- Ω-DIAMANTE: **6/20** (Núcleo 1,2,3,6,7,8). ❌ Sin evidencia máquina: 9, 10, 11, 12, 13, 14, 15, 19, 20 (ajenos a este bloque).

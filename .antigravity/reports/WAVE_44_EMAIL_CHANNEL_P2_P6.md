# WAVE 44 · CANAL DE EMAIL — DECISIONES P2/P3/P4/P6 (CEO, 2026-10-27)

**Estado: canal APAGADO por diseño.** `channels.email.enabled: false` sigue en `false`
porque la readiness real da **5/12 PASS**. No es una promesa: es la salida de un
comando que se puede volver a ejecutar.

Herramientas (viven en `D:\HARVEY_HQ\tools\`, fuera del repo para no inflarlo):

| Comando | Qué demuestra | Exit real hoy |
|---|---|---|
| `python tools/ear_os_suppression.py --write` | Siembra `do_not_contact` desde el marketplace (13.558 registros) | **0** · 9.215 entradas |
| `python tools/selftest_email_channel.py` | 19 comprobaciones P2/P3/P4/P6 sobre la config real | **0** · 19/19 |
| `python tools/ear_os_campaign_guard.py --check edwinagudelomariachi@gmail.com --campaign test-edwin` | La prueba a Edwin **sí** puede salir | **0** |
| `... --check contratacion@ayuntamiento.example.es --campaign test-edwin` | Veto B2G por destinatario | **2** · `B2G_EMAIL_VETADO` |
| `... --check otro@example.com --campaign test-edwin` | La prueba sólo escribe a su lista | **2** · `NOT_IN_TEST_ALLOWLIST` |
| `python tools/check_email_readiness.py` | Cerrojos de encendido | **1** · CANAL APAGADO 5/12 |
| `python -m harvey warmup` | Deliverability del subdominio (DNS real) | **1** · NOT READY (MX, SPF, DMARC) |

---

## Decisiones aplicadas (fichero `D:\HARVEY_HQ\harvey.local.yaml`)

### P2 · Dominio y buzón
- Buzón de envío: `hola@alianzas.productoraear.com` (**subdominio dedicado**; nunca el
  dominio que factura). Parte local provisional hasta crear el usuario en Workspace.
- `provider: gmail` (Workspace vía API) + `link_domains: ["productoraear.com"]`.
- `warmup`: `start_date: ""` (sin rampa todavía), `min_days: 14`, `start_sends: 5`,
  `daily_increase: 3`. Un dominio nuevo sin rampa es un dominio quemado en tres días.
- **Sigue apagado**: DNS del subdominio en `NXDOMAIN` (SPF, DKIM, DMARC y MX no existen),
  `GMAIL_CLIENT_ID/SECRET` vacíos y `data/gmail_token.json` inexistente.

### P3 · Primera campaña (una sola)
- `compliance/campaigns.yaml`: sólo `test-edwin` encendida, con **un** destinatario:
  `edwinagudelomariachi@gmail.com`. Cualquier otra dirección se bloquea con
  `NOT_IN_TEST_ALLOWLIST`.
- **B2G por email VETADO** dos veces: por identificador de campaña (`b2g*`,
  `licitacion*`, `placsp*`…) y por destinatario (sufijos de
  `compliance/public_sector_domains.txt` + patrones de etiqueta `ayto*`,
  `ayuntamiento*`, `diputacion*`, `consell*`, `cabildo*`, `mancomunidad*`,
  `consorcio*`, `gobierno*`, `junta*`). La licitación pública se presenta en
  **PLACSP**; no se envía por correo a un funcionario.
- Los tres segmentos (fincas / residencias / proveedores) quedan **declarados y
  apagados**: P3 manda una campaña, y P4 (lista blanca de partners) espera criterio
  del CEO.

### P4 · Semilla y supresión
- `do_not_contact` sembrado con **9.215 entradas** (5.065 dominios + 4.139 direcciones +
  12 sufijos de sector público). Fuente: `public/data/providers/*.json` (13.558
  registros, 4.279 con email, 5.757 con web). Regenerable e idempotente (segunda
  ejecución: `config_changed: false`).
- Correo gratuito **nunca** entra como dominio (`gmail.com` bloquearía media España):
  sólo la dirección concreta. El dominio propio no se autobloquea (buzón de bajas).
- **Semilla medida, sin maquillaje**: `src/data/sourcing/vimume_senior_leads.json` tiene
  150 residencias/centros de día y **0 con email**; 3.537 registros del marketplace sí
  tienen email verificado, pero son *partners* → van al DNC por P4. Resultado honesto:
  **hoy no hay semilla enviable por correo**; sólo la prueba a Edwin. Enriquecer el
  correo de esas 150 residencias es el trabajo real de mañana.

### P6 · Dirección postal y bajas
- `postal_address`: `Productora EAR Audiovisual S.L. — Calle La Fuente 12, 45930
  Méntrida, Toledo (España)` (idéntica al aviso legal y al JSON-LD de `/b2g` y
  `/licitaciones`).
- `opt_out_line`: `Si no te interesa, responde "baja" y no volveré a escribirte.`
  El buzón de bajas es `productoraear@gmail.com`; **no puede ir dentro de la línea**
  (el validador de Harvey prohíbe direcciones de correo ahí: la baja debe ser responder).
  Se resuelve con regla de reenvío/etiqueta en Workspace — operativa, no código.

---

## Hallazgos forenses de esta pasada

1. **`productoraear.com` no tiene SPF, ni DMARC, ni MX, ni DKIM** (DNS en
   `ns1.dns-parking.com`, A → `82.29.179.172`). Es el dominio que factura y el que firma
   el correo transaccional: sin DMARC, Gmail/Yahoo tratan el correo masivo como
   sospechoso. Mañana el DNS se arregla **en el raíz y en el subdominio**.
2. **`gov` no es una entrada válida de DNC** para Harvey (el normalizador exige punto).
   El generador ahora valida cada entrada con `harvey.gate.do_not_contact_entry` y
   reporta lo descartado: `["gov"]`. Sin esto, `load_config()` reventaba y **todo** el
   canal quedaba sin arrancar.
3. **Emails basura en la fuente** (`mailto:`, `%20`): se decodifican antes de sembrar.
   Quedan restos de scraping (`04.iinna@gmail.com`, `-villaxarahiz@…`) que sólo
   sobre-bloquean: el error seguro.
4. **P4 tenía una contradicción** (vender a partners vs. vetar partners). Se resolvió con
   el criterio más duro: el marketplace existente **nunca** recibe venta de sí mismo; la
   semilla son prospectos **nuevos**, y hoy no hay ninguno con email.

---

## Lo que falta para encender (mañana), con su comando

1. Crear `alianzas.productoraear.com` en Workspace y su DNS: MX, SPF, DKIM
   (`google._domainkey`), DMARC (`_dmarc`, `p=none` → `p=quarantine`).
   Verificación: `python tools/check_email_readiness.py` (checks 08–11).
2. Arreglar el **raíz**: SPF, DKIM y DMARC de `productoraear.com` (correo transaccional).
   Verificación: `python -m harvey warmup`.
3. Google Cloud → Gmail API → `GMAIL_CLIENT_ID/SECRET` en `.env` → `harvey gmail auth`
   → `data/gmail_token.json` con `refresh_token`. Verificación: checks 03–04.
4. Fijar `warmup.start_date` al día 1 de calentamiento (check 12) y conectar TrulyInbox
   (`harvey trulyinbox connect`) para leer la tasa de bandeja real.
5. Criterio del CEO sobre P4: lista blanca de partners (si hay alguno) y enriquecimiento
   de email de las 150 residencias. Sólo entonces `fincas` / `residencias` / `proveedores`.
6. Con todo en verde: `channels.email.enabled: true` **y** volver a correr
   `selftest_email_channel.py` + `ear_os_campaign_guard.py --check` antes del primer envío.

---

## Premortem

- **Si se enciende hoy**: el subdominio no existe en DNS → los correos salen sin
  autenticar y el primer envío masivo quema la reputación de `productoraear.com`.
  Detección antes que el cliente: `check_email_readiness.py` (hoy 5/12) y
  `harvey warmup` (NOT READY). Ambos ya devuelven exit 1.
- **Si el DNC se corrompe**: `live_do_not_contact` de Harvey conserva la última lista
  buena; el generador es idempotente y el bloque está delimitado por marcadores, así que
  un fallo de regenerado no deja la lista vacía.
- **Riesgo de P4 mañana**: meter un partner en campaña por error cuesta una relación;
  no meterlo cuesta un email. El DNC gana siempre (`DO_NOT_CONTACT` antes que cualquier
  estado de campaña).

# 🏛️ EAR OS v7.0 — MANIFIESTO Y MANUAL MAESTRO S-CLASS (BIBLIA OPERATIVA & ARQUITECTURA)
*Documento Unificado de Gobernanza, Legalidad B2G, Neuro-acústica VIMUME, Ledger SHA-256 e Infraestructura Bare-Metal*

---

## 📋 ÍNDICE ESTRUCTURAL BIT A BIT

1. **Gobernanza y Reglas Inmutables de Negocio (SSOT)**
   - 1.1. Split Soberano 80 / 10 / 10 (Artistas, EAR OS, VIMUME)
   - 1.2. Depósito Inmutable de 100,00 € en Stripe (Price-Lock SHA-256)
   - 1.3. Matriz de Tarifas y Logística S-Class (Méntrida Hub & Origen Proveedor)
   - 1.4. Rider Acústico y Niveles dBA (Ley 37/2003 del Ruido)
   - 1.5. Límite Contratación Pública B2G (Art. 118 LCSP - 14.250,00 €)

2. **Arquitectura de Software & Motor Ledger SHA-256**
   - 2.1. Inmutabilidad Financiera: `src/lib/vendor/ledgerEngine.ts`
   - 2.2. Flujo de Datos Full-Stack (Next.js 14/15 App Router Standalone)
   - 2.3. Intercepción y Enrutamiento Edge para Fincas Afiliadas
   - 2.4. Seguridad Perimetral, Rate Limiting y Zod Schemas

3. **Impacto Social VIMUME & Neuro-acústica 40 Hz**
   - 3.1. Fundamentación Clínica (Estimulación Gamma 40 Hz en Residencias Senior)
   - 3.2. Certificación RSC/ESG y Deducción Fiscal Ley 49/2002 (Modelo 182 AEAT)
   - 3.3. Retorno Social de la Inversión (SROI 4.85x)

4. **Motor de Licitaciones B2G & Expedientes Automáticos**
   - 4.1. Licitación Menor B2G (< 14.250,00 €) en `src/lib/b2g-tender-engine.ts`
   - 4.2. Generación de Pliegos Técnicos y Facturación Electrónica FACe

5. **Infraestructura Hostinger VPS, Coolify & Magia Negra de Rendimiento**
   - 5.1. Despliegue Standalone en VPS KVM 1 (`82.29.179.172`)
   - 5.2. Memoria Virtual Swap 4GB (Prevención OOM)
   - 5.3. Optimización de Red TCP BBR y Compresión Brotli
   - 5.4. Automatizaciones con n8n y Webhooks GitHub

---

## 1. GOBERNANZA Y REGLAS INMUTABLES DE NEGOCIO (SSOT)

### 1.1. Split Soberano 80 / 10 / 10
Cada transacción procesada en EAR OS se divide matemáticamente en tres bloques inmutables:
* **80% Artista / Proveedor Ejecutor:** Retribución neta inmediata por su actuación o servicio.
* **10% Infraestructura EAR OS:** Mantenimiento de pasarela Stripe SHA-256, telemetría y CDN.
* **10% VIMUME / Impacto Social:** Financiación directa de neuro-musicoterapia 40 Hz en centros de mayores.

### 1.2. Depósito Inmutable de 100,00 € (Stripe Price-Lock)
Para bloquear fecha y congelar tarifa, el cliente efectúa un depósito de 100,00 €. Este pago genera un hash SHA-256 único en la base de datos inmutable.

### 1.3. Matriz de Tarifas y Logística
* **Tarifa Base Solista (Edwin Agudelo):** 350,00 €.
* **Kilometraje:** 1,50 €/km a partir del km 50 desde la base del proveedor (Méntrida para Edwin Agudelo).
* **Alojamiento:** +120,00 € suplemento si la hora fin es >= 3:00 AM o la distancia excede los 200 km.

---

## 2. ARQUITECTURA DE SOFTWARE & MOTOR LEDGER SHA-256

### 2.1. Motor Ledger Inmutable
Ubicación: `src/lib/vendor/ledgerEngine.ts`
Garantiza la integridad de cada transacción mediante encadenamiento cryptográfico de bloques (Genesis Block -> Block N -> Block N+1).

---

## 3. INFRAESTRUCTURA VPS & OPERACIONAL

### 3.1. Datos del Servidor
* **IP Pública:** `82.29.179.172`
* **Dominio Principal:** `https://productoraear.com`
* **Gestor de Despliegue:** Coolify v4 (Docker Standalone)

---
*Manifiesto compilado autónomamente por Antigravity OMEGA v7.0 — Estado de Ejecución: Activo.*

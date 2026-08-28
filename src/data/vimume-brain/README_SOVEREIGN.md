# 🛡️ EAR OS GOLD - DOCUMENTACIÓN DE SOBERANÍA (GÉNESIS V2)

Este documento detalla la estructura vital necesaria para el funcionamiento del núcleo **S-Class**. Cualquier alteración manual en la consola de Firebase debe respetar estos esquemas para evitar el colapso de los paneles de mando.

## 📊 ESTRUCTURA DE FIRESTORE (DNA OPERATIVO)

### 1. `ear_orders` - Registro Financiero
Controla el flujo de caja en tiempo real del **Financial Panel**.
- **`id`**: (Auto-gen) Hash único de transacción.
- **`amount`**: (number) Valor de la transacción (ej: 1500).
- **`status`**: (string) `PAID` | `PENDING` | `FAILED`.
- **`customer`**: (string) Nombre de la entidad o cliente.
- **`concept`**: (string) Descripción del servicio/producto.
- **`createdAt`**: (timestamp) Marca temporal de la operación.

### 2. `ear_vendors` - Motor Vampire (Absorción)
Controla la base de datos de proveedores y el barrido de datos.
- **`name`**: (string) Nombre del proveedor.
- **`category`**: (string) Rubro (VIMUME, Catering, Producción, etc).
- **`status`**: (string) `VERIFIED` | `BLACK_LIST` | `NEURAL_SYNC`.
- **`id`**: (Auto-gen) Identificador VMP-Alpha.

### 3. `ear_leads` - Tripwire Engine
Captura de potenciales clientes y disparador de notificaciones.
- **`name`**: (string) Nombre del contacto.
- **`email`**: (string) Correo de contacto.
- **`status`**: (string) `NEW` | `CONTACTED` | `VAMPIRED`.

### 4. `neural_memories` - Astra Neural Brain
Almacena el historial de consultas al cerebro Gemini.
- **`prompt`**: (string) Consulta realizada.
- **`response`**: (string) Respuesta generada por la IA.
- **`timestamp`**: (timestamp) Tiempo de sinopsis.

---

## 🚀 SENSORES & TELEMETRÍA

| Sensor | ID / Protocolo | Ubicación |
| :--- | :--- | :--- |
| **Google Analytics** | `G-CHYFK3G8DN` | `layout.tsx` |
| **Microsoft Clarity** | `process.env.NEXT_PUBLIC_CLARITY_ID` | `layout.tsx` |
| **GSC Verification** | `GSC_VERIFICATION_GENESIS_S_CLASS` | `layout.tsx` (Hardcoded) |

---

## 🛡️ ALPHA GOD MODE (ACCÉSOS)
- **Email Root**: `productoraear@gmail.com`
- **Privilegios**: Bypass total de protecciones en `AuthContext.tsx`.
- **Destino**: `/dashboard` (EarCommandCenter).

**REGLA DE ORO:** Mantener el rigor estético **Aura Onyx** (#050505 / #d4af37) en cada nueva integración.

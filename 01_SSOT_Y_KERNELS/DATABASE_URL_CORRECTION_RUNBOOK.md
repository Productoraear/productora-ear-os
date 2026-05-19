---
tags:
  - runbook
  - database
  - vercel
  - supabase
  - hotfix
---
# 🏥 RUNBOOK: SURGICAL DATABASE_URL CORRECTION (ZERO-DOWNTIME RECUPERATION)
**Nivel**: S-CLASS ENTERPRISE
**Identificador**: RBK-DB-001
**Efecto**: Actualización y restablecimiento de credenciales de base de datos en Vercel sin interrumpir otros microservicios.

---

## 🏛️ 1. ANTECEDENTES Y DIAGNÓSTICO
*   **Problema**: El endpoint de producción `/api/health` retorna un código HTTP 500 debido a un fallo de autenticación de contraseña (`password authentication failed for user "postgres"`) contra el pooler de Supabase en la región de Europa Occidental (`aws-0-eu-west-1.pooler.supabase.com`).
*   **Impacto**: Bloqueo transaccional absoluto. Los webhooks de Stripe no pueden escribir ni registrar comisiones en `CommissionLedger`, `AuraWallet` ni generar `Waybill` de logística.

---

## 🛠️ 2. FASE A - OBTENCIÓN SEGURA DE CREDENCIALES (SUPABASE)

1.  Inicia sesión en el **Dashboard oficial de Supabase**.
2.  Navega a tu proyecto: **`ocrjsvjmdeqovkfdqoql`**.
3.  Ve a **Project Settings** (icono de engranaje en la barra lateral izquierda) ➔ **Database**.
4.  Localiza la sección **Connection string** y selecciona la pestaña **URI** (asegúrate de marcar la opción de **Transaction Connection / Session** según requieras).
    *   *Nota*: El puerto del pooler de transacciones (pgbouncer) es **`6543`** y debe llevar el parámetro `?pgbouncer=true`.
5.  **Reset de Contraseña** (Si no se dispone de la clave actual):
    *   En la misma pestaña **Database**, busca la sección **Database Password**.
    *   Haz clic en **Reset Database Password**.
    *   **Contraseña S-Class Sugerida (Altamente Segura y Compatible)**:
        *   *Ejemplo*: Generar una clave alfanumérica sin caracteres especiales conflictivos de URL (evitar `#`, `?`, `@`, `/` en la clave para prevenir roturas en el parser del string de conexión).
        *   *Estructura recomendada*: `EarMasterGoldRecovery2026` (o similar, conteniendo mayúsculas, minúsculas y números).
    *   *Precaución*: Copia inmediatamente la nueva contraseña. Supabase no la volverá a mostrar en texto plano.

---

## 🚀 3. FASE B - INYECCIÓN SEGURO DE VARIABLES (VERCEL)

Para evitar desajustes en compilaciones o variables cruzadas, realiza la inyección de forma atómica:

### Método A: A través de Vercel CLI (Recomendado / Inmediato)
Ejecuta los siguientes comandos desde la terminal local en `C:\EAR_OS_V2`:

```powershell
# 1. Eliminar la variable obsoleta en Vercel Production
vercel env rm DATABASE_URL production --yes

# 2. Agregar el nuevo string de conexión (reemplaza 'NUEVA_CONTRASEÑA' con el valor real)
vercel env add DATABASE_URL production "postgresql://postgres.ocrjsvjmdeqovkfdqoql:NUEVA_CONTRASEÑA@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Método B: A través del Dashboard Web de Vercel
1.  Entra en [Vercel Dashboard](https://vercel.com) y selecciona el proyecto **`ear`**.
2.  Ve a la pestaña **Settings** ➔ **Environment Variables**.
3.  Busca la variable **`DATABASE_URL`**.
4.  Haz clic en el menú de tres puntos a la derecha y selecciona **Edit**.
5.  Actualiza el valor en el input de **Value** con el nuevo string de conexión.
6.  Asegúrate de marcar únicamente la casilla **Production** (y *Preview/Development* si deseas sincronizar entornos remotos de pruebas).
7.  Haz clic en **Save**.

---

## ♻️ 4. FASE C - REDEPLOY Y REDIRECCIÓN ATÓMICA

Las variables de entorno en Vercel son inmutables durante el ciclo de vida de un contenedor en ejecución. Para que el Edge asimile la nueva `DATABASE_URL`, es obligatorio forzar una nueva compilación en caliente:

```powershell
# Forzar una nueva compilación y despliegue directo a producción en Vercel
vercel --prod
```

*   *Criterio de éxito de compilación*: La consola de Vercel debe retornar `Status: Ready` con un código de salida `0` y la generación de las páginas estáticas.

---

## 🩺 5. FASE D - CIRCUITO DE VALIDACIÓN FINAL (SMOKE TEST)

Una vez completado el Redeploy, ejecuta las siguientes validaciones en orden estricto:

### Paso 1: Petición de Salud del Sistema (Health Check)
Ejecuta la llamada de salud en caliente:
```powershell
curl.exe -s https://ear-psi.vercel.app/api/health
```

*   **Comprobación de Éxito**: La respuesta debe retornar un HTTP **`200 OK`** con el JSON en este estado:
    ```json
    {
      "status": "healthy",
      "checks": {
        "postgres": "UP",
        "firebase": "UP",
        "stripe": "CONFIGURED",
        "gemini": "CONFIGURED"
      }
    }
    ```

### Paso 2: Validación del Ledger y Stripe en Producción
*   Procede a realizar una transacción de prueba o verifica la recepción de un webhook Connect a través del Stripe Dashboard enviando un evento de test (`account.updated`) a `https://ear-psi.vercel.app/api/payments/webhook`.
*   Comprueba en los logs del Vercel Runtime que el procesador ACID complete la operación con código de salida exitoso.

---

## 🚨 6. PROCEDIMIENTO DE ROLLBACK (EN CASO DE FALLO LOGÍSTICO)
Si tras actualizar la clave, Prisma arroja errores de pool o timeouts:
1.  Verifica que el puerto sea **`6543`** (Session/Transaction pooler) y no `5432` (Direct connection, bloqueado por límites de IP en serverless).
2.  Reversa la variable en Vercel al valor inicial histórico reinstalando la contraseña anterior o re-generándola en Supabase.
3.  Ejecuta `vercel rollback` al identificador del deploy estable anterior (`ear-3hd2brgsd...`).

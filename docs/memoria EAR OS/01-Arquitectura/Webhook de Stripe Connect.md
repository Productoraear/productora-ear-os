# 💳 Webhook de Stripe Connect - Flujo de Identidad y Transacciones

Esta nota detalla el diseño de ingeniería del procesador transaccional en `/api/payments/webhook/route.ts` para resolver identidades de clientes sin azar y consolidar el split monetario en una única transacción ACID.

---

## ⚡ Flujo de Control Determinista

```mermaid
graph TD
    Start[Checkout Completed Event] --> Idempotency{¿Existe Ledger con esta Session ID?}
    Idempotency -->|SÍ| Skip[Retornar 200 - SKIPPED_DUPLICATE]
    Idempotency -->|NO| MatchClientId{¿Tiene clientId en Metadata?}
    
    MatchClientId -->|SÍ| FindUser[Buscar User por ID en Postgres]
    MatchClientId -->|NO| MatchEmail{¿Tiene Email en checkout?}
    
    FindUser -->|Existe| UseId[Usar userId]
    FindUser -->|No Existe| MatchEmail
    
    MatchEmail -->|SÍ| FindEmail[Buscar User por Email]
    MatchEmail -->|NO| Throw[Abortar con Error - Excepción de Invitado]
    
    FindEmail -->|Existe| UseId
    FindEmail -->|No Existe| CreateUser[Crear User Temporal con Rol CLIENT y Onboarding] --> UseId
    
    UseId --> ACID[Iniciar prisma.$transaction ACID]
    ACID --> Ledger[Crear CommissionLedger]
    ACID --> Wallet[Sumar balance en AuraWallet]
    ACID --> Waybill[Despachar Waybill en estado QUEUED]
    ACID --> Commit[Confirmar Transacción]
```

---

## 🔒 Mecanismos de Seguridad y Resiliencia

### 1. Cero Azar (`findFirst()`)
*   Se eliminó por completo el comportamiento aleatorio de búsqueda ciega.
*   Si no hay sesión autenticada (`clientId` nulo), se utiliza el correo de facturación suministrado en la pasarela de Stripe Connect para conciliar de forma auditable.
*   En caso de que un invitado no esté registrado en el sistema local, se crea automáticamente un usuario temporal asignando su correo real y marcando su rol de forma explícita (`CLIENT`).

### 2. Idempotencia en Borde Contable
*   Para evitar la duplicación de ingresos o cobros por reintentos de Stripe, el identificador `STRIPE-${session.id}` se registra bajo restricción `UNIQUE` en la columna `reference` de `CommissionLedger`.
*   Cualquier petición concurrente o duplicada es detenida en el primer gate mediante consulta indexada ultrarrápida, saliendo con código exitoso `200` y log de advertencia en servidor.

---

## 🔗 Notas Relacionadas
*   [[Esquema General]] - Flujo global de datos.
*   [[Runbook de Rollback]] - Procedimiento de reversión ante incidentes de cobro.

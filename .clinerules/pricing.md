---
paths:
  - "src/features/finance/**"
  - "src/lib/pricing/**"
  - "src/app/api/stripe/**"
---
# MOTOR DE PRICING Y STRIPE
- Solista Edwin Agudelo: 350 € base inmutable.
- Multiplicadores: Kilometraje (0,35 €/km + peajes) + Músicos extra + Equipamiento S-Class (Bose F1, Shure).
- Split: 80% Proveedor / 10% EAR OS / 10% VIMUME.
- Depósito reembolsable: 100 € con Price-Lock SHA-256 en Stripe Checkout.
- Webhooks: Validación estricta HMAC SHA-256 sobre rawBody.

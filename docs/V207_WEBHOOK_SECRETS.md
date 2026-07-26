# V207: STRIPE_WEBHOOK_SECRET & Vercel
1. Entrar a Stripe Dashboard -> Developers -> Webhooks.
2. Añadir Endpoint: `https://ear-psi.vercel.app/api/payments/webhook`
3. Escuchar eventos: `account.updated`, `checkout.session.completed`.
4. Copiar Signing Secret (empieza por `whsec_...`).
5. Entrar a Vercel Dashboard -> Settings -> Environment Variables.
6. Añadir `STRIPE_WEBHOOK_SECRET` con el valor copiado.
7. Redesplegar en Vercel sin caché.
8. Ejecutar transacción B2C real de 1€ a un perfil interno y comprobar actualización de estado a `isVerified: true` en PostgreSQL remoto y balance en el AuraWallet.

aso 1: Finalizar el Deploy

Espera a que la terminal termine. Si te pregunta de nuevo por onNewVimumeLeadNotify, puedes decirle que No (para mantenerla) o simplemente dejar que termine las demás. Una vez veas el mensaje de éxito, el backend ya "sabe" calcular comisiones.



Paso 2: Crear tu Perfil de Afiliado (Manual en Firestore)

Entra a tu Firebase Console.

Ve a Firestore Database.

Busca (o crea si no existe) la colección affiliates.

Haz clic en "Añadir documento".

ID del documento: TEST\_EDWIN\_2026

userId: Busca en la pestaña Authentication tu UID (el que usas para loguearte en la app) y pégalo aquí.

code: TEST2026 (Este es tu cupón).

role: PARTNER

status: ACTIVE

commissionRate: 10 (significa 10%).

totalEarned: 0 (número).

totalPaid: 0 (número).

createdAt: Selecciona tipo Timestamp y pon la fecha de hoy.

Paso 3: La Prueba de Fuego (Flujo de Usuario)

Limpiar la sesión: Abre una ventana de Incógnito en tu navegador.

Activar el Referido: Entra a la siguiente URL:

http://localhost:5173/vimume?ref=TEST2026

Verificar LocalStorage:

Pulsa F12 -> Pestaña Application -> Local Storage.

Debe aparecer una clave ear\_referral\_code con el valor TEST2026. Esto confirma que la web "capturó" al afiliado.

Hacer la Donación:

En la página de VIMUME, dale a DONAR.

Selecciona 1€ (es el mínimo para que Stripe no de error).

Procesa el pago con tarjeta.

Confirmación: Al llegar a la 

SuccessPage

, el sistema registrará internamente el evento order\_complete.

Paso 4: Verificación de Datos (Auditoría)

Ahora comprueba que el "cerebro" de EAR haya hecho sus cálculos:



En ear\_orders: Busca la última orden. Debe tener un campo referralCode: "TEST2026".

En referrals: Se habrá creado un documento automático con commissionAmount: 0.1 y estado PENDING.

En ear\_leads / WorkItems: Verás una nueva tarea llamada \[COMISIÓN] Pendiente por aprobar: TEST2026. Esto avisa a tu equipo de operaciones.

En el Dashboard de Afiliado: Entra a /dashboard con tu usuario y ve a la sección de Comisiones. Debería aparecer: "Total ganado: 0.10€ (Pendiente)".

Paso 5: Aprobar desde el Command Center

Ve a tu EarCommandCenter (/dashboard como admin).

Ve a la pestaña DESPACHO o AFILIADOS.

Busca la comisión de 0.10€ y dale a Aprobar.

Resultado: El estado en Firestore cambiará a APPROVED y el totalEarned de tu perfil de afiliado se actualizará.

🤖 ¿Qué pasa con las Automatizaciones de la FASE 5?

Como acabas de desplegar las funciones de la Fase 5:



XP/Loyalty: Al completar el pago de 1€, verás que en la colección ear\_loyalty\_points ahora tienes 10 puntos XP (1€ x 10).

Abandono: Si entras al checkout y cierras la pestaña sin pagar, en 1 hora el sistema te enviará automáticamente un email de recuperación (verificable en la colección ear\_email\_queue).

Dime cuando veas ese primer 0.10€ en tu dashboard y lanzamos el Test A/B de VIMUME para empezar a optimizar de verdad. 🚀






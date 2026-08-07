# 🔒 EAR OS — HIGH RISK ACTIONS GATE

> **Human-in-the-Loop:** Protocolo de seguridad que prohíbe al sistema RAG ejecutar acciones destructivas o legalmente vinculantes sin aprobación humana explícita.

## 1. Acciones de Alto Riesgo Bloqueadas
El RAG y la automatización NO pueden realizar de forma autónoma:
1. Emisión de reembolsos en Stripe.
2. Cancelación unilateral de un contrato firmado.
3. Asignación de un evento a un sustituto sin confirmación del operador de Fleet OS.
4. Alteración de precios base en la base de datos (Prisma).

## 2. Flujo de Aprobación (Escalado)
Si el usuario solicita una acción de alto riesgo (ej. *"Quiero cancelar mi reserva y que me devuelvan el dinero"*), el sistema responde:
*"He registrado tu solicitud de cancelación. Por razones de seguridad y para procesar tu reembolso correctamente, un agente de Productora EAR la revisará y te contactará en menos de 2 horas."* -> **Trigger P0 Telegram Alert**.

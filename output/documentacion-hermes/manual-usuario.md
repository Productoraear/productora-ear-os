# 🕊️ Manual de Usuario Clínico y Familiar — Hermes Tracker OT (S-Class Tutorial)

Este manual ha sido diseñado bajo los estándares de máxima excelencia editorial de Silicon Valley para servir como tutor interactivo del sistema **Hermes Tracker OT** de **VIMUME / EAR OS** en `productoraear.com`. Este documento capacita a terapeutas ocupacionales, geriatras, directores de centro y familiares autorizados para el control y estimulación neuro-acústica Gamma de 40Hz del deterioro cognitivo (Silver Economy).

---

## 🏛️ 1. INTRODUCCIÓN Y LA FILOSOFÍA DEL COLIBRÍ

El diseño de **Hermes Tracker OT** está inspirado en la **Fábula del Colibrí**: la idea de que cada pequeña acción, cada Hz emitido y cada registro de observación clínica es un grano de arena crítico para preservar la soberanía cognitiva de nuestros mayores frente al avance del Alzheimer.

Este software no es una simple base de datos; es un **ecosistema de estimulación e ingestión de telemetría médica en tiempo real**. El sistema implementa:
* **Estimulación Sónica Gamma (40Hz)** pura y modulada para favorecer la sincronía neuronal.
* **Consentimiento Híbrido Multimodal** que valida la firma familiar y la clave clínica en cada sesión.
* **Gobernanza del Dato (RGPD)** garantizando que el expediente no sea vulnerable ni expuesto.

---

## 🔑 2. ACCESO SEGURO Y EL PASO DE DOBLE FACTOR (MFA)

Para entrar a las zonas de control y telemetría de Hermes, el profesional debe completar un flujo de ingreso de **dos pasos**:

```
[Credencial Clínica] ➔ [Paso 1: Identificación de Red] ➔ [Paso 2: Código MFA 4-Dígitos (Demo: 7777)] ➔ [Acceso Otorgado]
```

### Flujo de Acceso Paso a Paso:
1. **Acceso al Portal Público**: Diríjase a `/vimume/hermes`. Aquí podrá experimentar de forma pública el simulador de 40Hz y leer la introducción mitológica.
2. **Petición del Dashboard**: Haga clic en **Acceso Profesional** o acceda directamente a `/vimume/hermes/dashboard`.
3. **Paso 1 - Identificación**: Introduzca su correo registrado (ej: `edwin.agudelo@productoraear.com`). El sistema valida que su usuario posea privilegios en la bóveda de terapeutas.
4. **Paso 2 - Doble Factor (MFA)**: El sistema generará una alerta de segundo nivel solicitando un código pin de 4 dígitos.
   * *Código de Demostración y Prueba*: Use `7777` o `1234` para verificar el flujo de simulación clínica en caliente.
   * *Aviso de Seguridad*: El ingreso de códigos incorrectos genera de forma inmutable un registro en la bóveda de logs (`SECURITY_VIOLATION`), bloqueando el panel tras tres intentos.

---

## 🏥 3. MULTI-CENTRO Y GEOLOCALIZACIÓN CLÍNICA

El ecosistema de VIMUME opera en un modelo multinacional de multi-tenencia desde el primer segundo. La interfaz adapta dinámicamente sus métricas y listados basándose en el **Centro Clínico Activo**:

### Centros Activos del Ecosistema:
* **Navalcarnero (ES)**: Centro piloto piloto para España.
* **Madrid HQ (ES)**: Sede central logística y de telemetría principal.
* **Barcelona (ES)**: Unidad de musicoterapia aplicada avanzada.
* **Valencia (ES)**: Unidad de estimulación motora y cognitiva.
* **CDMX Norte (MX)**: Centro líder para la Silver Economy en América Latina.

### Cambio y Restricciones de Contexto:
Al entrar al dashboard, su barra de estado superior mostrará la **📍 Ubicación Activa** y su **Rol Asignado**.
* Si usted es un **Terapeuta** o **Colaborador Clínico**, solo visualizará a los pacientes asignados a su centro geográfico de adscripción.
* El sistema bloquea de forma reactiva cualquier intento de alteración del centro en la base de datos si no coincide con su firma criptográfica.

---

## 🧪 4. LA INTERVENCIÓN CLÍNICA Y EL CONSENTIMIENTO HÍBRIDO

El registro de una nueva sesión de estimulación neuro-acústica es una acción estrictamente regulada. No se permite la ingesta de telemetría sin la firma y verificación doble del consentimiento:

```
[Iniciar Sesión] ➔ [Seleccionar Paciente Seed] ➔ [Definir Objetivo Clínico] ➔ [Check Consentimiento Familiar] ➔ [PIN Doble Verificación]
```

### Ejecución de una Sesión Paso a Paso:
1. **Selección del Paciente**: En la pestaña **Pacientes & Sesiones**, elija un expediente activo (ej: el paciente cero *Manuel Agudelo*, 78 años, Alzheimer Moderado GDS 4).
2. **Click en "Iniciar Sesión OT"**: Se abrirá un modal de alta densidad de datos.
3. **Formulación del Objetivo**: Defina la meta de la terapia (ej: *"Reducción de la agitación del atardecer a través de sintonización Gamma síncrona"*).
4. **Frecuencia Acústica**: Elija entre las modalidades sintonizadas:
   * *Gamma 40Hz (Sónica Pura)*: Onda senoidal uniforme a 40 ciclos por segundo.
   * *Gamma 39.5Hz (Doppler Modulada)*: Frecuencia modulada para evitar la habituación auditiva.
   * *Gamma 40.2Hz (Rítmica Sincrónica)*: Patrón intermitente para estimulación motora.
5. **Verificación de Consentimiento**:
   * *Obligatorio*: Debe marcar la casilla **"Consentimiento firmado por familiar o tutor legal"**.
   * *PIN de Terapeuta*: Ingrese el código PIN de firma digital del terapeuta (ej: `7777` o `1234`).
6. **Ejecución y Sincronía**: Presione **Comenzar Intervención**. El sistema registrará la sesión de forma síncrona en el ledger e inicializará el panel de monitoreo fisiológico en vivo.

---

## 🔊 5. USO DEL ESTIMULADOR SÓNICO GAMMA A 40HZ

La estimulación con ondas Gamma a 40Hz es una de las mayores innovaciones clínicas de VIMUME. Ayuda a activar las células microgliales para depurar acumulaciones beta-amiloides en el cerebro:

### Operación del Módulo en Cliente:
1. En la landing pública o en el panel de sesión en vivo, localice el módulo **"Estimulación Gamma a 40Hz (Sonido Puro)"**.
2. **Activación de Frecuencia**: Haga clic en el interruptor **"Activar Tono de 40Hz"**.
3. **Comportamiento del Navegador**: El sistema instanciará un `OscillatorNode` usando la Web Audio API nativa. Escuchará una vibración de tono extremadamente grave y puro de 40Hz.
4. **Recomendación Clínica**: Use auriculares estereofónicos cerrados de alta calidad para garantizar que la onda actúe de manera uniforme y equilibrada bilateralmente.
5. **Apagado Seguro**: Haga clic en **"Detener Estimulación"** en cualquier momento para desactivar el oscilador y liberar los recursos del procesador de audio.

---

## 📄 6. GENERACIÓN DE REPORTES E IMPRESIÓN (PDF & PRINT)

Al cerrar una intervención, es imperativo generar el reporte oficial para la historia clínica y para el seguimiento familiar:

### Generación de Reporte:
1. Navegue a la pestaña **Informes & PDF**.
2. Localice la sesión terminada.
3. **Modo de Impresión Estilizado**: Haga clic en **Imprimir Reporte**.
4. **Formato Clínico S-Class**: Se activará la directiva CSS `@media print` optimizada del navegador. Esta directiva remueve los elementos decorativos del dashboard (sidebars, fondos oscuros, brillos) y genera una hoja limpia en blanco y negro clínico estructurada con:
   * Identificación del Centro y Logotipo VIMUME.
   * Código hash de verificación del consentimiento firmado.
   * Notas de observación objetivas y gráficos de ritmo cardíaco (BPM).
   * Firma criptográfica del Terapeuta Responsable.
5. **Guardar como PDF**: Seleccione la impresora "Guardar como PDF" de su sistema operativo para exportar el documento digitalmente de forma limpia.

---

## 🚨 7. RESOLUCIÓN DE INCIDENCIAS RÁPIDAS (TUTORIAL BOOTSTRAP)

* **Problema: El sonido de 40Hz no se escucha al pulsar "Activar".**
  * *Causa*: Los navegadores modernos bloquean la Web Audio API por políticas de autoejecución (autoplay) hasta que el usuario realiza un clic físico en la pantalla.
  * *Solución*: Asegúrese de hacer clic directamente sobre el botón interactivo de activación. Verifique que el volumen del sistema esté arriba del 20%.
* **Problema: Al pulsar "Comenzar Intervención" el sistema me da un error de PIN.**
  * *Causa*: Ha introducido un código de verificación incorrecto.
  * *Solución*: Utilice el PIN de demostración autorizado `7777` o `1234`.
* **Problema: Las tablas o gráficos se imprimen con el fondo negro del Dashboard.**
  * *Causa*: Su navegador tiene desactivada la opción "Imprimir gráficos de fondo".
  * *Solución*: En el cuadro de diálogo de impresión de su navegador, expanda "Más opciones" y asegúrese de que la opción **"Gráficos de fondo"** esté desactivada para forzar el contraste clínico S-Class optimizado.

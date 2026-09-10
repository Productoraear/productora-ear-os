# 🔥 Guía de Configuración de Firebase para Bodas.net

## ⚠️ Error Detectado

Tu aplicación está intentando conectarse a Firebase pero **falta la configuración de credenciales**.

**Proyecto Firebase detectado:** `fincas-para-boda`

---

## 📋 Pasos para Configurar Firebase

### Paso 1: Acceder a la Consola de Firebase

1. Abre tu navegador y ve a:
   ```
   https://console.firebase.google.com/u/0/project/fincas-para-boda/settings/general
   ```

2. Inicia sesión con tu cuenta de Google si es necesario

### Paso 2: Crear una App Web (si no existe)

1. En la página de configuración general, busca la sección **"Tus apps"**

2. Si **NO tienes una app web** (icono `</>`):
   - Haz clic en el botón **`</>`** (Web)
   - Dale un nombre a tu app (ejemplo: "Bodas.net Web")
   - **NO** marques "También configura Firebase Hosting" (por ahora)
   - Haz clic en **"Registrar app"**

3. Si **YA tienes una app web**:
   - Busca el icono de engranaje ⚙️ al lado del nombre de tu app
   - O desplázate hasta la sección "SDK setup and configuration"

### Paso 3: Copiar las Credenciales

Verás un código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "fincas-para-boda.firebaseapp.com",
  projectId: "fincas-para-boda",
  storageBucket: "fincas-para-boda.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
};
```

### Paso 4: Actualizar el Archivo `.env.local`

1. Abre el archivo `.env.local` en la raíz del proyecto

2. Reemplaza cada valor `PENDIENTE_...` con tus credenciales reales:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...                              ← Copia el valor de apiKey
VITE_FIREBASE_AUTH_DOMAIN=fincas-para-boda.firebaseapp.com   ← Ya configurado
VITE_FIREBASE_PROJECT_ID=fincas-para-boda                      ← Ya configurado
VITE_FIREBASE_STORAGE_BUCKET=fincas-para-boda.appspot.com     ← Ya configurado
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012                 ← Copia el valor de messagingSenderId
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456           ← Copia el valor de appId
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX                      ← Copia el valor de measurementId
```

3. **Guarda el archivo** (Ctrl+S o Cmd+S)

### Paso 5: Habilitar Autenticación en Firebase

1. En la consola de Firebase, ve a **"Authentication"** en el menú lateral

2. Haz clic en **"Get started"** si es la primera vez

3. Ve a la pestaña **"Sign-in method"**

4. Habilita los métodos que necesites:

   **Email/Password** (Recomendado):
   - Haz clic en "Email/Password"
   - Activa el switch
   - Haz clic en "Guardar"

   **Google** (Recomendado):
   - Haz clic en "Google"
   - Activa el switch
   - Selecciona un email de soporte del proyecto
   - Haz clic en "Guardar"

### Paso 6: Crear Base de Datos Firestore

1. En la consola de Firebase, ve a **"Firestore Database"** en el menú lateral

2. Haz clic en **"Crear base de datos"**

3. Selecciona **"Iniciar en modo de prueba"** (puedes cambiar las reglas después)

4. Elige la ubicación del servidor (ejemplo: `europe-west3` para España)

5. Haz clic en **"Habilitar"**

### Paso 7: Configurar Storage (Almacenamiento)

1. En la consola de Firebase, ve a **"Storage"** en el menú lateral

2. Haz clic en **"Comenzar"**

3. Acepta las reglas de seguridad predeterminadas

4. Selecciona la misma ubicación que Firestore

5. Haz clic en **"Listo"**

### Paso 8: Reiniciar el Servidor de Desarrollo

1. En tu terminal, detén el servidor si está ejecutándose (Ctrl+C)

2. Inicia el servidor nuevamente:
   ```bash
   npm run dev
   ```

3. Abre tu navegador en `http://localhost:5173`

---

## ✅ Verificación

Si la configuración es correcta, deberías ver:

- ✅ La página de inicio de Bodas.net cargando correctamente
- ✅ Botones de "Iniciar Sesión" y "Registrarse" funcionando
- ✅ Sin mensajes de error en la consola del navegador

---

## 🔧 Solución de Problemas

### Error: "Firebase: Error (auth/invalid-api-key)"

**Causa:** El `VITE_FIREBASE_API_KEY` es incorrecto o todavía dice `PENDIENTE_TU_API_KEY`

**Solución:**
1. Verifica que copiaste correctamente el `apiKey` de Firebase Console
2. Asegúrate de que no hay espacios extra al principio o final
3. Reinicia el servidor después de editar `.env.local`

### Error: "Firebase: Error (auth/project-not-found)"

**Causa:** El `VITE_FIREBASE_PROJECT_ID` es incorrecto

**Solución:**
1. Verifica en Firebase Console que el Project ID es exactamente `fincas-para-boda`
2. No debe tener espacios ni caracteres especiales

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

**Causa:** Firebase no se está inicializando correctamente

**Solución:**
1. Verifica que TODAS las variables de entorno están configuradas
2. Reinicia el servidor completamente
3. Limpia el caché del navegador (Ctrl+Shift+R)

### Los botones de login no funcionan

**Causa:** Authentication no está habilitado en Firebase

**Solución:**
1. Ve a Firebase Console → Authentication
2. Habilita al menos "Email/Password"
3. Habilita "Google" para login social

---

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
- [Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Storage](https://firebase.google.com/docs/storage/web/start)

---

## 🆘 ¿Necesitas Ayuda?

Si después de seguir estos pasos sigues teniendo problemas:

1. Verifica que el archivo `.env.local` no tenga ningún valor `PENDIENTE_...`
2. Asegúrate de haber reiniciado el servidor después de editar `.env.local`
3. Revisa la consola del navegador (F12) para ver errores específicos
4. Verifica que Firebase Authentication y Firestore estén habilitados en Firebase Console

---

## 📸 Capturas de Pantalla de Referencia

### Dónde encontrar las credenciales:

1. **Firebase Console → Configuración del proyecto**
   ```
   https://console.firebase.google.com/u/0/project/fincas-para-boda/settings/general
   ```

2. **Scroll hasta "Tus apps"**

3. **Busca el código de configuración que empieza con `const firebaseConfig = {`**

4. **Copia cada valor exactamente como aparece**

---

## ✨ Próximos Pasos Después de Configurar

Una vez que Firebase esté configurado correctamente:

1. ✅ **Crea tu primera cuenta de usuario**
   - Haz clic en "Registrarse"
   - Usa email/password o Google

2. ✅ **Explora las funcionalidades**
   - Dashboard de pareja o proveedor
   - Gestión de invitados
   - Presupuesto
   - Búsqueda de proveedores

3. ✅ **Configura las reglas de seguridad** (opcional, para producción)
   - Ve a Firestore Database → Rules
   - Ve a Storage → Rules
   - Copia las reglas del archivo `FIREBASE_SETUP.md`

---

**¡Listo! Tu aplicación Bodas.net estará funcionando con Firebase en minutos.** 🎉

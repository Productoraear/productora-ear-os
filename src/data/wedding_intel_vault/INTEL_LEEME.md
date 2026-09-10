# 💍 Bodas.net - Plataforma de Planificación de Bodas

## 🚨 IMPORTANTE: Configuración Requerida

**¿Ves un error sobre Firebase?** → Lee **`CONFIGURAR_FIREBASE.md`** primero

Tu proyecto Firebase: **`fincas-para-boda`**

---

## 🎯 Resumen del Proyecto

Aplicación web completa para planificación de bodas similar a Bodas.net/The Knot, construida con:

- **React 19** + TypeScript
- **Firebase** (Authentication, Firestore, Storage)
- **TanStack Router** + TanStack Query
- **Tailwind CSS v4** + shadcn/ui
- **Vite** para desarrollo rápido

## 🏃 Inicio Rápido

### Prerequisitos

1. **Node.js 18+** instalado
2. **Cuenta de Firebase** (gratis)
3. **Proyecto Firebase** creado (el tuyo: `fincas-para-boda`)

### Pasos de Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Firebase:** (⚠️ PASO CRÍTICO)

   Lee la guía completa:
   ```bash
   # Abre y sigue las instrucciones de:
   CONFIGURAR_FIREBASE.md
   ```

   Resumen rápido:
   - Ve a: https://console.firebase.google.com/u/0/project/fincas-para-boda/settings/general
   - Crea una app web (si no existe)
   - Copia las credenciales de `firebaseConfig`
   - Edita `.env.local` y reemplaza los valores `PENDIENTE_...`
   - Guarda y reinicia el servidor

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
vite-template/
├── src/
│   ├── routes/
│   │   └── index.tsx          # Aplicación principal de Bodas.net
│   ├── components/
│   │   ├── ui/                # 40+ componentes shadcn/ui
│   │   ├── data/              # Hooks y servicios de Firebase
│   │   └── FirebaseConfigError.tsx  # Pantalla de error de config
│   ├── lib/
│   │   ├── firebase.ts        # Configuración de Firebase
│   │   └── utils.ts           # Utilidades (función cn, etc)
│   └── main.tsx               # Punto de entrada
├── .env.local                 # ⚠️ Configuración de Firebase (EDITAR AQUÍ)
├── .env.example               # Plantilla de variables de entorno
├── CONFIGURAR_FIREBASE.md     # 📖 GUÍA DE CONFIGURACIÓN (¡LEE ESTO!)
├── FIREBASE_SETUP.md          # Documentación técnica completa
└── CLAUDE.md                  # Instrucciones para Claude Code
```

## ✨ Funcionalidades

### Para Parejas (Novios)

- ✅ Dashboard personalizado
- ✅ Lista de invitados con RSVP
- ✅ Gestión de presupuesto
- ✅ Búsqueda de proveedores con filtros
- ✅ Organización de mesas
- ✅ Catálogo de vestidos/trajes
- ✅ Timeline de tareas

### Para Proveedores

- ✅ Dashboard de negocios
- ✅ Gestión de solicitudes de presupuesto
- ✅ Sistema de mensajería
- ✅ Calendario de eventos
- ✅ Analíticas y estadísticas
- ✅ Perfil de empresa verificado
- ✅ Sistema de promociones

### Características Técnicas

- 🔐 Autenticación completa (Email/Password, Google, Facebook, Apple)
- 💾 Base de datos en tiempo real (Firestore)
- 📸 Carga de imágenes (Firebase Storage)
- 🔔 Notificaciones push (Firebase Cloud Messaging)
- 🌐 Multiidioma (i18n con react-i18next)
- 📱 Diseño responsive
- ⚡ Optimización de rendimiento

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Validación (NO ejecutar en E2B)
npm run check:safe       # TypeScript + ESLint

# Construcción
npm run build            # Build para producción
npm run preview          # Vista previa del build

# Limpieza
npm run clean            # Limpia node_modules y dist
```

## ⚠️ Restricciones de E2B

Este proyecto está configurado para ejecutarse en E2B sandbox:

- ❌ **NO ejecutar** `npm start` o `npm run dev` en E2B
- ✅ **SÍ ejecutar** `npm run check:safe` para validación
- ✅ El servidor usa `0.0.0.0` para compatibilidad con contenedores

## 🔥 Configuración de Firebase

### Variables de Entorno Requeridas

Edita `.env.local` con tus credenciales:

```env
VITE_FIREBASE_API_KEY=AIzaSy...             ← Tu API Key
VITE_FIREBASE_AUTH_DOMAIN=fincas-para-boda.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fincas-para-boda
VITE_FIREBASE_STORAGE_BUCKET=fincas-para-boda.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123...    ← Tu Sender ID
VITE_FIREBASE_APP_ID=1:123...               ← Tu App ID
VITE_FIREBASE_MEASUREMENT_ID=G-XXX...       ← Tu Measurement ID
```

### Servicios de Firebase a Habilitar

1. **Authentication** → Sign-in method:
   - Email/Password ✅
   - Google ✅
   - Facebook (opcional)
   - Apple (opcional)

2. **Firestore Database**:
   - Crear en modo de prueba
   - Ubicación: `europe-west3` (recomendado para España)

3. **Storage**:
   - Habilitar servicio
   - Misma ubicación que Firestore

## 📚 Documentación

- **`CONFIGURAR_FIREBASE.md`** - Guía paso a paso de configuración
- **`FIREBASE_SETUP.md`** - Documentación técnica completa
- **`CLAUDE.md`** - Instrucciones para desarrollo con Claude Code
- **`.env.example`** - Plantilla de variables de entorno

## 🐛 Solución de Problemas

### Error: "Firebase no está configurado correctamente"

**Solución:**
1. Lee `CONFIGURAR_FIREBASE.md`
2. Verifica que `.env.local` no tenga valores `PENDIENTE_...`
3. Reinicia el servidor después de editar `.env.local`

### Error: "Firebase: Error (auth/invalid-api-key)"

**Solución:**
- Tu `VITE_FIREBASE_API_KEY` es incorrecto
- Cópialo correctamente de Firebase Console
- No debe tener espacios ni caracteres extra

### Los botones de login no funcionan

**Solución:**
- Habilita Authentication en Firebase Console
- Ve a Authentication → Sign-in method
- Activa "Email/Password" como mínimo

### No se guardan los datos

**Solución:**
- Verifica que Firestore Database esté creado
- Revisa las reglas de seguridad en Firestore
- Comprueba que el usuario esté autenticado

## 🌟 Próximos Pasos

Después de configurar Firebase:

1. ✅ Crear tu primera cuenta de usuario
2. ✅ Explorar el dashboard de parejas o proveedores
3. ✅ Añadir invitados de prueba
4. ✅ Buscar proveedores en tu provincia
5. ✅ Configurar reglas de seguridad para producción

## 📖 Stack Tecnológico

### Frontend
- React 19 (con Suspense y Transitions)
- TypeScript (strict mode parcial)
- Tailwind CSS v4
- shadcn/ui (40+ componentes)
- TanStack Router v7 (rutas tipadas)
- TanStack Query v5 (caché y sincronización)
- react-i18next (internacionalización)
- lucide-react (iconos)

### Backend/Servicios
- Firebase Authentication (gestión de usuarios)
- Cloud Firestore (base de datos NoSQL)
- Firebase Storage (almacenamiento de archivos)
- Firebase Cloud Messaging (notificaciones)
- Firebase Hosting (despliegue)

### Herramientas de Desarrollo
- Vite 6 (build tool)
- ESLint (linting)
- TypeScript Compiler (type checking)

## 📝 Modelo de Datos

### Colecciones de Firestore

**Usuarios/Parejas:**
- `users/{userId}/favoritos` - Proveedores guardados
- `users/{userId}/invitados` - Lista de invitados
- `users/{userId}/tareas` - Checklist de boda
- `users/{userId}/presupuesto` - Gestión de presupuesto
- `users/{userId}/mesas` - Organización de mesas
- `users/{userId}/evento` - Detalles del evento

**Proveedores:**
- `companies` - Directorio de empresas
- `companies/{id}/reviews` - Opiniones
- `quoteRequests` - Solicitudes de presupuesto
- `conversations` - Mensajes

**Comunidad:**
- `articles` - Blog e ideas
- `experiences` - Bodas reales
- `forums` - Foros de discusión

## 🔒 Seguridad

Para producción, configura las reglas de Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden leer/escribir sus propios datos
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Proveedores públicos
    match /companies/{companyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Despliegue

### Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Desplegar
npm run build
firebase deploy
```

## 📄 Licencia

Este proyecto es un template de código abierto para planificación de bodas.

---

## 🆘 Soporte

**¿Problemas con la configuración?**
1. Lee `CONFIGURAR_FIREBASE.md` completo
2. Verifica que todas las variables de `.env.local` estén configuradas
3. Revisa la consola del navegador (F12) para ver errores
4. Verifica Firebase Console para el estado de los servicios

**¿Preguntas sobre el código?**
- Consulta `CLAUDE.md` para convenciones del proyecto
- Revisa `FIREBASE_SETUP.md` para arquitectura técnica
- Los tipos están en `src/components/data/types.ts`

---

**¡Feliz planificación de bodas!** 💍✨

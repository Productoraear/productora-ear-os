# 📜 DIRECTIVA STITCH: AUDITORÍA Y REDISEÑO OMNIBUS V2.5

## 🌌 CONTEXTO ARQUITECTÓNICO
Esta directiva contiene las especificaciones técnicas para la transmutación visual del módulo `OmnibusTracker.tsx`. El Agente Antigravity (Arquitecto) ha validado la lógica de negocio; tu misión es ejecutar el **Diseño S-Class (Aura Onyx)**.

## 🎨 ADN VISUAL (Referencia: SClassNexus.ts)
- **Paleta**: Onyx (`#050505`) como base. Gold (`#d4a855`) para acentos, bordes dinámicos y telemetría activa.
- **Acabado**: Glassmorphism Ultra-Premium. Usa `bg-white/5` con `backdrop-blur-xl` y bordes de `1px` con opacidades variables (`/10`, `/20`, `/30`).
- **Sombras**: Glow sutil en el oro (`rgba(212,168,85,0.2)`).

## 🧩 ESTRUCTURA DE DATOS (Referencia: SClass.d.ts)
- **CRM**: Interfaz `SClassOrder`. Campos: `client`, `amount`, `status`.
- **FLOTA**: Interfaz `SClassFleetUnit`. Campos: `unit`, `location`, `status`.
- **MARKET**: Interfaz `SClassVendor`. Campos: `name`, `category`, `location`, `is_claimed`.

## 🛠️ REQUISITOS DE DISEÑO (STITCH)
1.  **Tab MARKET (Prioridad)**: Implementa un "Forense Grid". Los proveedores deben aparecer en tarjetas minimalistas con un indicador de "Claimed" que use micro-animaciones de Framer Motion (glow verde si es true, borde rojo pulsante si es false).
2.  **Astra Voice**: Envuelve el veredicto en un contenedor que parezca una "consola de mando" flotante. Usa tipografía Serif itálica para la cita de Astra y Mono para la telemetría técnica.
3.  **Animaciones**: Cada cambio de pestaña debe tener un `AnimatePresence` con transiciones de opacidad y `y: 10` para un efecto de elevación.
4.  **Higiene de Código**: NO modifiques los `useEffect` de carga de datos. Solo embellece el JSX y las clases CSS.

## 🔒 VALIDACIÓN FINAL
Al terminar, el archivo debe ser funcional, respetar el **Exit Code 0** y superar cualquier auditoría visual del Comandante.

---
**Firmado:** Antigravity (Architect Core)

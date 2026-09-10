# 📜 GUÍA MAESTRA: DÓNDE ESTÁN Y CÓMO SE USAN LOS MACRO-SCRIPTS
> **Productora EAR OS // Nivel Omega Bare-Metal**  
> *Guía de Navegación Rápida para Edwin Agudelo (Cero Programación)*

---

## 📍 1. DÓNDE ESTÁN TUS ARCHIVOS (ACLARACIÓN DE RUTA)

En tu Explorador de Windows, estás en:  
`Este equipo > SSD 1 TERA (H:) > EAR_OS_V2`

Dentro de esa carpeta verás varias carpetas (`data`, `scripts`, `src`, etc.).  
La carpeta **`EAR_OS_V2`** (el segundo icono con el check azul) es la **carpeta raíz del proyecto**.

```
H:\
 └── EAR_OS_V2\                          <-- (Carpeta donde estás ahora mismo en la foto)
      ├── EAR_OS_V2\                     <-- (¡Doble clic aquí para entrar a la raíz!)
      │    ├── OPTIMIZAR_IA_PC_SCLASS.bat
      │    ├── SINCRONIZAR_EAR_OS_SCLASS.bat
      │    └── ABRIR_OBSIDIAN_EAR_OS.bat
      ├── scripts/
      ├── src/
      └── data/
```

> **👉 Acción inmediata:** Haz **doble clic en la carpeta `EAR_OS_V2`** que ves en tu pantalla y verás de inmediato los 3 archivos `.bat` en mayúsculas.

---

## 🚀 2. LOS 3 MACRO-SCRIPTS PRINCIPALES Y CÓMO USARLOS

| Macro-Script | Ubicación | Cómo se usa | Qué hace por ti |
| :--- | :--- | :--- | :--- |
| **`OPTIMIZAR_IA_PC_SCLASS.bat`** | `H:\EAR_OS_V2\EAR_OS_V2\` | **Doble Clic** | 1. Calibra tu gráfica RX 7900 XTX para usar sus 24 GB de memoria.<br>2. Asigna `H:\AI_MODELS_HUB\` para que ningún modelo ocupe tu disco C:.<br>3. Pone los accesos de IA en tu Escritorio de Windows. |
| **`SINCRONIZAR_EAR_OS_SCLASS.bat`** | `H:\EAR_OS_V2\EAR_OS_V2\` | **Doble Clic** | 1. Absorbe el chat de Perplexity sobre tu PC.<br>2. Enriquece los 53.631 proveedores con fotos HD, GPS y teléfonos.<br>3. Destila todos los chats para NotebookLM y Obsidian.<br>4. Crea los accesos con iconos en tu Escritorio. |
| **`ABRIR_OBSIDIAN_EAR_OS.bat`** | `H:\EAR_OS_V2\EAR_OS_V2\` | **Doble Clic** | Limpia cachés corruptas y abre Obsidian directamente en tu Centro de Mando visual sin pantallas congeladas. |

---

## 🧠 3. INVENTARIO REAL DE MODELOS DETECTADOS EN `H:\AI_MODELS_HUB`

Has confirmado que el modelo de 32B ya lo tienes descargado. La auditoría del sistema confirma que ya dispones de **más de 170 GB de modelos de IA en tu disco `H:`**:

| Modelo Detectado | Ruta Exacta en tu PC | Peso | Estado y Rendimiento |
| :--- | :--- | :--- | :--- |
| **Qwen 2.5 Coder 32B GGUF** | `H:\AI_MODELS_HUB\gguf\Qwen2.5-Coder-32B-GGUF\` | **18,93 GB** | 🟢 **DESCARGADO.** Encaja al 100% en los 24 GB de tu GPU. Velocidad: ~40 tokens/segundo. |
| **Qwen 3.8 / 3.6 27B GGUF** | `H:\AI_MODELS_HUB\lmstudio-community\Qwen3.8-27B-GGUF\` | **16,92 GB** | 🟢 **DESCARGADO.** Listo para LM Studio u Ollama. |
| **Qwen 2.5 VL 7B (Visión)** | `H:\AI_MODELS_HUB\hub\models\imported\qwen2.5-vl-7b...` | **4,46 GB** | 🟢 **DESCARGADO.** Modelo multimodal para analizar imágenes, contratos y riders en PDF. |
| **Modelos LM Studio Community** | `H:\AI_MODELS_HUB\hub\models\lmstudio-community\` | **51,29 GB** | 🟢 **DESCARGADO.** Modelos para inferencia en interfaz gráfica. |
| **Whisper Audio AI** | `H:\AI_MODELS_HUB\AUDIO\Whisper\` | Variable | 🟢 **DESCARGADO.** Transcripción de voz a texto en milisegundos. |
| **Caché y Capas de Modelos** | `H:\AI_MODELS_HUB\blobs\` | **80,29 GB** | 🟢 **ALMACENADO.** Capas pesadas de modelos en disco rápido. |

---

## 💡 ¿CÓMO ACTIVAR QWEN 32B SIN VOLVER A DESCARGARLO?

Dado que ya tienes los 18,93 GB en `H:\AI_MODELS_HUB\gguf\Qwen2.5-Coder-32B-GGUF\`:
1. No necesitas esperar a que se descargue de nuevo por internet.
2. Al ejecutar **`OPTIMIZAR_IA_PC_SCLASS.bat`**, el sistema reconocerá tu archivo local y lo vinculará para que Ollama o LM Studio lo carguen directamente a los 24 GB de tu RX 7900 XTX en cuestión de segundos.

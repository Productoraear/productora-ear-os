# Plan de Construcción del Sitio Web "DreamDay"

## 1. Objetivo
Construir un prototipo funcional y visualmente atractivo del sitio web de comercio electrónico "DreamDay" para un planificador de bodas, inspirado en las funcionalidades de bodas.net pero enfocado en un único negocio.

## 2. Problema Actual y Solución
**Problema:** Actualmente, mi entorno de ejecución está fijado en el directorio del sistema `C:\WINDOWS\system32`. Este directorio tiene restricciones que impiden la instalación de dependencias y la ejecución de proyectos de desarrollo.
**Solución:** Para poder continuar, debes **reiniciar la CLI en un directorio de usuario estándar y accesible** (ej. `C:\Users\TuUsuario\Desktop`, `C:\Users\TuUsuario\Documents\Proyectos`). Una vez reiniciado en la ubicación correcta, podré ejecutar los siguientes pasos.

## 3. Plan General de Construcción
Procederé de forma autónoma, siguiendo estos pasos:
1.  **Configuración de la Estructura del Proyecto:** Creación manual de directorios y archivos esenciales para el frontend (React + TypeScript) y el backend (Node.js + Express).
2.  **Datos Mock (Simulados):** Utilización de archivos JSON locales para simular una base de datos, permitiendo un desarrollo rápido del frontend.
3.  **Desarrollo del Backend:** Creación de una API REST simple con Express para servir los datos mock.
4.  **Desarrollo del Frontend:** Construcción de la interfaz de usuario con React, utilizando Bootstrap para el estilo y conectándose a la API del backend.
5.  **Verificación:** Asegurar que el prototipo sea funcional y visualmente coherente.

## 4. Instrucciones Absolutas y Pasos Detallados (Una vez en el directorio correcto)

### A. Configuración del Frontend (React + TypeScript)

1.  **Crear el directorio principal del proyecto:**
    ```bash
    mkdir dream-day-app
    ```
2.  **Crear la estructura de directorios para el frontend:**
    ```bash
    mkdir dream-day-app/frontend/src
    mkdir dream-day-app/frontend/public
    ```
3.  **Crear `dream-day-app/frontend/package.json`:**
    ```json
    {
      "name": "frontend",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
        "@testing-library/jest-dom": "^5.17.0",
        "@testing-library/react": "^13.4.0",
        "@testing-library/user-event": "^13.5.0",
        "@types/jest": "^27.5.2",
        "@types/node": "^16.18.97",
        "@types/react": "^18.3.2",
        "@types/react-dom": "^18.3.0",
        "axios": "^1.7.2",
        "bootstrap": "^5.3.3",
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "react-router-dom": "^6.23.1",
        "react-scripts": "5.0.1",
        "typescript": "^4.9.5",
        "web-vitals": "^2.1.4"
      },
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
      },
      "eslintConfig": {
        "extends": [
          "react-app",
          "react-app/jest"
        ]
      },
      "browserslist": {
        "production": [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ],
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
      }
    }
    ```
4.  **Crear `dream-day-app/frontend/tsconfig.json`:**
    ```json
    {
      "compilerOptions": {
        "target": "es5",
        "lib": [
          "dom",
          "dom.iterable",
          "esnext"
        ],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx"
      },
      "include": [
        "src"
      ]
    }
    ```
5.  **Crear `dream-day-app/frontend/public/index.html`:**
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="DreamDay - Wedding Planner"
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>DreamDay - Wedding Planner</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
      </body>
    </html>
    ```
6.  **Crear `dream-day-app/frontend/src/index.tsx`:**
    ```typescript
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import './index.css';
    import App from './App';
    import reportWebVitals from './reportWebVitals';

    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    reportWebVitals();
    ```
7.  **Crear `dream-day-app/frontend/src/App.tsx`:**
    ```typescript
    import React from 'react';
    import './App.css';

    function App() {
      return (
        <div className="App">
          <header className="App-header">
            <h1>DreamDay</h1>
            <p>Coming Soon...</p>
          </header>
        </div>
      );
    }

    export default App;
    ```
8.  **Crear `dream-day-app/frontend/src/index.css`:**
    ```css
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }
    ```
9.  **Crear `dream-day-app/frontend/src/App.css`:**
    ```css
    .App {
      text-align: center;
    }

    .App-header {
      background-color: #f8f9fa;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: calc(10px + 2vmin);
      color: #333;
    }
    ```
10. **Crear `dream-day-app/frontend/src/reportWebVitals.ts`:**
    ```typescript
    import { ReportHandler } from 'web-vitals';

    const reportWebVitals = (onPerfEntry?: ReportHandler) => {
      if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(onPerfEntry);
          getFID(onPerfEntry);
          getFCP(onPerfEntry);
          getLCP(onPerfEntry);
          getTTFB(onPerfEntry);
        });
      }
    };

    export default reportWebVitals;
    ```
11. **Instalar dependencias del frontend:**
    ```bash
    npm install --prefix dream-day-app/frontend
    ```

### B. Configuración del Backend (Node.js + Express)

1.  **Crear el directorio del backend:**
    ```bash
    mkdir dream-day-app/backend
    ```
2.  **Inicializar el proyecto Node.js:**
    ```bash
    npm init -y --prefix dream-day-app/backend
    ```
3.  **Instalar Express:**
    ```bash
    npm install express --prefix dream-day-app/backend
    ```
4.  **Crear `dream-day-app/backend/server.js` (ejemplo básico):**
    ```javascript
    const express = require('express');
    const app = express();
    const port = 5000;

    app.get('/', (req, res) => {
      res.send('Backend de DreamDay funcionando!');
    });

    app.listen(port, () => {
      console.log(`Backend escuchando en http://localhost:${port}`);
    });
    ```

### C. Creación de Datos Mock (JSON)

1.  **Crear el directorio de datos:**
    ```bash
    mkdir dream-day-app/backend/data
    ```
2.  **Crear `dream-day-app/backend/data/providers.json` (ejemplo):**
    ```json
    [
      { "id": 1, "name": "Fotografía Nupcial", "category": "Fotógrafos", "rating": 5, "image": "placeholder.jpg" },
      { "id": 2, "name": "Flores de Ensueño", "category": "Floristerías", "rating": 4.8, "image": "placeholder.jpg" }
    ]
    ```
3.  **Crear `dream-day-app/backend/data/weddings.json` (ejemplo):**
    ```json
    [
      { "id": 1, "title": "Boda de Ana y Luis", "date": "2024-06-15", "image": "placeholder.jpg" },
      { "id": 2, "title": "Celebración de María y Pablo", "date": "2024-09-22", "image": "placeholder.jpg" }
    ]
    ```

### D. Implementación de Endpoints de API

1.  **Modificar `dream-day-app/backend/server.js` para servir datos mock:**
    (Se añadirá lógica para leer los JSON y servir los datos a través de rutas como `/api/providers`, `/api/weddings`).

### E. Desarrollo de la Interfaz de Usuario (Frontend)

1.  **Integrar Bootstrap:** Añadir Bootstrap al `index.html` o importarlo en `index.tsx`.
2.  **Crear Componentes React:** Desarrollar componentes para la barra de navegación, sección hero, listado de proveedores, galería de bodas, etc.
3.  **Conectar Frontend con Backend:** Utilizar `axios` para realizar llamadas a la API del backend y mostrar los datos dinámicamente.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies en EAR OS.',
};

export default function CookiesPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        color: '#f5f5f7',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        padding: '48px 24px',
      }}
    >
      <section style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
          Política de Cookies
        </h1>

        <p style={{ marginTop: 16, lineHeight: 1.6, color: '#c7c7cc' }}>
          Esta página describe cómo EAR OS utiliza cookies y tecnologías
          similares para mejorar la experiencia de navegación, analizar el
          rendimiento y personalizar contenidos.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>
          ¿Qué son las cookies?
        </h2>
        <p style={{ lineHeight: 1.6, color: '#c7c7cc' }}>
          Las cookies son pequeños archivos de texto que se almacenan en tu
          dispositivo cuando visitas un sitio web. Permiten recordar
          preferencias, mantener sesiones activas y recopilar métricas de uso.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>
          Tipos de cookies que utilizamos
        </h2>
        <ul style={{ lineHeight: 1.7, color: '#c7c7cc', paddingLeft: 20 }}>
          <li>
            <strong>Esenciales:</strong> necesarias para el funcionamiento
            básico del sitio.
          </li>
          <li>
            <strong>Analíticas:</strong> nos ayudan a entender cómo se utiliza
            la plataforma.
          </li>
          <li>
            <strong>Preferencias:</strong> guardan opciones de idioma, tema o
            accesibilidad.
          </li>
        </ul>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>
          Gestión de cookies
        </h2>
        <p style={{ lineHeight: 1.6, color: '#c7c7cc' }}>
          Puedes aceptar, rechazar o configurar las cookies desde el aviso de
          cookies. También puedes eliminarlas o bloquearlas desde la
          configuración de tu navegador.
        </p>
      </section>
    </main>
  );
}
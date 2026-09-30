import type { Metadata } from 'next';
import type { CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'Infraestructura',
  description: 'Infraestructura técnica de Productora EAR: frontend, APIs, datos y despliegue.',
};

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#030305',
  color: '#f5f5f7',
  padding: '48px 24px',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
};

const containerStyle: CSSProperties = {
  maxWidth: '960px',
  margin: '0 auto',
};

const titleStyle: CSSProperties = {
  fontSize: '40px',
  lineHeight: 1.1,
  margin: '0 0 16px',
};

const subtitleStyle: CSSProperties = {
  fontSize: '18px',
  color: '#a1a1aa',
  margin: '0 0 32px',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '16px',
};

const cardStyle: CSSProperties = {
  border: '1px solid #27272a',
  borderRadius: '16px',
  padding: '20px',
  backgroundColor: '#0a0a0c',
};

const cardTitleStyle: CSSProperties = {
  fontSize: '18px',
  margin: '0 0 8px',
};

const cardTextStyle: CSSProperties = {
  fontSize: '15px',
  color: '#a1a1aa',
  margin: 0,
  lineHeight: 1.5,
};

export default function InfraestructuraPage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Infraestructura</h1>
        <p style={subtitleStyle}>
          Arquitectura técnica de Productora EAR enfocada en rendimiento, seguridad y mantenibilidad.
        </p>

        <section style={gridStyle}>
          <article style={cardStyle}>
            <h2 style={cardTitleStyle}>Frontend</h2>
            <p style={cardTextStyle}>
              Next.js 15 con App Router, TypeScript estricto y una estética OLED consistente.
            </p>
          </article>

          <article style={cardStyle}>
            <h2 style={cardTitleStyle}>APIs</h2>
            <p style={cardTextStyle}>
              Rutas de API tipadas para perfiles, oráculos y flujos de negocio críticos.
            </p>
          </article>

          <article style={cardStyle}>
            <h2 style={cardTitleStyle}>Datos</h2>
            <p style={cardTextStyle}>
              Modelos de datos estructurados y validación en frontera para mantener integridad.
            </p>
          </article>

          <article style={cardStyle}>
            <h2 style={cardTitleStyle}>Despliegue</h2>
            <p style={cardTextStyle}>
              Build estático, verificación de tipos y despliegue continuo con mínima fricción.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arsenal',
  description: 'Módulo Arsenal de EAR OS v2.',
};

export default function ArsenalPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        color: '#e6e6ea',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '48px 24px',
      }}
    >
      <section style={{ maxWidth: 960, margin: '0 auto' }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#7c7c85',
          }}
        >
          EAR OS v2
        </p>

        <h1
          style={{
            margin: '12px 0 16px',
            fontSize: 40,
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          Arsenal
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: 640,
            fontSize: 16,
            lineHeight: 1.6,
            color: '#b8b8c0',
          }}
        >
          Módulo operativo listo para auditar, refactorizar y desplegar
          componentes de Productora EAR.
        </p>
      </section>
    </main>
  );
}
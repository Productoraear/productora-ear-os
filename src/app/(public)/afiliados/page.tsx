import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Afiliados | EAR',
  description: 'Programa de afiliados de Productora EAR.',
};

export default function AfiliadosPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        color: '#f5f5f5',
        padding: '48px 24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.1 }}>Afiliados</h1>
        <p style={{ marginTop: 16, lineHeight: 1.6 }}>
          Programa de afiliados de Productora EAR.
        </p>
      </section>
    </main>
  );
}
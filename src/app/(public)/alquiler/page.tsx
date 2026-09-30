import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alquiler',
  description: 'Gestión de alquileres, disponibilidad y reservas.',
};

export default function AlquilerPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        color: '#f5f5f5',
        padding: '48px 24px',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}
    >
      <section style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: 0 }}>Alquiler</h1>
        <p style={{ marginTop: 16, fontSize: 18, color: '#c9c9d1' }}>
          Gestión de alquileres, disponibilidad y reservas.
        </p>
      </section>
    </main>
  );
}
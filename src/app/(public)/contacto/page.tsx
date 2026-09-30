import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | EAR',
  description: 'Contacta con Productora EAR.',
};

export default function ContactoPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        color: '#f5f5f7',
        padding: '64px 24px',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 48,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          Contacto
        </h1>

        <p
          style={{
            marginTop: 16,
            marginBottom: 0,
            fontSize: 18,
            lineHeight: 1.6,
            color: '#a1a1aa',
          }}
        >
          Escríbenos y te responderemos lo antes posible.
        </p>

        <address
          style={{
            marginTop: 32,
            marginBottom: 0,
            display: 'grid',
            gap: 12,
            fontStyle: 'normal',
          }}
        >
          <a
            href="mailto:hola@ear.com"
            style={{
              color: '#f5f5f7',
              textDecoration: 'none',
              fontSize: 16,
            }}
          >
            hola@ear.com
          </a>

          <a
            href="tel:+520000000000"
            style={{
              color: '#f5f5f7',
              textDecoration: 'none',
              fontSize: 16,
            }}
          >
            +52 000 000 0000
          </a>
        </address>
      </section>
    </main>
  );
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rider Técnico | EAR',
  description: 'Rider técnico para producción de eventos EAR.',
};

export default function RiderTecnicoPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#030305',
        color: '#f5f5f7',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '48px 24px',
      }}
    >
      <section style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Rider Técnico
        </h1>

        <p
          style={{
            marginTop: '16px',
            marginBottom: '32px',
            color: '#a1a1aa',
            fontSize: '1.125rem',
            lineHeight: 1.6,
          }}
        >
          Especificaciones técnicas para la producción de eventos EAR.
        </p>

        <div style={{ display: 'grid', gap: '24px' }}>
          <article
            style={{
              border: '1px solid #1f1f23',
              borderRadius: '16px',
              padding: '24px',
              background: '#050507',
            }}
          >
            <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>Audio</h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#d4d4d8',
                lineHeight: 1.7,
              }}
            >
              <li>Consola digital con 32 canales</li>
              <li>4 monitores de piso</li>
              <li>4 micrófonos inalámbricos</li>
              <li>2 micrófonos dinámicos</li>
            </ul>
          </article>

          <article
            style={{
              border: '1px solid #1f1f23',
              borderRadius: '16px',
              padding: '24px',
              background: '#050507',
            }}
          >
            <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>Iluminación</h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#d4d4d8',
                lineHeight: 1.7,
              }}
            >
              <li>4 cabezas móviles</li>
              <li>2 barras de LED</li>
              <li>1 consola DMX</li>
            </ul>
          </article>

          <article
            style={{
              border: '1px solid #1f1f23',
              borderRadius: '16px',
              padding: '24px',
              background: '#050507',
            }}
          >
            <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>Electricidad</h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#d4d4d8',
                lineHeight: 1.7,
              }}
            >
              <li>1 circuito dedicado de 20A para audio</li>
              <li>1 circuito dedicado de 20A para iluminación</li>
              <li>Regleta industrial con protección</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Vendor',
  description: 'Panel de control para proveedores.',
};

type Stat = {
  readonly label: string;
  readonly value: string;
};

const stats: ReadonlyArray<Stat> = [
  { label: 'Pedidos activos', value: '0' },
  { label: 'Ingresos del mes', value: '$0.00' },
  { label: 'Productos', value: '0' },
  { label: 'Soporte', value: 'Abierto' },
];

export default function VendorDashboardPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#030305',
        color: '#e8e8ee',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        padding: '48px 24px',
        boxSizing: 'border-box',
      }}
    >
      <section style={{ maxWidth: 1120, margin: '0 auto' }}>
        <header style={{ marginBottom: 32 }}>
          <p
            style={{
              margin: 0,
              color: '#7c7c85',
              fontSize: 14,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Vendor
          </p>
          <h1 style={{ margin: '8px 0 0', fontSize: 34, lineHeight: 1.15, color: '#ffffff' }}>
            Dashboard
          </h1>
          <p
            style={{
              margin: '12px 0 0',
              color: '#a0a0aa',
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            Panel de control para gestionar pedidos, productos y métricas del proveedor.
          </p>
        </header>

        <section
          aria-label="Métricas principales"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}
        >
          {stats.map((stat) => (
            <article
              key={stat.label}
              style={{
                border: '1px solid #1a1a20',
                borderRadius: 16,
                padding: 20,
                background: 'linear-gradient(180deg, #08080c 0%, #050508 100%)',
              }}
            >
              <p style={{ margin: 0, color: '#8a8a94', fontSize: 13, letterSpacing: '0.04em' }}>
                {stat.label}
              </p>
              <p style={{ margin: '10px 0 0', color: '#ffffff', fontSize: 28, fontWeight: 650 }}>
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section
          aria-label="Acciones rápidas"
          style={{
            border: '1px solid #1a1a20',
            borderRadius: 16,
            padding: 24,
            background: '#050508',
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: 20, color: '#ffffff' }}>
            Acciones rápidas
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              type="button"
              style={{
                border: '1px solid #2a2a32',
                borderRadius: 12,
                padding: '10px 16px',
                background: '#0b0b10',
                color: '#e8e8ee',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Ver pedidos
            </button>
            <button
              type="button"
              style={{
                border: '1px solid #2a2a32',
                borderRadius: 12,
                padding: '10px 16px',
                background: '#0b0b10',
                color: '#e8e8ee',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Gestionar productos
            </button>
            <button
              type="button"
              style={{
                border: '1px solid #2a2a32',
                borderRadius: 12,
                padding: '10px 16px',
                background: '#0b0b10',
                color: '#e8e8ee',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Ver soporte
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
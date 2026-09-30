export const metadata = {
  title: 'Precios | EAR',
  description: 'Planes y precios de Productora EAR',
};

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
};

const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    price: '€290',
    period: '/mes',
    features: [
      '1 proyecto activo',
      'Entrega en 7 días',
      'Soporte por email',
    ],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€590',
    period: '/mes',
    features: [
      '3 proyectos activos',
      'Entrega prioritaria',
      'Revisión creativa',
      'Soporte por chat',
    ],
    highlighted: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '€1.190',
    period: '/mes',
    features: [
      'Proyectos ilimitados',
      'Equipo dedicado',
      'Estrategia mensual',
      'Soporte 24/7',
    ],
    highlighted: false,
  },
];

export default function PreciosPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#030305',
        color: '#f5f5f7',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '96px 24px' }}>
        <header style={{ textAlign: 'center', marginBottom: 64 }}>
          <p
            style={{
              margin: 0,
              color: '#8a8a93',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: 12,
            }}
          >
            EAR OS v2
          </p>
          <h1 style={{ margin: '16px 0 0', fontSize: 48, lineHeight: 1.1, fontWeight: 700 }}>
            Precios
          </h1>
          <p
            style={{
              margin: '16px auto 0',
              maxWidth: 640,
              color: '#b8b8c0',
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            Planes claros para producciones, campañas y contenido de alto impacto.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {plans.map((plan) => (
            <article
              key={plan.id}
              style={{
                border: plan.highlighted ? '1px solid #ffffff' : '1px solid #26262b',
                borderRadius: 24,
                padding: 32,
                background: plan.highlighted ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 360,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{plan.name}</h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 16 }}>
                <span style={{ fontSize: 40, fontWeight: 700 }}>{plan.price}</span>
                <span style={{ color: '#8a8a93' }}>{plan.period}</span>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '32px 0 0',
                  display: 'grid',
                  gap: 12,
                  flex: 1,
                }}
              >
                {plan.features.map((feature) => (
                  <li key={feature} style={{ color: '#d7d7de', fontSize: 15, lineHeight: 1.5 }}>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                style={{
                  marginTop: 32,
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: 'none',
                  background: plan.highlighted ? '#ffffff' : '#1d1d22',
                  color: plan.highlighted ? '#030305' : '#f5f5f7',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Elegir {plan.name}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace | EAR',
  description: 'Marketplace de la Productora EAR',
};

export default function MarketplacePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        color: '#f5f5f7',
        padding: '48px 24px',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <section style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          Marketplace
        </h1>

        <p
          style={{
            marginTop: 12,
            marginBottom: 0,
            color: '#a1a1aa',
            lineHeight: 1.6,
          }}
        >
          Explora, publica y gestiona recursos de la Productora EAR.
        </p>
      </section>
    </main>
  );
}
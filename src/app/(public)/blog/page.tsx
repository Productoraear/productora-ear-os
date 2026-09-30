import type { Metadata } from 'next';
import type { CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'Blog | EAR',
  description: 'Artículos y notas de Productora EAR.',
};

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
};

const posts: BlogPost[] = [
  {
    id: 'ear-os-v2',
    title: 'EAR OS v2',
    excerpt:
      'Actualización del sistema de producción con flujos más estables, auditoría de código y estética OLED.',
    date: '2026-06-16',
  },
  {
    id: 'nextjs-15',
    title: 'Next.js 15 en producción',
    excerpt:
      'Notas sobre rendimiento, tipado estricto y buenas prácticas para mantener la base técnica sólida.',
    date: '2026-06-10',
  },
  {
    id: 'design-system',
    title: 'Sistema de diseño oscuro',
    excerpt:
      'Definición de tokens visuales, contraste y jerarquía para una experiencia consistente en EAR.',
    date: '2026-06-02',
  },
];

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#030305',
  color: '#f5f5f7',
  padding: '48px 24px',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
};

const headerStyle: CSSProperties = {
  maxWidth: '960px',
  margin: '0 auto 32px',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '40px',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
};

const subtitleStyle: CSSProperties = {
  margin: '12px 0 0',
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: 1.5,
};

const listStyle: CSSProperties = {
  maxWidth: '960px',
  margin: '0 auto',
  display: 'grid',
  gap: '16px',
};

const cardStyle: CSSProperties = {
  border: '1px solid #1f1f23',
  borderRadius: '16px',
  padding: '24px',
  backgroundColor: '#07070a',
};

const cardTitleStyle: CSSProperties = {
  margin: '0 0 8px',
  fontSize: '20px',
  lineHeight: 1.3,
};

const cardExcerptStyle: CSSProperties = {
  margin: '0 0 12px',
  color: '#a1a1aa',
  lineHeight: 1.6,
};

const cardMetaStyle: CSSProperties = {
  margin: 0,
  color: '#71717a',
  fontSize: '13px',
};

export default function BlogPage() {
  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Blog</h1>
        <p style={subtitleStyle}>
          Notas técnicas, procesos y actualizaciones de Productora EAR.
        </p>
      </header>

      <section style={listStyle} aria-label="Artículos del blog">
        {posts.map((post) => (
          <article key={post.id} style={cardStyle}>
            <h2 style={cardTitleStyle}>{post.title}</h2>
            <p style={cardExcerptStyle}>{post.excerpt}</p>
            <p style={cardMetaStyle}>{post.date}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
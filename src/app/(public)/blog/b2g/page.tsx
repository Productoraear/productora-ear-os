"use client";

import BlogClusterPage from '@/app/components/public/BlogClusterPage';

export default function B2GPage() {
  const posts = [
    {
      id: 5,
      title: "Alianzas con Ayuntamientos: Modelo de Despliegue",
      excerpt: "Cómo integrar VIMUME en la agenda de cultura y bienestar de los municipios españoles.",
      date: "01 May 2026",
      author: "Relaciones Institucionales",
      tag: "B2G",
      readTime: "10 min",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      href: "/blog/b2g/alianzas-ayuntamientos"
    },
    {
      id: 9,
      title: "Institutional Sovereignty: IMSERSO & CSR Integration",
      excerpt: "Acceso a financiación institucional y presupuestos de Responsabilidad Social Corporativa para el despliegue VIMUME.",
      date: "15 May 2026",
      author: "Edwin Agudelo",
      tag: "Soberanía",
      readTime: "13 min",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=800&auto=format&fit=crop",
      href: "/blog/b2g/institutional-sovereignty"
    },
    {
      id: 10,
      title: "Sovereign SEO: Territorial Dominance & Local Schema",
      excerpt: "Optimización de la matriz de 2,100 landings para dominar la búsqueda local en cada provincia de España.",
      date: "15 May 2026",
      author: "Manus AI",
      tag: "SEO OMEGA",
      readTime: "9 min",
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=800&auto=format&fit=crop",
      href: "/blog/b2g/sovereign-seo-territorial"
    }
  ];

  return (
    <BlogClusterPage 
      title="B2G Strategy"
      category="VIMUME / INSTITUCIONAL"
      description="Marco de colaboración para administraciones públicas, subvenciones y programas territoriales de alto impacto."
      posts={posts}
    />
  );
}

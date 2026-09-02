"use client";

import BlogClusterPage from '@/app/components/public/BlogClusterPage';

export default function InvestigacionPage() {
  const posts = [
    {
      id: 2,
      title: "Arquitectura Cognitiva y Estímulo Sonoro",
      excerpt: "Análisis del impacto de las frecuencias de 432Hz vs 440Hz en pacientes con deterioro cognitivo severo.",
      date: "10 May 2026",
      author: "Equipo Técnico EAR",
      tag: "Investigación",
      readTime: "12 min",
      image: "https://images.unsplash.com/photo-1532187875605-2fe358a71424?q=80&w=800&auto=format&fit=crop",
      href: "/blog/investigacion/arquitectura-cognitiva"
    },
    {
      id: 3,
      title: "S-Class Scoring System: Curatorial Intelligence",
      excerpt: "Implementación de una matriz de 5 dimensiones para la clasificación elite de artistas en el ecosistema EAR OS.",
      date: "14 May 2026",
      author: "Edwin Agudelo",
      tag: "S-Class",
      readTime: "15 min",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
      href: "/blog/investigacion/s-class-scoring"
    },
    {
      id: 4,
      title: "Recursive Path Engineering: Navigation Zero-Dead-End",
      excerpt: "Cómo la arquitectura recursiva elimina los nodos terminales y garantiza una navegabilidad infinita en el market network.",
      date: "15 May 2026",
      author: "Manus AI",
      tag: "Arquitectura",
      readTime: "10 min",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
      href: "/blog/investigacion/recursive-path-engineering"
    }
  ];

  return (
    <BlogClusterPage 
      title="Investigación"
      category="VIMUME / CIENCIA"
      description="Documentación técnica y académica sobre el uso de la música como terapia complementaria en neurodegeneración."
      posts={posts}
    />
  );
}

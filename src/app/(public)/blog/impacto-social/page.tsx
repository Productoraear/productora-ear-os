"use client";

import BlogClusterPage from '@/app/components/public/BlogClusterPage';

export default function ImpactoSocialPage() {
  const posts = [
    {
      id: 4,
      title: "La 'Silver Economy' y el Impacto Social",
      excerpt: "Invertir en bienestar para la tercera edad no es solo filantropía; es la construcción de un nuevo paradigma.",
      date: "05 May 2026",
      author: "VIMUME Strategy",
      tag: "Impacto",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
      href: "/blog/impacto-social/silver-economy"
    },
    {
      id: 7,
      title: "Multi-role Transformation: Uber+Airbnb+Tinder Patterns",
      excerpt: "Cómo EAR OS integra patrones de éxito disruptivos para revolucionar la logística de eventos y el matching artístico.",
      date: "15 May 2026",
      author: "Manus AI",
      tag: "Disrupción",
      readTime: "14 min",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
      href: "/blog/impacto-social/multi-role-transformation"
    },
    {
      id: 8,
      title: "Digital Twin Strategy vs Bodas.net",
      excerpt: "El contraataque tecnológico de EAR OS para capturar la vertical de eventos mediante IA semántica y contexto clínico.",
      date: "15 May 2026",
      author: "Edwin Agudelo",
      tag: "Mercado",
      readTime: "11 min",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      href: "/blog/impacto-social/digital-twin-strategy"
    }
  ];

  return (
    <BlogClusterPage 
      title="Impacto Social"
      category="VIMUME / SOCIEDAD"
      description="Medición de ROI social, alianzas corporativas y el futuro del envejecimiento digno en España."
      posts={posts}
    />
  );
}

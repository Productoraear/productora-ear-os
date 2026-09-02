"use client";

import BlogClusterPage from '@/app/components/public/BlogClusterPage';

export default function TecnicaSonoraPage() {
  const posts = [
    {
      id: 3,
      title: "Ingeniería de Sonido en Centros de Día",
      excerpt: "Por qué el ruido de fondo es el mayor enemigo de la terapia de reminiscencia y cómo lo combatimos.",
      date: "08 May 2026",
      author: "Ingeniería EAR",
      tag: "Técnica",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
      href: "/blog/tecnica-sonora/ingenieria-sonido-centros"
    },
    {
      id: 11,
      title: "Astra Neural Engine: RAG-Optimized AI Logistics",
      excerpt: "El motor de inteligencia artificial que orquestra el conocimiento de EAR OS mediante recuperación semántica ultra-eficiente.",
      date: "15 May 2026",
      author: "Manus AI",
      tag: "AI Engine",
      readTime: "16 min",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
      href: "/blog/tecnica-sonora/astra-neural-engine"
    },
    {
      id: 12,
      title: "KV Cache Stability: Reducing LLM Latency by 70%",
      excerpt: "Técnicas avanzadas de serialización determinista para optimizar el rendimiento del motor Astra en producción.",
      date: "15 May 2026",
      author: "Equipo Técnico EAR",
      tag: "Optimización",
      readTime: "12 min",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop",
      href: "/blog/tecnica-sonora/kv-cache-stability"
    }
  ];

  return (
    <BlogClusterPage 
      title="Técnica Sonora"
      category="VIMUME / INGENIERÍA"
      description="Estándares de calidad, aislamiento acústico y despliegue de infraestructura sonora para entornos sensibles."
      posts={posts}
    />
  );
}

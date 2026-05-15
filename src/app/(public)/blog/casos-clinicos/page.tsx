"use client";

import BlogClusterPage from '@/app/components/public/BlogClusterPage';

export default function CasosClinicosPage() {
  const posts = [
    {
      id: 1,
      title: "El Silencio del Alzheimer y la Llave Musical",
      excerpt: "Cómo una canción de Antonio Machín logró que un paciente de 88 años volviera a hablar después de tres meses de mutismo absoluto en una residencia de Madrid.",
      date: "14 May 2026",
      author: "Edwin Agudelo",
      tag: "Caso Clínico",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
      href: "/blog/casos-clinicos/silencio-alzheimer"
    },
    {
      id: 2,
      title: "Reducción de Agitación Motora en Fase Avanzada",
      excerpt: "Estudio de caso sobre la aplicación del Protocolo VIMUME v2.0 en pacientes con demencia frontotemporal, logrando una reducción del 40% en episodios de agitación.",
      date: "12 May 2026",
      author: "Equipo Técnico EAR",
      tag: "Investigación",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1576091160550-2173bdd99625?q=80&w=800&auto=format&fit=crop",
      href: "/blog/casos-clinicos/agitacion-motora"
    },
    {
      id: 5,
      title: "Case Study: Atomic Reconstruction of Dispersed Ecosystems",
      excerpt: "Crónica de la reconstrucción técnica de EAR OS bajo el Protocolo YOLO Alpha, recuperando activos valorados en $800k USD.",
      date: "15 May 2026",
      author: "Manus AI",
      tag: "Arquitectura",
      readTime: "20 min",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      href: "/blog/casos-clinicos/atomic-reconstruction"
    },
    {
      id: 6,
      title: "VIMUME Protocol: Cognitive Health Infrastructure",
      excerpt: "Cómo el Protocolo VIMUME integra matching clínico y financiación institucional para dominar la vertical B2G.",
      date: "15 May 2026",
      author: "Edwin Agudelo",
      tag: "Estrategia",
      readTime: "12 min",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
      href: "/blog/casos-clinicos/vimume-protocol-infrastructure"
    }
  ];

  return (
    <BlogClusterPage 
      title="Casos Clínicos"
      category="VIMUME / EVIDENCIA"
      description="Documentación detallada de intervenciones, resultados métricos y testimonios de reconexión real."
      posts={posts}
    />
  );
}

"use client";

import BlogClusterPage from '@/app/components/public/BlogClusterPage';

export default function NewsletterPage() {
  const posts: any[] = [];

  return (
    <BlogClusterPage 
      title="Newsletter Institucional"
      category="VIMUME / COMUNICACIÓN"
      description="Boletín de actualidad sobre hitos, nuevos convenios y avances técnicos del ecosistema PRODUCTORAEAR."
      posts={posts}
    />
  );
}

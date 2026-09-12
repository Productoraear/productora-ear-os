import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveArsenalPoblacion } from '@/lib/seo/arsenalPoblacionesEngine';
import { ArsenalPoblacionLanding } from '@/features/alquiler-poblaciones/ui/ArsenalPoblacionLanding';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};

  let targetSlug = slug[slug.length - 1];
  if (slug[0] === 'arsenal' && slug.length > 1) {
    targetSlug = slug[1];
  }

  const profile = resolveArsenalPoblacion(targetSlug);

  return {
    title: profile.metaTitle,
    description: profile.metaDescription,
    alternates: {
      canonical: profile.canonicalUrl,
    },
    openGraph: {
      title: profile.metaTitle,
      description: profile.metaDescription,
      url: profile.canonicalUrl,
      type: 'website',
      locale: 'es_ES',
      siteName: 'Productora EAR',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
          width: 1200,
          height: 630,
          alt: profile.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.metaTitle,
      description: profile.metaDescription,
    },
  };
}

export default async function AlquilerPoblacionPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    notFound();
  }

  let targetSlug = slug[slug.length - 1];
  if (slug[0] === 'arsenal' && slug.length > 1) {
    targetSlug = slug[1];
  }

  const profile = resolveArsenalPoblacion(targetSlug);

  return <ArsenalPoblacionLanding profile={profile} />;
}

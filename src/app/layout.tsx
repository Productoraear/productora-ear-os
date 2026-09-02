import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/app/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Productora EAR · Ecosistema de Producción Musical, Eventos y VIMUME',
  description: 'Plataforma oficial de Productora EAR. Gestión de artistas, eventos nupciales, licitaciones municipales B2G, producción técnica y proyecto neuroacústico VIMUME.',
  icons: {
    icon: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="bg-[#050505] text-zinc-100 min-h-screen selection:bg-amber-500 selection:text-black antialiased font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { SharedProvider } from '@/app/context/SharedContext';
import { SovereignProvider } from '@/shared/context/SovereignContext';
import { AtmosphereProvider } from '@/app/context/AtmosphereProvider';
import { RoleSkinProvider } from '@/app/context/RoleSkinProvider';
import { EventCartProvider } from '@/context/EventCartContext';
import { MobileExperienceProvider } from '@/lib/config/mobile-experience-store';
import OraculoPublicDrawer from '@/components/oraculo/OraculoPublicDrawer';
import { SovereignMobileHUD } from '@/components/sclass/SovereignMobileHUD';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.productoraear.com'),
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
          <MobileExperienceProvider>
            <SharedProvider>
              <RoleSkinProvider>
                <SovereignProvider>
                  <AtmosphereProvider>
                    <EventCartProvider>
                      {children}
                      <OraculoPublicDrawer />
                      <SovereignMobileHUD />
                    </EventCartProvider>
                  </AtmosphereProvider>
                </SovereignProvider>
              </RoleSkinProvider>
            </SharedProvider>
          </MobileExperienceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

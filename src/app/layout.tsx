import { SovereignMobileHUD } from '@/components/sclass/SovereignMobileHUD';
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Montserrat } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

import { SharedProvider } from "@/app/context/SharedContext";
import { RoleSkinProvider } from "@/app/context/RoleSkinProvider";
import { SovereignProvider } from "@/shared/context/SovereignContext";
import { AtmosphereProvider } from "@/app/context/AtmosphereProvider";
import { EventCartProvider } from "@/context/EventCartContext";
import SmoothScrollProvider from '@/app/context/SmoothScrollProvider';
import { ThemeProvider } from "@/app/context/ThemeContext";
import { TenantRoleProvider } from "@/contexts/TenantRoleContext";
import { MobileExperienceProvider } from "@/lib/config/mobile-experience-store";
import { DynamicMobileExperienceOrchestrator } from "@/components/mobile/DynamicMobileExperienceOrchestrator";

import SovereignNavbar from "@/app/components/layout/SovereignNavbar";
import HummingbirdFlight from "@/app/components/ambient/HummingbirdFlight";
import OmniSearchModal from '@/app/components/ui/OmniSearchModal';
import { BespokePricerModal } from "@/features/finance/ui/BespokePricerModal";
import { SpatialIntelligence } from "@/app/components/spatial/SpatialIntelligence";
import SovereignFooter from "@/app/components/layout/SovereignFooter";
import { GeoStructuredData } from "@/components/seo/GeoStructuredData";
import { FloatingWhatsAppCta } from "@/components/ui/FloatingWhatsAppCta";
import { AIConciergeDock } from "@/components/chat/AIConciergeDock";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.productoraear.com"),
  alternates: {
    canonical: "/",
  },
  title: "Productora EAR :: Alquiler de Equipos de Sonido, Bodas & Eventos B2G",
  description: "Plataforma de producción técnica, alquiler de audiovisuales, música para bodas y licitaciones públicas de festejos.",
  keywords: ["alquiler equipos sonido madrid", "mariachi para bodas", "produccion eventos ayuntamientos", "pantallas led exterior", "Productora EAR"],
  authors: [{ name: "EAR OS Core" }],
  icons: {
    icon: "https://lh3.googleusercontent.com/a/ACg8ocJF7O8ZaJG4WsLPfVaVe5f5Gmu80nOoea2teuOAs-s9sq53uNk=s288-c-no",
    apple: "https://lh3.googleusercontent.com/a/ACg8ocJF7O8ZaJG4WsLPfVaVe5f5Gmu80nOoea2teuOAs-s9sq53uNk=s288-c-no",
  },
  openGraph: {
    title: "Productora EAR :: Alquiler de Equipos de Sonido, Bodas & Eventos B2G",
    description: "Plataforma de producción técnica, alquiler de audiovisuales, música para bodas y licitaciones públicas de festejos.",
    url: "https://www.productoraear.com",
    siteName: "Productora EAR // EAR OS",
    images: [
      {
        url: "https://lh3.googleusercontent.com/a/ACg8ocJF7O8ZaJG4WsLPfVaVe5f5Gmu80nOoea2teuOAs-s9sq53uNk=s288-c-no",
        width: 288,
        height: 288,
        alt: "Logo Oficial EAR OS"
      }
    ],
    locale: "es_ES",
    type: "website"
  },
  verification: {
    google: "aqeccjF8QKJSCm93Jb2C1rP8qvyhat2yLtJkrhFSGfU",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="es" 
      suppressHydrationWarning 
      className={`dark scroll-smooth ${fraunces.variable} ${montserrat.variable}`}
    >
      <head />
      <body 
        className={`antialiased bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans ${fraunces.variable} ${montserrat.variable}`}
        suppressHydrationWarning
      >
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}
        <ThemeProvider>
          <TenantRoleProvider>
            <MobileExperienceProvider>
              <SharedProvider>
                <RoleSkinProvider>
                  <SovereignProvider>
                    <AtmosphereProvider>
                      <EventCartProvider>
                        <SmoothScrollProvider>
                          <SpatialIntelligence />
                          <div className="min-h-screen relative flex flex-col">
                            <GeoStructuredData />
                            <SovereignNavbar />
                            <main className="flex-grow">
                              {children}
                            </main>
                            <SovereignFooter />
                            <HummingbirdFlight />
                            <BespokePricerModal />
                            <OmniSearchModal />
                            <DynamicMobileExperienceOrchestrator />
                          </div>
                        </SmoothScrollProvider>
                      </EventCartProvider>
                    </AtmosphereProvider>
                  </SovereignProvider>
                </RoleSkinProvider>
              </SharedProvider>
            </MobileExperienceProvider>
          </TenantRoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

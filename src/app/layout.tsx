import { SovereignMobileHUD } from '@/components/sclass/SovereignMobileHUD';
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Syne, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
import { VimumeThemeInjector } from "@/components/theme/VimumeThemeInjector";
import { EarConcierge } from "@/components/Astra/EarConcierge";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://productoraear.com"),
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
    url: "https://productoraear.com",
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
      className={`dark scroll-smooth ${syne.variable} ${inter.variable}`}
    >
      <head />
      <body 
        className={`antialiased bg-[#050505] text-white selection:bg-[#FF2B44] selection:text-white font-sans ${syne.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        <VimumeThemeInjector />
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
                            <EarConcierge />
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

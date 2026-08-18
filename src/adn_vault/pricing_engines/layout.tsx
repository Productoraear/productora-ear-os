import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import OmniSearchModal from '@/app/components/ui/OmniSearchModal';
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.productoraear.com"),
  title: "EarOS :: Sistema Operativo de Eventos & Matchmaking",
  description: "Plataforma de soberanía operativa, booking y contratación para Productora EAR.",
  keywords: ["EarOS", "Productora EAR", "Edwin Agudelo", "S-Class", "Logistics OS"],
  authors: [{ name: "EAR OS Core" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: "aqeccjF8QKJSCm93Jb2C1rP8qvyhat2yLtJkrhFSGfU",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import { SharedProvider } from "@/app/context/SharedContext";
import { BespokePricerModal } from "@/features/finance/ui/BespokePricerModal";
import { RoleSkinProvider } from "@/app/context/RoleSkinProvider";
import { SovereignProvider } from "@/shared/context/SovereignContext";
import SmoothScrollProvider from '@/app/context/SmoothScrollProvider';
import { AtmosphereProvider } from "@/app/context/AtmosphereProvider";
import { SpatialIntelligence } from "@/app/components/spatial/SpatialIntelligence";
import { ThemeProvider } from "@/app/context/ThemeContext";

import SovereignNavbar from "@/app/components/layout/SovereignNavbar";
import EarBottomNav from "@/app/components/layout/EarBottomNav";
import HummingbirdFlight from "@/app/components/ambient/HummingbirdFlight";
import DynamicContextBar from "@/app/components/layout/DynamicContextBar";

import { EventCartProvider } from "@/context/EventCartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" />
      </head>
      <body className="antialiased bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans">
        <Script
          src="https://js.stripe.com/v3/"
          strategy="lazyOnload"
        />
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
          <SharedProvider>
            <RoleSkinProvider>
              <SovereignProvider>
                <AtmosphereProvider>
                  <EventCartProvider>
                    <SmoothScrollProvider>
                      <SpatialIntelligence />
                      <div className="min-h-screen relative flex flex-col">
                        <main className="flex-grow">
                          <>
                            <SovereignNavbar />
                            {children}
                            <EarBottomNav />
                            <HummingbirdFlight />
                          </>
                        </main>
                        <BespokePricerModal />
                        <OmniSearchModal />
                        <DynamicContextBar />
                      </div>
                    </SmoothScrollProvider>
                  </EventCartProvider>
                </AtmosphereProvider>
              </SovereignProvider>
            </RoleSkinProvider>
          </SharedProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
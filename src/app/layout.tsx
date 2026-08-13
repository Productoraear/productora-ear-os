import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import OmniSearchModal from '@/app/components/ui/OmniSearchModal';
import { Inter, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// 🖋️ S-CLASS TYPOGRAPHY CONSOLIDATION
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "800"], // 3 real weights per family
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://productoraear.com"),
  title: "Unio - Matchmaking and Events Platform",
  description: "Plataforma de soberanía operativa y despliegue institucional para Productora EAR y VIMUME.",
  keywords: ["VIMUME", "Productora EAR", "EAR OS", "S-Class", "Logistics OS"],
  authors: [{ name: "EAR OS Core" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
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

// Importing required components
import SovereignNavbar from "@/app/components/layout/SovereignNavbar";
import EarBottomNav from "@/app/components/layout/EarBottomNav";
import AuraMatrixCanvas from "@/app/components/3d/AuraMatrixCanvas";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${syne.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" />
      </head>
      <body className="antialiased bg-background text-foreground selection:bg-[#ecb613] selection:text-black font-sans">
        <Script
          src="https://js.stripe.com/v3/"
          strategy="lazyOnload"
        />
        <ThemeProvider>
          <SharedProvider>
            <RoleSkinProvider>
              <SovereignProvider>
                <AtmosphereProvider>
                  <SmoothScrollProvider>
                    <SpatialIntelligence />
                    <div className="min-h-screen relative flex flex-col">
                      <main className="flex-grow">
<>
  <SovereignNavbar />
  {children}
  <EarBottomNav />
  <AuraMatrixCanvas />
</>
                      </main>
                      <BespokePricerModal />
                      <OmniSearchModal />
                    </div>
                  </SmoothScrollProvider>
                </AtmosphereProvider>
              </SovereignProvider>
            </RoleSkinProvider>
          </SharedProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
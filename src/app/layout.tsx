import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import OmniSearchModal from '@/app/components/ui/OmniSearchModal';
import { Inter, Manrope, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://productoraear.com"),
  title: "EAR OS GOLD | S-Class Production Shell",
  description: "Sistema Operativo de Alto Rendimiento para la Productora EAR. Gestión de Flota, CRM Forense y Oráculo de IA.",
  keywords: ["EAR OS", "Productora EAR", "S-Class", "Gestión Corporativa", "IA Forense"],
  authors: [{ name: "Antigravity Alpha Dev" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: "aqeccjF8QKJSCm93Jb2C1rP8qvyhat2yLtJkrhFSGfU",
  },
  other: {
    "google-site-verification": "aqeccjF8QKJSCm93Jb2C1rP8qvyhat2yLtJkrhFSGfU"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { SharedProvider } from "@/app/context/SharedContext";
import { BespokePricerModal } from "@/features/finance/ui/BespokePricerModal";
import { RoleSkinProvider } from "@/app/context/RoleSkinProvider";
import { SovereignProvider } from "@/shared/context/SovereignContext";
import SmoothScrollProvider from '@/app/context/SmoothScrollProvider';
import { LocalBusinessSchema } from "@/app/components/seo/LocalBusinessSchema";

import { AtmosphereProvider } from "@/app/context/AtmosphereProvider";
import { SpatialIntelligence } from "@/app/components/spatial/SpatialIntelligence";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${manrope.variable} ${syne.variable}`}>
      <head>
        <LocalBusinessSchema />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://productora-ear-backend.firebaseapp.com" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#050505] text-white selection:bg-[#d4a855] selection:text-black">
        <Script
          src="https://js.stripe.com/v3/"
          strategy="lazyOnload"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-W0JKLSZRQV`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W0JKLSZRQV');
          `}
        </Script>
        
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="lazyOnload">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}

        <SharedProvider>
          <RoleSkinProvider>
            <SovereignProvider>
              <AtmosphereProvider>
                <SmoothScrollProvider>
                  <SpatialIntelligence />
                  <div className="min-h-screen relative flex flex-col">
                    <main className="flex-grow">
                      {children}
                    </main>
                    <BespokePricerModal />
                    <OmniSearchModal />
                  </div>
                </SmoothScrollProvider>
              </AtmosphereProvider>
            </SovereignProvider>
          </RoleSkinProvider>
        </SharedProvider>
      </body>
    </html>
  );
}

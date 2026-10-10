import type { Metadata, Viewport } from "next";
import type { ReactElement } from "react";
import SovereignRegister from "@/modules/SClassScreens/SovereignRegister";

const SITE_URL = "https://productoraear.com";
const CANONICAL_URL = `${SITE_URL}/register`;
const OG_IMAGE_URL = `${SITE_URL}/og/register.png`;
const LOGO_URL = `${SITE_URL}/logo.png`;

export const metadata: Metadata = {
  title: "Crear Cuenta | Productora EAR",
  description:
    "Regístrate en Productora EAR: gestión de proyectos audiovisuales, base de talento, catálogo de locaciones y flujos de trabajo en un solo panel.",
  applicationName: "Productora EAR",
  keywords: [
    "Productora EAR",
    "registro",
    "crear cuenta",
    "producción audiovisual",
    "gestión de proyectos",
    "base de talento",
    "catálogo de locaciones",
    "EAR OS",
  ],
  authors: [{ name: "Productora EAR", url: SITE_URL }],
  creator: "Productora EAR",
  publisher: "Productora EAR",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: CANONICAL_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: CANONICAL_URL,
    siteName: "Productora EAR",
    title: "Crear Cuenta | Productora EAR",
    description:
      "Crea tu cuenta en Productora EAR: proyectos, talento, locaciones y flujos de trabajo en un solo panel.",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Registro Productora EAR — Panel de producción audiovisual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crear Cuenta | Productora EAR",
    description:
      "Crea tu cuenta en Productora EAR: proyectos, talento, locaciones y flujos de trabajo en un solo panel.",
    images: [OG_IMAGE_URL],
    creator: "@productoraear",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Productora EAR",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#030305",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

interface JsonLdOrganization {
  readonly "@type": "Organization";
  readonly name: string;
  readonly url: string;
  readonly logo: {
    readonly "@type": "ImageObject";
    readonly url: string;
  };
}

interface JsonLdWebSite {
  readonly "@type": "WebSite";
  readonly name: string;
  readonly url: string;
}

interface JsonLdEntryPoint {
  readonly "@type": "EntryPoint";
  readonly urlTemplate: string;
  readonly actionPlatform: readonly string[];
}

interface JsonLdRegisterAction {
  readonly "@type": "RegisterAction";
  readonly target: JsonLdEntryPoint;
  readonly name: string;
}

interface JsonLdWebPage {
  readonly "@context": "https://schema.org";
  readonly "@type": "WebPage";
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly inLanguage: string;
  readonly isPartOf: JsonLdWebSite;
  readonly potentialAction: JsonLdRegisterAction;
  readonly publisher: JsonLdOrganization;
}

const jsonLd: JsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Crear Cuenta | Productora EAR",
  url: CANONICAL_URL,
  description:
    "Página de registro de Productora EAR: proyectos, talento, locaciones y flujos de trabajo en un solo panel.",
  inLanguage: "es-MX",
  isPartOf: {
    "@type": "WebSite",
    name: "Productora EAR",
    url: SITE_URL,
  },
  potentialAction: {
    "@type": "RegisterAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: CANONICAL_URL,
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    name: "Registro de usuario",
  },
  publisher: {
    "@type": "Organization",
    name: "Productora EAR",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
  },
};

const WRAPPER_CLASSES: string = [
  "w-full max-w-md sm:max-w-lg md:max-w-xl",
  "motion-safe:animate-[earFadeUp_520ms_cubic-bezier(0.22,1,0.36,1)_both]",
  "[&_button]:min-h-[48px] [&_a]:min-h-[48px] [&_input]:min-h-[48px] [&_select]:min-h-[48px] [&_textarea]:min-h-[48px]",
  "[&_button]:min-w-[48px] [&_a]:min-w-[48px]",
  "[&_button]:transition-[transform,background-color,border-color,box-shadow,opacity,color] [&_button]:duration-200 [&_button]:ease-out",
  "[&_a]:transition-[transform,background-color,border-color,box-shadow,opacity,color] [&_a]:duration-200 [&_a]:ease-out",
  "[&_button]:will-change-transform [&_a]:will-change-transform",
  "motion-safe:[&_button:hover]:-translate-y-[1px] motion-safe:[&_a:hover]:-translate-y-[1px]",
  "motion-safe:[&_button:active]:translate-y-0 motion-safe:[&_a:active]:translate-y-0",
  "motion-safe:[&_button:active]:scale-[0.985] motion-safe:[&_a:active]:scale-[0.985]",
  "[&_button:focus-visible]:outline-none [&_a:focus-visible]:outline-none",
  "[&_button:focus-visible]:ring-2 [&_a:focus-visible]:ring-2",
  "[&_button:focus-visible]:ring-white/40 [&_a:focus-visible]:ring-white/40",
  "[&_button:focus-visible]:ring-offset-2 [&_a:focus-visible]:ring-offset-2",
  "[&_button:focus-visible]:ring-offset-[#030305] [&_a:focus-visible]:ring-offset-[#030305]",
  "[&_input]:transition-[border-color,box-shadow,background-color] [&_input]:duration-200 [&_input]:ease-out",
  "[&_select]:transition-[border-color,box-shadow,background-color] [&_select]:duration-200 [&_select]:ease-out",
  "[&_textarea]:transition-[border-color,box-shadow,background-color] [&_textarea]:duration-200 [&_textarea]:ease-out",
  "[&_input:focus-visible]:outline-none [&_select:focus-visible]:outline-none [&_textarea:focus-visible]:outline-none",
  "[&_input:focus-visible]:ring-2 [&_select:focus-visible]:ring-2 [&_textarea:focus-visible]:ring-2",
  "[&_input:focus-visible]:ring-white/30 [&_select:focus-visible]:ring-white/30 [&_textarea:focus-visible]:ring-white/30",
  "[&_input:focus-visible]:ring-offset-2 [&_select:focus-visible]:ring-offset-2 [&_textarea:focus-visible]:ring-offset-2",
  "[&_input:focus-visible]:ring-offset-[#030305] [&_select:focus-visible]:ring-offset-[#030305] [&_textarea:focus-visible]:ring-offset-[#030305]",
  "motion-reduce:[&_button]:transition-none motion-reduce:[&_a]:transition-none",
  "motion-reduce:[&_button:hover]:translate-y-0 motion-reduce:[&_a:hover]:translate-y-0",
  "motion-reduce:[&_button:active]:scale-100 motion-reduce:[&_a:active]:scale-100",
].join(" ");

const KEYFRAMES_CSS: string = `
  @keyframes earFadeUp {
    0% { opacity: 0; transform: translate3d(0, 12px, 0); }
    100% { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes earPulse {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.06); }
  }
  @media (prefers-reduced-motion: reduce) {
    [class*="animate-[ear"] { animation: none !important; }
  }
`;

export default function RegisterPage(): ReactElement {
  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-[#030305] text-white antialiased selection:bg-white/15 selection:text-white"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[120px] motion-safe:animate-[earPulse_9s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[420px] w-[420px] rounded-full bg-white/[0.02] blur-[110px] motion-safe:animate-[earPulse_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-10 md:px-8 md:py-12">
        <div className={WRAPPER_CLASSES}>
          <SovereignRegister />
        </div>
      </div>
      <style>{KEYFRAMES_CSS}</style>
    </main>
  );
}
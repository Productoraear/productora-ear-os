"use client";

import Link from "next/link";
import { Mail, Phone, Globe, ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { usePathname } from "next/navigation";

/**
 * 🏛️ PUBLIC FOOTER - VIMUME-FIRST LUMINOUS REFACTOR
 * Context-aware footer with unified branding and hierarchical endorsement.
 */
export default function PublicFooter() {
  const pathname = usePathname();
  const isVimumeContext = pathname.startsWith('/vimume');

  // Theme constants
  const footerBg = isVimumeContext ? "bg-[#fdfcf8]" : "bg-black";
  const textColor = isVimumeContext ? "text-[#1a1a1a]" : "text-white";
  const sublineColor = isVimumeContext ? "text-black/30" : "text-white/20";
  const mutedTextColor = isVimumeContext ? "text-black/40" : "text-white/40";
  const borderColor = isVimumeContext ? "border-black/5" : "border-white/5";

  return (
    <footer className={`${footerBg} border-t ${borderColor} py-32 px-6 relative overflow-hidden transition-colors duration-1000`}>
      {/* Decorative Atmosphere */}
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 ${isVimumeContext ? 'bg-[#3b82f6]/5' : 'bg-[#ecb613]/5'}`} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 relative z-10">
        {/* 🏛️ BRAND BLOCK */}
        <div className="space-y-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-5">
              {/* EAR Isotype */}
              <div className="w-10 h-10 bg-[#ecb613] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,182,19,0.2)]">
                <span className="text-black font-black text-xl italic leading-none">E</span>
              </div>

              <div className="flex flex-col justify-center">
                {isVimumeContext ? (
                  <>
                    <img 
                      src="/brand/vimume-logo-horizontal-light-blue.svg" 
                      alt="VIMUME" 
                      className="h-10 w-auto object-contain brightness-0 contrast-200 opacity-80"
                    />
                    <span className={`${sublineColor} text-[11px] font-black uppercase tracking-[0.3em] mt-2`}>
                      por Productora EAR
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[#ecb613] text-3xl font-black italic tracking-tighter uppercase">
                      PRODUCTORAEAR
                    </span>
                    <span className={`${sublineColor} text-[11px] font-black uppercase tracking-[0.4em] mt-1`}>
                      Infraestructura Pública
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className={`${mutedTextColor} text-sm leading-relaxed max-w-xs italic border-l ${isVimumeContext ? 'border-black/10' : 'border-white/10'} pl-6`}>
              {isVimumeContext 
                ? "Recuperando la identidad y la memoria a través de la excelencia en la intervención musical institucional."
                : "Facilitando la excelencia técnica en proyectos institucionales y eventos de gran impacto. Autoridad y rigor."}
            </p>
          </div>

          <div className="flex gap-4">
             {[Mail, Phone, Globe].map((Icon, i) => (
               <div key={i} className={`w-12 h-12 rounded-full border ${borderColor} flex items-center justify-center transition-all cursor-pointer ${isVimumeContext ? 'text-black/30 hover:text-[#3b82f6] hover:border-[#3b82f6]/30' : 'text-white/30 hover:text-[#ecb613] hover:border-[#ecb613]/30'}`}>
                 <Icon size={18} />
               </div>
             ))}
          </div>
        </div>

        {/* Vertical VIMUME */}
        <div className="space-y-10">
          <h4 className={`text-xs font-black uppercase tracking-[0.4em] ${sublineColor}`}>Vertical VIMUME</h4>
          <nav className={`flex flex-col gap-4 text-[13px] font-medium ${mutedTextColor} italic`}>
            <Link href={ROUTES.vimumeCentros} className={`hover:${textColor} transition-colors`}>Centros & Residencias</Link>
            <Link href={ROUTES.vimumeEventos} className={`hover:${textColor} transition-colors`}>Eventos & Domicilios</Link>
            <Link href={ROUTES.vimumeNosotros} className={`hover:${textColor} transition-colors`}>Sobre Nosotros</Link>
            <Link href={ROUTES.vimumeFaq} className={`hover:${textColor} transition-colors`}>FAQ & Metodología</Link>
          </nav>
        </div>

        {/* Servicios */}
        <div className="space-y-10">
          <h4 className={`text-xs font-black uppercase tracking-[0.4em] ${sublineColor}`}>Servicios</h4>
          <nav className={`flex flex-col gap-4 text-[13px] font-medium ${mutedTextColor} italic`}>
            <Link href={ROUTES.servicios} className={`hover:${textColor} transition-colors`}>Infraestructura Pública</Link>
            <Link href={ROUTES.servicios} className={`hover:${textColor} transition-colors`}>Diseño Lumínico</Link>
            <Link href={ROUTES.servicios} className={`hover:${textColor} transition-colors`}>Producción Oficial</Link>
            <Link href={ROUTES.dossier} className={`hover:${textColor} transition-colors`}>Dossier de Autoridad</Link>
          </nav>
        </div>

        {/* Global Hub */}
        <div className="space-y-10">
          <h4 className={`text-xs font-black uppercase tracking-[0.4em] ${sublineColor}`}>Global Hub</h4>
          <div className={`space-y-5 text-[13px] font-medium ${mutedTextColor} italic`}>
            <div className="flex items-center gap-4">
               <Phone size={14} className={isVimumeContext ? "text-[#3b82f6]" : "text-[#ecb613]"} />
               <span>+34 693 693 048</span>
            </div>
            <div className="flex items-center gap-4">
               <Mail size={14} className={isVimumeContext ? "text-[#3b82f6]" : "text-[#ecb613]"} />
               <span>hola@productoraear.com</span>
            </div>
            <p className={`${isVimumeContext ? 'text-[#3b82f6]' : 'text-[#ecb613]'} text-[11px] font-black uppercase not-italic tracking-[0.4em] mt-10 flex items-center gap-2`}>
               Logística Institucional Activada <ArrowUpRight size={10} />
            </p>
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto mt-32 pt-12 border-t ${borderColor} flex flex-col md:flex-row justify-between items-center gap-8`}>
        <p className={`${sublineColor} text-[11px] font-black uppercase tracking-[0.6em]`}>© 2026 Productora EAR. Rigor Certificado.</p>
        <div className={`flex gap-10 text-[11px] font-black uppercase tracking-[0.4em] ${sublineColor}`}>
          <Link href="/privacidad" className={`hover:${textColor} transition-colors`}>Privacidad</Link>
          <Link href="/legal" className={`hover:${textColor} transition-colors`}>Legal</Link>
          <Link href="/cookies" className={`hover:${textColor} transition-colors`}>Cookies</Link>
          <Link href="/sitemap" className={`hover:${textColor} transition-colors`}>Mapa del Sitio</Link>
        </div>
      </div>
    </footer>
  );
}

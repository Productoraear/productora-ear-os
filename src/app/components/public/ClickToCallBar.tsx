"use client";

import { Phone, MessageCircle } from "lucide-react";
import { CENTRALITA } from "@/lib/phone-constants";

/**
 * 📞 CLICK-TO-CALL STICKY BAR — MOBILE ONLY
 * Fixed bottom bar with dual CTA: direct call + WhatsApp.
 * Only renders on screens < lg (1024px).
 * This is the #1 organic call generator for local SEO.
 */
export default function ClickToCallBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-[90] lg:hidden">
      {/* Gradient fade above the bar */}
      <div className="h-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      
      <div className="bg-black/95 backdrop-blur-xl border-t border-[#ecb613]/20 px-4 py-3 flex items-center gap-3">
        {/* Primary CTA: Call */}
        <a
          href={CENTRALITA.tel}
          className="flex-1 flex items-center justify-center gap-2.5 bg-[#ecb613] text-black font-black text-sm uppercase tracking-wider rounded-2xl py-3.5 transition-all active:scale-95 shadow-[0_0_20px_rgba(236,182,19,0.3)]"
          aria-label={`Llamar al ${CENTRALITA.display}`}
        >
          <Phone size={18} strokeWidth={2.5} />
          <span>Llamar Ahora</span>
        </a>

        {/* Secondary CTA: WhatsApp */}
        <a
          href={CENTRALITA.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-black text-xs uppercase tracking-wider rounded-2xl px-5 py-3.5 transition-all active:scale-95"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle size={16} strokeWidth={2.5} />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Safe area padding for iOS notch phones */}
      <div className="bg-black/95 h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}

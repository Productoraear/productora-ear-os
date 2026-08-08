/**
 * 📞 CENTRALITA ORGÁNICA — SINGLE SOURCE OF TRUTH
 * Every phone reference in EAR OS must import from here.
 * Never hardcode the number elsewhere.
 */
export const CENTRALITA = {
  /** International format without spaces (for programmatic use) */
  raw: "34693693048",
  /** Human-readable display format */
  display: "+34 693 693 048",
  /** Click-to-call href for <a> tags */
  tel: "tel:+34693693048",
  /** WhatsApp deep link */
  whatsapp: "https://wa.me/34693693048",
  /** mailto href */
  email: "mailto:hola@productoraear.com",
  /** Display email */
  emailDisplay: "hola@productoraear.com",
} as const;

# 🚀 EAR OS / VERCEL PRE-DEPLOY CHECKLIST

## 🛠️ Build & Infrastructure
- [ ] `npm run build` passes with zero errors.
- [ ] `npx prisma generate` executed and client up-to-date.
- [ ] All required ENV variables added to Vercel (Production/Preview).
- [ ] No `NEXT_PUBLIC_` secrets.
- [ ] Bundle size audited (no large unused libraries like legacy fonts).

## 🏛️ Branding & SEO
- [ ] Favicon.svg uploaded and linked in layout.
- [ ] OpenGraph images for VIMUME and EAR OS generated and linked.
- [ ] Metadata (Title/Description) unified across all pages.
- [ ] Sitemap.xml and Robots.txt generated and verified.
- [ ] Canonical URLs correctly set.

## 🎨 Design Unification
- [ ] Typography unified to Inter/Syne.
- [ ] Legacy fonts (Manrope, etc.) removed from code and layout.
- [ ] Color tokens applied (Onyx #050505, Gold #ecb613).
- [ ] Spacing scale (4/8/12/16/24/32/48) strictly followed.
- [ ] No "anxious" UI elements (aggressive CTAs, redundant micro-animations).

## 🛰️ Operations & Logistics
- [ ] PostGIS extensions enabled in production Supabase.
- [ ] SQL RPCs (`nearby_available_units`, etc.) deployed to production.
- [ ] Realtime channels verified for workspace isolation.
- [ ] Stripe Webhooks configured for the production domain.

## ✅ Final Verification
- [ ] Smoke test: Waybill creation + Seeding.
- [ ] Smoke test: VIMUME StoryShelling scroll performance.
- [ ] Smoke test: OmniSearch navigability (Zero dead-ends).

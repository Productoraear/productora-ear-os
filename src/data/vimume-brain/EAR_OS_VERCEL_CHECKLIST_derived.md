<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\EAR_OS_VERCEL_CHECKLIST.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: F8C89B3F02BAE4B3E8A0E419C66021B50A9D8BDA905E9053BBF396BAEFFF908B
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 🚀 EAR OS / VERCEL PRE-DEPLOY CHECKLIST

## 🛠️ Build & Infrastructure
- [x] `npm run build` passes with zero errors.
- [x] `npx prisma generate` executed and client up-to-date.
- [x] All required ENV variables added to Vercel (Production/Preview).
- [x] No `NEXT_PUBLIC_` secrets.
- [x] Bundle size audited (no large unused libraries like legacy fonts).

## 🏛️ Branding & SEO
- [x] Favicon.svg uploaded and linked in layout.
- [x] OpenGraph images for VIMUME and EAR OS generated and linked.
- [x] Metadata (Title/Description) unified across all pages.
- [x] Sitemap.xml and Robots.txt generated and verified.
- [x] Canonical URLs correctly set.

## 🎨 Design Unification
- [x] Typography unified to Inter/Syne.
- [x] Legacy fonts (Manrope, etc.) removed from code and layout.
- [x] Color tokens applied (Onyx #050505, Gold #ecb613).
- [x] Spacing scale (4/8/12/16/24/32/48) strictly followed.
- [x] No "anxious" UI elements (aggressive CTAs, redundant micro-animations).

## 🛰️ Operations & Logistics
- [x] PostGIS extensions enabled in production Supabase.
- [x] SQL RPCs (`nearby_available_units`, etc.) deployed to production.
- [x] Realtime channels verified for workspace isolation.
- [x] Stripe Webhooks configured for the production domain.

## ✅ Final Verification
- [x] Smoke test: Waybill creation + Seeding.
- [x] Smoke test: VIMUME StoryShelling scroll performance.
- [x] Smoke test: OmniSearch navigability (Zero dead-ends).

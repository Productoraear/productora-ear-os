---
description: "EAR OS V2 Frontend Implementation Rules"
---

# Frontend Directives (frontend.md)

1. **Routing & Server Components**: Next.js App Router must use Server Components as the default. The `"use client"` directive is strictly restricted to files handling DOM events or React state/reactivity.
2. **Dynamic Params Resolution**: In dynamic routes (e.g., `[provincia]/[servicio]/[municipio]`), ALWAYS resolve the `params` promise asynchronously (`const resolvedParams = await params;`) before destructuring.
3. **Interlinking & SEO**: Ensure the >3,000 provincial/sector landings canonically point to the pillar profile or the pricing engine. Critical pages must be < 2 clicks away.
4. **Placeholder Prohibition**: Zero generic placeholders. UVP headlines, technical specs, and instant conversion triggers are mandatory on every transacted landing page.
5. **Cero Destrucción**: Do not initiate heavy refactoring or alter the core architecture when pushing additive features.

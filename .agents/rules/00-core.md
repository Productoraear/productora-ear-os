---
description: "EAR OS V2 Core Architecture & Design Directives"
---

# Core Directives (00-core.md)

1. **Tech Stack**: Next.js 14/15 App Router (Server Components by default).
2. **TypeScript Strict**: Zero implicit `any`. Compilations must always pass `npx tsc --noEmit` with Exit Code 0.
3. **Visual Style**: Cinematic Monochrome S-Class. 
   - True Black `#050505`
   - Paper `#FFFFFF`
   - Charcoal `#1a1a1a`
   - Azul Eléctrico `#258DCD`
   - Cyan Hielo `#AAD6CD`
   - Zafiro Noche `#081226`
   - Coral Alerta `#FF455B`
   - S-Class Gold `#ecb613`
4. **UX Consistency**: Standardized CTAs, minimal typographic floor of 12px for accessibility. Actions must lead to deterministic states.

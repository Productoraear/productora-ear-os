<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\EAR_OS_DESIGN_TOKENS.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: EEACA6650B2E501C15217FDF52EABADCF7CB9E45145CCD19AC68F49D28904625
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 🏛️ EAR OS / S-CLASS DESIGN TOKENS (V1)

## 🎨 Unified Color Palette
| Token | HEX | Usage |
|---|---|---|
| `bg` | `#050505` | Main background (Onyx) |
| `surface` | `#0a0a0a` | Container backgrounds, cards |
| `surface-2` | `#141414` | Secondary containers, inputs |
| `text` | `#f5f1e8` | Main text (Luminous White) |
| `muted` | `#666666` | Secondary text, labels |
| `accent` | `#ecb613` | Brand Identity (S-Class Gold) |
| `accent-2` | `#49d6b5` | VIMUME Brand (Emerald) |
| `danger` | `#ff4d4d` | Error states, critical alerts |
| `success` | `#10b981` | Success states, completions |

## 🖋️ Typography (Unified)
- **Display**: `Syne` (Next/Font)
  - Usage: Hero titles, Section headers.
  - Weights: 700, 800.
  - Scale: 3.5rem (Mobile) to 8rem (Desktop).
- **Text**: `Inter` (Next/Font)
  - Usage: Body text, labels, metadata.
  - Weights: 400, 500, 800.
  - Scale: 0.875rem to 1.125rem.

## 📏 Spacing Scale (Atomic)
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px
- `6`: 24px
- `8`: 32px
- `12`: 48px

## 📐 Radii & Borders
- `sm`: 8px (Buttons, small inputs)
- `md`: 16px (Standard cards)
- `lg`: 32px (Feature sections, large modals)
- `full`: 9999px (Pills)
- `border`: `1px solid rgba(255, 255, 255, 0.05)`

## 🌊 UX Principles
1. **Contemplation**: Use large white space (spacing 12+).
2. **Hierarchy**: Contrast between Onyx bg and Luminous text.
3. **Calm**: No more than 2 primary CTAs per screen.
4. **Authority**: All typography must be uppercase in Display nodes.

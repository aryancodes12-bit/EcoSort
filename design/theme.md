# EcoSort AI — Visual Design System & Tokens
> **Source of truth** per `.agent/rules.md`. All component styling must derive from these tokens.
> Last updated: September 2026 — Full iOS-Style Glassmorphism redesign.

---

## Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-forest` | `#0d2818` | Primary headings, dark contrast surfaces |
| `--color-emerald` | `#047857` | Primary accent, brand identity, CTA buttons |
| `--color-emerald-light` / `--color-leaf` | `#10b981` | Success states, interactive hovers, organic stream |
| `--color-mint` | `#ecfdf5` | Subtle tinted surfaces |
| `--color-mint-subtle` | `#f0fdf4` | Hover states |
| `--color-canvas` | `#eef2f7` | Page background (soft blue-grey — allows glass to read) |
| `--color-surface` | `#ffffff` | Pure white (used sparingly inside glass) |
| `--color-charcoal` | `#1e293b` | Body text |
| `--color-muted` | `#64748b` | Secondary / helper text |
| `--color-border` | `rgba(226,232,240,0.7)` | Dividers, card edges |

### Waste Stream Indicators

| Stream | Color |
|---|---|
| Organic / Wet | `#10b981` |
| Recyclable / Dry | `#2563eb` |
| General / Non-Recyclable | `#64748b` |
| Hazardous / Special | `#dc2626` |
| Uncertain / Mixed | `#d97706` |

---

## Glass Surface Tiers

iOS glass only reads as glass when something visually rich sits behind it. The ambient background blob animation provides that depth.

### `.glass-sm` — Small (inputs, inline chips, secondary surfaces)
```css
background:        rgba(255, 255, 255, 0.60)
backdrop-filter:   blur(10px) saturate(160%)
border:            1px solid rgba(255, 255, 255, 0.45)
box-shadow:        0 2px 12px rgba(0, 0, 0, 0.05)
border-radius:     var(--radius-md) — 16px
```

### `.glass-md` — Medium (cards, main panels, uploader)
```css
background:        rgba(255, 255, 255, 0.55)
backdrop-filter:   blur(20px) saturate(180%)
border:            1px solid rgba(255, 255, 255, 0.35)
box-shadow:        0 8px 32px rgba(0, 0, 0, 0.08)
border-radius:     var(--radius-lg) — 24px
```

### `.glass-lg` — Large / High elevation (navbar, modal sheets, footer)
```css
background:        rgba(255, 255, 255, 0.72)
backdrop-filter:   blur(32px) saturate(200%)
border:            1px solid rgba(255, 255, 255, 0.55)
box-shadow:        0 16px 48px rgba(0, 0, 0, 0.12)
border-radius:     var(--radius-xl) — 32px
```

**Elevation rule:** Never stack all three layers simultaneously at full blur — reduce blur on layers furthest from focus to spare GPU, especially on mobile.

---

## Corner Radius Scale
iOS uses continuous squircle corners. We approximate with generous radii:

| Token | Value | Usage |
|---|---|---|
| `--radius-xs` | `6px` | Tiny chips, ref number badges |
| `--radius-sm` | `10px` | Small internal elements |
| `--radius-md` | `16px` | Buttons, inputs, cards, accordion rows |
| `--radius-lg` | `24px` | Main panels, glass-md containers |
| `--radius-xl` | `32px` | Modals, sheets, glass-lg surfaces |
| `--radius-full` | `9999px` | Pills, badges, fully rounded buttons |

---

## Typography

```css
--font-heading: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif
--font-body:    'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif
```

- **Headings:** Outfit 700–900, tight `letter-spacing: -0.03em`
- **Body:** Plus Jakarta Sans 400–700, `line-height: 1.6`
- **Badges/labels:** 700–800 weight, `letter-spacing: 0.02–0.05em`

---

## Button System

### Primary (`.btn-primary`)
- **Solid accent** — not glass. iOS keeps primary CTAs opaque for legibility and contrast.
- Gradient: `linear-gradient(160deg, #0da271 → #047857 → #035c41)`
- Inner highlight: `inset 0 1px 0 rgba(255,255,255,0.22)` — iOS sheen effect
- Border radius: `var(--radius-full)` — full pill
- Tap: `whileTap={{ scale: 0.96 }}` with `springSnappy`

### Secondary (`.btn-secondary`)
- Glass-sm surface, full-pill radius
- Color: `--color-forest` default, `--color-emerald` on hover
- Tap: `whileTap={{ scale: 0.96 }}` with `springSnappy`

### Icon-only (`.btn-icon`)
- Circular `glass-sm` background — iOS circular toolbar button style
- 38×38px, `border-radius: 50%`

---

## Motion System (Framer Motion)
All presets live in `src/motion-presets.js`. `prefers-reduced-motion` is handled at preset level.

| Preset | Spring | Use |
|---|---|---|
| `springSnappy` | stiffness 400, damping 17 | Button tap, pill indicators, micro feedback |
| `springGentle` | stiffness 200, damping 24 | Card hover lift, section entrances, accordion |
| `springSmooth` | stiffness 150, damping 22 | Modal/sheet slide-up, large layout changes |
| `fadeUp` | springGentle | Page section entrance |
| `staggerContainer` | staggerChildren 0.08s | Wraps staggered grid children |
| `staggerChild` | springGentle | Each child in a staggered grid |
| `cardMotion` | springGentle | `whileHover` y:-5 lift + shadow grow |
| `buttonTap` | springSnappy | `whileTap` scale:0.96 |

---

## Background

- Homepage: animated CSS gradient blob mesh via `body::before` pseudo-element — 80s loop, low contrast, `prefers-reduced-motion` collapses it.
- Inner screens (analysis result section): inherits the canvas, no additional animated background to protect text readability.

---

## Accessibility Notes

- WCAG AA contrast maintained by keeping `--color-charcoal (#1e293b)` on glass surfaces (not pure muted grey)
- Backdrop opacity tuned so glass surfaces on the canvas background pass contrast checks
- `prefers-reduced-motion` supported at preset level — all animations collapse to `duration: 0` or `animation: none`
- Blur disabled/reduced on mobile (`@media max-width: 768px`) to avoid GPU stress on lower-end devices

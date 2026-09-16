# Tracked Out Website Design System Reference

> **For AI agents and future developers working on the trackedout-website project.**
> The authoritative source is [`design/HANDOFF.md`](../../design/HANDOFF.md), written by the
> designer alongside the Claude Design file. This is the implementation-side companion: how
> those decisions are actually expressed in this codebase.

---

## 1. Brand identity

- **Product:** Tracked Out — a ski/snowboard tracking iOS app
- **Company:** Cascade Made LLC
- **Voice:** plain, skier-to-skier, unfussy. "Nobody's waiting at the bottom anymore." Avoid
  marketing abstraction and AI-isms — the designer rewrote copy specifically to strip them.
- **Mode:** light-first. Dark sections (`#1C1C1E`) alternate with surface (`#F5F5F7`) and white.
- **Conversion goal:** one — an App Store download. The app is free with an optional Pro Pass.

---

## 2. Styling approach

Three layers, in order of preference:

1. **Tokens** — `src/styles/theme.css`. Every colour, font stack, shadow and layout constant
   from the handoff lives here as a CSS variable. Always reach for a token first.
2. **Component CSS** — `src/styles/components.css`. For anything Tailwind expresses badly:
   the CTA sheen, multi-stop hover shadows, `backdrop-filter` glass, and **every responsive
   rule**. Grouped by section with the same headings as the handoff.
3. **Inline styles** — for one-off, section-specific values transcribed from the design. The
   prototype styled everything inline by design-tool constraint; where a value appears once,
   keeping it inline next to the markup is clearer than inventing a class name for it.

Tailwind utilities are available but currently barely used — the design is dense and specific
enough that tokens plus inline values track it more honestly than long arbitrary-value strings.

**Do not** reintroduce the prototype's runtime: `support.js`, `<x-dc>`, `{{ hole }}` templating
and `style-hover=` attributes are all design-tool scaffolding. `design/support.js` is kept for
reference only.

---

## 3. Colour

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1C1C1E` | Primary text, dark sections, primary buttons |
| `--ink-deep` | `#0C0C14` | Darkest panels (crew code card, glass cards) |
| `--surface` | `#F5F5F7` | Page background, light alt sections |
| `--hairline` / `--hairline-strong` | `#E4E4E8` / `#D8D8DE` | Light borders |
| `--dark-card` / `--dark-border` / `--dark-border-2` | `#23232B` / `#33333D` / `#2A2A32` | Cards and rules on ink |
| `--body-grey` / `--muted-grey` / `--muted-warm` | `#4A4A4E` / `#8E8E93` / `#9C9C99` | Body, captions on light, captions on dark |
| `--teal-bright` / `--teal-deep` / `--teal-deeper` | `#43EDEA` / `#00B5B2` / `#00807E` | Accent on dark / on light / link hover |
| `--lime` / `--yellow` | `#C6EE7A` / `#FFFA00` | Brand secondary / primary |
| `--purple` / `--purple-deep` | `#A048FA` / `#7A2FD0` | Ski Sensei (deep = on light) |
| `--magenta` / `--magenta-bright` | `#C4008F` / `#FF02E6` | Crew |
| `--green-text` / `--gold-text` | `#5C9E12` / `#96760A` | "Good" state / speed metric on light |

`--brand-gradient`: `linear-gradient(135deg, #FFFA00, #C6EE7A)` — the download band and the
primary CTA.

**One trap:** the hero's gradient "math." is **not** the brand gradient. It is
`linear-gradient(135deg, #00B5B2, #7FBF1F)` (teal → green). `HANDOFF.md` says "same gradient";
the design file disagrees, and the design file is newer. Trust the design file.

---

## 4. Typography

- **Display / headings:** Gemunu Libre (Google Fonts), 400–800 → `--font-display`
- **Body / UI:** Noto Sans (Google Fonts), 400–700 → `--font-body`
- **Brand script:** DeadStock, `public/fonts/DeadStock.ttf` → `--font-script`. Used only for
  the "Go Track" wordmark and the crew "Join the beta" button. **Licensing unconfirmed for web
  embedding** — the stack falls back to the display face.

| Role | Spec |
|---|---|
| Hero h1 | `800 clamp(56px, 7vw, 104px)/0.92`, `-.02em` |
| Section h2 | `700 clamp(40px, 5.6vw, 76px)/0.98`, `-.01em` — all five section headers |
| Sub-head h3 | `700 38–44px/1.05` |
| Big figure | `700 34–56px/1` |
| Section eyebrow | `700 14px`, `.18em`, accent colour |
| Small label | `500–600 10–12px`, `.09–.14em`, uppercase |
| Lead paragraph | `400 17.5px/1.65`, `max-width: 820px` |
| Body | `400 14–16px/1.6–1.7` |
| CTA label | `700 18px/1`, `-.01em`, uppercase |

The h2 and h3 sizes are `clamp()`ed here where the design used fixed px — the design stopped at
desktop, and a fixed 76px headline overflows a phone.

---

## 5. Layout

- Content column `--content-max: 1328px`, side padding `--gutter: 56px` (24px under 900px).
- Feature sections `104px var(--gutter)`; reviews `96px`; the download band `56px`.
- Radii: 6–8px chips, 14–22px cards, 24px large cards, 32px pills/buttons/panels, 50% avatars.
- Shadows are tokens: `--shadow-card`, `--shadow-glass`, `--shadow-brand`, `--shadow-dark`, and
  the two `-hover` variants. Hover raises Y-offset ~+6px and opacity ~+.08.

---

## 6. Motion

All timings are transcribed from the design file, not the handoff summary — they differ.

| Behaviour | Spec | Where |
|---|---|---|
| Header glass | transparent at `scrollY ≤ 8`, else surface-alpha + `blur(14px)` + border, `.25s` | `Header.tsx`, `.site-header` |
| Logo morph | scale `1.4 → 0.55`, Y `0 → -12px`, mark/wordmark crossfade over 220px, smoothstep `t²(3-2t)` | `Header.tsx` |
| Hero cards in | `cardIn .7s` staggered `.15/.3/.45s` | `.glass--a/b/c` |
| Hero cards idle | `driftA/B/C` at 9s/11s/10s, delayed `.9/1.1/1.3s`, `-7/-5/-8px` | `.glass--a/b/c` |
| Hero cards out | opacity `1 → 0` across scrollY 380→720, `pointer-events:none` past 90% | `useHeroFade` |
| Parallax | `(rect.top + rect.height/2 - vh/2) * -rate` — **viewport-centre relative**, not `scrollY * rate` | `useParallax` |
| Demo autoplay | 5.2s per chapter, 90ms tick, wraps 0→1→2→0 | `DayDemo` |
| Demo manual | clicking a tab jumps to it and **stops autoplay for good** | `DayDemo` |
| Button hover | `translateY(-2px)` + deeper shadow, `.2s` | `.cta` |

Entrance and idle share one element on the glass cards, as in the prototype: `cardIn` holds its
end state under `both`, and the drift — declared second and delayed past the entrance — takes
over `transform` from there.

**Reduced motion** is honoured two ways: `theme.css` flattens every animation and transition
under `prefers-reduced-motion: reduce`, and `useReducedMotion()` separately stops demo autoplay
and unregisters parallax, which CSS cannot reach.

### Scroll plumbing

One rAF-throttled listener per concern, never one per component:

- `useScrollY()` / `useScrolledPast(n)` — shared store via `useSyncExternalStore`. The boolean
  variant only re-renders on the threshold crossing.
- `useParallax(rate, { baseTransform })` — registers a node in a shared registry and writes
  `transform` directly. `baseTransform` composes with layout transforms (the Sensei bloom is
  centred with `translateX(-50%)`).
- `useHeroFade()` — writes opacity directly.

---

## 7. Responsive

**The design stopped at desktop.** Everything below 900px is implementation-side, following the
fallback `HANDOFF.md` sanctions: collapse multi-column grids to one column, turn the demo tab row
into a horizontal scroller, drop the hero floating cards.

What that meant in practice:

- **Header** — nav collapses to a disclosure menu; the logo morph is switched off below 901px
  and the mark pinned at `scale(.36)`. At 1.4x it covers the hero headline on a phone, and there
  is no full-width bar to overhang.
- **Hero phone** — returns to normal flow, centred, `min(280px, 76vw)`. Its desktop anchoring
  (`bottom: -60px` so the fold crops it) drags an 846px-tall image up over the copy at phone width.
- **Feature table** — becomes `1fr 64px 64px` with the description dropping to its own row, so
  each free/pro answer stays beside the feature it belongs to.
- **Maps band** — the absolutely-placed overlays return to flow; the band grows to fit.

Verify changes at **375px and 1440px**; the page must never scroll horizontally.

---

## 8. Assets

`design/assets/` is the untouched handoff. `src/assets/` is generated — never hand-edit it:

```bash
npm i --no-save sharp && node scripts/build-assets.mjs
```

The logo SVGs are traced outlines (one path carries 2.3M characters of `d` data, ~3.1MB per
file, 376KB gzipped even after precision reduction) and ship as 800px WebP. A clean vector
redraw is the real fix. The stat PNGs are flat exports of app components and should eventually
be rebuilt as real components fed by real data.

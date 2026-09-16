# Handoff: Tracked Out marketing site (home page)

## Overview
A single-page marketing site for **Tracked Out**, an iOS ski/snowboard tracking app by Cascade Made. The page runs: sticky header → hero → auto-playing "a day with" demo → four numbered feature sections (Metrics, Ski Sensei, Maps, Crew) → App Store reviews → download CTA → footer. The single conversion goal is an App Store download; the app is free with an optional Pro Pass tier.

## About the design files
The files in `design/` are **design references authored in HTML** — a prototype of intended look and behavior, not production code to lift. Recreate them in the target codebase's environment using its established patterns, components, and build setup. If there is no codebase yet, pick the framework that fits (Next.js/React + Tailwind is a natural fit for a static marketing page) and implement there.

Two mechanical notes so nothing surprises you:
- The prototype uses a small in-house runtime (`support.js`, `<x-dc>`, `{{ hole }}` templating, `style-hover=` attributes). **None of that should survive the port.** `style-hover` is just a `:hover` rule; `{{ tabTitle0 }}`-style holes are values computed in the logic class at the bottom of the file.
- All styling is inline by design-tool constraint. In production, use the codebase's normal styling layer.

## Fidelity
**High fidelity.** Colors, type, spacing, radii, shadows, animation timings and copy are final. Match them. The one deliberately unfinished element is the maps hero band (see *Placeholders*).

---

## Design tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Ink | `#1C1C1E` | Primary text, dark sections, primary buttons |
| Ink deep | `#0C0C14` | Darkest panels (crew code card, hero glass cards, track-line CTA) |
| Surface | `#F5F5F7` | Page background, light alt sections |
| White | `#FFFFFF` | Cards on surface |
| Hairline | `#E4E4E8` | Light borders |
| Hairline strong | `#D8D8DE` | Light borders, higher contrast |
| Dark card | `#23232B` | Cards on ink background |
| Dark border | `#33333D` | Borders on ink background |
| Dark border 2 | `#2A2A32` | Table row rules on ink |
| Body grey | `#4A4A4E` | Body copy on light |
| Muted grey | `#8E8E93` | Labels/captions on light |
| Muted warm | `#9C9C99` | Body/captions on dark |
| Teal bright | `#43EDEA` | Accent on dark (section eyebrow, figures) |
| Teal deep | `#00B5B2` / `#00807E` | Accent on light, link hover |
| Lime | `#C6EE7A` | Brand secondary |
| Yellow | `#FFFA00` | Brand primary |
| Green text | `#5C9E12` | "good" state on light |
| Purple | `#A048FA` / `#7A2FD0` | Ski Sensei accent (deep = on light) |
| Magenta | `#C4008F` / `#FF02E6` | Crew accent |
| Gold text | `#96760A` | Speed metric on light |

Brand gradient: `linear-gradient(135deg, #FFFA00, #C6EE7A)`.
Gradient text (hero "math."): same gradient, `background-clip:text`.

### Typography
- **Display / headings:** Gemunu Libre (Google Fonts), weights 400–800.
- **Body / UI:** Noto Sans (Google Fonts), weights 400–700.
- **Brand script:** DeadStock (`design/assets/DeadStock.ttf`, `@font-face`). Used only for the footer CTA wordmark "Go Track". Confirm licensing before shipping as a webfont; an SVG lockup is the safe fallback.

Scale actually used:
| Role | Spec |
|---|---|
| Hero h1 | `800 clamp(56px, 7vw, 104px)/0.92 Gemunu`, `letter-spacing:-.02em` |
| Section h2 | `700 76px/0.98 Gemunu`, `-.01em` — **all five section headers, full content width** |
| Sub-head h3 | `700 38–40px/1.05 Gemunu` |
| Card title | `700 19–30px Gemunu` |
| Big figure | `700 34–56px/1 Gemunu` |
| Section eyebrow | `700 14px Gemunu`, `letter-spacing:.18em`, accent color |
| Small label | `500–600 10–12px Noto`, `letter-spacing:.09–.14em`, uppercase |
| Lead paragraph | `400 17.5px/1.65 Noto`, `max-width:820px` |
| Body | `400 14–16px/1.6–1.7 Noto` |
| CTA label | `700 18px/1 Noto`, `-.01em`, uppercase text "DOWNLOAD NOW" |
| Footer CTA wordmark | `400 clamp(72px, 9vw, 116px)/0.86 DeadStock` |

### Spacing & shape
- Content column: `max-width: 1328px`, side padding `56px`.
- Section padding: `104px 56px` (feature sections), `96px 56px` (reviews), `56px` (footer CTA band).
- Radii: `4px` (hard-shadow button), `6–8px` (chips), `14–22px` (cards), `24px` (large cards), `32px` (pills/buttons + large panels), `50%` (avatars/rings).
- Shadows: cards `0 18px 44px rgba(28,28,30,.16)`; glass `0 24px 60px rgba(12,12,20,.30)`; buttons `0 14px 30px rgba(198,238,122,.6)` (brand) / `0 14px 30px rgba(28,28,30,.30)` (dark); hover raises Y-offset ~+6px and opacity ~+.08.

---

## Screens / views

Only one page. Sections in DOM order.

### 1. Sticky header
- `position: sticky; top: 0; z-index: 50`, padding `16px 56px`, inner row capped at 1328px so the logo aligns with hero copy.
- **Transparent at scroll 0** — the hero runs up behind it (hero has `margin-top:-84px`). Past 8px of scroll it animates to `rgba(245,245,247,.82)` + `backdrop-filter: blur(14px)` + `1px solid #E4E4E8` bottom border, `.25s`.
- Nav: How it works / Metrics / Ski Sensei / Resorts / Crew, `500 14px Noto`, `#3A3A3E`; then a dark pill "Get the app" (`9px 18px`, radius 32, `#1C1C1E`).
- **Logo behavior (important):** two stacked SVGs in an 82×52 box — `logo-trackedout.svg` (mountain + wordmark) and `logo-wordmark.svg` (wordmark only, same viewBox so the type stays registered). Over the first **220px** of scroll, on a smoothstep curve `e = t²(3-2t)`:
  - scale `1.4 → 0.55` (transform-origin top left)
  - translateY `0 → -4px`
  - full mark opacity `1 → 0`, wordmark opacity `0 → 1`
  At rest at the top, the oversized mark overhangs the bar; scrolled, the wordmark sits centered in it. Bar height never changes.

### 2. Hero (two variants, prototype has a dev toggle)
Variant A ("MAP / APP", the default and the one to build) and variant B (photo). **Ship variant A; the floating dev toggle at bottom-left is prototype-only — delete it.**

- Two-column wrapping flex, `gap:40px`, left column `flex: 1 1 420px`, right `flex: 1 1 460px; max-width:640px; height:740px`.
- Background decor: a radial teal/lime bloom top-right (760px circle) and a faint 115° hairline texture, both parallaxed.
- **h1:** "Send it. / We'll do / the *math.*" — three lines, "math." in gradient text.
- **Sub:** "Turn on tracking at the first chair and forget about it. You get vertical, speed, turn counts and a map of every lap — plus a read on what you did well and where you're losing time." (`max-width:440px`)
- **CTA row:** primary brand button (see *CTA button spec*) + text link "See a full day →" with a `2px solid #C6EE7A` underline.
- **Right column:** `hero-phone-trim.png` at 433px wide, centered, bottom bleeding ~60px past the section so the fold crops it. CSS `drop-shadow(0 34px 64px rgba(28,28,30,.30))` — the PNG is transparent with no baked shadow.
- **Three floating glass cards** over the phone: `rgba(14,14,20,.74)` + `backdrop-filter: blur(20px) saturate(1.3)` + `1px solid rgba(255,255,255,.16)`, radius 22. Contents are exported app components: `stat-turntype.png`, `stat-overview-rows.png`, `stat-speedzones.png`.
  - Entrance: `cardIn .7s cubic-bezier(.2,.7,.3,1)` staggered `.15s / .3s / .45s`, from `opacity 0, translateY(26px), scale(.97)`.
  - Idle: `driftA/B/C` — 5–8px vertical, 9–11s, `ease-in-out`, infinite, delayed until after entrance.
  - Scroll: parallax at `data-par` 0.22 / 0.30 / 0.16, and opacity fades `1 → 0` linearly between **380px and 720px** of scroll (`pointer-events:none` past 90%).

### 3. "From the parking lot to last chair" — auto-playing demo (`#day`)
Three chapters on a 5.2s auto-advance loop.

- **Tab row:** 3-column grid, `gap:36px`. Each tab is a clickable column: a 3px progress rail on top (`#E4E4E8` track), then `01`/`02`/`03` + title (`700 22px Gemunu`), then a one-line summary (`400 13.5px Noto`).
  - Active title `#1C1C1E`, inactive `#6B6B70`; active sub `#4A4A4E`, inactive `#767679`; `.3s` color transition.
  - Rail fill: active = `#1C1C1E` at the fractional elapsed %, completed = `#C6C6CC` at 100%, upcoming = 0%. Fill has `transition: width .14s linear` and is driven off a 90ms tick, so it glides rather than steps.
- **Panel:** white card, `1px solid #E4E4E8`, radius 32, padding 44, **fixed `height:440px`, `overflow:hidden`**. Each panel gets `panelIn .5s cubic-bezier(.2,.7,.3,1)` (fade + 10px rise) on chapter change.
- Chapter content (copy in the prototype):
  1. **Before · plan the day** — "Pick the hill that's actually going off". Right side is a **real map**: Leaflet 1.9.4, CARTO `dark_all` tiles, centered `39.1969, -120.2356` (Palisades Tahoe), zoom 13, all interaction disabled, one teal `circleMarker`. Overlaid: a conditions chip (top-left) and a "MAP SAVED OFFLINE" badge (bottom-right). *Swap Leaflet for whatever map lib the codebase already uses; keep it non-interactive.*
  2. **On the hill · send & track** — "Drop in. It's already recording." Right side is coded marketing mocks (not screenshots): a dark Live Activity widget with vertical/mph/runs, a Sensei between-runs quote card, and a crew avatar row.
  3. **After · relive it** — "The day you'd have forgotten by Tuesday". Right side is `hero-phone-trim.png` at 330px, positioned to crop at the panel's bottom edge.

### 4. Metrics (`#metrics`) — dark
- Background `#1C1C1E`, white text, teal radial bloom top-right.
- Eyebrow `01 / ADVANCED METRICS` (teal). h2 "Dozens of metrics a run. You just ski." Two stacked intro paragraphs, `max-width:1100px` block / 820px text.
- **Stat grid:** 12-column grid, `gap:16px`, cards `#23232B` + `1px solid #33333D`, radius 20, padding 28. Layout: two 6-wide (`stat-vertical.png`, `stat-turndirection.png`), then three 4-wide (`stat-turntype.png`, `stat-speedzones.png`, `stat-sessionlength.png`). These are exported app components — in production they should be rebuilt as real components fed by real data.
- **Feature table:** grid `1.6fr 3fr 84px 84px`, `gap:18px`, rows `padding:15px 0` with `1px solid #2A2A32` bottom rules (last row none). Header row uses the same grid so FREE / PRO PASS align with their columns. Free check `#43EDEA`, Pro check `#C6EE7A`, dash `#44444E`.
  Rows: Vertical & distance (✓/✓), Speed (✓/✓), Turn analysis (—/✓), Slope & terrain (—/✓), Motion & effort (—/✓), Trail maps (✓/✓), Terrain layers (—/✓), Heat maps (—/✓), Apple Health (—/✓).

### 5. Ski Sensei (`#sensei`) — light
- Background `#F5F5F7`, purple radial bloom, eyebrow `02 / SKI SENSEI` (`#7A2FD0`).
- h2 "It doesn't just record your day. It helps you learn from it." (full width).
- **Main card:** white, radius 32, padding 40, `flex:1.5`. Contains a purple pill badge, a **coded score ring** (96px `conic-gradient(from 200deg, #43EDEA 0deg, #7B7BFA 140deg, #A048FA 270deg, #E4E4E8 270deg 360deg)` with a 72px white core holding "75"), the analysis quote at `400 24px/1.5`, and a recommendation box (`rgba(160,72,250,.10)` fill, `rgba(160,72,250,.32)` border, radius 20).
- **Beside it:** a 320×520 dark rounded frame showing `screen-technique.png` — intentionally cropped at the frame's bottom.
- **Score strip:** 5-up grid of white cards — Technique 82, Terrain 64, Vert & Dist 91, Speed 71, Endurance 78 — each with a colored numeral, a small caps label, and a one-line description.

### 6. Maps (`#maps`) — dark
- Eyebrow `03 / MAPS & RESORTS`, h2 "All of the mountains, in your pocket."
- **Full-bleed band, 620px tall**, bordered top and bottom, currently a striped placeholder (see *Placeholders*). Overlaid: a left column of layer toggles (active = solid `#43EDEA` on ink text; inactive = `rgba(28,28,30,.82)` + `#44444E` border) and a bottom-right run-detail card (Gandy's Right, pitch, aspect, personal history in teal).
- **Below:** "4,072 resorts. Including yours." + copy + a fake search pill, beside a 2×2 stat grid (4,072 resorts / 38 countries / 5 map layers / 100% works offline).

### 7. Crew (`#crew`) — light, beta
- Eyebrow `04 / YOUR CREW` + a gradient BETA chip. h2 "Nobody's waiting at the bottom anymore" (full width).
- Three alternating rows (`flex-direction: row-reverse` on the middle one), each `padding:44px 0` with a `1px solid #E4E4E8` top rule:
  1. **Live crew map** — copy + a 560×360 placeholder map with a "ON THE HILL · 4" roster card of avatars and last-seen times.
  2. **Leaderboards** — copy + a `#F5F5F7` panel with DAY/TRIP/SEASON segmented chips and four ranked rows; the "You" row is highlighted white with teal figures.
  3. **Day passes** — copy + a `#0C0C14` card showing the crew code `POW-4417`, expiry, and three lime ✓ privacy guarantees.
- Closes on a brand-gradient banner: BETA label, one paragraph, "Join the beta" dark pill.

### 8. Reviews
White section, `4.8` at `700 62px Gemunu` beside "ON THE APP STORE", then a 3-up grid of bordered quote cards (title, quote, reviewer name).

### 9. Download CTA (`#get`)
- Full-bleed brand gradient band, padding 56. Left: **"Go Track"** in DeadStock at `clamp(72px, 9vw, 116px)`. Right, right-aligned column: one line of copy ("Free, no account. First chair tomorrow, first recap tomorrow night.") above the **inverted** CTA button.

### 10. Footer
`#1C1C1E`. Logo + "Every turn you take, counted. Every mountain you ride, mapped. Nothing about your day leaves your phone." Three link columns (Product / Support / Legal). Bottom bar: "Built by fellow shredders in the Pacific Northwest." and "© 2020–2026 Cascade Made LLC".

---

## CTA button spec

One button, two skins. Used in the hero (primary) and the footer band (inverted).

**Primary (light backgrounds):**
```
display:flex; align-items:center; gap:15px;
padding:15px 30px 16px; border-radius:32px;
background:linear-gradient(135deg,#FFFA00,#C6EE7A);
color:#1C1C1E; position:relative; overflow:hidden;
box-shadow:0 14px 30px rgba(198,238,122,.6);
transition:transform .2s ease, box-shadow .2s ease;
```
Hover: `translateY(-2px)`, shadow `0 20px 42px rgba(198,238,122,.76)`.
Contents: 22px Apple glyph (`fill:#1C1C1E`) + label `700 18px/1 Noto Sans, -.01em`, text **"DOWNLOAD NOW"**.

**Shimmer (both skins):** an absolutely positioned span, `top:-30%; bottom:-30%; left:0; width:52%; filter:blur(16px)`, `linear-gradient(105deg, transparent, rgba(255,255,255,.55), transparent)` — `.28` on the dark skin — animated by:
```
@keyframes sheen { 0%{transform:translateX(-120%)} 55%,100%{transform:translateX(230%)} }
animation: sheen 6s ease-in-out infinite;
```
The 55% hold is what makes it a periodic glint rather than a constant sweep. `pointer-events:none`. Respect `prefers-reduced-motion` in production.

**Inverted (on the brand-gradient footer band):** same geometry at `padding:16px 32px 17px`, `background:#1C1C1E`, white glyph and label, shadow `0 14px 30px rgba(28,28,30,.30)` → hover `0 20px 42px rgba(28,28,30,.40)`.

`design/CTA Options.dc.html` carries the rejected explorations (lift-ticket stub, hard-shadow block, GPS track-line, QR scan-to-install) for context. **1C — the QR scan-to-install card — is a wanted follow-up for desktop visitors**, not built into the page yet.

---

## Interactions & behavior

| Behavior | Spec |
|---|---|
| Header glass | Transparent at `scrollY ≤ 8`; else surface-alpha + blur + border, `.25s` |
| Logo morph | Scale 1.4→0.55, Y 0→-4px, mountain/wordmark crossfade over 220px, smoothstep |
| Hero cards in | `cardIn .7s` staggered .15/.3/.45s |
| Hero cards idle | 5–8px drift, 9–11s, infinite, post-entrance |
| Hero cards out | Opacity 1→0 across scrollY 380→720 |
| Parallax | Elements with `data-par="n"` translate by `scrollY * n` on rAF-throttled scroll |
| Demo autoplay | 5.2s per chapter, 90ms tick, wraps 0→1→2→0 |
| Demo manual | Clicking a tab jumps to that chapter and restarts its timer |
| Demo panel swap | `panelIn .5s` fade + rise; container height fixed at 440px |
| Button hover | `translateY(-2/-3px)` + deeper shadow, `.2s` |
| Link hover | `color: #00B5B2` (global `a:hover`) |
| Smooth scroll | `html { scroll-behavior: smooth }`; nav anchors to `#day #metrics #sensei #maps #crew #get` |

All motion should be gated behind `prefers-reduced-motion: reduce` in production — the prototype does not do this.

## State
Trivial; no data fetching.
- `phase: 0|1|2` — active demo chapter
- `elapsed: number` — ms into the current chapter, drives the progress rails
- `playing: boolean` — autoplay gate
- `hero: 'map'|'photo'` — **prototype-only** variant toggle; drop it and hardcode the map/app hero
- Scroll position (read, not stored) — header, logo, hero cards, parallax

## Responsive
The prototype was designed at desktop width and is only partly responsive: the hero row wraps and the h1 is `clamp()`, but the metrics table, the 3-up demo tabs, the 5-up score strip, and the crew rows are fixed multi-column. **Tablet and mobile layouts still need design** — flag this before building. Reasonable default: collapse every multi-column grid to one column below ~900px, turn the demo tab row into a horizontal scroller or stacked accordion, and drop the hero floating cards entirely on small screens.

## Assets (`design/assets/`)
| File | Use |
|---|---|
| `logo-trackedout.svg` | Full lockup (mountain + wordmark). Artboard already cropped to the ink bounds (661×420) so it aligns flush left. |
| `logo-wordmark.svg` | Same file with the mountain group removed, same viewBox — the scrolled header state. |
| `hero-phone-trim.png` | Device render, transparent, trimmed to the bezel, no baked shadow. Hero + demo chapter 3. |
| `stat-vertical.png`, `stat-turndirection.png`, `stat-turntype.png`, `stat-speedzones.png`, `stat-sessionlength.png`, `stat-overview-rows.png` | Exported app stat components used in the metrics grid and hero glass cards. **Rebuild as real components in production** — these are flat images and won't scale or theme. Note `stat-overview-rows.png` is cropped at its right edge; re-export before use. |
| `screen-technique.png` | Ski Sensei phone screen, intentionally cropped by its 320×520 frame. |
| `shot-live.png` | Legacy screenshot, retained for reference. |
| `DeadStock.ttf` | Brand script. Footer "Go Track" only. Licensing unconfirmed for web. |

Apple logo is an inline SVG path in the CTA markup.

## Placeholders — needs real content before launch
1. **Maps hero band** (`#maps`) — striped placeholder labelled `2656 × 1240`. Needs a 3D resort flyover capture with a track overlay. This is the section's whole payload.
2. **Crew live map** (`#crew`, row 1) — 1120×720 placeholder for crew pins on a trail map.
3. **Copy is written, not legally reviewed** — resort counts (4,072 / 38 countries), the 4.8 rating and the three review quotes are all invented for the mock. Replace with real numbers.
4. **Pro Pass pricing appears nowhere by request** — the page sells the free app only.

## Files
```
design/
  Tracked Out Home.dc.html   the page (sections in DOM order; logic class at the bottom of the file)
  CTA Options.dc.html        rejected CTA explorations, incl. the QR desktop idea
  support.js                 prototype runtime — reference only, do not port
  assets/                    images, logos, brand font
```
Open either HTML file directly in a browser to see the live design.

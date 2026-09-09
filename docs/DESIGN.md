---
version: alpha
name: رکاد
description: A playful, sticker-like landing page for Iran's first startup vocational high-school (هنرستان استارتاپی). RTL Persian, bold word-by-word headlines, two-color audience segmentation, and a two-layer card-shadow technique.
colors:
  primary: "#21295a"
  primary-alt: "#202a5a"
  secondary: "#58bdaf"
  secondary-alt: "#59bbaf"
  secondary-dark: "#347e75"
  secondary-alt-dark: "#2e7068"
  secondary-wordmark: "#4bb5a8"
  accent: "#e0195b"
  accent-text: "#ce1754"
  tertiary: "#f4971f"
  tertiary-alt: "#f9a21d"
  purple: "#4f215a"
  ink: "#292827"
  ink-light: "#202a5a"
  bg-mint: "#f2faf9"
  bg-blush: "#fefafb"
  bg-lavender: "#f4f5fb"
  bg-neutral: "#f6f6f6"
  overlay-white-15: "rgba(255,255,255,0.15)"
  overlay-white-58: "rgba(255,255,255,0.58)"
  overlay-white-69: "rgba(255,255,255,0.69)"
  overlay-grey-22: "rgba(180,180,180,0.22)"
typography:
  h1-hero:
    fontFamily: "IRANSansX"
    fontSize: "3.7125rem"
    fontWeight: 950
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  h2-section:
    fontFamily: "IRANSansX"
    fontSize: "3.325rem"
    fontWeight: 950
    lineHeight: "1.2"
    letterSpacing: "-0.01em"
  h3-card:
    fontFamily: "IRANSansX"
    fontSize: "2rem"
    fontWeight: 900
    lineHeight: "1.1"
  stat-number:
    fontFamily: "IRANSansX"
    fontSize: "4.375rem"
    fontWeight: 950
    lineHeight: "1.0"
  label-pill:
    fontFamily: "IRANSansX"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: "1.35"
  body-lg:
    fontFamily: "IRANSansX"
    fontSize: "1.09375rem"
    fontWeight: 600
    lineHeight: "1.7"
  body-md:
    fontFamily: "IRANSansX"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.6"
  body-sm:
    fontFamily: "IRANSansX"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.5"
  caption:
    fontFamily: "IRANSansX"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1.4"
  nav-link:
    fontFamily: "IRANSansX"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: "1.25"
  nav-cta:
    fontFamily: "IRANSansX"
    fontSize: "0.9375rem"
    fontWeight: 900
    lineHeight: "1.25"
rounded:
  pill-sm: "0.1875rem"
  pill-md: "0.5rem"
  pill-lg: "0.625rem"
  badge: "0.475rem"
  chip: "0.51875rem"
  card-sm: "0.8375rem"
  card-lg: "2.5625rem"
  navbar: "1.375rem"
  squircle-sm: "0.75rem"
  squircle-lg: "2.75rem"
spacing:
  section: "4rem"
  section-sm: "3rem"
  section-lg: "6rem"
  section-xl: "8rem"
  gutter: "3rem"
  gutter-md: "4rem"
  gutter-lg: "6rem"
  gutter-xl: "7.5rem"
  content-max: "75rem"
shadow:
  soft: "0 1.25rem 3.75rem -1.25rem rgba(33,41,90,0.25)"
  card-offset: "6px 8px 0 0"
---

## Overview

رکاد (Rokad) is a marketing landing page for **Iran's first startup vocational high-school** (اولین هنرستان استارتاپی ایران). The brand speaks to parents and students in Persian (RTL) with a playful, **sticker-collage visual language** — cards are independently rotated ±1–3°, headlines are composed word-by-word with per-word rotations, and the two-gender school tracks are color-coded navy (boys) and magenta (girls) while the brand teal unifies CTAs and trust signals.

**Brand tone:** energetic, trustworthy, youthful, anti-cookie-cutter.

**Visual metaphors:** paper-collage sticker aesthetic, hand-cut/scrapbook lettering, two-layer offset card shadows (hard-edge duplicate shape, not CSS blur), translucent two-dot bullet marks inside feature pills.

## Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#21295a` | Navy — boys-track brand color, header text, dark CTAs, footer bg |
| `primary-alt` | `#202a5a` | Navy variant — near-identical drift; consolidate to `primary` unless QA demands otherwise |
| `secondary` | `#58bdaf` | Teal — primary brand CTA color, wordmark accent, trust ribbon, scrollbar |
| `secondary-alt` | `#59bbaf` | Teal variant — same drift note as primary |
| `secondary-dark` | `#347e75` | Dark teal — caption text on mint cards, ribbon label, dark-variant CTAs |
| `accent` | `#e0195b` | Magenta — girls-track brand color, event-card accent |
| `accent-text` | `#ce1754` | Dark magenta — small text on white/blush cards |
| `tertiary` | `#f4971f` | Orange — network/branches stat card, ecosystem branch accent |
| `tertiary-alt` | `#f9a21d` | Orange variant — near-identical drift |
| `ink` | `#292827` | Default dark body/heading text on white sections |
| `bg-mint` | `#f2faf9` | Teal stat-card bg, navbar bg, hero wash |
| `bg-blush` | `#fefafb` | Magenta stat-card bg |
| `bg-lavender` | `#f4f5fb` | Navy stat-card bg |
| `bg-neutral` | `#f6f6f6` | Orange stat-card bg |
| `white` | `#ffffff` | Card fills, button fills, light sections |

**Border system:** every StatCard uses a **2px solid border in the card's accent hue** plus a solid-fill duplicate of the same shape offset ~4px down-right in the saturated accent — this produces the hand-drawn drop-shadow look. Do not use `box-shadow` for card shadows; the offset-rect technique is intentional and visible at card edges.

**Two near-duplicate hexes** (`#21295a` vs `#202a5a`, `#58bdaf` vs `#59bbaf`) exist in the source Figma — this is design-file drift, not an intentional two-tone system. Treat each pair as a single token.

## Typography

**Primary font:** `IRANSansX` — Persian/Latin geometric sans. Weights in use: DemiBold (600), Bold (700), ExtraBold (800), Black (900), ExtraBlack (950). Numeral-specific cut `IRANSansXFaNum` for Persian-style digits in stat counters.

**Secondary font:** `Montserrat` (variable, wght 100–900) — self-hosted, used for Latin characters only. Positioned before IRANSansX in the font stack so Latin glyphs render from Montserrat and Persian automatically falls back to IRANSansX per-character.

**Type scale (px):** 15 / 15.8 / 17.5 / 20.4 / 43 / 53.2 / 59.4 / 70.5 — an unusually large jump-scale typical of playful youth marketing sites, not a strict modular scale.

| Role | Weight | Size | Line-height | Color | Notes |
|---|---|---|---|---|---|
| Hero H1 ("آینده از اینجا شروع میشه!") | ExtraBlack (950) | 59.4px | 1.1 (very loose) | white | Each word independently rotated ±2–4° |
| Section H2 | ExtraBlack (950) | 53.2px | ~1.2 | ink, with accent words in brand color | Word-by-word rotation ±1.5–3° |
| Card big number (+250, 76%) | ExtraBlack (950) | 70.5px | 1.0 | card accent color | Uses FaNum cut for Persian digits |
| Label pill ("نرخ اشتغال") | Bold (700) | 15.8px | 1.35 (oversized, centers visually) | card accent | White pill, 0.76px border |
| Body paragraph | DemiBold (600) | 17.5px | 1.7 | ink | Centered, max-width ~494px |
| Primary button label | ExtraBold (800) | 20.4px | normal | white (on navy) | Hero CTAs |
| Nav links | DemiBold (600) | 15px | 1.25 | navy | |
| Nav CTA pill | Black (900) | 15px | 1.25 | white on navy | Rotated -3° in nav |
| School-card H3 | Black (900) | 43px | tight | white | -1° rotation |
| School-card meta | Medium (500, FaNum) | 15.5px | 1.64 | white/80% | |
| Feature chip text | DemiBold (600) | 14.3px | 1.8 (oversized) | white | |
| Small category badge | Bold (700) | 15.8px | 1.35 | white, translucent bg | |

## Layout & Spacing

- **Canvas:** 1440px desktop reference frame.
- **Content column:** 1200px (`max-w-[75rem]`), centered → 120px fixed side margins at desktop.
- **Section rhythm:** full-width color blocks with generous internal padding (~80–120px top before first heading). No visible section-divider lines; separation comes purely from background-color changes.
- **Vertical spacing tokens:** `section` (4rem), `section-sm` (3rem), `section-lg` (6rem), `section-xl` (8rem).
- **Gutter tokens:** `gutter` (3rem), `gutter-md` (4rem), `gutter-lg` (6rem), `gutter-xl` (7.5rem).
- **Responsive breakpoints:** `xs` (26.25rem / 420px), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px) — plus `container` (75rem / 1200px) custom maxWidth.

**RTL rule:** `dir="rtl"` on `<html>` and `direction: rtl` on `html`/`body` in CSS. Under RTL, the **first child in a flex/grid row renders at the right edge** — arrays in this codebase are ordered with that in mind (see Pitfalls).

## Elevation

- **Card shadow:** two-layer technique — a solid accent-color duplicate rect offset ~4px down-right sits behind the front card (see Colors section). This is a DOM element or pseudo-element, never `box-shadow`.
- **Navbar shadow:** `soft` token — `0 1.25rem 3.75rem -1.25rem rgba(33,41,90,0.25)` — Apple-style soft elevation on the floating pill-shaped navbar.
- **Hero card shadow:** same `soft` token.

## Shapes

- **Card radius language:** two families — soft-round **8–15px** for buttons/pills/chips, and a distinctive **large asymmetric cut-corner** (`rounded-tl-*` + `rounded-br-*`, other two corners square) used on StatCards, PillarCards, and SchoolCards. This asymmetric radius is the single most repeated signature shape on the page.
- **Navbar:** fully rounded pill (`rounded-[24px]` mobile → `rounded-[38px]` desktop).
- **SchoolCards:** large squircle (`rounded-[2.75rem]` / `rounded-[3.25rem]`).
- **Icon chips:** `rounded-[0.68625rem_0_0.68625rem_0]` — asymmetric squircle matching the card motif.

## Components

### NavPill
| Property | Value |
|---|---|
| backgroundColor | `{colors.primary}` (navy) or `{colors.secondary}` (teal) |
| textColor | `#FFFFFF` |
| typography | `{typography.nav-cta}` |
| rounded | `{rounded.pill-lg}` |
| padding | `11px 7px` (navy pill), `24px 9.4px` (teal pill) |
| rotation | `-3deg` (navy pill in nav bar) |

### HeroCTAButton
| Property | Value |
|---|---|
| filled-navy | backgroundColor `{colors.primary}`, textColor `#FFFFFF`, rounded `{rounded.pill-lg}`, padding `24px 17px`, rotation `-1.5deg` |
| outline-white | backgroundColor `#FFFFFF`, textColor `{colors.primary}`, rounded `{rounded.pill-lg}`, padding `24px 17px`, rotation `+1.5deg` (mirrored) |

### StatCard
| Property | Value |
|---|---|
| Size | `264×210px` desktop |
| Border | `2px solid` in card accent color |
| Radius | asymmetric `rounded-tl-{rounded.card-sm} rounded-br-{rounded.card-sm}` |
| Shadow | offset-rect duplicate, same radius, solid accent color, `6px 8px 0 0` offset |
| Eyebrow badge | white pill, `border-{accent} 0.76px`, `{typography.label-pill}` |
| Number | `{typography.stat-number}`, accent color |
| Caption | two-line, `{typography.body-sm}` bold + `{typography.body-sm}` medium, accent color |
| Rotation | cards alternate `+2.5deg` / `-2deg` |
| Themes | orange (`tertiary`), navy (`primary`), magenta (`accent`), teal (`secondary`) |

### SchoolCard
| Property | Value |
|---|---|
| Size | `~589×450px` container, `~581×440px` card |
| Radius | `{rounded.squircle-lg}` |
| Boys theme | backgroundColor `{colors.primary}`, ctaTextColor `{colors.primary}` |
| Girls theme | backgroundColor `{colors.accent}`, ctaTextColor `{colors.accent}` |
| CTA button | white fill, `{typography.label-pill}` size, `+1.5deg` rotation |
| Feature chips | two-dot bullet (`rgba(white,0.58)` outer + `rgba(white,0.69)` inner dot), `bg-white/15`, `-rotate-2` |
| Illustration | left-aligned (RTL), `w-[85%]` mobile → `max-w-[16.25rem]` desktop |

### FeatureChip (two-dot bullet)
| Property | Value |
|---|---|
| Background | `bg-white/15` (on dark cards) or accent-colored border pill (on light cards) |
| Bullet | two overlapping translucent-white circles: outer `rgba(255,255,255,0.58)`, inner `rgba(255,255,255,0.69)` offset up-left by 2px |
| Typography | `{typography.body-sm}` bold |

### PillarCard (numbered, icon+title+body)
| Property | Value |
|---|---|
| Light variant | backgroundColor `{colors.bg-neutral}`, border `1px solid {colors.ink}`, asymmetric `rounded-[0_2rem_0_2rem]` |
| Dark variant | backgroundColor `rgba(255,255,255,0.06)`, border `1px solid rgba(255,255,255,0.12)` |
| Featured variant | backgroundColor `{colors.secondary}`, border `{colors.secondary}` |
| Icon chip | `w-11 h-11`, `rounded-xl`, white icon on translucent bg |
| Index number | `text-white/20` (dark) or `text-ink/20` (light), `font-black text-2xl`, absolute top-left |
| Typography | title `{typography.body-lg}`, body `{typography.body-md}` |

### BadgeChip
| Property | Value |
|---|---|
| Background | `rgba(255,255,255,0.15)` on dark cards |
| Border | `0.76px` in white |
| Typography | `{typography.label-pill}`, white |

### TrustRibbon (hero)
| Property | Value |
|---|---|
| Shape | two offset `rounded-tl/tr-[15px]` only (flat bottom) — torn ticket-stub shape |
| Fill | `bg-overlay-grey-22` (semi-transparent) with `border-5 {colors.secondary}` |
| Typography | `{typography.h3-card}`, `#347e75` |

### BranchCard (Ecosystem)
| Property | Value |
|---|---|
| Border | `2px solid` in brand color (amber/teal/violet) |
| Radius | `0 12px 0 12px` (asymmetric) |
| Shadow | `6px 8px 0 0` in border color |
| CTA button | 40px tall, `rounded-xl`, brand-color fill |

## Do's and Don'ts

- **Do** keep `dir="rtl"` at the document root, not per-node. Every text node inherits from it.
- **Do** order arrays (nav links, stat cards, school cards, pillars) with RTL in mind — the first array element renders at the **right** edge.
- **Do** use the two-layer offset-rect technique for card shadows, not `box-shadow`. The hard edge is a brand signature.
- **Do** snap per-word rotation values to a clean scale (`-3deg, -1.5deg, 0deg, +1.5deg, +2.5deg, +3deg`) for maintainability; the hand-placed floats (e.g. `1.83deg`) are design-file artifacts.
- **Do** render semantic headings as single accessible DOM nodes (`<h1>`, `<h2>`) and apply per-word rotation via `<span>` wrappers with `aria-hidden` on the decorative layer — never split semantic content across unrelated DOM nodes.
- **Do** use `font-weight: 950` (ExtraBlack / Black) directly in inline styles where Tailwind's utility set doesn't expose 950 — the design uses 950 frequently for headline words.
- **Don't** use Google Fonts or remote font URLs — all fonts (`IRANSansX` 11 weights + `Montserrat` variable) are self-hosted in `public/fonts/`.
- **Don't** hand-code the character illustrations (hero mentor, boys student, girls student) as SVG paths — they are multi-part vector composites (50–150+ sub-shapes each) that must be exported as flattened image assets from Figma.
- **Don't** use `box-shadow` for the card offset-shadow effect — it will look softer and more generic than the source's hard-edge duplicate shape.
- **Don't** inline hex values in component JSX when a Tailwind theme token exists — always use the named token (e.g. `bg-navy` not `bg-[#21295a]`) for maintainability.
- **Don't** leave Figma asset URLs in shipped code — they expire ~7 days after generation. Download and commit the bytes immediately.

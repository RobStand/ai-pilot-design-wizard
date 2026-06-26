# Design System — AI Pilot Design Wizard

> Source of truth for all visual and UI decisions. Read this before touching anything
> that renders. Created by `/design-consultation` (codifying the existing system + refinements).

## Product Context
- **What this is:** An 8-step wizard that guides operators through designing a rigorous AI
  pilot program (hypothesis → rollout → exit criteria), then streams two generated documents
  from Claude: a steering-committee **Pilot Brief** and a full operational **Pilot Playbook**.
- **Who it's for:** Operators, transformation leads, and steering committees who need a
  defensible pilot plan — people who want proof, not hype.
- **Space/industry:** B2B / enterprise AI-transformation tooling.
- **Project type:** Web app (Next.js App Router). Wizard + generated-document renderer. No database.

## Memorable Thing
> "Built by an expert in AI transformation."

Every decision serves earned authority and rigor. When a choice is ambiguous, pick the option
that reads as more precise and more engineered — never the friendlier or more decorative one.

## Aesthetic Direction
- **Direction:** Engineered instrument (industrial-utilitarian × brutally minimal).
- **Decoration level:** Minimal — typography, hairline rules, and monospace micro-labels do
  all the work. No gradients, no decorative blobs, no icon-in-colored-circle grids, no stock imagery.
- **Mood:** A precise technical instrument. Confident, reserved, dense with signal. The product
  should feel like serious software for serious work.

## Typography
- **Display/Hero:** Hanken Grotesk (800/700) — humanist grotesk; confident without trend-chasing.
  Tight tracking (-2.5% display, -1.5% headings).
- **Body:** Hanken Grotesk (400/500). One sans for the whole app keeps it cohesive.
- **UI/Labels:** JetBrains Mono (500), UPPERCASE, letter-spacing ~0.10–0.14em. The "instrument
  panel" signal — this is a deliberate risk (most B2B tools use a sans for labels).
- **Data/Tables:** Hanken Grotesk with `font-variant-numeric: tabular-nums`. Used in the generated
  Brief/Playbook so risk registers and metrics read like a quant's report.
- **Code/sentinels:** JetBrains Mono (e.g. the `<!-- DOCUMENT_BREAK -->` delimiter).
- **Loading:** `next/font/google` — `Hanken_Grotesk` → `--font-grotesk`, `JetBrains_Mono` → `--font-mono`
  (see `app/layout.tsx`). Bound to Tailwind `font-sans` / `font-mono`.
- **Scale (px):** 12 · 14 · 16 · 20 · 24 · 32 · 40 · 52. Body 16; UI labels 11–12; display 40–52.

## Color
- **Approach:** Restrained — one accent + cool neutrals. Color is rare and meaningful; the accent
  carries all emphasis. No second brand color, no gradients.
- **Primary (accent):** `#3551c9` slate-cobalt — actions, focus, active step, links. Used sparingly.
  A calmer, slightly desaturated cobalt (less glare than pure `#2348ff`).
  - accent-ink `#243a96` (hover/pressed), accent-soft `#eff1fb` (tints, help panels).
- **Neutrals (cool):** ink `#0d1117` → ink-soft `#1f2733` → ink-muted `#5b6675`;
  paper `#ffffff`, paper-soft `#f6f7f9`, line `#e6e9ee` (hairline borders).
- **Semantic (muted, never candy):** success `#1f9d57` · warning `#c08a1e` · error `#d23b2c` ·
  info = accent `#3551c9`. (Sharper/emerald-amber-vermilion direction; legible at pill size,
  still subordinate to slate-cobalt.)
- **Dark mode:** Light-first today (`color-scheme: light`). Planned dark-surface tokens when built:
  paper `#11151c` / paper-soft `#0b0e13`, line `#232b36`, ink `#eef1f6` / ink-muted `#8893a3`,
  accent `#6f86e6`; semantics lightened ~12–18%: success `#3fc47e`, warning `#e0b23f`, error `#ef6a5b`.
  Redesign surfaces — don't just invert.

## Spacing
- **Base unit:** 4px.
- **Density:** Comfortable (data-dense where it earns it — tables, sidebar).
- **Scale (px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64.

## Layout
- **Approach:** Grid-disciplined. Strict alignment, predictable structure.
- **Grid:** Single-column wizard card centered, with a left jump-back sidebar listing the 8
  numbered steps (current step highlighted in cobalt). Top header carries the product name in mono.
- **Max content width:** ~1040px reading column; wizard card narrower.
- **Border radius (hierarchical):** 6px controls · 8px inputs/buttons · 12px panels/help · 16px cards.
- **Structure:** Hairline rules (`line` color) separate sections rather than shadows or boxes.

## Motion
- **Approach:** Minimal-functional. Only transitions that aid comprehension. No choreography,
  no scroll-driven effects.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro 50–100ms · short 150–250ms (default for hover/focus/state) · medium 250–400ms.

## Anti-patterns (never ship)
- Purple/violet gradients; gradient CTAs.
- 3-column icon-in-circle feature grids; centered-everything with uniform spacing.
- A second accent color competing with cobalt.
- `system-ui`/`-apple-system` as a display or body font.
- Warm-paper + serif (e.g. Fraunces) + green/gold palettes — reads as AI slop here.
- Decorative imagery or blobs.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-26 | Initial design system codified | `/design-consultation` formalized the existing in-code system as the source of truth. |
| 2026-06-26 | Kept Hanken Grotesk + JetBrains Mono | Already implemented in `app/layout.tsx`; matches the engineered-instrument anchor. |
| 2026-06-26 | Mono uppercase for UI labels (deliberate risk) | Reads as a technical instrument; reinforces "built by an expert." |
| 2026-06-26 | tabular-nums for generated-doc tables (refinement) | Risk register + metrics read like a quant's report, not a sales deck. |
| 2026-06-26 | Semantic palette = emerald/amber/vermilion (`#1f9d57`/`#c08a1e`/`#d23b2c`) | User chose the sharper, more saturated option; legible at pill size, still subordinate to cobalt. |
| 2026-06-26 | Accent changed `#2348ff` → slate-cobalt `#3551c9` | Pure cobalt read too bright; user chose the calmer, slightly desaturated blue. accent-ink/soft + dark accent re-derived. |
| 2026-06-26 | Light-first; dark tokens documented but unbuilt | App sets `color-scheme: light`; dark plan recorded for later. |

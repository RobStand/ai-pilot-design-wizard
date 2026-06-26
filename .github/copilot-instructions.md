# Copilot instructions: AI Pilot Design Wizard

Next.js (App Router) + TypeScript + Tailwind app. An 8-step wizard collects an AI-pilot
design, then streams two generated documents (Pilot Brief + Pilot Playbook) from the
Anthropic API. No database — all state lives in React and `localStorage`.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build — also runs full type-check + lint (use this to validate changes)
npm start        # serve the production build
npm run lint     # eslint (next/core-web-vitals)
```

There is no test runner configured. `npm run build` is the validation gate: it type-checks
every file and lints. Run it after changes.

Requires `ANTHROPIC_API_KEY` in `.env.local` (see `.env.example`). Without it, `/api/pilot`
returns a 500 with a JSON `error`; the wizard UI still works, only generation fails.

## Architecture (the parts that span files)

**Single source of truth for wizard state.** `lib/types.ts` defines the flat `WizardState`
interface — every wizard field is a top-level property. Adding a field means touching, in order:
1. `lib/types.ts` — the field
2. `lib/wizard-reducer.ts` — `initialWizardState` (must define every field; localStorage merges over it)
3. the relevant `components/steps/StepN*.tsx` — the input
4. `data/wizard-steps.ts` `isStepValid()` — validation, if required
5. `lib/prompts.ts` `buildUserPrompt()` — so the value reaches Claude

**State flow.** `components/WizardShell.tsx` owns `useReducer(wizardReducer, initialWizardState)`,
hydrates from `localStorage` on mount, and autosaves on every change. Steps are dumb: they receive
`{ state, dispatch }` (`components/steps/types.ts`) and emit reducer actions. There is no global
store/context — state is passed down explicitly.

**Step metadata is data, not code.** `data/wizard-steps.ts` `STEPS[]` drives the header, sidebar,
progress, and help panels. Per-step gating lives in `isStepValid(step, state)`. The wizard never
hardcodes step titles/validation in components.

**Generation handshake.** `/results` POSTs the whole `WizardState` to `app/api/pilot/route.ts`,
which streams Claude's raw text back. Claude is instructed (in `lib/prompts.ts`) to emit two HTML
documents separated by the `DOCUMENT_BREAK` sentinel (`<!-- DOCUMENT_BREAK -->`). The results page
splits the accumulating stream on that exact constant — it is exported from `lib/prompts.ts` and
imported on the client; **keep them identical**. The Brief is everything before the delimiter, the
Playbook everything after.

**Starter risks are computed client-side, never via Claude.** `getStarterRisks(industry, capability)`
in `data/wizard-steps.ts` derives 3 suggested risks from Step 1; `Step7Risks.tsx` seeds them once on
mount only if `state.risks` is empty.

## Conventions

- **Path alias:** import from repo root with `@/…` (e.g. `@/lib/types`, `@/components/ui`). No deep relative paths.
- **Empty = unselected:** enum-like fields use `""` as the unset state (e.g. `beneficiary: Beneficiary | ""`),
  which is also what `isStepValid` checks via the `filled()` helper.
- **Form inputs:** build from the primitives in `components/ui.tsx` (`Field`, `TextInput`, `TextArea`,
  `Select`, `Segmented`, `RadioGroup`, `YesNo`) rather than raw elements, so styling/validation stay consistent.
- **Styling:** Tailwind only, via the semantic component classes in `app/globals.css` (`.card`,
  `.btn-primary`, `.field-input`, `.help-panel`, `.doc`, `.seg`/`.seg-on`). Use theme tokens from
  `tailwind.config.ts` (`ink`, `paper`, `accent`) — do not introduce ad-hoc hex colors. Design language
  is grotesk + mono, cool neutrals, single cobalt accent (`#2348ff`); no serif or warm-paper palettes.
- **`"use client"`** on every interactive component (all of `components/**`, the wizard/results/landing
  pages). The only server module is `app/api/pilot/route.ts` (`runtime = "nodejs"`).
- **Generated HTML is rendered with `dangerouslySetInnerHTML`** after `cleanHtml()` in `app/results/page.tsx`
  strips code fences, `html/head/body` wrappers, and `<script>`. Claude is told to emit bare semantic HTML
  (no markdown, no document wrapper) — preserve that contract on both ends.
- **Model id** is `claude-sonnet-4-6` in `app/api/pilot/route.ts`, per the project spec.
- **PDF/clipboard** go through `lib/pdf-export.ts`; `html2pdf.js` is dynamically imported (browser-only)
  and typed by `types/html2pdf.d.ts`.

## gstack

This repo uses the [gstack](https://github.com/garrytan/gstack) skill suite. Use the **`/browse`**
skill from gstack for **all web browsing**. **Never** use `mcp__claude-in-chrome__*` tools.

Available gstack skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`,
`/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`,
`/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`,
`/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`,
`/retro`, `/investigate`, `/document-release`, `/document-generate`, `/codex`, `/cso`,
`/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`,
`/unfreeze`, `/gstack-upgrade`, `/learn`.

# AI Pilot Design Wizard

An eight-step wizard that guides you through designing a rigorous AI pilot program — from
hypothesis through rollout and exit criteria — then generates two documents with Claude:

- **Pilot Brief** — a one-page, steering-committee-ready summary.
- **Pilot Playbook** — the full operational plan (metrics, RACI, risk register, governance, exit criteria).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Anthropic SDK (`@anthropic-ai/sdk`) with streaming
- `html2pdf.js` for PDF export
- Wizard state via `useReducer`, autosaved to `localStorage` (no database)

## Setup

```bash
npm install
cp .env.example .env.local   # add your key
```

`.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
```

## Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## How it works

1. Work through the 8 steps (`/wizard`). Required fields gate the Next button; the desktop
   sidebar lets you jump back to any completed step. Progress autosaves to `localStorage`.
2. Step 7 pre-populates suggested starter risks derived client-side from your industry and
   AI capability (`data/wizard-steps.ts`) — no model call.
3. Click **Generate pilot documents** to go to `/results`, which POSTs the full wizard state
   to `/api/pilot`. The route streams both documents in one response, separated by a
   `<!-- DOCUMENT_BREAK -->` delimiter the results page splits on.
4. Switch between the **Pilot Brief** and **Pilot Playbook** tabs; export each as PDF or copy
   as text. **Edit inputs** returns to the wizard with everything preserved.

## Project layout

```
app/            landing, wizard, results pages + /api/pilot route
components/      WizardShell, step components, document renderers, export bar, UI primitives
data/           industries, step definitions/help text, starter-risk lookup, validation
lib/            types, wizard reducer + localStorage, prompt construction, PDF export
```

# Claude Code Build Instructions: AI Pilot Design Wizard

## What we're building

A step-by-step wizard that guides a user through designing an AI pilot program. The user works through eight structured steps — from hypothesis definition through rollout and exit criteria. At the end, Claude generates a polished one-page Pilot Brief document ready to present to a steering committee, plus a detailed Pilot Playbook with everything the team needs to execute.

This tool demonstrates something most AI tools miss: that successful AI deployment is about disciplined program design, not just technology. It's the artifact you'd hand someone in week three of an engagement.

---

## The problem this solves

Most AI pilots fail not because the technology doesn't work, but because they were never properly designed. No clear hypothesis. No defined success metrics. No exit criteria. No rollout plan. Teams jump from "let's try AI" to "we deployed something" without the middle part. This wizard forces the discipline that separates pilots that convert to production from pilots that die in committee.

The target user is an AI program lead, product manager, or transformation lead who needs to structure an AI initiative and get it approved by leadership.

---

## Tech stack

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) with streaming
- **Export**: `html2pdf.js` for PDF export
- **State**: React state with `useReducer` for wizard state management — no database

---

## Project structure

```
/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── wizard/
│   │   └── page.tsx                    # Wizard container
│   └── api/
│       └── pilot/
│           └── route.ts                # Calls Claude, streams both outputs
├── data/
│   ├── industries.ts                   # Industry list
│   └── wizard-steps.ts                # Step definitions, questions, help text
├── lib/
│   ├── prompts.ts                      # Prompt construction
│   ├── wizard-reducer.ts              # Wizard state management
│   └── pdf-export.ts
└── components/
    ├── WizardShell.tsx                 # Step navigation, progress, container
    ├── StepHeader.tsx                  # Step title, description, help text
    ├── WizardNav.tsx                   # Back / Next / Generate controls
    ├── PilotBrief.tsx                  # One-page summary document
    ├── PilotPlaybook.tsx               # Full detailed playbook
    └── ExportBar.tsx
```

---

## Wizard steps

Eight steps. Show one step at a time with a clear progress indicator (step X of 8) and step name. Allow navigation back to previous steps. The Next button is disabled until required fields in the current step are filled.

---

### Step 1: The opportunity

**Step title**: "What are we trying to prove?"

Questions:
- Pilot name (text input — give it a real name, e.g. "Intelligent Loan Document Review Pilot")
- Industry (dropdown)
- The AI capability being piloted (dropdown + free text):
  - Generative AI / LLM
  - Predictive model
  - Document processing / extraction
  - Conversational AI / chatbot
  - Computer vision
  - Recommendation system
  - Autonomous agent
  - Other (text)
- The business problem this addresses (textarea — describe in 2–3 sentences what is broken today)
- The hypothesis (textarea with scaffolding prompt): "We believe that [AI capability] will [achieve outcome] for [user/customer], resulting in [measurable impact]. We will know this is true when [evidence]."
  - Provide the scaffolding in the placeholder text so the user fills in the brackets
- Who benefits most from this pilot succeeding? (dropdown: Customers/Members, Employees, Both, Operations/Back-office)

Help text sidebar: Explain what makes a good pilot hypothesis. A good hypothesis is falsifiable, measurable, and scoped. If you can't state what would prove it wrong, it's not a hypothesis — it's a hope.

---

### Step 2: Scope and boundaries

**Step title**: "What's in and what's out?"

Questions:
- Pilot scope description (textarea — what processes, systems, or workflows are included?)
- Explicit exclusions (textarea — what are you deliberately NOT testing in this pilot?)
- Pilot population (number + unit): "This pilot will involve approximately [N] [customers / employees / transactions / documents] per [week/month]"
- Duration (dropdown): 4 weeks / 6 weeks / 8 weeks / 12 weeks / Custom
- Geography / business unit scope (text input — which locations, teams, or segments?)
- Will this pilot run in production or in a sandbox? (radio: Production / Sandbox / Hybrid)

Help text: Scope creep kills pilots. Be ruthlessly specific about what this pilot will and will not test. A focused pilot that answers one question cleanly is worth more than a broad pilot that answers nothing definitively.

---

### Step 3: Success metrics

**Step title**: "How will we know it worked?"

This step has a dynamic metrics builder. The user adds metrics one at a time using a repeating form block.

For each metric:
- Metric name (text)
- Type (dropdown): Quantitative / Qualitative
- Current baseline value (text — what is it today?)
- Target value (text — what does success look like?)
- How it will be measured (text — data source, method)
- Measurement frequency (dropdown): Daily / Weekly / Bi-weekly / End of pilot

Require at least 3 metrics. Suggest a maximum of 7.

Below the metrics builder, add:
- Primary success threshold: "We will declare this pilot a success if [textarea — state the minimum bar for proceeding to production]"
- Primary failure threshold: "We will declare this pilot a failure and stop if [textarea — what would cause us to pull the plug early?]"

Help text: Good metrics are SMART. Separate leading indicators (things you can measure weekly) from lagging indicators (outcomes you'll see at the end). Include at least one metric that could surface problems early so you can course-correct rather than fail at the finish line.

---

### Step 4: Data requirements

**Step title**: "What data do we need?"

Questions:
- Data sources required (multi-select checkboxes — user can check all that apply):
  - Internal transaction / operational data
  - Customer / member profile data
  - Document repository
  - Real-time event streams
  - Third-party data
  - Synthetic / test data
  - Historical labeled data (for training/evaluation)
- Data readiness (segmented control for each checked source): Ready now / Needs prep / Not yet available
- Are there any data privacy or regulatory constraints on the data being used? (yes/no — if yes, text field: describe)
- Data volume estimate (dropdown): <1K records, 1K–10K, 10K–100K, 100K–1M, 1M+
- Who is responsible for data access and preparation? (text — name/role)
- Data freshness requirement (dropdown): Real-time, Near real-time (<1hr), Daily, Weekly, Historical only

Help text: Data problems are the most common reason pilots stall before they start. If your data readiness is "not yet available" for any required source, that becomes your first workstream — not the AI model.

---

### Step 5: Technology and integration

**Step title**: "What do we need to build or connect?"

Questions:
- AI approach (radio):
  - Use an existing vendor / SaaS AI tool (no custom model)
  - Build on a foundation model API (OpenAI, Anthropic, Azure OpenAI, etc.)
  - Fine-tune an existing model on our data
  - Train a custom model from scratch
- Vendor or platform (text — if applicable)
- Systems this pilot needs to integrate with (textarea — list the systems, APIs, or data stores)
- Integration complexity (segmented control): Low (API call only) / Medium (some integration work) / High (significant engineering required)
- Will this require changes to existing workflows or UX? (yes/no — if yes, describe briefly)
- Infrastructure already available? (radio): Yes, fully / Partially / Needs to be provisioned
- Security review required? (yes/no)
- Who is the technical lead for this pilot? (text — name/role)

Help text: Keep the integration surface as small as possible for the pilot. Every integration point is a dependency that can delay you. If you can prove the hypothesis with a lighter integration, do that first.

---

### Step 6: Team and governance

**Step title**: "Who's running this?"

Questions:
- Pilot sponsor (text — executive name/role who has budget authority and will receive results)
- Pilot lead (text — day-to-day owner)
- Core team members (repeating field): Name / Role / Responsibility (add up to 6)
- Steering committee cadence (dropdown): Weekly check-in / Bi-weekly / Monthly / End-of-pilot only
- Who needs to approve go/no-go to production? (textarea — list the decision makers)
- Are there legal, compliance, or risk stakeholders who need to be involved? (yes/no — if yes, names/roles)
- Change management lead (text — who is managing the human side of this change?)

Help text: A pilot without an executive sponsor is a science project. Make sure someone with authority is named, engaged, and has committed to making a go/no-go decision based on the evidence.

---

### Step 7: Risks and mitigations

**Step title**: "What could go wrong?"

Dynamic risk builder. User adds risks one at a time.

For each risk:
- Risk description (text)
- Category (dropdown): Technical / Data / Regulatory / Adoption / Vendor / Timeline / Other
- Likelihood (radio): High / Medium / Low
- Impact (radio): High / Medium / Low
- Mitigation plan (text)
- Early warning signal (text — how will you know this risk is materializing before it becomes a crisis?)

Require at least 3 risks. Pre-populate with 3 suggested starter risks based on the industry and AI type selected in Step 1 (derive these client-side from a lookup table in `wizard-steps.ts` — do not call Claude for this).

Example pre-populated risks:
- For financial services + LLM: "Model hallucination leads to incorrect information being surfaced to members or staff"
- For financial services + predictive model: "Disparate impact on a protected class discovered during or after pilot"
- Universal: "Low adoption by intended users due to insufficient training or change management"

---

### Step 8: Rollout plan and exit criteria

**Step title**: "How do we launch, learn, and decide?"

Questions:
- Rollout approach (radio with description):
  - Big bang — all pilot participants from day one
  - Phased — start with a small group, expand in waves
  - Shadow mode — AI runs in parallel but humans make all decisions (for comparison)
  - A/B test — split participants between AI-assisted and control group
- If phased or A/B: describe the phases or split (textarea)
- Training plan (textarea — how will pilot participants be prepared? what does onboarding look like?)
- Feedback mechanism (textarea — how will you collect qualitative feedback from participants during the pilot?)
- Interim check-in points (number input — how many formal check-ins during the pilot, aside from final readout?)
- Final readout format (dropdown): Executive presentation / Written report / Both
- Go/no-go decision date (date picker)
- If go: what does the path to production look like? (textarea — brief description)
- If no-go: what happens to the learnings? (textarea — how will findings be documented and reused?)

Help text: The rollout plan is where most pilots get lazy. Shadow mode is underused — it lets you compare AI performance against human performance on real work before anyone's workflow changes. Seriously consider it.

---

## Output: two documents

After Step 8, the user clicks "Generate pilot documents." Navigate to a results page. Call the API and stream two documents sequentially.

### Document 1: Pilot Brief (one page)

Executive-facing. Fits on one page when printed. Structured as:

- **Pilot name and sponsor**
- **Hypothesis** (pulled directly from Step 1)
- **Scope** (1–2 sentences)
- **Duration and population**
- **Success criteria** (top 3 metrics and primary success threshold)
- **Key risks** (top 2, one sentence each)
- **Investment required** (Claude estimates based on integration complexity and team size)
- **Go/no-go decision date**
- **Recommendation to approve** (1 paragraph — Claude writes this as if making the case to the steering committee)

### Document 2: Pilot Playbook (full detail)

Operational. For the team running the pilot. Sections:

1. **Overview and context** — why we're doing this, what we're trying to learn
2. **Hypothesis and success metrics** — full metrics table with baselines and targets
3. **Scope and boundaries** — what's in, what's out, explicit exclusions
4. **Data requirements and ownership** — data sources, readiness, responsible parties
5. **Technology and integration plan** — architecture overview, dependencies, integration points
6. **Team structure and RACI** — Claude generates a simple RACI table from the team inputs
7. **Risk register** — full risk table with likelihood, impact, mitigations, and early warning signals
8. **Rollout and onboarding plan** — phasing, training approach, feedback mechanisms
9. **Governance and reporting cadence** — check-in schedule, steering committee, escalation path
10. **Exit criteria and decision framework** — go/no-go criteria, decision makers, post-pilot paths

---

## API route: app/api/pilot/route.ts

POST endpoint. Accepts the complete wizard state object. Streams both documents sequentially, separated by a clear delimiter the frontend can detect (e.g. `<!-- DOCUMENT_BREAK -->`).

**System prompt:**
```
You are a senior AI program manager with deep experience designing and running AI pilots at 
large enterprises and regulated institutions. You write with precision and clarity. Your 
documents are specific to the inputs provided — not generic templates. You know that pilot 
design is where AI initiatives succeed or fail, and you hold a high bar for rigor: clear 
hypotheses, measurable outcomes, honest risk assessment, and disciplined exit criteria. 
Your Pilot Brief is written for a steering committee — concise, decisive, and persuasive. 
Your Pilot Playbook is written for the team — detailed, actionable, and complete.
```

**User prompt:** construct from all wizard inputs. Pass every field. Claude should use specific values (e.g. actual metric names, actual team member roles, actual risk descriptions) throughout — no placeholders.

Use `claude-sonnet-4-6`. Stream the response. Set API key from `process.env.ANTHROPIC_API_KEY`.

---

## Results page

- Two-tab interface: "Pilot Brief" and "Pilot Playbook"
- Brief tab shows on load, streams the one-pager first
- Playbook tab streams in parallel or sequentially — show a loading indicator until ready
- Export options per tab: Download PDF / Copy as text
- Brief PDF should be formatted to actually fit on one page — tight typography, reduced margins
- Playbook PDF is multi-page, formatted like an internal project document
- "Edit inputs" link returns to the wizard with all inputs preserved

---

## Wizard UX details

- Progress bar at top showing current step (1–8) with step names visible on desktop
- Step names shown as a clickable sidebar on desktop (can jump back to any completed step)
- On mobile: progress bar only, no sidebar
- Back button always available from Step 2 onward
- Each step has a help text panel (collapsible on mobile, visible on desktop sidebar) with guidance on how to think about that step — write these as direct, opinionated advice, not neutral instructions
- Autosave to `localStorage` so the user doesn't lose their work if they close the tab — with a "Resume where you left off" prompt on the landing page if saved state is detected
- Estimated time remaining shown in the header (recalculates as steps are completed)

---

## Visual design

Professional but slightly warmer than the governance tool — this is a working document for a team, not a compliance artifact.

- Color palette: white, light gray, single accent (teal or slate-blue)
- Wizard steps: clean card layout, generous spacing
- Help text panels: subtle background (light blue or gray), clearly secondary
- Progress indicator: numbered steps with connecting line, completed steps checked
- Results page: document-style layout, tab switcher for Brief vs. Playbook
- Mobile: full functionality, optimized for touch

---

## Environment

```
ANTHROPIC_API_KEY=your_key_here
```

---

## Suggested build order

1. Scaffold Next.js + Tailwind
2. Build `wizard-steps.ts` with all step definitions, questions, and help text
3. Build `wizard-reducer.ts` for state management
4. Build the wizard shell and navigation
5. Build each step component (Steps 1–8)
6. Add localStorage autosave
7. Build the API route
8. Build the results page with tab switcher and progressive rendering
9. Add PDF export for both documents
10. Build landing page with resume prompt
11. Polish: help text panels, mobile layout, loading states, error handling

---

## Definition of done

- All 8 wizard steps work with proper validation (Next disabled until required fields filled)
- Back navigation preserves all previously entered data
- localStorage autosave works — closing and reopening the browser resumes where you left off
- Both documents (Brief and Playbook) generate and stream correctly
- Pilot Brief is concise and fits one page when printed/exported
- Pilot Playbook RACI table is generated from actual team inputs
- Risk register includes the pre-populated starter risks plus any user-added ones
- PDF export works for both documents
- Help text is present and useful on every step
- Professional enough to hand to a steering committee or show in a portfolio demo

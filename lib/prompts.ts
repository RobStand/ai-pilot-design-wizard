import { DATA_SOURCES } from "@/data/wizard-steps";
import type { WizardState } from "@/lib/types";

export const DOCUMENT_BREAK = "<!-- DOCUMENT_BREAK -->";

export const SYSTEM_PROMPT = `You are a senior AI program manager with deep experience designing and running AI pilots at 
large enterprises and regulated institutions. You write with precision and clarity. Your 
documents are specific to the inputs provided — not generic templates. You know that pilot 
design is where AI initiatives succeed or fail, and you hold a high bar for rigor: clear 
hypotheses, measurable outcomes, honest risk assessment, and disciplined exit criteria. 
Your Pilot Brief is written for a steering committee — concise, decisive, and persuasive. 
Your Pilot Playbook is written for the team — detailed, actionable, and complete.`;

function line(label: string, value: string | undefined | null): string {
  const v = (value ?? "").toString().trim();
  return `- ${label}: ${v.length ? v : "(not provided)"}`;
}

function capability(s: WizardState): string {
  if (s.capability === "Other") return s.capabilityOther || "Other";
  return s.capability;
}

function population(s: WizardState): string {
  if (!s.populationCount) return "(not provided)";
  return `~${s.populationCount} ${s.populationUnit} per ${s.populationPer}`;
}

function metricsBlock(s: WizardState): string {
  if (!s.metrics.length) return "(none provided)";
  return s.metrics
    .map(
      (m, i) =>
        `  ${i + 1}. ${m.name} [${m.type}] — baseline: ${m.baseline || "n/a"}; target: ${
          m.target || "n/a"
        }; measured via: ${m.method || "n/a"}; frequency: ${m.frequency}`
    )
    .join("\n");
}

function dataSourcesBlock(s: WizardState): string {
  const selected = DATA_SOURCES.filter((d) => s.dataSources[d.key]?.selected);
  if (!selected.length) return "(none selected)";
  return selected
    .map(
      (d) => `  - ${d.label} — readiness: ${s.dataSources[d.key].readiness}`
    )
    .join("\n");
}

function teamBlock(s: WizardState): string {
  if (!s.teamMembers.length) return "(none provided)";
  return s.teamMembers
    .map(
      (t) =>
        `  - ${t.name || "(unnamed)"} — ${t.role || "role n/a"} — ${
          t.responsibility || "responsibility n/a"
        }`
    )
    .join("\n");
}

function risksBlock(s: WizardState): string {
  if (!s.risks.length) return "(none provided)";
  return s.risks
    .map(
      (r, i) =>
        `  ${i + 1}. ${r.description} [${r.category}] — likelihood: ${
          r.likelihood
        }, impact: ${r.impact}; mitigation: ${
          r.mitigation || "n/a"
        }; early warning: ${r.earlyWarning || "n/a"}`
    )
    .join("\n");
}

export function buildUserPrompt(s: WizardState): string {
  return `Below is the complete design intake for an AI pilot. Use the specific values throughout — actual metric names, actual team roles, actual risk descriptions. Do not invent facts that contradict the inputs, and do not leave placeholders.

# STEP 1 — OPPORTUNITY
${line("Pilot name", s.pilotName)}
${line("Industry", s.industry)}
${line("AI capability", capability(s))}
${line("Business problem", s.businessProblem)}
${line("Hypothesis", s.hypothesis)}
${line("Primary beneficiary", s.beneficiary)}

# STEP 2 — SCOPE & BOUNDARIES
${line("Scope description", s.scopeDescription)}
${line("Explicit exclusions", s.exclusions)}
${line("Pilot population", population(s))}
${line("Duration", s.duration)}
${line("Geography / business unit", s.geography)}
${line("Environment", s.environment)}

# STEP 3 — SUCCESS METRICS
Metrics:
${metricsBlock(s)}
${line("Primary success threshold", s.successThreshold)}
${line("Primary failure threshold", s.failureThreshold)}

# STEP 4 — DATA REQUIREMENTS
Data sources:
${dataSourcesBlock(s)}
${line("Privacy / regulatory constraints", s.hasDataConstraints === "yes" ? s.dataConstraintsDetail : "None reported")}
${line("Data volume estimate", s.dataVolume)}
${line("Data access & prep owner", s.dataOwner)}
${line("Data freshness requirement", s.dataFreshness)}

# STEP 5 — TECHNOLOGY & INTEGRATION
${line("AI approach", s.aiApproach)}
${line("Vendor / platform", s.vendor)}
${line("Systems to integrate with", s.integrations)}
${line("Integration complexity", s.integrationComplexity)}
${line("Workflow / UX changes", s.workflowChanges === "yes" ? s.workflowChangesDetail : "None")}
${line("Infrastructure available", s.infraAvailable)}
${line("Security review required", s.securityReview)}
${line("Technical lead", s.technicalLead)}

# STEP 6 — TEAM & GOVERNANCE
${line("Pilot sponsor", s.sponsor)}
${line("Pilot lead", s.pilotLead)}
Core team members:
${teamBlock(s)}
${line("Steering committee cadence", s.steeringCadence)}
${line("Go/no-go approvers", s.goNoGoApprovers)}
${line("Legal / compliance / risk stakeholders", s.hasComplianceStakeholders === "yes" ? s.complianceStakeholdersDetail : "None reported")}
${line("Change management lead", s.changeLead)}

# STEP 7 — RISKS & MITIGATIONS
${risksBlock(s)}

# STEP 8 — ROLLOUT & EXIT CRITERIA
${line("Rollout approach", s.rolloutApproach)}
${line("Phasing / split detail", s.rolloutDetail)}
${line("Training plan", s.trainingPlan)}
${line("Feedback mechanism", s.feedbackMechanism)}
${line("Interim check-in points", s.interimCheckins)}
${line("Final readout format", s.readoutFormat)}
${line("Go/no-go decision date", s.goNoGoDate)}
${line("Path to production (if go)", s.pathToProduction)}
${line("Handling of learnings (if no-go)", s.noGoLearnings)}

---

Produce TWO documents in a single response, in this exact order, separated by a line containing only the delimiter ${DOCUMENT_BREAK}

Format both documents in clean semantic HTML (use h1, h2, h3, p, ul, ol, table, thead, tbody, tr, th, td, strong). Do NOT wrap the output in markdown code fences. Do NOT include <html>, <head>, or <body> tags — emit only the content elements.

=== DOCUMENT 1: PILOT BRIEF (one page, executive-facing) ===
Must fit on a single printed page. Be concise and decisive. Include, as labeled sections:
- Pilot name and sponsor
- Hypothesis (use the hypothesis provided)
- Scope (1–2 sentences)
- Duration and population
- Success criteria (the top 3 metrics and the primary success threshold)
- Key risks (top 2, one sentence each)
- Investment required (estimate a sensible range based on integration complexity, team size, AI approach, and duration; state assumptions briefly)
- Go/no-go decision date
- Recommendation to approve (one persuasive paragraph making the case to the steering committee)

After the brief, output the delimiter ${DOCUMENT_BREAK} on its own line.

=== DOCUMENT 2: PILOT PLAYBOOK (full operational detail) ===
For the team executing the pilot. Use these numbered sections:
1. Overview and context — why we're doing this, what we're trying to learn
2. Hypothesis and success metrics — full metrics table with baselines and targets
3. Scope and boundaries — what's in, what's out, explicit exclusions
4. Data requirements and ownership — sources, readiness, responsible parties
5. Technology and integration plan — architecture overview, dependencies, integration points
6. Team structure and RACI — generate a RACI table (Responsible / Accountable / Consulted / Informed) from the team inputs
7. Risk register — full table with likelihood, impact, mitigations, and early warning signals
8. Rollout and onboarding plan — phasing, training approach, feedback mechanisms
9. Governance and reporting cadence — check-in schedule, steering committee, escalation path
10. Exit criteria and decision framework — go/no-go criteria, decision makers, post-pilot paths`;
}

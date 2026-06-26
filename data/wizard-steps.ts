import type { DataSourceKey, Risk, WizardState } from "@/lib/types";

export interface StepMeta {
  index: number; // 1-based
  name: string; // short, for sidebar/progress
  title: string; // step headline
  subtitle: string; // one-line description
  help: string; // opinionated guidance for the help panel
}

export const STEPS: StepMeta[] = [
  {
    index: 1,
    name: "Opportunity",
    title: "What are we trying to prove?",
    subtitle: "Name the pilot, the capability, and the hypothesis it tests.",
    help: "A good hypothesis is falsifiable, measurable, and scoped. If you can't state what would prove it wrong, it's not a hypothesis — it's a hope. Write it so a skeptic could agree on what evidence would settle the question.",
  },
  {
    index: 2,
    name: "Scope",
    title: "What's in and what's out?",
    subtitle: "Draw a tight boundary around what this pilot will test.",
    help: "Scope creep kills pilots. Be ruthlessly specific about what this pilot will and will not test. A focused pilot that answers one question cleanly is worth more than a broad pilot that answers nothing definitively.",
  },
  {
    index: 3,
    name: "Success metrics",
    title: "How will we know it worked?",
    subtitle: "Define measurable outcomes and the bar for proceeding.",
    help: "Good metrics are SMART. Separate leading indicators (measurable weekly) from lagging indicators (outcomes you see at the end). Include at least one metric that can surface problems early so you can course-correct rather than fail at the finish line.",
  },
  {
    index: 4,
    name: "Data",
    title: "What data do we need?",
    subtitle: "Inventory the sources, readiness, and ownership.",
    help: "Data problems are the most common reason pilots stall before they start. If any required source is 'not yet available', that becomes your first workstream — not the AI model. Name an owner for every source.",
  },
  {
    index: 5,
    name: "Technology",
    title: "What do we need to build or connect?",
    subtitle: "Choose the AI approach and map the integration surface.",
    help: "Keep the integration surface as small as possible for the pilot. Every integration point is a dependency that can delay you. If you can prove the hypothesis with a lighter integration, do that first.",
  },
  {
    index: 6,
    name: "Team & governance",
    title: "Who's running this?",
    subtitle: "Name the sponsor, the lead, the team, and the deciders.",
    help: "A pilot without an executive sponsor is a science project. Make sure someone with authority is named, engaged, and has committed to making a go/no-go decision based on the evidence — not on vibes.",
  },
  {
    index: 7,
    name: "Risks",
    title: "What could go wrong?",
    subtitle: "Build a risk register with mitigations and early signals.",
    help: "Name the risks you'd rather not think about. The most useful column is the early warning signal — how you'll know a risk is materializing before it becomes a crisis. A risk without a signal is just anxiety.",
  },
  {
    index: 8,
    name: "Rollout & exit",
    title: "How do we launch, learn, and decide?",
    subtitle: "Define rollout, training, feedback, and the go/no-go.",
    help: "The rollout plan is where most pilots get lazy. Shadow mode is underused — it lets you compare AI performance against human performance on real work before anyone's workflow changes. Seriously consider it.",
  },
];

export const TOTAL_STEPS = STEPS.length;

export const CAPABILITIES = [
  "Generative AI / LLM",
  "Predictive model",
  "Document processing / extraction",
  "Conversational AI / chatbot",
  "Computer vision",
  "Recommendation system",
  "Autonomous agent",
  "Other",
] as const;

export const DURATIONS = ["4 weeks", "6 weeks", "8 weeks", "12 weeks", "Custom"];

export const POPULATION_UNITS = [
  "customers",
  "members",
  "employees",
  "transactions",
  "documents",
  "cases",
];

export const POPULATION_PER = ["day", "week", "month"];

export const DATA_SOURCES: { key: DataSourceKey; label: string }[] = [
  { key: "internal_ops", label: "Internal transaction / operational data" },
  { key: "customer_profile", label: "Customer / member profile data" },
  { key: "document_repo", label: "Document repository" },
  { key: "event_streams", label: "Real-time event streams" },
  { key: "third_party", label: "Third-party data" },
  { key: "synthetic", label: "Synthetic / test data" },
  { key: "historical_labeled", label: "Historical labeled data (training/eval)" },
];

export const DATA_VOLUMES = [
  "<1K records",
  "1K–10K",
  "10K–100K",
  "100K–1M",
  "1M+",
];

export const DATA_FRESHNESS = [
  "Real-time",
  "Near real-time (<1hr)",
  "Daily",
  "Weekly",
  "Historical only",
];

export const STEERING_CADENCE = [
  "Weekly check-in",
  "Bi-weekly",
  "Monthly",
  "End-of-pilot only",
];

export const READOUT_FORMATS = [
  "Executive presentation",
  "Written report",
  "Both",
];

export const RISK_CATEGORIES: Risk["category"][] = [
  "Technical",
  "Data",
  "Regulatory",
  "Adoption",
  "Vendor",
  "Timeline",
  "Other",
];

let riskCounter = 0;
function makeRisk(partial: Omit<Risk, "id">): Risk {
  riskCounter += 1;
  return { id: `starter-${Date.now()}-${riskCounter}`, ...partial };
}

// Derive 3 suggested starter risks from Step 1 inputs — no Claude call.
export function getStarterRisks(industry: string, capability: string): Risk[] {
  const ind = industry.toLowerCase();
  const cap = capability.toLowerCase();
  const isFinancial =
    ind.includes("bank") ||
    ind.includes("credit union") ||
    ind.includes("capital markets") ||
    ind.includes("insurance");
  const isRegulated =
    isFinancial ||
    ind.includes("health") ||
    ind.includes("public sector") ||
    ind.includes("government");

  const risks: Risk[] = [];

  const isLlm =
    cap.includes("llm") ||
    cap.includes("generative") ||
    cap.includes("conversational") ||
    cap.includes("chatbot") ||
    cap.includes("agent");
  const isPredictive =
    cap.includes("predictive") || cap.includes("recommendation");

  if (isLlm) {
    risks.push(
      makeRisk({
        description:
          "Model hallucination leads to incorrect information being surfaced to members or staff",
        category: "Technical",
        likelihood: "Medium",
        impact: "High",
        mitigation:
          "Constrain outputs with retrieval grounding, require source citations, and route low-confidence responses to a human reviewer.",
        earlyWarning:
          "Reviewer override rate or flagged-answer rate climbs above an agreed threshold in weekly QA sampling.",
      })
    );
  } else if (isPredictive) {
    risks.push(
      makeRisk({
        description: isRegulated
          ? "Disparate impact on a protected class discovered during or after the pilot"
          : "Model accuracy degrades on real-world data versus the evaluation set",
        category: isRegulated ? "Regulatory" : "Technical",
        likelihood: "Medium",
        impact: "High",
        mitigation: isRegulated
          ? "Run fairness/bias testing across protected segments before launch and monitor segment-level outcomes throughout."
          : "Hold out a representative validation set, monitor live accuracy weekly, and define a rollback threshold.",
        earlyWarning: isRegulated
          ? "Outcome disparity between segments exceeds the agreed fairness tolerance in interim review."
          : "Live precision/recall drifts more than the agreed delta from the offline baseline.",
      })
    );
  } else {
    risks.push(
      makeRisk({
        description:
          "Model output quality on real-world inputs falls short of the accuracy bar set in the hypothesis",
        category: "Technical",
        likelihood: "Medium",
        impact: "High",
        mitigation:
          "Validate against a representative labeled sample before launch and monitor quality on a weekly cadence.",
        earlyWarning:
          "Weekly quality sampling trends below target for two consecutive checkpoints.",
      })
    );
  }

  if (isRegulated) {
    risks.push(
      makeRisk({
        description:
          "Regulatory or compliance review introduces requirements that delay launch or constrain scope",
        category: "Regulatory",
        likelihood: "Medium",
        impact: "Medium",
        mitigation:
          "Engage compliance and risk stakeholders in week one, document the data-use basis, and pre-agree the review checklist.",
        earlyWarning:
          "Open compliance questions remain unresolved within one week of the planned launch date.",
      })
    );
  } else {
    risks.push(
      makeRisk({
        description:
          "Required data source is not ready in time, delaying the start of the pilot",
        category: "Data",
        likelihood: "Medium",
        impact: "Medium",
        mitigation:
          "Confirm data access and quality in week one; stand up a fallback dataset or synthetic data if access slips.",
        earlyWarning:
          "Data access or quality issues remain open past the first weekly checkpoint.",
      })
    );
  }

  // Universal adoption risk
  risks.push(
    makeRisk({
      description:
        "Low adoption by intended users due to insufficient training or change management",
      category: "Adoption",
      likelihood: "Medium",
      impact: "High",
      mitigation:
        "Invest in hands-on onboarding, name change-management ownership, and gather participant feedback continuously.",
      earlyWarning:
        "Active usage of the tool by pilot participants stays below the expected baseline in the first two weeks.",
    })
  );

  return risks;
}

// Approximate the duration in weeks for time-remaining estimates.
export function durationWeeks(duration: string): number {
  const match = duration.match(/(\d+)\s*week/i);
  return match ? parseInt(match[1], 10) : 8;
}

// ---- Validation: returns true when the step's required fields are filled ----

const filled = (v: string) => v.trim().length > 0;

export function isStepValid(step: number, s: WizardState): boolean {
  switch (step) {
    case 1:
      return (
        filled(s.pilotName) &&
        filled(s.industry) &&
        filled(s.capability) &&
        (s.capability !== "Other" || filled(s.capabilityOther)) &&
        filled(s.businessProblem) &&
        filled(s.hypothesis) &&
        filled(s.beneficiary)
      );
    case 2:
      return (
        filled(s.scopeDescription) &&
        filled(s.populationCount) &&
        filled(s.populationUnit) &&
        filled(s.populationPer) &&
        filled(s.duration) &&
        filled(s.environment)
      );
    case 3:
      return (
        s.metrics.length >= 3 &&
        s.metrics.every(
          (m) =>
            filled(m.name) &&
            filled(m.baseline) &&
            filled(m.target) &&
            filled(m.method)
        ) &&
        filled(s.successThreshold) &&
        filled(s.failureThreshold)
      );
    case 4: {
      const anySelected = Object.values(s.dataSources).some((d) => d.selected);
      const constraintsOk =
        s.hasDataConstraints === "no" ||
        (s.hasDataConstraints === "yes" && filled(s.dataConstraintsDetail));
      return (
        anySelected &&
        constraintsOk &&
        filled(s.dataVolume) &&
        filled(s.dataOwner) &&
        filled(s.dataFreshness)
      );
    }
    case 5: {
      const workflowOk =
        s.workflowChanges === "no" ||
        (s.workflowChanges === "yes" && filled(s.workflowChangesDetail));
      return (
        filled(s.aiApproach) &&
        filled(s.integrations) &&
        filled(s.integrationComplexity) &&
        workflowOk &&
        filled(s.infraAvailable) &&
        filled(s.securityReview) &&
        filled(s.technicalLead)
      );
    }
    case 6: {
      const complianceOk =
        s.hasComplianceStakeholders === "no" ||
        (s.hasComplianceStakeholders === "yes" &&
          filled(s.complianceStakeholdersDetail));
      return (
        filled(s.sponsor) &&
        filled(s.pilotLead) &&
        filled(s.steeringCadence) &&
        filled(s.goNoGoApprovers) &&
        complianceOk
      );
    }
    case 7:
      return (
        s.risks.length >= 3 &&
        s.risks.every(
          (r) =>
            filled(r.description) && filled(r.mitigation) && filled(r.earlyWarning)
        )
      );
    case 8:
      return (
        filled(s.rolloutApproach) &&
        filled(s.trainingPlan) &&
        filled(s.feedbackMechanism) &&
        filled(s.readoutFormat) &&
        filled(s.goNoGoDate) &&
        filled(s.pathToProduction)
      );
    default:
      return false;
  }
}

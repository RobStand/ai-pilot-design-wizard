// Central type definitions for the wizard state.

export type Beneficiary =
  | "Customers / Members"
  | "Employees"
  | "Both"
  | "Operations / Back-office";

export type SandboxMode = "Production" | "Sandbox" | "Hybrid";

export type Readiness = "Ready now" | "Needs prep" | "Not yet available";

export type AiApproach =
  | "Existing vendor / SaaS AI tool (no custom model)"
  | "Build on a foundation model API"
  | "Fine-tune an existing model on our data"
  | "Train a custom model from scratch";

export type IntegrationComplexity =
  | "Low (API call only)"
  | "Medium (some integration work)"
  | "High (significant engineering required)";

export type InfraAvailability =
  | "Yes, fully"
  | "Partially"
  | "Needs to be provisioned";

export type RolloutApproach =
  | "Big bang"
  | "Phased"
  | "Shadow mode"
  | "A/B test";

export type HiLo = "High" | "Medium" | "Low";

export type MeasurementFrequency =
  | "Daily"
  | "Weekly"
  | "Bi-weekly"
  | "End of pilot";

export interface Metric {
  id: string;
  name: string;
  type: "Quantitative" | "Qualitative";
  baseline: string;
  target: string;
  method: string;
  frequency: MeasurementFrequency;
}

export interface Risk {
  id: string;
  description: string;
  category:
    | "Technical"
    | "Data"
    | "Regulatory"
    | "Adoption"
    | "Vendor"
    | "Timeline"
    | "Other";
  likelihood: HiLo;
  impact: HiLo;
  mitigation: string;
  earlyWarning: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  responsibility: string;
}

export type DataSourceKey =
  | "internal_ops"
  | "customer_profile"
  | "document_repo"
  | "event_streams"
  | "third_party"
  | "synthetic"
  | "historical_labeled";

export interface DataSourceSelection {
  selected: boolean;
  readiness: Readiness;
}

export interface WizardState {
  // Step 1 — opportunity
  pilotName: string;
  industry: string;
  capability: string;
  capabilityOther: string;
  businessProblem: string;
  hypothesis: string;
  beneficiary: Beneficiary | "";

  // Step 2 — scope
  scopeDescription: string;
  exclusions: string;
  populationCount: string;
  populationUnit: string;
  populationPer: string;
  duration: string;
  geography: string;
  environment: SandboxMode | "";

  // Step 3 — metrics
  metrics: Metric[];
  successThreshold: string;
  failureThreshold: string;

  // Step 4 — data
  dataSources: Record<DataSourceKey, DataSourceSelection>;
  hasDataConstraints: "yes" | "no" | "";
  dataConstraintsDetail: string;
  dataVolume: string;
  dataOwner: string;
  dataFreshness: string;

  // Step 5 — technology
  aiApproach: AiApproach | "";
  vendor: string;
  integrations: string;
  integrationComplexity: IntegrationComplexity | "";
  workflowChanges: "yes" | "no" | "";
  workflowChangesDetail: string;
  infraAvailable: InfraAvailability | "";
  securityReview: "yes" | "no" | "";
  technicalLead: string;

  // Step 6 — team & governance
  sponsor: string;
  pilotLead: string;
  teamMembers: TeamMember[];
  steeringCadence: string;
  goNoGoApprovers: string;
  hasComplianceStakeholders: "yes" | "no" | "";
  complianceStakeholdersDetail: string;
  changeLead: string;

  // Step 7 — risks
  risks: Risk[];

  // Step 8 — rollout & exit
  rolloutApproach: RolloutApproach | "";
  rolloutDetail: string;
  trainingPlan: string;
  feedbackMechanism: string;
  interimCheckins: string;
  readoutFormat: string;
  goNoGoDate: string;
  pathToProduction: string;
  noGoLearnings: string;
}

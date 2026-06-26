import type {
  DataSourceKey,
  DataSourceSelection,
  Metric,
  Risk,
  TeamMember,
  WizardState,
} from "@/lib/types";

const STORAGE_KEY = "pilot-wizard-state-v1";

function emptyDataSources(): Record<DataSourceKey, DataSourceSelection> {
  const keys: DataSourceKey[] = [
    "internal_ops",
    "customer_profile",
    "document_repo",
    "event_streams",
    "third_party",
    "synthetic",
    "historical_labeled",
  ];
  return keys.reduce((acc, k) => {
    acc[k] = { selected: false, readiness: "Ready now" };
    return acc;
  }, {} as Record<DataSourceKey, DataSourceSelection>);
}

export const initialWizardState: WizardState = {
  pilotName: "",
  industry: "",
  capability: "",
  capabilityOther: "",
  businessProblem: "",
  hypothesis: "",
  beneficiary: "",

  scopeDescription: "",
  exclusions: "",
  populationCount: "",
  populationUnit: "",
  populationPer: "",
  duration: "",
  geography: "",
  environment: "",

  metrics: [],
  successThreshold: "",
  failureThreshold: "",

  dataSources: emptyDataSources(),
  hasDataConstraints: "",
  dataConstraintsDetail: "",
  dataVolume: "",
  dataOwner: "",
  dataFreshness: "",

  aiApproach: "",
  vendor: "",
  integrations: "",
  integrationComplexity: "",
  workflowChanges: "",
  workflowChangesDetail: "",
  infraAvailable: "",
  securityReview: "",
  technicalLead: "",

  sponsor: "",
  pilotLead: "",
  teamMembers: [],
  steeringCadence: "",
  goNoGoApprovers: "",
  hasComplianceStakeholders: "",
  complianceStakeholdersDetail: "",
  changeLead: "",

  risks: [],

  rolloutApproach: "",
  rolloutDetail: "",
  trainingPlan: "",
  feedbackMechanism: "",
  interimCheckins: "",
  readoutFormat: "",
  goNoGoDate: "",
  pathToProduction: "",
  noGoLearnings: "",
};

let idSeed = 0;
export function uid(prefix = "id"): string {
  idSeed += 1;
  return `${prefix}-${Date.now().toString(36)}-${idSeed}`;
}

export function emptyMetric(): Metric {
  return {
    id: uid("metric"),
    name: "",
    type: "Quantitative",
    baseline: "",
    target: "",
    method: "",
    frequency: "Weekly",
  };
}

export function emptyRisk(): Risk {
  return {
    id: uid("risk"),
    description: "",
    category: "Technical",
    likelihood: "Medium",
    impact: "Medium",
    mitigation: "",
    earlyWarning: "",
  };
}

export function emptyTeamMember(): TeamMember {
  return { id: uid("tm"), name: "", role: "", responsibility: "" };
}

export type WizardAction =
  | { type: "SET_FIELD"; field: keyof WizardState; value: WizardState[keyof WizardState] }
  | { type: "PATCH"; patch: Partial<WizardState> }
  | { type: "TOGGLE_DATA_SOURCE"; key: DataSourceKey }
  | {
      type: "SET_DATA_READINESS";
      key: DataSourceKey;
      readiness: DataSourceSelection["readiness"];
    }
  | { type: "ADD_METRIC" }
  | { type: "UPDATE_METRIC"; id: string; patch: Partial<Metric> }
  | { type: "REMOVE_METRIC"; id: string }
  | { type: "ADD_RISK" }
  | { type: "ADD_RISKS"; risks: Risk[] }
  | { type: "UPDATE_RISK"; id: string; patch: Partial<Risk> }
  | { type: "REMOVE_RISK"; id: string }
  | { type: "ADD_TEAM_MEMBER" }
  | { type: "UPDATE_TEAM_MEMBER"; id: string; patch: Partial<TeamMember> }
  | { type: "REMOVE_TEAM_MEMBER"; id: string }
  | { type: "REPLACE"; state: WizardState }
  | { type: "RESET" };

export function wizardReducer(
  state: WizardState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "PATCH":
      return { ...state, ...action.patch };
    case "TOGGLE_DATA_SOURCE": {
      const current = state.dataSources[action.key];
      return {
        ...state,
        dataSources: {
          ...state.dataSources,
          [action.key]: { ...current, selected: !current.selected },
        },
      };
    }
    case "SET_DATA_READINESS":
      return {
        ...state,
        dataSources: {
          ...state.dataSources,
          [action.key]: {
            ...state.dataSources[action.key],
            readiness: action.readiness,
          },
        },
      };
    case "ADD_METRIC":
      return { ...state, metrics: [...state.metrics, emptyMetric()] };
    case "UPDATE_METRIC":
      return {
        ...state,
        metrics: state.metrics.map((m) =>
          m.id === action.id ? { ...m, ...action.patch } : m
        ),
      };
    case "REMOVE_METRIC":
      return {
        ...state,
        metrics: state.metrics.filter((m) => m.id !== action.id),
      };
    case "ADD_RISK":
      return { ...state, risks: [...state.risks, emptyRisk()] };
    case "ADD_RISKS":
      return { ...state, risks: [...state.risks, ...action.risks] };
    case "UPDATE_RISK":
      return {
        ...state,
        risks: state.risks.map((r) =>
          r.id === action.id ? { ...r, ...action.patch } : r
        ),
      };
    case "REMOVE_RISK":
      return { ...state, risks: state.risks.filter((r) => r.id !== action.id) };
    case "ADD_TEAM_MEMBER":
      return {
        ...state,
        teamMembers: [...state.teamMembers, emptyTeamMember()],
      };
    case "UPDATE_TEAM_MEMBER":
      return {
        ...state,
        teamMembers: state.teamMembers.map((t) =>
          t.id === action.id ? { ...t, ...action.patch } : t
        ),
      };
    case "REMOVE_TEAM_MEMBER":
      return {
        ...state,
        teamMembers: state.teamMembers.filter((t) => t.id !== action.id),
      };
    case "REPLACE":
      return action.state;
    case "RESET":
      return initialWizardState;
    default:
      return state;
  }
}

// ---- localStorage persistence ----

export function loadSavedState(): WizardState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Merge over initial state so newly added fields stay defined.
    return {
      ...initialWizardState,
      ...parsed,
      dataSources: { ...emptyDataSources(), ...(parsed.dataSources ?? {}) },
    };
  } catch {
    return null;
  }
}

export function saveState(state: WizardState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / serialization errors
  }
}

export function clearSavedState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasSavedState(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export const WIZARD_STORAGE_KEY = STORAGE_KEY;

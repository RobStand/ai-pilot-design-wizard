"use client";

import type { IntegrationComplexity } from "@/lib/types";
import {
  Field,
  RadioGroup,
  Segmented,
  TextArea,
  TextInput,
  YesNo,
} from "@/components/ui";
import type { StepProps } from "./types";

const COMPLEXITY: IntegrationComplexity[] = [
  "Low (API call only)",
  "Medium (some integration work)",
  "High (significant engineering required)",
];

export default function Step5Technology({ state, dispatch }: StepProps) {
  const set = (field: keyof typeof state, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  return (
    <div>
      <Field label="AI approach" required>
        <RadioGroup
          value={state.aiApproach}
          onChange={(v) => set("aiApproach", v)}
          options={[
            {
              value: "Existing vendor / SaaS AI tool (no custom model)",
              label: "Use an existing vendor / SaaS AI tool",
              description: "No custom model.",
            },
            {
              value: "Build on a foundation model API",
              label: "Build on a foundation model API",
              description: "OpenAI, Anthropic, Azure OpenAI, etc.",
            },
            {
              value: "Fine-tune an existing model on our data",
              label: "Fine-tune an existing model on our data",
            },
            {
              value: "Train a custom model from scratch",
              label: "Train a custom model from scratch",
            },
          ]}
        />
      </Field>

      <Field label="Vendor or platform" hint="If applicable.">
        <TextInput
          value={state.vendor}
          onChange={(v) => set("vendor", v)}
          placeholder="e.g. Anthropic Claude, Azure OpenAI, internal platform"
        />
      </Field>

      <Field label="Systems this pilot needs to integrate with" required>
        <TextArea
          value={state.integrations}
          onChange={(v) => set("integrations", v)}
          rows={3}
          placeholder="List the systems, APIs, or data stores."
        />
      </Field>

      <Field label="Integration complexity" required>
        <Segmented
          value={state.integrationComplexity}
          onChange={(v) => set("integrationComplexity", v)}
          options={COMPLEXITY}
        />
      </Field>

      <Field label="Will this require changes to existing workflows or UX?" required>
        <YesNo
          value={state.workflowChanges}
          onChange={(v) => set("workflowChanges", v)}
        />
      </Field>

      {state.workflowChanges === "yes" && (
        <Field label="Describe the workflow / UX changes" required>
          <TextArea
            value={state.workflowChangesDetail}
            onChange={(v) => set("workflowChangesDetail", v)}
            rows={2}
          />
        </Field>
      )}

      <Field label="Infrastructure already available?" required>
        <RadioGroup
          value={state.infraAvailable}
          onChange={(v) => set("infraAvailable", v)}
          options={[
            { value: "Yes, fully", label: "Yes, fully" },
            { value: "Partially", label: "Partially" },
            { value: "Needs to be provisioned", label: "Needs to be provisioned" },
          ]}
        />
      </Field>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="Security review required?" required>
          <YesNo
            value={state.securityReview}
            onChange={(v) => set("securityReview", v)}
          />
        </Field>
        <Field label="Technical lead for this pilot" required>
          <TextInput
            value={state.technicalLead}
            onChange={(v) => set("technicalLead", v)}
            placeholder="Name / role"
          />
        </Field>
      </div>
    </div>
  );
}

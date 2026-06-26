"use client";

import { CAPABILITIES } from "@/data/wizard-steps";
import { INDUSTRIES } from "@/data/industries";
import type { Beneficiary } from "@/lib/types";
import { Field, Select, TextArea, TextInput } from "@/components/ui";
import type { StepProps } from "./types";

const BENEFICIARIES: Beneficiary[] = [
  "Customers / Members",
  "Employees",
  "Both",
  "Operations / Back-office",
];

const HYPOTHESIS_SCAFFOLD =
  "We believe that [AI capability] will [achieve outcome] for [user/customer], resulting in [measurable impact]. We will know this is true when [evidence].";

export default function Step1Opportunity({ state, dispatch }: StepProps) {
  const set = (field: keyof typeof state, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  return (
    <div>
      <Field label="Pilot name" required>
        <TextInput
          value={state.pilotName}
          onChange={(v) => set("pilotName", v)}
          placeholder="e.g. Intelligent Loan Document Review Pilot"
        />
      </Field>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="Industry" required>
          <Select
            value={state.industry}
            onChange={(v) => set("industry", v)}
            options={INDUSTRIES}
          />
        </Field>

        <Field label="Primary beneficiary" required>
          <Select
            value={state.beneficiary}
            onChange={(v) => set("beneficiary", v)}
            options={BENEFICIARIES}
            placeholder="Who benefits most?"
          />
        </Field>
      </div>

      <Field label="AI capability being piloted" required>
        <Select
          value={state.capability}
          onChange={(v) => set("capability", v)}
          options={CAPABILITIES}
        />
      </Field>

      {state.capability === "Other" && (
        <Field label="Describe the capability" required>
          <TextInput
            value={state.capabilityOther}
            onChange={(v) => set("capabilityOther", v)}
            placeholder="Name the AI capability"
          />
        </Field>
      )}

      <Field
        label="The business problem this addresses"
        required
        hint="Describe in 2–3 sentences what is broken today."
      >
        <TextArea
          value={state.businessProblem}
          onChange={(v) => set("businessProblem", v)}
          rows={3}
          placeholder="What is slow, costly, error-prone, or impossible today?"
        />
      </Field>

      <Field
        label="The hypothesis"
        required
        hint="Fill in the brackets. A hypothesis you can't disprove isn't a hypothesis."
      >
        <TextArea
          value={state.hypothesis}
          onChange={(v) => set("hypothesis", v)}
          rows={4}
          placeholder={HYPOTHESIS_SCAFFOLD}
        />
      </Field>
    </div>
  );
}

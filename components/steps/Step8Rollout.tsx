"use client";

import { READOUT_FORMATS } from "@/data/wizard-steps";
import { Field, RadioGroup, Select, TextArea } from "@/components/ui";
import type { StepProps } from "./types";

export default function Step8Rollout({ state, dispatch }: StepProps) {
  const set = (field: keyof typeof state, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  const showPhasing =
    state.rolloutApproach === "Phased" || state.rolloutApproach === "A/B test";

  return (
    <div>
      <Field label="Rollout approach" required>
        <RadioGroup
          value={state.rolloutApproach}
          onChange={(v) => set("rolloutApproach", v)}
          options={[
            {
              value: "Big bang",
              label: "Big bang",
              description: "All pilot participants from day one.",
            },
            {
              value: "Phased",
              label: "Phased",
              description: "Start with a small group, expand in waves.",
            },
            {
              value: "Shadow mode",
              label: "Shadow mode",
              description:
                "AI runs in parallel but humans make all decisions (for comparison).",
            },
            {
              value: "A/B test",
              label: "A/B test",
              description: "Split participants between AI-assisted and control.",
            },
          ]}
        />
      </Field>

      {showPhasing && (
        <Field label="Describe the phases or split" required>
          <TextArea
            value={state.rolloutDetail}
            onChange={(v) => set("rolloutDetail", v)}
            rows={2}
          />
        </Field>
      )}

      <Field
        label="Training plan"
        required
        hint="How will participants be prepared? What does onboarding look like?"
      >
        <TextArea
          value={state.trainingPlan}
          onChange={(v) => set("trainingPlan", v)}
          rows={3}
        />
      </Field>

      <Field
        label="Feedback mechanism"
        required
        hint="How will you collect qualitative feedback during the pilot?"
      >
        <TextArea
          value={state.feedbackMechanism}
          onChange={(v) => set("feedbackMechanism", v)}
          rows={3}
        />
      </Field>

      <div className="grid gap-x-5 sm:grid-cols-3">
        <Field
          label="Interim check-in points"
          hint="Aside from the final readout."
        >
          <input
            type="number"
            min={0}
            className="field-input"
            value={state.interimCheckins}
            onChange={(e) => set("interimCheckins", e.target.value)}
            placeholder="e.g. 2"
          />
        </Field>
        <Field label="Final readout format" required>
          <Select
            value={state.readoutFormat}
            onChange={(v) => set("readoutFormat", v)}
            options={READOUT_FORMATS}
          />
        </Field>
        <Field label="Go/no-go decision date" required>
          <input
            type="date"
            className="field-input"
            value={state.goNoGoDate}
            onChange={(e) => set("goNoGoDate", e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="If go: what does the path to production look like?"
        required
      >
        <TextArea
          value={state.pathToProduction}
          onChange={(v) => set("pathToProduction", v)}
          rows={2}
        />
      </Field>

      <Field label="If no-go: what happens to the learnings?">
        <TextArea
          value={state.noGoLearnings}
          onChange={(v) => set("noGoLearnings", v)}
          rows={2}
          placeholder="How will findings be documented and reused?"
        />
      </Field>
    </div>
  );
}

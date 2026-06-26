"use client";

import { DURATIONS, POPULATION_PER, POPULATION_UNITS } from "@/data/wizard-steps";
import { Field, RadioGroup, Select, TextArea, TextInput } from "@/components/ui";
import type { StepProps } from "./types";

export default function Step2Scope({ state, dispatch }: StepProps) {
  const set = (field: keyof typeof state, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  return (
    <div>
      <Field
        label="Pilot scope description"
        required
        hint="What processes, systems, or workflows are included?"
      >
        <TextArea
          value={state.scopeDescription}
          onChange={(v) => set("scopeDescription", v)}
          rows={3}
          placeholder="Describe exactly what this pilot will cover."
        />
      </Field>

      <Field
        label="Explicit exclusions"
        hint="What are you deliberately NOT testing in this pilot?"
      >
        <TextArea
          value={state.exclusions}
          onChange={(v) => set("exclusions", v)}
          rows={3}
          placeholder="Name what's out of scope so no one assumes it's in."
        />
      </Field>

      <Field label="Pilot population" required>
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span>Approximately</span>
          <input
            type="number"
            min={0}
            className="field-input w-24"
            value={state.populationCount}
            onChange={(e) => set("populationCount", e.target.value)}
            placeholder="N"
          />
          <select
            className="field-input w-auto bg-white"
            value={state.populationUnit}
            onChange={(e) => set("populationUnit", e.target.value)}
          >
            <option value="" disabled>
              unit
            </option>
            {POPULATION_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <span>per</span>
          <select
            className="field-input w-auto bg-white"
            value={state.populationPer}
            onChange={(e) => set("populationPer", e.target.value)}
          >
            <option value="" disabled>
              period
            </option>
            {POPULATION_PER.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </Field>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="Duration" required>
          <Select
            value={state.duration}
            onChange={(v) => set("duration", v)}
            options={DURATIONS}
          />
        </Field>

        <Field label="Geography / business unit scope">
          <TextInput
            value={state.geography}
            onChange={(v) => set("geography", v)}
            placeholder="Which locations, teams, or segments?"
          />
        </Field>
      </div>

      <Field label="Will this pilot run in production or a sandbox?" required>
        <RadioGroup
          value={state.environment}
          onChange={(v) => set("environment", v)}
          options={[
            { value: "Production", label: "Production" },
            { value: "Sandbox", label: "Sandbox" },
            { value: "Hybrid", label: "Hybrid" },
          ]}
        />
      </Field>
    </div>
  );
}

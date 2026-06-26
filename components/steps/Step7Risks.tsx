"use client";

import { useEffect, useRef } from "react";
import { getStarterRisks, RISK_CATEGORIES } from "@/data/wizard-steps";
import type { HiLo, Risk } from "@/lib/types";
import { Field, Segmented, Select, TextArea, TextInput } from "@/components/ui";
import type { StepProps } from "./types";

const HILO: HiLo[] = ["High", "Medium", "Low"];

export default function Step7Risks({ state, dispatch }: StepProps) {
  const seeded = useRef(false);

  // Pre-populate starter risks (client-side, from Step 1) the first time the
  // user lands on this step with no risks yet.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (state.risks.length === 0) {
      const capability =
        state.capability === "Other" ? state.capabilityOther : state.capability;
      const starters = getStarterRisks(state.industry, capability);
      if (starters.length) dispatch({ type: "ADD_RISKS", risks: starters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (id: string, patch: Partial<Risk>) =>
    dispatch({ type: "UPDATE_RISK", id, patch });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          Suggested starter risks are pre-filled — edit them and add your own.
          (at least 3, {state.risks.length} so far)
        </p>
        <button
          type="button"
          className="btn-ghost text-xs"
          onClick={() => dispatch({ type: "ADD_RISK" })}
        >
          + Add risk
        </button>
      </div>

      <div className="space-y-4">
        {state.risks.map((r, i) => (
          <div
            key={r.id}
            className="rounded-xl border border-paper-line bg-paper-soft/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Risk {i + 1}
              </span>
              <button
                type="button"
                className="text-xs text-ink-muted hover:text-accent"
                onClick={() => dispatch({ type: "REMOVE_RISK", id: r.id })}
              >
                Remove
              </button>
            </div>

            <Field label="Risk description" required>
              <TextInput
                value={r.description}
                onChange={(v) => update(r.id, { description: v })}
                placeholder="What could go wrong?"
              />
            </Field>

            <div className="grid gap-x-4 sm:grid-cols-3">
              <Field label="Category">
                <Select
                  value={r.category}
                  onChange={(v) =>
                    update(r.id, { category: v as Risk["category"] })
                  }
                  options={RISK_CATEGORIES}
                />
              </Field>
              <Field label="Likelihood">
                <Segmented
                  value={r.likelihood}
                  onChange={(v) => update(r.id, { likelihood: v as HiLo })}
                  options={HILO}
                />
              </Field>
              <Field label="Impact">
                <Segmented
                  value={r.impact}
                  onChange={(v) => update(r.id, { impact: v as HiLo })}
                  options={HILO}
                />
              </Field>
            </div>

            <Field label="Mitigation plan" required>
              <TextArea
                value={r.mitigation}
                onChange={(v) => update(r.id, { mitigation: v })}
                rows={2}
              />
            </Field>

            <Field
              label="Early warning signal"
              required
              hint="How will you know this risk is materializing before it becomes a crisis?"
            >
              <TextInput
                value={r.earlyWarning}
                onChange={(v) => update(r.id, { earlyWarning: v })}
              />
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}

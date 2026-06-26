"use client";

import { Field, Select, TextArea, TextInput } from "@/components/ui";
import type { MeasurementFrequency } from "@/lib/types";
import type { StepProps } from "./types";

const FREQUENCIES: MeasurementFrequency[] = [
  "Daily",
  "Weekly",
  "Bi-weekly",
  "End of pilot",
];

export default function Step3Metrics({ state, dispatch }: StepProps) {
  const canAdd = state.metrics.length < 7;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          Add at least 3 metrics ({state.metrics.length}/7).
        </p>
        <button
          type="button"
          className="btn-ghost text-xs"
          disabled={!canAdd}
          onClick={() => dispatch({ type: "ADD_METRIC" })}
        >
          + Add metric
        </button>
      </div>

      <div className="space-y-4">
        {state.metrics.map((m, i) => (
          <div key={m.id} className="rounded-xl border border-paper-line bg-paper-soft/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Metric {i + 1}
              </span>
              <button
                type="button"
                className="text-xs text-ink-muted hover:text-accent"
                onClick={() => dispatch({ type: "REMOVE_METRIC", id: m.id })}
              >
                Remove
              </button>
            </div>

            <div className="grid gap-x-4 sm:grid-cols-2">
              <Field label="Metric name" required>
                <TextInput
                  value={m.name}
                  onChange={(v) =>
                    dispatch({ type: "UPDATE_METRIC", id: m.id, patch: { name: v } })
                  }
                  placeholder="e.g. Document review time"
                />
              </Field>
              <Field label="Type">
                <Select
                  value={m.type}
                  onChange={(v) =>
                    dispatch({
                      type: "UPDATE_METRIC",
                      id: m.id,
                      patch: { type: v as "Quantitative" | "Qualitative" },
                    })
                  }
                  options={["Quantitative", "Qualitative"]}
                />
              </Field>
              <Field label="Current baseline" required>
                <TextInput
                  value={m.baseline}
                  onChange={(v) =>
                    dispatch({ type: "UPDATE_METRIC", id: m.id, patch: { baseline: v } })
                  }
                  placeholder="What is it today?"
                />
              </Field>
              <Field label="Target value" required>
                <TextInput
                  value={m.target}
                  onChange={(v) =>
                    dispatch({ type: "UPDATE_METRIC", id: m.id, patch: { target: v } })
                  }
                  placeholder="What does success look like?"
                />
              </Field>
              <Field label="How it will be measured" required>
                <TextInput
                  value={m.method}
                  onChange={(v) =>
                    dispatch({ type: "UPDATE_METRIC", id: m.id, patch: { method: v } })
                  }
                  placeholder="Data source, method"
                />
              </Field>
              <Field label="Measurement frequency">
                <Select
                  value={m.frequency}
                  onChange={(v) =>
                    dispatch({
                      type: "UPDATE_METRIC",
                      id: m.id,
                      patch: { frequency: v as MeasurementFrequency },
                    })
                  }
                  options={FREQUENCIES}
                />
              </Field>
            </div>
          </div>
        ))}

        {state.metrics.length === 0 && (
          <button
            type="button"
            className="w-full rounded-xl border border-dashed border-paper-line py-6 text-sm text-ink-muted hover:border-accent hover:text-accent"
            onClick={() => dispatch({ type: "ADD_METRIC" })}
          >
            + Add your first metric
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-x-5 sm:grid-cols-2">
        <Field
          label="Primary success threshold"
          required
          hint="The minimum bar for proceeding to production."
        >
          <TextArea
            value={state.successThreshold}
            onChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "successThreshold", value: v })
            }
            rows={3}
            placeholder="We will declare this pilot a success if…"
          />
        </Field>
        <Field
          label="Primary failure threshold"
          required
          hint="What would cause you to pull the plug early?"
        >
          <TextArea
            value={state.failureThreshold}
            onChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "failureThreshold", value: v })
            }
            rows={3}
            placeholder="We will declare this pilot a failure and stop if…"
          />
        </Field>
      </div>
    </div>
  );
}

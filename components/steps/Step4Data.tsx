"use client";

import {
  DATA_FRESHNESS,
  DATA_SOURCES,
  DATA_VOLUMES,
} from "@/data/wizard-steps";
import type { Readiness } from "@/lib/types";
import { Field, Select, TextArea, TextInput, YesNo } from "@/components/ui";
import type { StepProps } from "./types";

const READINESS: Readiness[] = ["Ready now", "Needs prep", "Not yet available"];

export default function Step4Data({ state, dispatch }: StepProps) {
  return (
    <div>
      <Field label="Data sources required" required hint="Check all that apply.">
        <div className="space-y-2">
          {DATA_SOURCES.map((src) => {
            const sel = state.dataSources[src.key];
            return (
              <div
                key={src.key}
                className={`rounded-lg border px-3.5 py-3 transition ${
                  sel.selected
                    ? "border-accent/40 bg-accent-soft/40"
                    : "border-paper-line bg-white"
                }`}
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-accent"
                    checked={sel.selected}
                    onChange={() =>
                      dispatch({ type: "TOGGLE_DATA_SOURCE", key: src.key })
                    }
                  />
                  <span className="text-sm text-ink">{src.label}</span>
                </label>
                {sel.selected && (
                  <div className="mt-2 flex flex-wrap gap-2 pl-7">
                    {READINESS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`seg ${sel.readiness === r ? "seg-on" : ""}`}
                        onClick={() =>
                          dispatch({
                            type: "SET_DATA_READINESS",
                            key: src.key,
                            readiness: r,
                          })
                        }
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Field>

      <Field label="Data privacy or regulatory constraints?" required>
        <YesNo
          value={state.hasDataConstraints}
          onChange={(v) =>
            dispatch({ type: "SET_FIELD", field: "hasDataConstraints", value: v })
          }
        />
      </Field>

      {state.hasDataConstraints === "yes" && (
        <Field label="Describe the constraints" required>
          <TextArea
            value={state.dataConstraintsDetail}
            onChange={(v) =>
              dispatch({
                type: "SET_FIELD",
                field: "dataConstraintsDetail",
                value: v,
              })
            }
            rows={2}
            placeholder="e.g. PII handling, GDPR, GLBA, HIPAA, contractual limits"
          />
        </Field>
      )}

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="Data volume estimate" required>
          <Select
            value={state.dataVolume}
            onChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "dataVolume", value: v })
            }
            options={DATA_VOLUMES}
          />
        </Field>
        <Field label="Data freshness requirement" required>
          <Select
            value={state.dataFreshness}
            onChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "dataFreshness", value: v })
            }
            options={DATA_FRESHNESS}
          />
        </Field>
      </div>

      <Field
        label="Who is responsible for data access and preparation?"
        required
      >
        <TextInput
          value={state.dataOwner}
          onChange={(v) =>
            dispatch({ type: "SET_FIELD", field: "dataOwner", value: v })
          }
          placeholder="Name / role"
        />
      </Field>
    </div>
  );
}

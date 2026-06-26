"use client";

import { STEERING_CADENCE } from "@/data/wizard-steps";
import { Field, Select, TextArea, TextInput, YesNo } from "@/components/ui";
import type { StepProps } from "./types";

export default function Step6Team({ state, dispatch }: StepProps) {
  const set = (field: keyof typeof state, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });
  const canAddMember = state.teamMembers.length < 6;

  return (
    <div>
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field
          label="Pilot sponsor"
          required
          hint="Executive with budget authority who receives results."
        >
          <TextInput
            value={state.sponsor}
            onChange={(v) => set("sponsor", v)}
            placeholder="Name / role"
          />
        </Field>
        <Field label="Pilot lead" required hint="Day-to-day owner.">
          <TextInput
            value={state.pilotLead}
            onChange={(v) => set("pilotLead", v)}
            placeholder="Name / role"
          />
        </Field>
      </div>

      <Field label="Core team members" hint="Add up to 6.">
        <div className="space-y-2">
          {state.teamMembers.map((tm, i) => (
            <div
              key={tm.id}
              className="grid gap-2 rounded-lg border border-paper-line bg-paper-soft/50 p-3 sm:grid-cols-[1fr_1fr_1.4fr_auto]"
            >
              <input
                className="field-input"
                placeholder="Name"
                value={tm.name}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_TEAM_MEMBER",
                    id: tm.id,
                    patch: { name: e.target.value },
                  })
                }
              />
              <input
                className="field-input"
                placeholder="Role"
                value={tm.role}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_TEAM_MEMBER",
                    id: tm.id,
                    patch: { role: e.target.value },
                  })
                }
              />
              <input
                className="field-input"
                placeholder="Responsibility"
                value={tm.responsibility}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_TEAM_MEMBER",
                    id: tm.id,
                    patch: { responsibility: e.target.value },
                  })
                }
              />
              <button
                type="button"
                aria-label={`Remove team member ${i + 1}`}
                className="seg"
                onClick={() =>
                  dispatch({ type: "REMOVE_TEAM_MEMBER", id: tm.id })
                }
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-ghost text-xs"
            disabled={!canAddMember}
            onClick={() => dispatch({ type: "ADD_TEAM_MEMBER" })}
          >
            + Add team member
          </button>
        </div>
      </Field>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="Steering committee cadence" required>
          <Select
            value={state.steeringCadence}
            onChange={(v) => set("steeringCadence", v)}
            options={STEERING_CADENCE}
          />
        </Field>
        <Field label="Change management lead" hint="Who manages the human side?">
          <TextInput
            value={state.changeLead}
            onChange={(v) => set("changeLead", v)}
            placeholder="Name / role"
          />
        </Field>
      </div>

      <Field label="Who needs to approve go/no-go to production?" required>
        <TextArea
          value={state.goNoGoApprovers}
          onChange={(v) => set("goNoGoApprovers", v)}
          rows={2}
          placeholder="List the decision makers."
        />
      </Field>

      <Field label="Legal, compliance, or risk stakeholders involved?" required>
        <YesNo
          value={state.hasComplianceStakeholders}
          onChange={(v) => set("hasComplianceStakeholders", v)}
        />
      </Field>

      {state.hasComplianceStakeholders === "yes" && (
        <Field label="Names / roles" required>
          <TextArea
            value={state.complianceStakeholdersDetail}
            onChange={(v) => set("complianceStakeholdersDetail", v)}
            rows={2}
          />
        </Field>
      )}
    </div>
  );
}

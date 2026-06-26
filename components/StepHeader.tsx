"use client";

import type { StepMeta } from "@/data/wizard-steps";

export default function StepHeader({ step }: { step: StepMeta }) {
  return (
    <header className="mb-6">
      <div className="font-mono text-xs uppercase tracking-widest text-accent">
        Step {step.index} of 8 · {step.name}
      </div>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">
        {step.title}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">{step.subtitle}</p>
    </header>
  );
}

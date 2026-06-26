"use client";

import { TOTAL_STEPS } from "@/data/wizard-steps";

export default function WizardNav({
  step,
  canProceed,
  onBack,
  onNext,
  onGenerate,
}: {
  step: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onGenerate: () => void;
}) {
  const isLast = step === TOTAL_STEPS;

  return (
    <div className="mt-8 flex items-center justify-between border-t border-paper-line pt-5">
      <button
        type="button"
        className="btn-ghost"
        onClick={onBack}
        disabled={step === 1}
      >
        ← Back
      </button>

      {!canProceed && (
        <span className="hidden text-xs text-ink-muted sm:block">
          Complete the required fields to continue
        </span>
      )}

      {isLast ? (
        <button
          type="button"
          className="btn-primary"
          onClick={onGenerate}
          disabled={!canProceed}
        >
          Generate pilot documents →
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next →
        </button>
      )}
    </div>
  );
}

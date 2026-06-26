"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  isStepValid,
  STEPS,
  TOTAL_STEPS,
} from "@/data/wizard-steps";
import {
  initialWizardState,
  loadSavedState,
  saveState,
  wizardReducer,
} from "@/lib/wizard-reducer";
import ProgressSidebar from "@/components/ProgressSidebar";
import StepHeader from "@/components/StepHeader";
import WizardNav from "@/components/WizardNav";
import Step1Opportunity from "@/components/steps/Step1Opportunity";
import Step2Scope from "@/components/steps/Step2Scope";
import Step3Metrics from "@/components/steps/Step3Metrics";
import Step4Data from "@/components/steps/Step4Data";
import Step5Technology from "@/components/steps/Step5Technology";
import Step6Team from "@/components/steps/Step6Team";
import Step7Risks from "@/components/steps/Step7Risks";
import Step8Rollout from "@/components/steps/Step8Rollout";

const MINUTES_PER_STEP = 2.5;

export default function WizardShell() {
  const router = useRouter();
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [helpOpen, setHelpOpen] = useState(false);

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    const saved = loadSavedState();
    if (saved) dispatch({ type: "REPLACE", state: saved });
    setHydrated(true);
  }, []);

  // Autosave whenever state changes (after hydration).
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const validity = useMemo(
    () => STEPS.map((s) => isStepValid(s.index, state)),
    [state]
  );
  const canProceed = validity[step - 1];

  const remainingMinutes = useMemo(() => {
    const remainingSteps = STEPS.filter(
      (s) => s.index >= step && !validity[s.index - 1]
    ).length;
    return Math.max(0, Math.round(remainingSteps * MINUTES_PER_STEP));
  }, [step, validity]);

  const goTo = (n: number) => {
    const clamped = Math.min(Math.max(1, n), TOTAL_STEPS);
    setStep(clamped);
    setMaxReached((m) => Math.max(m, clamped));
    setHelpOpen(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerate = () => {
    saveState(state);
    router.push("/results");
  };

  const meta = STEPS[step - 1];

  const renderStep = () => {
    const props = { state, dispatch };
    switch (step) {
      case 1:
        return <Step1Opportunity {...props} />;
      case 2:
        return <Step2Scope {...props} />;
      case 3:
        return <Step3Metrics {...props} />;
      case 4:
        return <Step4Data {...props} />;
      case 5:
        return <Step5Technology {...props} />;
      case 6:
        return <Step6Team {...props} />;
      case 7:
        return <Step7Risks {...props} />;
      case 8:
        return <Step8Rollout {...props} />;
      default:
        return null;
    }
  };

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-ink"
        >
          pilot<span className="text-accent">.design</span>
        </Link>
        <span className="font-mono text-xs text-ink-muted">
          {remainingMinutes > 0
            ? `~${remainingMinutes} min remaining`
            : "Ready to generate"}
        </span>
      </div>

      {/* Mobile progress bar */}
      <div className="mb-6 lg:hidden">
        <div className="mb-1 flex justify-between font-mono text-xs text-ink-muted">
          <span>
            Step {step} / {TOTAL_STEPS} · {meta.name}
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-line">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-10">
            <ProgressSidebar
              current={step}
              maxReached={maxReached}
              validity={validity}
              onJump={goTo}
            />
          </div>
        </aside>

        {/* Main column */}
        <main>
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="card p-6 sm:p-8">
              <StepHeader step={meta} />

              {/* Mobile collapsible help */}
              <div className="mb-5 lg:hidden">
                <button
                  type="button"
                  className="btn-ghost w-full justify-between text-xs"
                  onClick={() => setHelpOpen((o) => !o)}
                >
                  <span>How to think about this step</span>
                  <span>{helpOpen ? "−" : "+"}</span>
                </button>
                {helpOpen && <p className="help-panel mt-2">{meta.help}</p>}
              </div>

              {renderStep()}

              <WizardNav
                step={step}
                canProceed={canProceed}
                onBack={() => goTo(step - 1)}
                onNext={() => goTo(step + 1)}
                onGenerate={handleGenerate}
              />
            </div>

            {/* Desktop help panel */}
            <aside className="hidden lg:block">
              <div className="sticky top-10">
                <div className="help-panel">
                  <div className="mb-1.5 font-mono text-xs uppercase tracking-wider text-accent">
                    Guidance
                  </div>
                  {meta.help}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

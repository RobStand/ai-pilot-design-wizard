"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSavedState, hasSavedState, loadSavedState } from "@/lib/wizard-reducer";

const STEPS_PREVIEW = [
  ["01", "The opportunity", "Name the pilot and write a falsifiable hypothesis."],
  ["02", "Scope & boundaries", "Draw a tight line around what you'll test."],
  ["03", "Success metrics", "Define the bar for proceeding to production."],
  ["04", "Data requirements", "Inventory sources, readiness, and owners."],
  ["05", "Technology", "Pick the approach; minimize the integration surface."],
  ["06", "Team & governance", "Name the sponsor, lead, and deciders."],
  ["07", "Risks", "Build a register with mitigations and early signals."],
  ["08", "Rollout & exit", "Plan the launch and the go/no-go decision."],
];

export default function LandingPage() {
  const router = useRouter();
  const [resume, setResume] = useState(false);
  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    if (hasSavedState()) {
      const s = loadSavedState();
      setResume(true);
      setResumeName(s?.pilotName || "");
    }
  }, []);

  const startFresh = () => {
    clearSavedState();
    router.push("/wizard");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      {/* Nav */}
      <div className="mb-14 flex items-center justify-between">
        <span className="font-mono text-sm font-medium tracking-tight text-ink">
          pilot<span className="text-accent">.design</span>
        </span>
        <span className="font-mono text-xs text-ink-muted">
          AI Pilot Design Wizard
        </span>
      </div>

      {/* Hero */}
      <section className="max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-paper-line bg-white px-3 py-1 font-mono text-xs text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Eight steps · two documents
        </div>
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Design an AI pilot that survives the steering committee.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          Most AI pilots fail because they were never properly designed — no clear
          hypothesis, no success metrics, no exit criteria. This wizard forces the
          discipline that separates pilots that convert to production from the ones
          that die in committee.
        </p>

        {resume && (
          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-accent/20 bg-accent-soft/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-accent-ink">
              <span className="font-medium">Resume where you left off</span>
              {resumeName && (
                <span className="text-accent-ink/80"> — “{resumeName}”</span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={startFresh} className="btn-ghost text-xs">
                Start over
              </button>
              <Link href="/wizard" className="btn-primary text-xs">
                Resume →
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {resume ? (
            <Link href="/wizard" className="btn-primary">
              Continue pilot →
            </Link>
          ) : (
            <Link href="/wizard" className="btn-primary">
              Start designing →
            </Link>
          )}
          <span className="text-sm text-ink-muted">
            Generates a one-page Brief + full execution Playbook.
          </span>
        </div>
      </section>

      {/* Steps grid */}
      <section className="mt-16">
        <div className="mb-5 font-mono text-xs uppercase tracking-widest text-ink-muted">
          What you&apos;ll work through
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS_PREVIEW.map(([n, title, desc]) => (
            <div key={n} className="card p-4">
              <div className="font-mono text-xs text-accent">{n}</div>
              <div className="mt-1 text-sm font-semibold text-ink">{title}</div>
              <div className="mt-1 text-xs leading-relaxed text-ink-muted">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outputs */}
      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <div className="font-mono text-xs uppercase tracking-wider text-accent">
            Output 1
          </div>
          <h3 className="mt-1 text-lg font-semibold text-ink">Pilot Brief</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            A one-page, executive-facing summary — hypothesis, scope, success
            criteria, key risks, investment, and a recommendation to approve.
            Built to fit on a single printed page.
          </p>
        </div>
        <div className="card p-6">
          <div className="font-mono text-xs uppercase tracking-wider text-accent">
            Output 2
          </div>
          <h3 className="mt-1 text-lg font-semibold text-ink">Pilot Playbook</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            The full operational plan for the team — metrics tables, a RACI,
            a complete risk register, rollout and onboarding, governance, and
            exit criteria.
          </p>
        </div>
      </section>

      <footer className="mt-16 border-t border-paper-line pt-6 font-mono text-xs text-ink-muted">
        Your work autosaves locally in this browser. Nothing is stored on a server.
      </footer>
    </div>
  );
}

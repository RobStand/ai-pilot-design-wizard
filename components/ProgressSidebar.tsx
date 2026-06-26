"use client";

import { STEPS } from "@/data/wizard-steps";

export default function ProgressSidebar({
  current,
  maxReached,
  validity,
  onJump,
}: {
  current: number;
  maxReached: number;
  validity: boolean[]; // index 0 == step 1
  onJump: (step: number) => void;
}) {
  return (
    <nav className="space-y-1">
      {STEPS.map((s) => {
        const isCurrent = s.index === current;
        const reached = s.index <= maxReached;
        const complete = validity[s.index - 1] && s.index < current;
        const clickable = reached;
        return (
          <button
            key={s.index}
            type="button"
            disabled={!clickable}
            onClick={() => clickable && onJump(s.index)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
              isCurrent
                ? "bg-accent-soft text-accent-ink"
                : clickable
                ? "text-ink hover:bg-paper-soft"
                : "cursor-not-allowed text-ink-muted/50"
            }`}
          >
            <span
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border text-xs font-medium ${
                isCurrent
                  ? "border-accent bg-accent text-white"
                  : complete
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-paper-line text-ink-muted"
              }`}
            >
              {complete ? "✓" : s.index}
            </span>
            <span className="truncate">{s.name}</span>
          </button>
        );
      })}
    </nav>
  );
}

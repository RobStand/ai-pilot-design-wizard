"use client";

import { forwardRef } from "react";

const PilotBrief = forwardRef<HTMLDivElement, { html: string; pilotName?: string }>(
  function PilotBrief({ html, pilotName }, ref) {
    return (
      <div
        ref={ref}
        className="doc mx-auto max-w-[820px] bg-white p-8 sm:p-10"
        style={{ fontSize: "13px", lineHeight: 1.5 }}
      >
        <div className="mb-4 flex items-center justify-between border-b border-paper-line pb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Pilot Brief
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            {pilotName || "AI Pilot Program"}
          </span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }
);

export default PilotBrief;

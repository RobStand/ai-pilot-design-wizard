"use client";

import { forwardRef } from "react";

const PilotPlaybook = forwardRef<
  HTMLDivElement,
  { html: string; pilotName?: string }
>(function PilotPlaybook({ html, pilotName }, ref) {
  return (
    <div ref={ref} className="doc mx-auto max-w-[820px] bg-white p-8 sm:p-12">
      <div className="mb-6 border-b border-paper-line pb-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Pilot Playbook
        </div>
        <div className="mt-1 text-lg font-semibold tracking-tight text-ink">
          {pilotName || "AI Pilot Program"}
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
});

export default PilotPlaybook;

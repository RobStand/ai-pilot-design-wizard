"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DOCUMENT_BREAK } from "@/lib/prompts";
import type { WizardState } from "@/lib/types";
import { loadSavedState } from "@/lib/wizard-reducer";
import ExportBar from "@/components/ExportBar";
import PilotBrief from "@/components/PilotBrief";
import PilotPlaybook from "@/components/PilotPlaybook";

type Tab = "brief" | "playbook";
type Status = "idle" | "streaming" | "done" | "error";

function cleanHtml(raw: string): string {
  return raw
    .replace(/```html/gi, "")
    .replace(/```/g, "")
    .replace(/<\/?(?:html|head|body)[^>]*>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<!--\s*ERROR:[\s\S]*?-->/gi, "")
    .trim();
}

export default function ResultsPage() {
  const [tab, setTab] = useState<Tab>("brief");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [briefHtml, setBriefHtml] = useState("");
  const [playbookHtml, setPlaybookHtml] = useState("");
  const [pilotName, setPilotName] = useState("");
  const [noInputs, setNoInputs] = useState(false);

  const briefRef = useRef<HTMLDivElement>(null);
  const playbookRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const state = loadSavedState();
    if (!state || !state.pilotName) {
      setNoInputs(true);
      return;
    }
    setPilotName(state.pilotName);
    void generate(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generate(state: WizardState) {
    setStatus("streaming");
    setBriefHtml("");
    setPlaybookHtml("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });

        const breakIdx = acc.indexOf(DOCUMENT_BREAK);
        if (breakIdx === -1) {
          setBriefHtml(cleanHtml(acc));
        } else {
          setBriefHtml(cleanHtml(acc.slice(0, breakIdx)));
          setPlaybookHtml(cleanHtml(acc.slice(breakIdx + DOCUMENT_BREAK.length)));
        }
      }

      if (acc.includes("<!-- ERROR:")) {
        const m = acc.match(/<!--\s*ERROR:\s*([\s\S]*?)-->/);
        throw new Error(m?.[1]?.trim() || "Generation failed.");
      }

      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (noInputs) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-semibold text-ink">No pilot inputs found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Start the wizard to design your pilot, then generate the documents.
        </p>
        <Link href="/wizard" className="btn-primary mt-6">
          Open the wizard →
        </Link>
      </div>
    );
  }

  const isStreaming = status === "streaming";
  const playbookLoading = isStreaming && playbookHtml.length === 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="no-print sticky top-0 z-10 border-b border-paper-line bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-mono text-sm font-medium text-ink">
              pilot<span className="text-accent">.design</span>
            </Link>
            <span className="hidden text-sm text-ink-muted sm:inline">
              {pilotName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/wizard" className="btn-ghost text-xs">
              Edit inputs
            </Link>
            {tab === "brief" ? (
              <ExportBar
                getElement={() => briefRef.current}
                filename={`${pilotName || "pilot"}-brief.pdf`}
                variant="brief"
                disabled={status !== "done" && briefHtml.length === 0}
              />
            ) : (
              <ExportBar
                getElement={() => playbookRef.current}
                filename={`${pilotName || "pilot"}-playbook.pdf`}
                variant="playbook"
                disabled={status !== "done" && playbookHtml.length === 0}
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-5xl gap-1 px-4 sm:px-6">
          {(["brief", "playbook"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                tab === t
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {t === "brief" ? "Pilot Brief" : "Pilot Playbook"}
              {t === "playbook" && playbookLoading && (
                <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent align-middle" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Status line */}
      {(isStreaming || status === "error") && (
        <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
          {isStreaming && (
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              Generating your pilot documents…
            </div>
          )}
          {status === "error" && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}{" "}
              <button
                type="button"
                className="ml-2 underline"
                onClick={() => {
                  const s = loadSavedState();
                  if (s) void generate(s);
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Document body */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="card overflow-hidden">
          <div className={tab === "brief" ? "" : "hidden"}>
            {briefHtml ? (
              <PilotBrief ref={briefRef} html={briefHtml} pilotName={pilotName} />
            ) : (
              <Placeholder label="Pilot Brief" />
            )}
          </div>
          <div className={tab === "playbook" ? "" : "hidden"}>
            {playbookHtml ? (
              <PilotPlaybook
                ref={playbookRef}
                html={playbookHtml}
                pilotName={pilotName}
              />
            ) : (
              <Placeholder
                label="Pilot Playbook"
                sub={
                  isStreaming
                    ? "The playbook streams after the brief completes…"
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Placeholder({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center p-10 text-center">
      <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-paper-line border-t-accent" />
      <p className="text-sm font-medium text-ink">Preparing the {label}</p>
      {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}

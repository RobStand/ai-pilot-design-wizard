"use client";

import { useState } from "react";
import { copyElementText, exportElementToPdf } from "@/lib/pdf-export";

export default function ExportBar({
  getElement,
  filename,
  variant,
  disabled,
}: {
  getElement: () => HTMLElement | null;
  filename: string;
  variant: "brief" | "playbook";
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePdf = async () => {
    const el = getElement();
    if (!el) return;
    setBusy(true);
    try {
      await exportElementToPdf(el, { filename, variant });
    } catch (err) {
      console.error(err);
      alert("PDF export failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    const el = getElement();
    if (!el) return;
    try {
      await copyElementText(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Copy failed.");
    }
  };

  return (
    <div className="no-print flex items-center gap-2">
      <button
        type="button"
        className="btn-ghost text-xs"
        onClick={handleCopy}
        disabled={disabled}
      >
        {copied ? "Copied ✓" : "Copy as text"}
      </button>
      <button
        type="button"
        className="btn-primary text-xs"
        onClick={handlePdf}
        disabled={disabled || busy}
      >
        {busy ? "Exporting…" : "Download PDF"}
      </button>
    </div>
  );
}

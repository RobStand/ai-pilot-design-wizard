// Client-side PDF export helpers using html2pdf.js (dynamically imported).

type PdfVariant = "brief" | "playbook";

interface ExportOptions {
  filename: string;
  variant: PdfVariant;
}

export async function exportElementToPdf(
  element: HTMLElement,
  { filename, variant }: ExportOptions
): Promise<void> {
  // html2pdf references window/document, so import only in the browser.
  const html2pdf = (await import("html2pdf.js")).default;

  const margin =
    variant === "brief"
      ? [10, 12, 10, 12] // tighter margins so the brief fits one page
      : [14, 16, 16, 16];

  const opt = {
    margin,
    filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    pagebreak: { mode: ["css", "legacy"] },
  };

  await html2pdf().set(opt).from(element).save();
}

export async function copyElementText(element: HTMLElement): Promise<void> {
  const text = element.innerText;
  await navigator.clipboard.writeText(text);
}

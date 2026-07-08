import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { REPORT_CSS, deckblattHtml, fensterBlockHtml } from "./reportContent.js";

// Breite/Höhe von A4 in mm und die entsprechende Pixelbreite bei 96dpi.
// Jede Seite wird exakt in dieser Breite gerendert (box-sizing: border-box),
// damit nichts über den Seitenrand hinausragen und rechts abgeschnitten werden kann.
const A4_MM = { w: 210, h: 297 };
const PAGE_PX = 794; // 210mm bei 96dpi

function renderInIframe(html) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-10000px";
    iframe.style.left = "0";
    iframe.style.width = `${PAGE_PX}px`;
    iframe.style.height = "1px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const doc = iframe.contentDocument;
        const bilder = Array.from(doc.images);
        await Promise.all(
          bilder.map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((res) => {
                  img.onload = res;
                  img.onerror = res;
                })
          )
        );
        iframe.style.height = `${doc.body.scrollHeight}px`;
        requestAnimationFrame(() => resolve({ iframe, doc }));
      } catch (err) {
        reject(err);
      }
    };
    iframe.srcdoc = html;
  });
}

// Zeichnet ein Canvas so in die PDF-Seite, dass es garantiert vollständig
// (Breite UND Höhe) auf die Seite passt – zentriert, notfalls verkleinert.
function seiteEinpassen(pdf, canvas, istErsteSeite) {
  if (!istErsteSeite) pdf.addPage();

  const pxPerMmBreite = canvas.width / A4_MM.w;
  const inhaltHoeheMm = canvas.height / pxPerMmBreite;

  const skalierung = Math.min(1, A4_MM.h / inhaltHoeheMm);
  const breiteMm = A4_MM.w * skalierung;
  const hoeheMm = inhaltHoeheMm * skalierung;
  const x = (A4_MM.w - breiteMm) / 2;
  const y = (A4_MM.h - hoeheMm) / 2;

  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  pdf.addImage(imgData, "JPEG", x, y, breiteMm, hoeheMm);
}

// Erstellt ein echtes, downloadbares Mehrseiten-PDF: eine A4-Seite als Deckblatt,
// danach eine A4-Seite pro Fenster – jede Seite vollständig und zentriert eingepasst.
// svgProvider(id) liefert die aktuell gerenderte Skizze (SVG-HTML) je Fenster.
export async function exportAlsPdf(fenster, svgProvider, heute, dateiname) {
  if (fenster.length === 0) return;

  const seitenHtml = fenster
    .map((f, i) => `<div class="pdf-seite" id="pdf-fenster-${f.id}">${fensterBlockHtml(f, i, svgProvider)}</div>`)
    .join("\n");

  const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
  ${REPORT_CSS}
  html, body { width: ${PAGE_PX}px; }
  .pdf-seite { width: ${PAGE_PX}px; padding: 36px 32px; }
  .pdf-seite .fenster { border: none; padding: 0; margin: 0; }
</style>
</head>
<body>
<div class="pdf-seite" id="pdf-deckblatt">${deckblattHtml(fenster.length, heute)}</div>
${seitenHtml}
</body>
</html>`;

  const { iframe, doc } = await renderInIframe(html);

  try {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });

    const deckblatt = doc.getElementById("pdf-deckblatt");
    const deckblattCanvas = await html2canvas(deckblatt, { scale: 2, useCORS: true, backgroundColor: "#FFFFFF" });
    seiteEinpassen(pdf, deckblattCanvas, true);

    for (const f of fenster) {
      const el = doc.getElementById(`pdf-fenster-${f.id}`);
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#FFFFFF" });
      seiteEinpassen(pdf, canvas, false);
    }

    pdf.save(dateiname ?? `fenster-aufmass-${heute.replaceAll(".", "-")}.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
}

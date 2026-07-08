import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { REPORT_CSS, deckblattHtml, fensterBlockHtml } from "./reportContent.js";
import { svgZuImgTag } from "../lib/svgRaster.js";

// Breite/Höhe von A4 in mm und die entsprechende Pixelbreite bei 96dpi.
// Jede Seite wird exakt in dieser Breite gerendert, damit nichts über den
// Seitenrand hinausragen und rechts abgeschnitten werden kann.
const A4_MM = { w: 210, h: 297 };
const PAGE_PX = 794; // 210mm bei 96dpi

// Das Report-CSS wird direkt im Hauptdokument eingefügt (kein iframe mehr) –
// html2canvas hatte über ein per srcdoc befülltes iframe keine zuverlässigen
// Koordinaten geliefert (Inhalt landete verschoben/rechtsbündig). Alle
// Selektoren in REPORT_CSS sind unter ".aufmass-report" verschachtelt, damit
// sie nicht auf die laufende App durchschlagen.
function stelleStyleSicher() {
  if (document.getElementById("pdf-export-style")) return;
  const style = document.createElement("style");
  style.id = "pdf-export-style";
  style.textContent = REPORT_CSS;
  document.head.appendChild(style);
}

function baueSeite(innerHtml) {
  const seite = document.createElement("div");
  seite.style.width = `${PAGE_PX}px`;
  seite.style.padding = "36px 32px";
  seite.style.background = "#FFFFFF";
  seite.innerHTML = innerHtml;
  return seite;
}

function baueContainer(fenster, svgProvider, heute, projektNotiz) {
  stelleStyleSicher();

  const container = document.createElement("div");
  container.className = "aufmass-report";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "-99999px";
  container.style.width = `${PAGE_PX}px`;

  const deckblatt = baueSeite(deckblattHtml(fenster.length, heute, projektNotiz));
  container.appendChild(deckblatt);

  const seiten = fenster.map((f, i) => {
    const seite = baueSeite(fensterBlockHtml(f, i, svgProvider));
    const fensterEl = seite.querySelector(".fenster");
    if (fensterEl) {
      fensterEl.style.border = "none";
      fensterEl.style.padding = "0";
      fensterEl.style.margin = "0";
    }
    container.appendChild(seite);
    return seite;
  });

  document.body.appendChild(container);
  return { container, deckblatt, seiten };
}

async function warteAufBilder(container) {
  const bilder = Array.from(container.querySelectorAll("img"));
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
export async function exportAlsPdf(fenster, svgProvider, heute, projektNotiz, dateiname) {
  if (fenster.length === 0) return;

  // Skizzen vorab zu <img>-Tags rastern (html2canvas rendert komplexe inline-SVGs
  // mit Mustern/gedrehtem Text nicht zuverlässig – ein fertiges Rasterbild schon).
  const gerasterteSkizzen = {};
  for (const f of fenster) {
    gerasterteSkizzen[f.id] = await svgZuImgTag(svgProvider(f.id) ?? "");
  }
  const svgProviderFuerPdf = (id) => gerasterteSkizzen[id] ?? "";

  const { container, deckblatt, seiten } = baueContainer(fenster, svgProviderFuerPdf, heute, projektNotiz);

  try {
    await warteAufBilder(container);
    // Einen Frame abwarten, damit Layout/Fonts vor der Aufnahme sicher stehen.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const pdf = new jsPDF({ unit: "mm", format: "a4" });

    const html2canvasOptions = {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
      // Verhindert, dass html2canvas beim Klonen des Hauptdokuments den
      // externen Google-Fonts-Import erneut anfragt (macht jede Seite langsam).
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
          if (el.textContent?.includes("fonts.googleapis.com") || el.href?.includes("fonts.googleapis.com")) {
            el.remove();
          }
        });
      },
    };

    const deckblattCanvas = await html2canvas(deckblatt, html2canvasOptions);
    seiteEinpassen(pdf, deckblattCanvas, true);

    for (const seite of seiten) {
      const canvas = await html2canvas(seite, html2canvasOptions);
      seiteEinpassen(pdf, canvas, false);
    }

    pdf.save(dateiname ?? `fenster-aufmass-${heute.replaceAll(".", "-")}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

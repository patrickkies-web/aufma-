import { num } from "../lib/format.js";

// Gemeinsamer Inhalt (HTML-Fragmente + CSS) für den HTML- und den PDF-Export,
// damit beide immer dieselben, vollständigen Informationen zeigen.
//
// Alle Selektoren sind unter ".aufmass-report" verschachtelt: der PDF-Export
// fügt dieses CSS direkt im Hauptdokument der App ein (kein iframe mehr, siehe
// exportPdf.js), damit es dort NICHT auf die laufende App durchschlägt.
export const REPORT_CSS = `
  .aufmass-report, .aufmass-report * { box-sizing: border-box; }
  .aufmass-report { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; color: #22313F; }
  .aufmass-report header { border-bottom: 3px solid #22313F; padding-bottom: 12px; margin-bottom: 8px; }
  .aufmass-report h1 { margin: 0; font-size: 24px; }
  .aufmass-report .meta { color: #6B7A85; font-size: 13px; margin-top: 4px; }
  .aufmass-report .hinweis { background: #FBF0DC; border: 1px solid #D9A441; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin: 16px 0 24px; line-height: 1.5; }
  .aufmass-report .fenster { border: 1px solid #DDE4E8; border-radius: 10px; padding: 16px 18px; margin-bottom: 20px; page-break-inside: avoid; }
  .aufmass-report .fenster h2 { margin: 0 0 10px; font-size: 16px; }
  .aufmass-report .nr { font-family: ui-monospace, Menlo, monospace; color: #2456A6; }
  .aufmass-report .skizze { width: 100%; }
  .aufmass-report .skizze svg { width: 100%; max-width: 460px; height: auto; display: block; margin-inline: auto; }
  .aufmass-report .tiefe-info { display: grid; gap: 6px; margin-top: 10px; }
  .aufmass-report .tiefe-info div { padding: 8px 12px; border-radius: 8px; font-size: 12.5px; line-height: 1.45; }
  .aufmass-report .tiefe-info .rollo { background: #FBF0DC; border: 1px solid #D9A441; }
  .aufmass-report .tiefe-info .fenster-tiefe { background: #CFE4F6; border: 1px solid #2E4A66; }
  .aufmass-report .tiefe-info strong { font-family: ui-monospace, Menlo, monospace; }
  .aufmass-report .legende { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 10px; font-size: 11.5px; }
  .aufmass-report .legende span.eintrag { display: inline-flex; align-items: center; gap: 6px; }
  .aufmass-report .legende span.swatch { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
  .aufmass-report table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px; }
  .aufmass-report th, .aufmass-report td { padding: 6px 8px; border-bottom: 1px solid #EEF1F3; text-align: left; }
  .aufmass-report th { color: #6B7A85; font-weight: 600; width: 55%; }
  .aufmass-report td { font-family: ui-monospace, Menlo, monospace; }
  .aufmass-report .fotos { display: flex; gap: 14px; margin-top: 14px; }
  .aufmass-report .fotos figure { margin: 0; flex: 1; }
  .aufmass-report .fotos img { width: 100%; border-radius: 8px; border: 1px solid #DDE4E8; display: block; }
  .aufmass-report .fotos figcaption { font-size: 12px; color: #6B7A85; text-align: center; margin-top: 4px; }
  .aufmass-report footer { color: #6B7A85; font-size: 12px; margin-top: 24px; }
`;

const LEGENDE_EINTRAEGE = [
  { farbe: "#E6DFD3", rand: "#B9AC97", text: "Mauerwerk (Wand)" },
  { farbe: "#FFFFFF", rand: "#22313F", text: "Maueraussparung" },
  { farbe: "#CFE4F6", rand: "#2E4A66", text: "Fensterelement" },
  { farbe: "#FBF0DC", rand: "#D9A441", text: "Rollladenraum" },
];

export function deckblattHtml(fensterCount, heute) {
  return `
<header>
  <h1>Fenster-Aufmaß</h1>
  <div class="meta">Erstellt am ${heute} · ${fensterCount} Fenster · alle Maße in mm</div>
</header>
<div class="hinweis">
  <strong>Hinweis zur Rollladenraum-Tiefe:</strong> gemessen von der Wandkante bündig zum Fenster
  bis zur Innenkante des Mauerwerks (zweischaliges Mauerwerk).
  Die Rollladenraum-Höhe ergibt sich aus Aussparungshöhe minus Fensterhöhe.
</div>`;
}

// svgProvider(id) liefert das HTML für die Skizze – normalerweise das rohe SVG,
// im PDF-Export (siehe exportPdf.js) stattdessen ein vorgerastertes <img>, weil
// html2canvas komplexe inline-SVGs (Muster, gedrehter Text) nicht zuverlässig rendert.
export function fensterBlockHtml(f, index, svgProvider) {
  const svg = svgProvider(f.id) ?? "";
  const h = Math.max(num(f.aH) - num(f.fH), 0);
  const rT = num(f.rT), fT = num(f.fT);

  const legende = `
    <div class="legende">
      ${LEGENDE_EINTRAEGE.map((e) => `
        <span class="eintrag">
          <span class="swatch" style="background:${e.farbe}; border:1.5px solid ${e.rand};"></span>
          ${e.text}
        </span>`).join("")}
    </div>`;

  const tiefeInfo = (rT > 0 || fT > 0) ? `
    <div class="tiefe-info">
      ${rT > 0 ? `<div class="rollo"><strong>Rollladenraum-Tiefe: ${rT} mm</strong><br>gemessen von der Wandkante bündig zum Fenster bis zur Innenkante des Mauerwerks (zweischalig)</div>` : ""}
      ${fT > 0 ? `<div class="fenster-tiefe"><strong>Fenster-Bautiefe: ${fT} mm</strong><br>Vorderkante bis Hinterkante des Fensterelements, an der tiefsten Stelle gemessen</div>` : ""}
    </div>` : "";

  const fotos = (f.fotoInnen || f.fotoAussen) ? `
    <div class="fotos">
      ${f.fotoAussen ? `<figure><img src="${f.fotoAussen}" alt="Foto außen"><figcaption>Ist-Zustand außen</figcaption></figure>` : ""}
      ${f.fotoInnen ? `<figure><img src="${f.fotoInnen}" alt="Foto innen"><figcaption>Ist-Zustand innen</figcaption></figure>` : ""}
    </div>` : "";

  return `
    <section class="fenster">
      <h2><span class="nr">${String(index + 1).padStart(2, "0")}</span> ${f.name ? f.name : "Ohne Bezeichnung"}</h2>
      <div class="skizze">${svg}</div>
      ${legende}
      ${tiefeInfo}
      <table>
        <tr><th>Maueraussparung innen</th><td>B ${num(f.aB)} × H ${num(f.aH)} mm</td></tr>
        <tr><th>Maueraussparung außen</th><td>B ${num(f.aaB)} × H ${num(f.aaH)} mm</td></tr>
        <tr><th>Fensterelement (Bestand)</th><td>B ${num(f.fB)} × H ${num(f.fH)} mm</td></tr>
        <tr><th>Fenster-Bautiefe (tiefste Stelle)</th><td>T ${fT} mm</td></tr>
        <tr><th>Rollladenraum</th><td>T ${rT} × H ${h} mm</td></tr>
      </table>
      ${fotos}
    </section>`;
}

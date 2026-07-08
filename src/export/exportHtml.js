import { num } from "../lib/format.js";
import { download } from "../lib/files.js";

// Baut den druckfertigen HTML-Report für alle erfassten Fenster.
// svgProvider(id) liefert das gerenderte Skizzen-SVG (als HTML-String) für ein Fenster.
export function baueFensterbauerHtml(fenster, svgProvider, heute) {
  const bloecke = fenster.map((f, i) => {
    const svg = svgProvider(f.id) ?? "";
    const h = Math.max(num(f.aH) - num(f.fH), 0);
    return `
      <section class="fenster">
        <h2><span class="nr">${String(i + 1).padStart(2, "0")}</span> ${f.name ? f.name : "Ohne Bezeichnung"}</h2>
        <div class="inhalt">
          <div class="skizze">${svg}</div>
          <table>
            <tr><th>Maueraussparung innen</th><td>B ${num(f.aB)} × H ${num(f.aH)} mm</td></tr>
            <tr><th>Maueraussparung außen</th><td>B ${num(f.aaB)} × H ${num(f.aaH)} mm</td></tr>
            <tr><th>Fensterelement (Bestand)</th><td>B ${num(f.fB)} × H ${num(f.fH)} mm</td></tr>
            <tr><th>Fenster-Bautiefe (tiefste Stelle)</th><td>T ${num(f.fT)} mm</td></tr>
            <tr><th>Rollladenraum</th><td>T ${num(f.rT)} × H ${h} mm</td></tr>
          </table>
          ${(f.fotoInnen || f.fotoAussen) ? `
          <div class="fotos">
            ${f.fotoAussen ? `<figure><img src="${f.fotoAussen}" alt="Foto außen"><figcaption>Ist-Zustand außen</figcaption></figure>` : ""}
            ${f.fotoInnen ? `<figure><img src="${f.fotoInnen}" alt="Foto innen"><figcaption>Ist-Zustand innen</figcaption></figure>` : ""}
          </div>` : ""}
        </div>
      </section>`;
  }).join("\n");

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fenster-Aufmaß – ${heute}</title>
<style>
  body { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; color: #22313F; margin: 0; padding: 32px 24px; max-width: 800px; margin-inline: auto; }
  header { border-bottom: 3px solid #22313F; padding-bottom: 12px; margin-bottom: 8px; }
  h1 { margin: 0; font-size: 24px; }
  .meta { color: #6B7A85; font-size: 13px; margin-top: 4px; }
  .hinweis { background: #FBF0DC; border: 1px solid #D9A441; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin: 16px 0 24px; line-height: 1.5; }
  .fenster { border: 1px solid #DDE4E8; border-radius: 10px; padding: 16px 18px; margin-bottom: 20px; page-break-inside: avoid; }
  .fenster h2 { margin: 0 0 10px; font-size: 16px; }
  .nr { font-family: ui-monospace, Menlo, monospace; color: #2456A6; }
  .skizze svg { width: 100%; max-width: 460px; height: auto; display: block; margin-inline: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; }
  th, td { padding: 6px 8px; border-bottom: 1px solid #EEF1F3; text-align: left; }
  th { color: #6B7A85; font-weight: 600; width: 55%; }
  td { font-family: ui-monospace, Menlo, monospace; }
  .fotos { display: flex; gap: 14px; margin-top: 14px; }
  .fotos figure { margin: 0; flex: 1; }
  .fotos img { width: 100%; border-radius: 8px; border: 1px solid #DDE4E8; display: block; }
  .fotos figcaption { font-size: 12px; color: #6B7A85; text-align: center; margin-top: 4px; }
  footer { color: #6B7A85; font-size: 12px; margin-top: 24px; }
  @media print { body { padding: 0; } .fenster { border-color: #BFC9CF; } }
</style>
</head>
<body>
<header>
  <h1>Fenster-Aufmaß</h1>
  <div class="meta">Erstellt am ${heute} · ${fenster.length} Fenster · alle Maße in mm</div>
</header>
<div class="hinweis">
  <strong>Hinweis zur Rollladenraum-Tiefe:</strong> gemessen von der Wandkante bündig zum Fenster
  bis zur Innenkante des Mauerwerks (zweischaliges Mauerwerk).
  Die Rollladenraum-Höhe ergibt sich aus Aussparungshöhe minus Fensterhöhe.
</div>
${bloecke}
<footer>Zum Drucken oder als PDF speichern: Datei öffnen und die Druckfunktion des Browsers verwenden.</footer>
</body>
</html>`;
}

export function exportFensterbauerHtml(fenster, svgProvider, heute) {
  const html = baueFensterbauerHtml(fenster, svgProvider, heute);
  download(html, `fenster-aufmass-${heute.replaceAll(".", "-")}.html`, "text/html");
}

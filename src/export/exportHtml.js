import { download } from "../lib/files.js";
import { REPORT_CSS, deckblattHtml, fensterBlockHtml } from "./reportContent.js";

// Baut den druckfertigen HTML-Report für alle erfassten Fenster.
// svgProvider(id) liefert das gerenderte Skizzen-SVG (als HTML-String) für ein Fenster.
export function baueFensterbauerHtml(fenster, svgProvider, heute, projektNotiz) {
  const bloecke = fenster.map((f, i) => fensterBlockHtml(f, i, svgProvider)).join("\n");

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fenster-Aufmaß – ${heute}</title>
<style>
  ${REPORT_CSS}
  body { margin: 0; }
  .aufmass-report { padding: 32px 24px; max-width: 800px; margin-inline: auto; }
  @media print { .aufmass-report { padding: 0; } .fenster { border-color: #BFC9CF; } }
</style>
</head>
<body>
<div class="aufmass-report">
${deckblattHtml(fenster.length, heute, projektNotiz)}
${bloecke}
<footer>Zum Drucken oder als PDF speichern: Datei öffnen und die Druckfunktion des Browsers verwenden.</footer>
</div>
</body>
</html>`;
}

export function exportFensterbauerHtml(fenster, svgProvider, heute, projektNotiz) {
  const html = baueFensterbauerHtml(fenster, svgProvider, heute, projektNotiz);
  download(html, `fenster-aufmass-${heute.replaceAll(".", "-")}.html`, "text/html");
}

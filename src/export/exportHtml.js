import { download } from "../lib/files.js";
import { REPORT_CSS, deckblattHtml, fensterBlockHtml } from "./reportContent.js";

// Baut den druckfertigen HTML-Report für alle erfassten Fenster.
// svgProvider(id) liefert das gerenderte Skizzen-SVG (als HTML-String) für ein Fenster.
export function baueFensterbauerHtml(fenster, svgProvider, heute) {
  const bloecke = fenster.map((f, i) => fensterBlockHtml(f, i, svgProvider)).join("\n");

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fenster-Aufmaß – ${heute}</title>
<style>
  ${REPORT_CSS}
  body { padding: 32px 24px; max-width: 800px; margin-inline: auto; }
  @media print { body { padding: 0; } .fenster { border-color: #BFC9CF; } }
</style>
</head>
<body>
${deckblattHtml(fenster.length, heute)}
${bloecke}
<footer>Zum Drucken oder als PDF speichern: Datei öffnen und die Druckfunktion des Browsers verwenden.</footer>
</body>
</html>`;
}

export function exportFensterbauerHtml(fenster, svgProvider, heute) {
  const html = baueFensterbauerHtml(fenster, svgProvider, heute);
  download(html, `fenster-aufmass-${heute.replaceAll(".", "-")}.html`, "text/html");
}

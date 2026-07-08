import { download } from "../lib/files.js";
import { REPORT_CSS, deckblattHtml, fensterBlockHtml } from "./reportContent.js";
import { t } from "../i18n/translations.js";

// Baut den druckfertigen HTML-Report für alle erfassten Fenster.
// svgProvider(id) liefert das gerenderte Skizzen-SVG (als HTML-String) für ein Fenster.
export function baueFensterbauerHtml(fenster, svgProvider, heute, projektNotiz, lang = "de") {
  const bloecke = fenster.map((f, i) => fensterBlockHtml(f, i, svgProvider, lang)).join("\n");

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t(lang, "reportTitel")} – ${heute}</title>
<style>
  ${REPORT_CSS}
  body { margin: 0; }
  .aufmass-report { padding: 32px 24px; max-width: 800px; margin-inline: auto; }
  @media print { .aufmass-report { padding: 0; } .fenster { border-color: #BFC9CF; } }
</style>
</head>
<body>
<div class="aufmass-report">
${deckblattHtml(fenster.length, heute, projektNotiz, lang)}
${bloecke}
<footer>${t(lang, "reportFusszeile")}</footer>
</div>
</body>
</html>`;
}

export function exportFensterbauerHtml(fenster, svgProvider, heute, projektNotiz, lang = "de") {
  const html = baueFensterbauerHtml(fenster, svgProvider, heute, projektNotiz, lang);
  download(html, `fenster-aufmass-${heute.replaceAll(".", "-")}.html`, "text/html");
}

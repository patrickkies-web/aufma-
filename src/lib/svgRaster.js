// Rastert ein SVG-Markup mit der nativen Bildpipeline des Browsers (Image + Canvas)
// zu einem PNG-Data-URL. Wird für den PDF-Export gebraucht: html2canvas rendert
// komplexe inline-SVGs (Muster, gedrehte Text-Elemente) nicht zuverlässig – ein
// fertig gerastertes <img> ist für html2canvas ein gewöhnliches Rasterbild und
// wird exakt in der vorgegebenen Größe und Position übernommen.
export function svgZuImgTag(svgHtml, zielBreitePx = 460, dpiScale = 2) {
  return new Promise((resolve, reject) => {
    const viewBoxMatch = svgHtml.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const vw = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 400;
    const vh = viewBoxMatch ? parseFloat(viewBoxMatch[2]) : 300;
    const zielHoehe = (zielBreitePx * vh) / vw;

    // el.outerHTML liefert kein xmlns-Attribut (im HTML-Kontext nicht nötig),
    // als eigenständiges SVG-Dokument (für <img>) ist es aber zwingend erforderlich.
    const svgMitNamespace = svgHtml.includes("xmlns=")
      ? svgHtml
      : svgHtml.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');

    const blob = new Blob([svgMitNamespace], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(zielBreitePx * dpiScale);
      canvas.height = Math.round(zielHoehe * dpiScale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(
        `<img src="${canvas.toDataURL("image/png")}" width="${zielBreitePx}" height="${zielHoehe.toFixed(2)}" style="display:block;margin-inline:auto;" />`
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Skizze konnte nicht gerastert werden"));
    };
    img.src = url;
  });
}

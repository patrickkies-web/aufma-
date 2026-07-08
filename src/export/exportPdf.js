import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { baueFensterbauerHtml } from "./exportHtml.js";

// Rendert den Report in ein unsichtbares, gleich-origin iframe und wartet,
// bis Layout und eingebettete Bilder (Fotos, Skizzen-SVG) fertig geladen sind.
function renderInIframe(html) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-10000px";
    iframe.style.left = "0";
    iframe.style.width = "820px";
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
        // Höhe des iframes an den tatsächlichen Inhalt anpassen, damit html2canvas alles erfasst.
        iframe.style.height = `${doc.body.scrollHeight}px`;
        requestAnimationFrame(() => resolve({ iframe, doc }));
      } catch (err) {
        reject(err);
      }
    };
    iframe.srcdoc = html;
  });
}

// Erstellt ein echtes, downloadbares Mehrseiten-PDF aus der Aufmaßliste.
// svgProvider(id) liefert die aktuell gerenderte Skizze (SVG-HTML) je Fenster.
export async function exportAlsPdf(fenster, svgProvider, heute, dateiname) {
  if (fenster.length === 0) return;
  const html = baueFensterbauerHtml(fenster, svgProvider, heute);
  const { iframe, doc } = await renderInIframe(html);

  try {
    const canvas = await html2canvas(doc.body, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
      windowWidth: doc.documentElement.scrollWidth,
      windowHeight: doc.documentElement.scrollHeight,
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const pxPerMm = canvas.width / pageW;
    const pageHeightPx = pageH * pxPerMm;
    const totalPages = Math.ceil(canvas.height / pageHeightPx);

    for (let page = 0; page < totalPages; page++) {
      const sliceHeightPx = Math.min(pageHeightPx, canvas.height - page * pageHeightPx);

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeightPx;
      sliceCanvas
        .getContext("2d")
        .drawImage(
          canvas,
          0, page * pageHeightPx, canvas.width, sliceHeightPx,
          0, 0, canvas.width, sliceHeightPx
        );

      const imgData = sliceCanvas.toDataURL("image/jpeg", 0.92);
      if (page > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, pageW, sliceHeightPx / pxPerMm);
    }

    pdf.save(dateiname ?? `fenster-aufmass-${heute.replaceAll(".", "-")}.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
}

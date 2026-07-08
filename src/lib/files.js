// Fotos verkleinern, damit sie speicherbar bleiben (localStorage-Limit).
export const bildVerkleinern = (datei) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(datei);
    img.onload = () => {
      const max = 1000;
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Bild unlesbar"));
    };
    img.src = url;
  });

// Beliebigen Inhalt als Datei im Browser herunterladen.
export const download = (inhalt, dateiname, typ) => {
  const blob = inhalt instanceof Blob ? inhalt : new Blob([inhalt], { type: typ });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = dateiname;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

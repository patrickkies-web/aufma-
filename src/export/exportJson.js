import { download } from "../lib/files.js";

export function datenSpeichern(fenster, heute) {
  const daten = { app: "fenster-aufmass", version: 1, gespeichert: new Date().toISOString(), fenster };
  download(JSON.stringify(daten, null, 2), `fenster-aufmass-${heute.replaceAll(".", "-")}.json`, "application/json");
}

// Liest eine zuvor exportierte JSON-Datei und liefert eine bereinigte Fensterliste.
export function datenLaden(datei) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const daten = JSON.parse(reader.result);
        const liste = Array.isArray(daten) ? daten : daten.fenster;
        if (!Array.isArray(liste)) throw new Error("Kein gültiges Format");
        const bereinigt = liste
          .filter((f) => f && typeof f === "object")
          .map((f, i) => ({
            id: f.id || `${Date.now().toString(36)}-${i}`,
            name: f.name || "",
            aB: f.aB ?? "", aH: f.aH ?? "", aaB: f.aaB ?? "", aaH: f.aaH ?? "",
            fB: f.fB ?? "", fH: f.fH ?? "", fT: f.fT ?? "", rT: f.rT ?? "",
            fotoInnen: f.fotoInnen ?? null, fotoAussen: f.fotoAussen ?? null,
            fotoWunsch: f.fotoWunsch ?? null, wunschNotiz: f.wunschNotiz ?? "",
          }));
        resolve(bereinigt);
      } catch (err) {
        reject(new Error("Die Datei konnte nicht gelesen werden. Bitte eine mit dieser App gespeicherte JSON-Datei wählen."));
      }
    };
    reader.readAsText(datei);
  });
}

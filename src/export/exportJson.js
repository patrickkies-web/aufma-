import { download } from "../lib/files.js";
import { normalisiereFenster } from "../lib/migrate.js";
import { t } from "../i18n/translations.js";

export function datenSpeichern(fenster, projektNotiz, heute) {
  const daten = { app: "fenster-aufmass", version: 1, gespeichert: new Date().toISOString(), fenster, projektNotiz };
  download(JSON.stringify(daten, null, 2), `fenster-aufmass-${heute.replaceAll(".", "-")}.json`, "application/json");
}

// Liest eine zuvor exportierte JSON-Datei und liefert die bereinigte Fensterliste
// samt allgemeiner Projektnotiz.
export function datenLaden(datei, lang = "de") {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const daten = JSON.parse(reader.result);
        const liste = Array.isArray(daten) ? daten : daten.fenster;
        if (!Array.isArray(liste)) throw new Error("Kein gültiges Format");
        const fenster = liste
          .filter((f) => f && typeof f === "object")
          .map((f, i) => normalisiereFenster({
            id: f.id || `${Date.now().toString(36)}-${i}`,
            name: f.name || "",
            aB: f.aB ?? "", aH: f.aH ?? "", aaB: f.aaB ?? "", aaH: f.aaH ?? "",
            fB: f.fB ?? "", fH: f.fH ?? "", fT: f.fT ?? "", rT: f.rT ?? "",
            fotoInnen: f.fotoInnen ?? null, fotoAussen: f.fotoAussen ?? null,
            fotosWunsch: f.fotosWunsch, fotoWunsch: f.fotoWunsch, wunschNotiz: f.wunschNotiz ?? "",
          }));
        const projektNotiz = Array.isArray(daten) ? "" : daten.projektNotiz ?? "";
        resolve({ fenster, projektNotiz });
      } catch (err) {
        reject(new Error(t(lang, "fehlerDateiUngueltig")));
      }
    };
    reader.readAsText(datei);
  });
}

import { useState, useEffect, useMemo, useRef } from "react";
import { T } from "./design/tokens.js";
import { num, heutigesDatum } from "./lib/format.js";
import { storage, STORAGE_KEY } from "./lib/storage.js";
import { Feld, Gruppe } from "./components/Feld.jsx";
import { FotoFeld } from "./components/FotoFeld.jsx";
import { Skizze } from "./components/Skizze.jsx";
import { TiefenInfo } from "./components/TiefenInfo.jsx";
import { Legende } from "./components/Legende.jsx";
import { FensterKarte } from "./components/FensterKarte.jsx";
import { exportFensterbauerHtml } from "./export/exportHtml.js";
import { exportAlsPdf } from "./export/exportPdf.js";
import { datenSpeichern, datenLaden } from "./export/exportJson.js";

const leer = {
  name: "",
  aB: "", // Aussparung innen Breite (mm)
  aH: "", // Aussparung innen Höhe (mm)
  aaB: "", // Aussparung außen Breite (mm)
  aaH: "", // Aussparung außen Höhe (mm)
  fB: "", // Fensterelement Breite (mm)
  fH: "", // Fensterelement Höhe (mm)
  fT: "", // Fensterelement Bautiefe (mm) – Vorderkante bis Hinterkante, tiefste Stelle
  rT: "", // Rollladenraum Tiefe (mm)
  fotoInnen: null, // Foto Ist-Zustand von innen (Daten-URL)
  fotoAussen: null, // Foto Ist-Zustand von außen (Daten-URL)
};

export default function App() {
  const [fenster, setFenster] = useState([]);
  const [form, setForm] = useState(leer);
  const [editId, setEditId] = useState(null);
  const [geladen, setGeladen] = useState(false);
  const [kopiert, setKopiert] = useState(false);
  const [pdfWirdErstellt, setPdfWirdErstellt] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await storage.get(STORAGE_KEY);
        if (r?.value) setFenster(JSON.parse(r.value));
      } catch (e) {
        /* noch nichts gespeichert */
      }
      setGeladen(true);
    })();
  }, []);

  const speichern = async (liste) => {
    setFenster(liste);
    try {
      await storage.set(STORAGE_KEY, JSON.stringify(liste));
    } catch (e) {
      console.error("Speichern fehlgeschlagen", e);
    }
  };

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const rH = Math.max(num(form.aH) - num(form.fH), 0);
  const gueltig = num(form.aB) > 0 && num(form.aH) > 0;
  const warnung =
    (num(form.fB) > num(form.aB) && num(form.aB) > 0 && "Fensterbreite ist größer als die Aussparung.") ||
    (num(form.fH) > num(form.aH) && num(form.aH) > 0 && "Fensterhöhe ist größer als die Aussparung.") ||
    null;

  const uebernehmen = () => {
    if (!gueltig) return;
    if (editId) {
      speichern(fenster.map((f) => (f.id === editId ? { ...form, id: editId } : f)));
      setEditId(null);
    } else {
      speichern([...fenster, { ...form, id: Date.now().toString(36) }]);
    }
    setForm(leer);
  };

  const bearbeiten = (f) => {
    setForm(f);
    setEditId(f.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loeschen = (id) => {
    speichern(fenster.filter((f) => f.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm(leer);
    }
  };

  const aufmassText = useMemo(() => {
    const zeilen = fenster.map((f, i) => {
      const h = Math.max(num(f.aH) - num(f.fH), 0);
      return [
        `Fenster ${i + 1}${f.name ? ` – ${f.name}` : ""}`,
        `  Maueraussparung innen:  B ${num(f.aB)} × H ${num(f.aH)} mm`,
        `  Maueraussparung außen:  B ${num(f.aaB)} × H ${num(f.aaH)} mm`,
        `  Fensterelement:   B ${num(f.fB)} × H ${num(f.fH)} mm`,
        `  Fenster-Bautiefe: T ${num(f.fT)} mm (Vorder- bis Hinterkante, tiefste Stelle)`,
        `  Rollladenraum:    T ${num(f.rT)} × H ${h} mm`,
      ].join("\n");
    });
    return `AUFMASS FENSTER – alle Maße in mm\n(Tiefe Rollladenraum = Wandkante bündig Fenster bis Innenkante Mauerwerk, zweischalig)\n\n${zeilen.join("\n\n")}`;
  }, [fenster]);

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(aufmassText);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2000);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = aufmassText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2000);
    }
  };

  const heute = heutigesDatum();

  const svgProvider = (id) => document.querySelector(`[data-skizze="${id}"] svg`)?.outerHTML ?? "";

  const handleExportHtml = () => exportFensterbauerHtml(fenster, svgProvider, heute);

  const handleExportPdf = async () => {
    setPdfWirdErstellt(true);
    try {
      await exportAlsPdf(fenster, svgProvider, heute);
    } catch (e) {
      console.error("PDF-Export fehlgeschlagen", e);
      alert("Das PDF konnte nicht erstellt werden. Bitte erneut versuchen.");
    } finally {
      setPdfWirdErstellt(false);
    }
  };

  const handleDatenSpeichern = () => datenSpeichern(fenster, heute);

  const dateiRef = useRef(null);
  const handleDatenLaden = async (e) => {
    const datei = e.target.files?.[0];
    if (!datei) return;
    try {
      const bereinigt = await datenLaden(datei);
      speichern(bereinigt);
      setEditId(null);
      setForm(leer);
    } catch (err) {
      alert(err.message);
    }
    e.target.value = "";
  };

  const btn = (primary) => ({
    padding: "11px 18px", borderRadius: 8, border: primary ? "none" : `1px solid ${T.soft}`,
    background: primary ? T.blue : "#FFF", color: primary ? "#FFF" : T.ink,
    fontSize: 14, fontWeight: 600, fontFamily: T.sans, cursor: "pointer",
  });

  return (
    <div style={{ minHeight: "100vh", background: T.paper, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 60px" }}>
        <header style={{ marginBottom: 18, borderBottom: `2px solid ${T.ink}`, paddingBottom: 10 }}>
          <h1 style={{ margin: 0, fontSize: 22, letterSpacing: "0.01em" }}>Fenster-Aufmaß</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: T.line }}>
            Maße erfassen, Skizze prüfen, Aufmaß an den Fensterbauer geben. Alle Angaben in mm.
          </p>
        </header>

        <section style={{
          background: T.card, borderRadius: 12, padding: 16,
          border: `1px solid ${T.soft}`, display: "grid", gap: 14,
        }}>
          <Feld label="Bezeichnung / Raum" value={form.name} onChange={set("name")}
            unit="" placeholder="z. B. Küche Süd" />

          <Gruppe titel="Maueraussparung von innen (gesamt)">
            <Feld label="Breite" value={form.aB} onChange={set("aB")} />
            <Feld label="Höhe" value={form.aH} onChange={set("aH")} />
          </Gruppe>

          <Gruppe titel="Maueraussparung von außen">
            <Feld label="Breite" value={form.aaB} onChange={set("aaB")} />
            <Feld label="Höhe" value={form.aaH} onChange={set("aaH")} />
          </Gruppe>

          <Gruppe titel="Sichtbares Fensterelement (Bestand)">
            <Feld label="Breite" value={form.fB} onChange={set("fB")} />
            <Feld label="Höhe" value={form.fH} onChange={set("fH")} />
            <Feld label="Bautiefe (Vorder- → Hinterkante)" value={form.fT} onChange={set("fT")} />
          </Gruppe>

          <Gruppe titel="Rollladenraum">
            <Feld label="Tiefe (Wandkante → Innenkante)" value={form.rT} onChange={set("rT")} />
            <div>
              <span style={{
                display: "block", fontSize: 11, letterSpacing: "0.04em",
                textTransform: "uppercase", color: T.line, marginBottom: 4,
              }}>Höhe (berechnet)</span>
              <div style={{
                padding: "10px 12px", borderRadius: 8, background: T.paper,
                border: `1px dashed ${T.soft}`, fontFamily: T.mono, fontSize: 16,
              }}>
                {num(form.aH) > 0 && num(form.fH) > 0 ? `${rH} mm` : "–"}
              </div>
            </div>
          </Gruppe>

          <Gruppe titel="Fotos Ist-Zustand">
            <FotoFeld label="Foto von innen" value={form.fotoInnen} onChange={set("fotoInnen")} />
            <FotoFeld label="Foto von außen" value={form.fotoAussen} onChange={set("fotoAussen")} />
          </Gruppe>

          {warnung && (
            <div style={{
              fontSize: 13, color: T.warn, background: "#FBF1E7",
              border: `1px solid ${T.warn}33`, borderRadius: 8, padding: "8px 12px",
            }}>⚠ {warnung}</div>
          )}

          <div style={{ borderTop: `1px solid ${T.soft}`, paddingTop: 12 }}>
            <Skizze w={form} />
            {gueltig && <TiefenInfo w={form} />}
            {gueltig && <Legende />}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={uebernehmen} disabled={!gueltig}
              style={{ ...btn(true), flex: 1, opacity: gueltig ? 1 : 0.4 }}>
              {editId ? "Änderung speichern" : "Fenster hinzufügen"}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm(leer); }} style={btn(false)}>
                Abbrechen
              </button>
            )}
          </div>
        </section>

        <section style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 15 }}>
              Aufmaßliste <span style={{ color: T.line, fontFamily: T.mono, fontSize: 13 }}>({fenster.length})</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <button onClick={handleExportPdf} disabled={fenster.length === 0 || pdfWirdErstellt}
              style={{ ...btn(true), padding: "9px 14px", fontSize: 13, opacity: fenster.length && !pdfWirdErstellt ? 1 : 0.4 }}>
              {pdfWirdErstellt ? "PDF wird erstellt…" : "Als PDF exportieren"}
            </button>
            <button onClick={handleExportHtml} disabled={fenster.length === 0}
              style={{ ...btn(false), padding: "9px 14px", fontSize: 13, opacity: fenster.length ? 1 : 0.4 }}>
              Export für Fensterbauer (HTML)
            </button>
            <button onClick={kopieren} disabled={fenster.length === 0}
              style={{ ...btn(false), padding: "9px 14px", fontSize: 13, opacity: fenster.length ? 1 : 0.4 }}>
              {kopiert ? "✓ Kopiert" : "Als Text kopieren"}
            </button>
            <button onClick={handleDatenSpeichern} disabled={fenster.length === 0}
              style={{ ...btn(false), padding: "9px 14px", fontSize: 13, opacity: fenster.length ? 1 : 0.4 }}>
              Datei speichern
            </button>
            <button onClick={() => dateiRef.current?.click()}
              style={{ ...btn(false), padding: "9px 14px", fontSize: 13 }}>
              Datei laden
            </button>
            <input ref={dateiRef} type="file" accept=".json,application/json"
              onChange={handleDatenLaden} style={{ display: "none" }} />
          </div>

          {geladen && fenster.length === 0 && (
            <p style={{ fontSize: 13, color: T.line, textAlign: "center", padding: "18px 0" }}>
              Noch keine Fenster erfasst. Trage oben das erste Fenster ein.
            </p>
          )}

          <div style={{ display: "grid", gap: 12 }}>
            {fenster.map((f, i) => (
              <FensterKarte
                key={f.id}
                f={f}
                index={i}
                aktiv={editId === f.id}
                onBearbeiten={bearbeiten}
                onLoeschen={loeschen}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

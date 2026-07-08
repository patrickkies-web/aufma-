import { useState, useEffect, useMemo, useRef } from "react";
import { T } from "./design/tokens.js";
import { num, heutigesDatum } from "./lib/format.js";
import { storage, STORAGE_KEY } from "./lib/storage.js";
import { Feld, Gruppe, Notizfeld } from "./components/Feld.jsx";
import { FotoFeld, FotoGalerieFeld } from "./components/FotoFeld.jsx";
import { normalisiereFenster } from "./lib/migrate.js";
import { Skizze } from "./components/Skizze.jsx";
import { TiefenInfo } from "./components/TiefenInfo.jsx";
import { Legende } from "./components/Legende.jsx";
import { FensterKarte } from "./components/FensterKarte.jsx";
import { SpracheSchalter } from "./components/SpracheSchalter.jsx";
import { useI18n } from "./i18n/I18nContext.jsx";
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
  fotosWunsch: [], // Referenzbilder gewünschte Ausführung, z. B. Konfigurator-Screenshots (Daten-URLs)
  wunschNotiz: "", // Freitext: Wünsche zum Fenster
};

export default function App() {
  const { lang, t } = useI18n();
  const [fenster, setFenster] = useState([]);
  const [projektNotiz, setProjektNotiz] = useState("");
  const [form, setForm] = useState(leer);
  const [editId, setEditId] = useState(null);
  const [geladen, setGeladen] = useState(false);
  const [kopiert, setKopiert] = useState(false);
  const [pdfWirdErstellt, setPdfWirdErstellt] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await storage.get(STORAGE_KEY);
        if (r?.value) {
          const daten = JSON.parse(r.value);
          const liste = Array.isArray(daten) ? daten : daten.fenster ?? [];
          setFenster(liste.map(normalisiereFenster));
          setProjektNotiz(Array.isArray(daten) ? "" : daten.projektNotiz ?? "");
        }
      } catch (e) {
        /* noch nichts gespeichert */
      }
      setGeladen(true);
    })();
  }, []);

  const speichern = async (liste, notiz = projektNotiz) => {
    setFenster(liste);
    try {
      await storage.set(STORAGE_KEY, JSON.stringify({ fenster: liste, projektNotiz: notiz }));
    } catch (e) {
      console.error("Speichern fehlgeschlagen", e);
    }
  };

  const aktualisiereProjektNotiz = (v) => {
    setProjektNotiz(v);
    storage.set(STORAGE_KEY, JSON.stringify({ fenster, projektNotiz: v }))
      .catch((e) => console.error("Speichern fehlgeschlagen", e));
  };

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const rH = Math.max(num(form.aH) - num(form.fH), 0);
  const gueltig = num(form.aB) > 0 && num(form.aH) > 0;
  const warnung =
    (num(form.fB) > num(form.aB) && num(form.aB) > 0 && t("warnungBreite")) ||
    (num(form.fH) > num(form.aH) && num(form.aH) > 0 && t("warnungHoehe")) ||
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

  // Wünsche direkt in der Aufmaßliste-Karte bearbeiten, ohne erst über
  // "Bearbeiten" das Formular oben zu öffnen.
  const aendereWunschNotiz = (id, wunschNotiz) => {
    speichern(fenster.map((f) => (f.id === id ? { ...f, wunschNotiz } : f)));
    if (editId === id) {
      setForm((f) => ({ ...f, wunschNotiz }));
    }
  };

  const aufmassText = useMemo(() => {
    const zeilen = fenster.map((f, i) => {
      const h = Math.max(num(f.aH) - num(f.fH), 0);
      return [
        `${t("labelFenster")} ${i + 1}${f.name ? ` – ${f.name}` : ""}`,
        `  ${t("reportMaueraussparungInnen")}:  B ${num(f.aB)} × H ${num(f.aH)} mm`,
        `  ${t("reportMaueraussparungAussen")}:  B ${num(f.aaB)} × H ${num(f.aaH)} mm`,
        `  ${t("tabelleFensterelement")}:   B ${num(f.fB)} × H ${num(f.fH)} mm`,
        `  ${t("tabelleFensterBautiefe")}: T ${num(f.fT)} mm`,
        `  ${t("tabelleRollladenraum")}:    T ${num(f.rT)} × H ${h} mm`,
        ...(f.wunschNotiz ? [`  ${t("wuenscheLabel")}:          ${f.wunschNotiz}`] : []),
      ].join("\n");
    });
    const kopf = `${t("reportTitel").toUpperCase()} – alle Maße in mm`
      + (projektNotiz ? `\n\n${t("reportAllgemeineHinweise")}:\n${projektNotiz}` : "");
    return `${kopf}\n\n${zeilen.join("\n\n")}`;
  }, [fenster, projektNotiz, lang]);

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

  const heute = heutigesDatum(lang);

  const svgProvider = (id) => document.querySelector(`[data-skizze="${id}"] svg`)?.outerHTML ?? "";

  const handleExportHtml = () => exportFensterbauerHtml(fenster, svgProvider, heute, projektNotiz, lang);

  const handleExportPdf = async () => {
    setPdfWirdErstellt(true);
    try {
      await exportAlsPdf(fenster, svgProvider, heute, projektNotiz, undefined, lang);
    } catch (e) {
      console.error("PDF-Export fehlgeschlagen", e);
      alert(t("alertPdfFehler"));
    } finally {
      setPdfWirdErstellt(false);
    }
  };

  const handleDatenSpeichern = () => datenSpeichern(fenster, projektNotiz, heute);

  const dateiRef = useRef(null);
  const handleDatenLaden = async (e) => {
    const datei = e.target.files?.[0];
    if (!datei) return;
    try {
      const geladeneDaten = await datenLaden(datei, lang);
      speichern(geladeneDaten.fenster, geladeneDaten.projektNotiz);
      setProjektNotiz(geladeneDaten.projektNotiz);
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
        <header style={{
          marginBottom: 18, borderBottom: `2px solid ${T.ink}`, paddingBottom: 10,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: "0.01em" }}>{t("appTitle")}</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: T.line }}>
              {t("appSubtitle")}
            </p>
          </div>
          <SpracheSchalter />
        </header>

        <section style={{
          background: T.card, borderRadius: 12, padding: 16,
          border: `1px solid ${T.soft}`, marginBottom: 18,
        }}>
          <Notizfeld label={t("allgemeineHinweiseLabel")} value={projektNotiz} onChange={aktualisiereProjektNotiz}
            placeholder={t("allgemeineHinweisePlaceholder")} />
        </section>

        <section style={{
          background: T.card, borderRadius: 12, padding: 16,
          border: `1px solid ${T.soft}`, display: "grid", gap: 14,
        }}>
          <Feld label={t("bezeichnungLabel")} value={form.name} onChange={set("name")}
            unit="" placeholder={t("bezeichnungPlaceholder")} inputMode="text" />

          <Gruppe titel={t("gruppeAussparungInnenTitel")}>
            <Feld label={t("feldBreite")} value={form.aB} onChange={set("aB")} />
            <Feld label={t("feldHoehe")} value={form.aH} onChange={set("aH")} />
          </Gruppe>

          <Gruppe titel={t("gruppeAussparungAussenTitel")}>
            <Feld label={t("feldBreite")} value={form.aaB} onChange={set("aaB")} />
            <Feld label={t("feldHoehe")} value={form.aaH} onChange={set("aaH")} />
          </Gruppe>

          <Gruppe titel={t("gruppeFensterelementTitel")}>
            <Feld label={t("feldBreite")} value={form.fB} onChange={set("fB")} />
            <Feld label={t("feldHoehe")} value={form.fH} onChange={set("fH")} />
            <Feld label={t("feldBautiefe")} value={form.fT} onChange={set("fT")} />
          </Gruppe>

          <Gruppe titel={t("gruppeRollladenraumTitel")}>
            <Feld label={t("feldTiefeRollladen")} value={form.rT} onChange={set("rT")} />
            <div>
              <span style={{
                display: "block", fontSize: 11, letterSpacing: "0.04em",
                textTransform: "uppercase", color: T.line, marginBottom: 4,
              }}>{t("feldHoeheBerechnet")}</span>
              <div style={{
                padding: "10px 12px", borderRadius: 8, background: T.paper,
                border: `1px dashed ${T.soft}`, fontFamily: T.mono, fontSize: 16,
              }}>
                {num(form.aH) > 0 && num(form.fH) > 0 ? `${rH} mm` : "–"}
              </div>
            </div>
          </Gruppe>

          <Gruppe titel={t("gruppeFotosIstZustandTitel")}>
            <FotoFeld label={t("fotoInnenLabel")} value={form.fotoInnen} onChange={set("fotoInnen")} />
            <FotoFeld label={t("fotoAussenLabel")} value={form.fotoAussen} onChange={set("fotoAussen")} />
          </Gruppe>

          <Gruppe titel={t("gruppeWunschTitel")}>
            <div style={{ gridColumn: "1 / -1" }}>
              <FotoGalerieFeld label={t("wunschBilderLabel")} values={form.fotosWunsch} onChange={set("fotosWunsch")} />
            </div>
            <Notizfeld label={t("wunschNotizLabel")} value={form.wunschNotiz} onChange={set("wunschNotiz")}
              placeholder={t("wunschNotizPlaceholder")} />
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
              {editId ? t("btnAenderungSpeichern") : t("btnFensterHinzufuegen")}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm(leer); }} style={btn(false)}>
                {t("btnAbbrechen")}
              </button>
            )}
          </div>
        </section>

        <section style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 15 }}>
              {t("aufmasslisteTitel")} <span style={{ color: T.line, fontFamily: T.mono, fontSize: 13 }}>({fenster.length})</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <button onClick={handleExportPdf} disabled={fenster.length === 0 || pdfWirdErstellt}
              style={{ ...btn(true), padding: "9px 14px", fontSize: 13, opacity: fenster.length && !pdfWirdErstellt ? 1 : 0.4 }}>
              {pdfWirdErstellt ? t("btnPdfWirdErstellt") : t("btnPdfExport")}
            </button>
            <button onClick={handleExportHtml} disabled={fenster.length === 0}
              style={{ ...btn(false), padding: "9px 14px", fontSize: 13, opacity: fenster.length ? 1 : 0.4 }}>
              {t("btnHtmlExport")}
            </button>
            <button onClick={kopieren} disabled={fenster.length === 0}
              style={{ ...btn(false), padding: "9px 14px", fontSize: 13, opacity: fenster.length ? 1 : 0.4 }}>
              {kopiert ? t("btnTextKopiert") : t("btnTextKopieren")}
            </button>
            <button onClick={handleDatenSpeichern} disabled={fenster.length === 0}
              style={{ ...btn(false), padding: "9px 14px", fontSize: 13, opacity: fenster.length ? 1 : 0.4 }}>
              {t("btnDateiSpeichern")}
            </button>
            <button onClick={() => dateiRef.current?.click()}
              style={{ ...btn(false), padding: "9px 14px", fontSize: 13 }}>
              {t("btnDateiLaden")}
            </button>
            <input ref={dateiRef} type="file" accept=".json,application/json"
              onChange={handleDatenLaden} style={{ display: "none" }} />
          </div>

          {geladen && fenster.length === 0 && (
            <p style={{ fontSize: 13, color: T.line, textAlign: "center", padding: "18px 0" }}>
              {t("leereListeHinweis")}
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
                onWunschNotizChange={aendereWunschNotiz}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

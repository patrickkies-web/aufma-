import { useRef } from "react";
import { T } from "../design/tokens.js";
import { bildVerkleinern } from "../lib/files.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export function FotoFeld({ label, value, onChange }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const waehlen = async (e) => {
    const datei = e.target.files?.[0];
    if (!datei) return;
    try {
      onChange(await bildVerkleinern(datei));
    } catch (err) {
      alert(t("alertFotoFehler"));
    }
    e.target.value = "";
  };
  return (
    <div>
      <span style={{
        display: "block", fontSize: 11, letterSpacing: "0.04em",
        textTransform: "uppercase", color: T.line, marginBottom: 4, fontFamily: T.sans,
      }}>{label}</span>
      <input ref={ref} type="file" accept="image/*" onChange={waehlen} style={{ display: "none" }} />
      {value ? (
        <div>
          <img src={value} alt={label} style={{
            width: "100%", height: 110, objectFit: "cover",
            borderRadius: 8, border: `1px solid ${T.soft}`, display: "block",
          }} />
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button onClick={() => ref.current?.click()} style={{
              background: "none", border: "none", color: T.blue, fontSize: 12.5,
              cursor: "pointer", fontFamily: T.sans, padding: 0,
            }}>{t("ersetzen")}</button>
            <button onClick={() => onChange(null)} style={{
              background: "none", border: "none", color: T.warn, fontSize: 12.5,
              cursor: "pointer", fontFamily: T.sans, padding: 0,
            }}>{t("entfernen")}</button>
          </div>
        </div>
      ) : (
        <button onClick={() => ref.current?.click()} style={{
          width: "100%", height: 110, borderRadius: 8, cursor: "pointer",
          border: `1.5px dashed ${T.line}`, background: T.paper,
          color: T.line, fontSize: 13, fontFamily: T.sans, whiteSpace: "pre-line",
        }}>
          {t("fotoAufnehmenPlatzhalter")}
        </button>
      )}
    </div>
  );
}

// Wie FotoFeld, erlaubt aber beliebig viele Fotos (z. B. mehrere Referenzbilder
// zur Wunsch-Ausführung) statt nur eines einzelnen.
export function FotoGalerieFeld({ label, values, onChange }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const fotos = values ?? [];

  const hinzufuegen = async (e) => {
    const dateien = Array.from(e.target.files ?? []);
    if (!dateien.length) return;
    try {
      const neue = await Promise.all(dateien.map(bildVerkleinern));
      onChange([...fotos, ...neue]);
    } catch (err) {
      alert(t("alertFotosFehler"));
    }
    e.target.value = "";
  };

  const entfernen = (index) => onChange(fotos.filter((_, i) => i !== index));

  return (
    <div>
      <span style={{
        display: "block", fontSize: 11, letterSpacing: "0.04em",
        textTransform: "uppercase", color: T.line, marginBottom: 4, fontFamily: T.sans,
      }}>{label}</span>
      <input ref={ref} type="file" accept="image/*" multiple onChange={hinzufuegen} style={{ display: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8 }}>
        {fotos.map((foto, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={foto} alt={`${label} ${i + 1}`} style={{
              width: "100%", height: 90, objectFit: "cover",
              borderRadius: 8, border: `1px solid ${T.soft}`, display: "block",
            }} />
            <button onClick={() => entfernen(i)} aria-label={t("entfernen")} style={{
              position: "absolute", top: 4, right: 4, width: 22, height: 22,
              borderRadius: "50%", border: "none", background: "rgba(34,49,63,0.75)",
              color: "#FFF", fontSize: 13, lineHeight: "22px", padding: 0, cursor: "pointer",
            }}>×</button>
          </div>
        ))}
        <button onClick={() => ref.current?.click()} style={{
          height: 90, borderRadius: 8, cursor: "pointer",
          border: `1.5px dashed ${T.line}`, background: T.paper,
          color: T.line, fontSize: 12, fontFamily: T.sans,
        }}>
          {t("fotoHinzufuegenKurz")}
        </button>
      </div>
    </div>
  );
}

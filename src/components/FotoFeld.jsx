import { useRef } from "react";
import { T } from "../design/tokens.js";
import { bildVerkleinern } from "../lib/files.js";

export function FotoFeld({ label, value, onChange }) {
  const ref = useRef(null);
  const waehlen = async (e) => {
    const datei = e.target.files?.[0];
    if (!datei) return;
    try {
      onChange(await bildVerkleinern(datei));
    } catch (err) {
      alert("Das Foto konnte nicht gelesen werden.");
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
            }}>Ersetzen</button>
            <button onClick={() => onChange(null)} style={{
              background: "none", border: "none", color: T.warn, fontSize: 12.5,
              cursor: "pointer", fontFamily: T.sans, padding: 0,
            }}>Entfernen</button>
          </div>
        </div>
      ) : (
        <button onClick={() => ref.current?.click()} style={{
          width: "100%", height: 110, borderRadius: 8, cursor: "pointer",
          border: `1.5px dashed ${T.line}`, background: T.paper,
          color: T.line, fontSize: 13, fontFamily: T.sans,
        }}>
          + Foto aufnehmen<br />oder auswählen
        </button>
      )}
    </div>
  );
}

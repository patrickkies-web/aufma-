import { T, SK } from "../design/tokens.js";
import { num } from "../lib/format.js";

// Textzeilen für Tiefenmaße, die in der Frontansicht nicht darstellbar sind.
export function TiefenInfo({ w }) {
  const rT = num(w.rT), fT = num(w.fT);
  if (rT <= 0 && fT <= 0) return null;
  return (
    <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
      {rT > 0 && (
        <div style={{
          padding: "8px 12px", borderRadius: 8,
          background: SK.rolloBg, border: `1px solid ${SK.rollo}`,
          fontSize: 12.5, color: T.ink, fontFamily: T.sans, lineHeight: 1.45,
        }}>
          <strong style={{ fontFamily: T.mono }}>Rollladenraum-Tiefe: {rT} mm</strong>
          <br />
          gemessen von der Wandkante bündig zum Fenster bis zur Innenkante des Mauerwerks (zweischalig)
        </div>
      )}
      {fT > 0 && (
        <div style={{
          padding: "8px 12px", borderRadius: 8,
          background: SK.glas, border: `1px solid ${SK.rahmen}`,
          fontSize: 12.5, color: T.ink, fontFamily: T.sans, lineHeight: 1.45,
        }}>
          <strong style={{ fontFamily: T.mono }}>Fenster-Bautiefe: {fT} mm</strong>
          <br />
          Vorderkante bis Hinterkante des Fensterelements, an der tiefsten Stelle gemessen
        </div>
      )}
    </div>
  );
}

import { T } from "../design/tokens.js";
import { num } from "../lib/format.js";
import { Skizze } from "./Skizze.jsx";
import { TiefenInfo } from "./TiefenInfo.jsx";

// Eine Karte in der Aufmaßliste: Skizze, Maße-Tabelle, Fotos, Bearbeiten/Löschen.
export function FensterKarte({ f, index, aktiv, onBearbeiten, onLoeschen }) {
  const h = Math.max(num(f.aH) - num(f.fH), 0);
  return (
    <article style={{
      background: T.card, border: `1px solid ${aktiv ? T.blue : T.soft}`,
      borderRadius: 12, padding: 14,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <strong style={{ fontSize: 14 }}>
          <span style={{ fontFamily: T.mono, color: T.blue }}>{String(index + 1).padStart(2, "0")}</span>
          {" "}{f.name || "Ohne Bezeichnung"}
        </strong>
        <span style={{ display: "flex", gap: 12 }}>
          <button onClick={() => onBearbeiten(f)} style={{
            background: "none", border: "none", color: T.blue, fontSize: 13,
            cursor: "pointer", fontFamily: T.sans, padding: 0,
          }}>Bearbeiten</button>
          <button onClick={() => onLoeschen(f.id)} style={{
            background: "none", border: "none", color: T.warn, fontSize: 13,
            cursor: "pointer", fontFamily: T.sans, padding: 0,
          }}>Löschen</button>
        </span>
      </div>

      <div data-skizze={f.id}>
        <Skizze w={f} compact />
      </div>
      <TiefenInfo w={f} />

      <table style={{
        width: "100%", fontSize: 12.5, fontFamily: T.mono,
        borderCollapse: "collapse", marginTop: 8,
      }}>
        <tbody>
          <tr>
            <td style={{ color: T.line, padding: "3px 0", fontFamily: T.sans }}>Aussparung innen</td>
            <td style={{ textAlign: "right" }}>B {num(f.aB)} × H {num(f.aH)}</td>
          </tr>
          <tr>
            <td style={{ color: T.line, padding: "3px 0", fontFamily: T.sans }}>Aussparung außen</td>
            <td style={{ textAlign: "right" }}>B {num(f.aaB)} × H {num(f.aaH)}</td>
          </tr>
          <tr>
            <td style={{ color: T.line, padding: "3px 0", fontFamily: T.sans }}>Fensterelement</td>
            <td style={{ textAlign: "right" }}>B {num(f.fB)} × H {num(f.fH)}</td>
          </tr>
          <tr>
            <td style={{ color: T.line, padding: "3px 0", fontFamily: T.sans }}>Fenster-Bautiefe</td>
            <td style={{ textAlign: "right" }}>T {num(f.fT)}</td>
          </tr>
          <tr>
            <td style={{ color: T.line, padding: "3px 0", fontFamily: T.sans }}>Rollladenraum</td>
            <td style={{ textAlign: "right" }}>T {num(f.rT)} × H {h}</td>
          </tr>
        </tbody>
      </table>

      {(f.fotoInnen || f.fotoAussen) && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {f.fotoInnen && (
            <figure style={{ margin: 0, flex: 1 }}>
              <img src={f.fotoInnen} alt="Innen" style={{
                width: "100%", height: 90, objectFit: "cover",
                borderRadius: 8, border: `1px solid ${T.soft}`, display: "block",
              }} />
              <figcaption style={{ fontSize: 11, color: T.line, textAlign: "center", marginTop: 3 }}>Innen</figcaption>
            </figure>
          )}
          {f.fotoAussen && (
            <figure style={{ margin: 0, flex: 1 }}>
              <img src={f.fotoAussen} alt="Außen" style={{
                width: "100%", height: 90, objectFit: "cover",
                borderRadius: 8, border: `1px solid ${T.soft}`, display: "block",
              }} />
              <figcaption style={{ fontSize: 11, color: T.line, textAlign: "center", marginTop: 3 }}>Außen</figcaption>
            </figure>
          )}
        </div>
      )}

      {f.fotoWunsch && (
        <figure style={{ margin: "10px 0 0" }}>
          <img src={f.fotoWunsch} alt="Wunsch-Ausführung" style={{
            width: "100%", height: 120, objectFit: "cover",
            borderRadius: 8, border: `1px solid ${T.soft}`, display: "block",
          }} />
          <figcaption style={{ fontSize: 11, color: T.line, textAlign: "center", marginTop: 3 }}>Wunsch-Ausführung</figcaption>
        </figure>
      )}

      {f.wunschNotiz && (
        <div style={{
          marginTop: 10, padding: "8px 12px", borderRadius: 8,
          background: T.paper, border: `1px solid ${T.soft}`,
          fontSize: 12.5, color: T.ink, lineHeight: 1.45, whiteSpace: "pre-wrap",
        }}>
          <strong style={{ fontFamily: T.sans, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: T.line }}>
            Wünsche
          </strong>
          <div style={{ marginTop: 3 }}>{f.wunschNotiz}</div>
        </div>
      )}
    </article>
  );
}

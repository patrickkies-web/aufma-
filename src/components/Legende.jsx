import { T, SK } from "../design/tokens.js";

const EINTRAEGE = [
  { farbe: SK.wand, rand: SK.wandLinie, text: "Mauerwerk (Wand)" },
  { farbe: SK.oeffnung, rand: T.ink, text: "Maueraussparung" },
  { farbe: SK.glas, rand: SK.rahmen, text: "Fensterelement" },
  { farbe: SK.rolloBg, rand: SK.rollo, text: "Rollladenraum" },
];

export function Legende() {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 8,
      fontSize: 11.5, color: T.ink, fontFamily: T.sans,
    }}>
      {EINTRAEGE.map((e) => (
        <span key={e.text} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{
            width: 14, height: 14, borderRadius: 3, background: e.farbe,
            border: `1.5px solid ${e.rand}`, display: "inline-block",
          }} />
          {e.text}
        </span>
      ))}
    </div>
  );
}

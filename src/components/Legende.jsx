import { T, SK } from "../design/tokens.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export function Legende() {
  const { t } = useI18n();
  const eintraege = [
    { farbe: SK.wand, rand: SK.wandLinie, text: t("legendeMauerwerk") },
    { farbe: SK.oeffnung, rand: T.ink, text: t("legendeMaueraussparung") },
    { farbe: SK.glas, rand: SK.rahmen, text: t("legendeFensterelement") },
    { farbe: SK.rolloBg, rand: SK.rollo, text: t("legendeRollladenraum") },
  ];
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 8,
      fontSize: 11.5, color: T.ink, fontFamily: T.sans,
    }}>
      {eintraege.map((e) => (
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

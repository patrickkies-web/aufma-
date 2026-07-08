import { T } from "../design/tokens.js";
import { useI18n } from "../i18n/I18nContext.jsx";

// Kippschalter zum Umschalten zwischen Deutsch und Polnisch.
export function SpracheSchalter() {
  const { lang, setLang } = useI18n();
  const istPl = lang === "pl";

  return (
    <button
      onClick={() => setLang(istPl ? "de" : "pl")}
      aria-label="Sprache wechseln / Zmień język"
      style={{
        position: "relative", display: "flex", alignItems: "center",
        width: 88, height: 34, borderRadius: 17, border: `1px solid ${T.soft}`,
        background: T.paper, cursor: "pointer", padding: 3, flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: istPl ? 46 : 3,
        width: 39, height: 26, borderRadius: 13, background: T.blue,
        transition: "left 0.18s ease",
      }} />
      <span style={{
        position: "relative", flex: 1, textAlign: "center", zIndex: 1,
        fontSize: 12.5, fontWeight: 700, fontFamily: T.sans,
        color: istPl ? T.line : "#FFF", transition: "color 0.18s ease",
      }}>DE</span>
      <span style={{
        position: "relative", flex: 1, textAlign: "center", zIndex: 1,
        fontSize: 12.5, fontWeight: 700, fontFamily: T.sans,
        color: istPl ? "#FFF" : T.line, transition: "color 0.18s ease",
      }}>PL</span>
    </button>
  );
}

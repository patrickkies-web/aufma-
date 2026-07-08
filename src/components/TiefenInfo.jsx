import { T, SK } from "../design/tokens.js";
import { num } from "../lib/format.js";
import { useI18n } from "../i18n/I18nContext.jsx";

// Textzeilen für Tiefenmaße, die in der Frontansicht nicht darstellbar sind.
export function TiefenInfo({ w }) {
  const { t } = useI18n();
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
          <strong style={{ fontFamily: T.mono }}>{t("rollladenTiefeLabel")}: {rT} mm</strong>
          <br />
          {t("rollladenTiefeBeschreibung")}
        </div>
      )}
      {fT > 0 && (
        <div style={{
          padding: "8px 12px", borderRadius: 8,
          background: SK.glas, border: `1px solid ${SK.rahmen}`,
          fontSize: 12.5, color: T.ink, fontFamily: T.sans, lineHeight: 1.45,
        }}>
          <strong style={{ fontFamily: T.mono }}>{t("fensterBautiefeLabel")}: {fT} mm</strong>
          <br />
          {t("fensterBautiefeBeschreibung")}
        </div>
      )}
    </div>
  );
}

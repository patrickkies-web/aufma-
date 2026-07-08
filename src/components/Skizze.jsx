import { T, SK } from "../design/tokens.js";
import { num } from "../lib/format.js";
import { useI18n } from "../i18n/I18nContext.jsx";

function Tick({ x, y }) {
  return <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} stroke={T.blue} strokeWidth="1.4" />;
}

function DimH({ x1, x2, y, label, above = true }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={T.blue} strokeWidth="1" />
      <Tick x={x1} y={y} />
      <Tick x={x2} y={y} />
      <text
        x={(x1 + x2) / 2}
        y={above ? y - 5 : y + 13}
        textAnchor="middle"
        fontSize="11"
        fontFamily={T.mono}
        fill={T.blue}
      >
        {label}
      </text>
    </g>
  );
}

function DimV({ y1, y2, x, label, left = true }) {
  const cy = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={T.blue} strokeWidth="1" />
      <Tick x={x} y={y1} />
      <Tick x={x} y={y2} />
      <text
        x={left ? x - 5 : x + 15}
        y={cy}
        textAnchor="middle"
        fontSize="11"
        fontFamily={T.mono}
        fill={T.blue}
        transform={`rotate(-90 ${left ? x - 5 : x + 15} ${cy})`}
      >
        {label}
      </text>
    </g>
  );
}

// Skizze: Frontansicht der Maueraussparung mit Fensterelement und Rollladenraum.
export function Skizze({ w, compact = false }) {
  const { t } = useI18n();
  const aB = num(w.aB), aH = num(w.aH), fB = num(w.fB), fH = num(w.fH), rT = num(w.rT);
  if (aB <= 0 || aH <= 0) {
    return (
      <div style={{
        padding: 24, textAlign: "center", color: T.line,
        fontFamily: T.sans, fontSize: 13, border: `1px dashed ${T.soft}`, borderRadius: 8,
      }}>
        {t("skizzePlatzhalter")}
      </div>
    );
  }

  const rH = Math.max(aH - fH, 0);

  const VW = 400;
  const wd = compact ? 16 : 22;
  // Gleicher Randabstand links & rechts (die größere, rechts benötigte Breite für
  // bis zu zwei Maßlinien), damit die Zeichnung bei jedem Seitenverhältnis zentriert bleibt.
  const seitenrand = 82 + wd;
  const oben = 36 + wd, unten = 44 + wd;
  const drawWmax = VW - 2 * seitenrand;
  const drawHmax = compact ? 170 : 250;

  const scale = Math.min(drawWmax / aB, drawHmax / aH);
  const W = aB * scale, H = aH * scale;
  const x0 = (VW - W) / 2, y0 = oben + 12;
  const VH = y0 + H + unten;

  const fW = fB * scale, fHh = fH * scale;
  const fx = x0 + (W - fW) / 2;
  const fy = y0 + H - fHh;
  const zeigtFenster = fB > 0 && fH > 0;
  const zeigtRollo = zeigtFenster && rH > 0;

  const uid = compact ? "c" : "g";

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", display: "block" }}>
      <defs>
        <pattern id={`mauer-${uid}`} width="18" height="10" patternUnits="userSpaceOnUse">
          <rect width="18" height="10" fill={SK.wand} />
          <path d="M0 0H18M0 10H18M9 0V5M0 5H18M4.5 5V10M13.5 5V10"
            stroke={SK.wandLinie} strokeWidth="0.7" fill="none" />
        </pattern>
        <pattern id={`rollo-${uid}`} width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={SK.rolloBg} />
          <line x1="0" y1="0" x2="0" y2="8" stroke={SK.rollo} strokeWidth="1.6" />
        </pattern>
      </defs>

      <rect x={x0 - wd} y={y0 - wd} width={W + 2 * wd} height={H + 2 * wd}
        fill={`url(#mauer-${uid})`} stroke={T.ink} strokeWidth="1.4" />

      <rect x={x0} y={y0} width={W} height={H} fill={SK.oeffnung} stroke={T.ink} strokeWidth="2.2" />

      {zeigtRollo && (
        <g>
          <rect x={x0} y={y0} width={W} height={H - fHh} fill={`url(#rollo-${uid})`}
            stroke={SK.rollo} strokeWidth="1.2" />
        </g>
      )}

      {zeigtFenster && (
        <g>
          <rect x={fx} y={fy} width={fW} height={fHh} fill={SK.rahmen} />
          <rect x={fx + 5} y={fy + 5} width={Math.max(fW - 10, 0)} height={Math.max(fHh - 10, 0)}
            fill={SK.glas} stroke={SK.rahmen} strokeWidth="1" />
          <line x1={fx + fW * 0.25} y1={fy + fHh - 10} x2={fx + fW * 0.55} y2={fy + 10}
            stroke="#FFFFFF" strokeWidth="2.5" opacity="0.7" />
          <line x1={fx + fW * 0.38} y1={fy + fHh - 10} x2={fx + fW * 0.68} y2={fy + 10}
            stroke="#FFFFFF" strokeWidth="1.4" opacity="0.7" />
        </g>
      )}

      <DimH x1={x0} x2={x0 + W} y={y0 + H + wd + 20} label={`${t("labelAussparung")} ${aB} mm`} above={false} />
      <DimV y1={y0} y2={y0 + H} x={x0 - wd - 18} label={`${t("labelAussparung")} ${aH} mm`} />
      {zeigtFenster && <DimH x1={fx} x2={fx + fW} y={y0 - wd - 12} label={`${t("labelFenster")} ${fB} mm`} />}
      {zeigtFenster && <DimV y1={fy} y2={y0 + H} x={x0 + W + wd + 16} label={`${t("labelFenster")} ${fH} mm`} left={false} />}
      {zeigtRollo && (
        <g>
          <line x1={x0 + W} y1={y0} x2={x0 + W + wd + 46} y2={y0}
            stroke={T.blue} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.6" />
          <line x1={x0 + W} y1={fy} x2={x0 + W + wd + 46} y2={fy}
            stroke={T.blue} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.6" />
          <DimV y1={y0} y2={fy} x={x0 + W + wd + 46} label={`${t("labelRollo")} ${rH} mm`} left={false} />
        </g>
      )}
    </svg>
  );
}

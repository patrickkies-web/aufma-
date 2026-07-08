import { T } from "../design/tokens.js";

export function Feld({ label, value, onChange, unit = "mm", placeholder = "0", inputMode = "decimal" }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{
        display: "block", fontSize: 11, letterSpacing: "0.04em",
        textTransform: "uppercase", color: T.line, marginBottom: 4, fontFamily: T.sans,
      }}>{label}</span>
      <div style={{ position: "relative" }}>
        <input
          type="text" inputMode={inputMode} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box", padding: "10px 44px 10px 12px",
            border: `1px solid ${T.soft}`, borderRadius: 8, fontSize: 16,
            fontFamily: T.mono, color: T.ink, background: "#FFF", outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = T.blue)}
          onBlur={(e) => (e.target.style.borderColor = T.soft)}
        />
        <span style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          fontSize: 12, color: T.line, fontFamily: T.mono,
        }}>{unit}</span>
      </div>
    </label>
  );
}

export function Gruppe({ titel, children }) {
  return (
    <fieldset style={{
      border: `1px solid ${T.soft}`, borderRadius: 10, padding: "12px 14px 14px",
      margin: 0,
    }}>
      <legend style={{
        fontSize: 12, fontWeight: 600, color: T.ink, padding: "0 6px",
        fontFamily: T.sans,
      }}>{titel}</legend>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {children}
      </div>
    </fieldset>
  );
}

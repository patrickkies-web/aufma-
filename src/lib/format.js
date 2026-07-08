export const num = (v) => {
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? 0 : n;
};

export const heutigesDatum = () =>
  new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

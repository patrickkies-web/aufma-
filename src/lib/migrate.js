// Ältere gespeicherte Daten hatten ein einzelnes "fotoWunsch"-Feld statt der
// heutigen "fotosWunsch"-Liste. Beim Laden auf das aktuelle Format überführen.
export function normalisiereFenster(f) {
  const fotosWunsch = Array.isArray(f.fotosWunsch)
    ? f.fotosWunsch.filter(Boolean)
    : f.fotoWunsch
      ? [f.fotoWunsch]
      : [];
  const { fotoWunsch, ...rest } = f;
  return { ...rest, fotosWunsch };
}

# Fenster-Aufmaß

Eine kleine Web-App zum Aufmessen von Fenstern für Fensterbauer: Maße erfassen, Skizze automatisch prüfen, Fotos vom Ist-Zustand anhängen und das Aufmaß als PDF, HTML oder JSON exportieren.

## Funktionen

- Erfassung von Maueraussparung (innen/außen), Fensterelement und Rollladenraum in mm
- Automatisch generierte Bauzeichnungs-Skizze mit Maßlinien
- Fotos "Ist-Zustand" (innen/außen) anhängen
- Speicherung im Browser (localStorage) – Daten bleiben nach Neuladen erhalten
- Export als **PDF** (druckfertiger Bericht, direkt im Browser erzeugt)
- Export als HTML-Bericht (zum Drucken/Speichern über den Browser)
- Aufmaß als Text kopieren
- Projektdatei als JSON speichern und wieder laden

## Entwicklung

```bash
npm install
npm run dev
```

## Produktions-Build

```bash
npm run build
npm run preview
```

## Deployment

Die App wird automatisch per GitHub Actions (`.github/workflows/deploy.yml`) auf GitHub Pages veröffentlicht, sobald auf `main` gepusht wird. Einmalig muss in den Repository-Einstellungen unter **Settings → Pages → Build and deployment → Source** auf **"GitHub Actions"** umgestellt werden. Danach ist die App unter

```
https://<benutzername>.github.io/aufma-/
```

erreichbar.

## Projektstruktur

```
src/
  App.jsx              Haupt-App (Formular + Aufmaßliste)
  components/          UI-Bausteine (Feld, FotoFeld, Skizze, FensterKarte, ...)
  export/               PDF-, HTML- und JSON-Export
  lib/                  Hilfsfunktionen (Formatierung, Speicherung, Dateien)
  design/tokens.js      Farben, Schriften
```

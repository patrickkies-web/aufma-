// Übersetzungs-Wörterbuch für die App-Oberfläche und die Exporte (HTML/PDF).
// Neue Sprache hinzufügen: Objekt mit denselben Schlüsseln wie "de" ergänzen.
export const translations = {
  de: {
    appTitle: "Fenster-Aufmaß",
    appSubtitle: "Maße erfassen, Skizze prüfen, Aufmaß an den Fensterbauer geben. Alle Angaben in mm.",

    allgemeineHinweiseLabel: "Allgemeine Hinweise zum Projekt",
    allgemeineHinweisePlaceholder: "z. B. Zugang zum Objekt, Termine, Ansprechpartner, allgemeine Wünsche …",

    bezeichnungLabel: "Bezeichnung / Raum",
    bezeichnungPlaceholder: "z. B. Küche Süd",

    gruppeAussparungInnenTitel: "Maueraussparung von innen (gesamt)",
    gruppeAussparungAussenTitel: "Maueraussparung von außen",
    gruppeFensterelementTitel: "Sichtbares Fensterelement (Bestand)",
    gruppeRollladenraumTitel: "Rollladenraum",
    feldBreite: "Breite",
    feldHoehe: "Höhe",
    feldBautiefe: "Bautiefe (Vorder- → Hinterkante)",
    feldTiefeRollladen: "Tiefe (Wandkante → Innenkante)",
    feldHoeheBerechnet: "Höhe (berechnet)",

    gruppeFotosIstZustandTitel: "Fotos Ist-Zustand",
    fotoInnenLabel: "Foto von innen",
    fotoAussenLabel: "Foto von außen",

    gruppeWunschTitel: "Wunsch-Ausführung",
    wunschBilderLabel: "Referenzbilder (z. B. Konfigurator-Screenshots)",
    wunschNotizLabel: "Wünsche zum Fenster",
    wunschNotizPlaceholder: "z. B. 3 Felder, mittig Dreh-Kipp, außen Dreh, Farbe weiß …",

    warnungBreite: "Fensterbreite ist größer als die Aussparung.",
    warnungHoehe: "Fensterhöhe ist größer als die Aussparung.",

    btnFensterHinzufuegen: "Fenster hinzufügen",
    btnAenderungSpeichern: "Änderung speichern",
    btnAbbrechen: "Abbrechen",

    aufmasslisteTitel: "Aufmaßliste",
    btnPdfExport: "Als PDF exportieren",
    btnPdfWirdErstellt: "PDF wird erstellt…",
    btnHtmlExport: "Export für Fensterbauer (HTML)",
    btnTextKopieren: "Als Text kopieren",
    btnTextKopiert: "✓ Kopiert",
    btnDateiSpeichern: "Datei speichern",
    btnDateiLaden: "Datei laden",
    leereListeHinweis: "Noch keine Fenster erfasst. Trage oben das erste Fenster ein.",
    alertPdfFehler: "Das PDF konnte nicht erstellt werden. Bitte erneut versuchen.",

    btnBearbeiten: "Bearbeiten",
    btnLoeschen: "Löschen",
    ohneBezeichnung: "Ohne Bezeichnung",
    tabelleAussparungInnen: "Aussparung innen",
    tabelleAussparungAussen: "Aussparung außen",
    tabelleFensterelement: "Fensterelement",
    tabelleFensterBautiefe: "Fenster-Bautiefe",
    tabelleRollladenraum: "Rollladenraum",
    fotoInnenCaption: "Innen",
    fotoAussenCaption: "Außen",
    wunschAusfuehrungCaption: "Wunsch-Ausführung",
    wuenscheLabel: "Wünsche",

    fotoAufnehmenPlatzhalter: "+ Foto aufnehmen\noder auswählen",
    ersetzen: "Ersetzen",
    entfernen: "Entfernen",
    fotoHinzufuegenKurz: "+ Foto",
    alertFotoFehler: "Das Foto konnte nicht gelesen werden.",
    alertFotosFehler: "Eines der Fotos konnte nicht gelesen werden.",

    skizzePlatzhalter: "Skizze erscheint, sobald Breite und Höhe der Maueraussparung eingetragen sind.",
    labelFenster: "Fenster",
    labelAussparung: "Aussparung",
    labelRollo: "Rollo",

    rollladenTiefeLabel: "Rollladenraum-Tiefe",
    rollladenTiefeBeschreibung: "gemessen von der Wandkante bündig zum Fenster bis zur Innenkante des Mauerwerks (zweischalig)",
    fensterBautiefeLabel: "Fenster-Bautiefe",
    fensterBautiefeBeschreibung: "Vorderkante bis Hinterkante des Fensterelements, an der tiefsten Stelle gemessen",

    legendeMauerwerk: "Mauerwerk (Wand)",
    legendeMaueraussparung: "Maueraussparung",
    legendeFensterelement: "Fensterelement",
    legendeRollladenraum: "Rollladenraum",

    reportTitel: "Fenster-Aufmaß",
    reportErstelltAm: "Erstellt am {{datum}} · {{anzahl}} Fenster · alle Maße in mm",
    reportHinweisRollladenStark: "Hinweis zur Rollladenraum-Tiefe:",
    reportHinweisRollladenText: "gemessen von der Wandkante bündig zum Fenster bis zur Innenkante des Mauerwerks (zweischaliges Mauerwerk). Die Rollladenraum-Höhe ergibt sich aus Aussparungshöhe minus Fensterhöhe.",
    reportAllgemeineHinweise: "Allgemeine Hinweise",
    reportFusszeile: "Zum Drucken oder als PDF speichern: Datei öffnen und die Druckfunktion des Browsers verwenden.",
    reportMaueraussparungInnen: "Maueraussparung innen",
    reportMaueraussparungAussen: "Maueraussparung außen",
    reportFensterelementBestand: "Fensterelement (Bestand)",
    reportFensterBautiefeTiefsteStelle: "Fenster-Bautiefe (tiefste Stelle)",
    reportRollladenraum: "Rollladenraum",
    reportFotoAussenCaption: "Ist-Zustand außen",
    reportFotoInnenCaption: "Ist-Zustand innen",
    reportWunschAusfuehrung: "Wunsch-Ausführung",
    reportWuensche: "Wünsche",
    reportOhneBezeichnung: "Ohne Bezeichnung",

    fehlerDateiUngueltig: "Die Datei konnte nicht gelesen werden. Bitte eine mit dieser App gespeicherte JSON-Datei wählen.",
  },

  pl: {
    appTitle: "Pomiar okien",
    appSubtitle: "Wprowadź wymiary, sprawdź szkic, przekaż pomiar producentowi okien. Wszystkie wymiary w mm.",

    allgemeineHinweiseLabel: "Ogólne uwagi do projektu",
    allgemeineHinweisePlaceholder: "np. dostęp do obiektu, terminy, osoba kontaktowa, ogólne życzenia …",

    bezeichnungLabel: "Oznaczenie / Pomieszczenie",
    bezeichnungPlaceholder: "np. Kuchnia południowa",

    gruppeAussparungInnenTitel: "Otwór w murze od wewnątrz (całkowity)",
    gruppeAussparungAussenTitel: "Otwór w murze od zewnątrz",
    gruppeFensterelementTitel: "Widoczny element okienny (stan istniejący)",
    gruppeRollladenraumTitel: "Skrzynka roletowa",
    feldBreite: "Szerokość",
    feldHoehe: "Wysokość",
    feldBautiefe: "Głębokość konstrukcyjna (przód → tył)",
    feldTiefeRollladen: "Głębokość (krawędź ściany → krawędź wewnętrzna)",
    feldHoeheBerechnet: "Wysokość (obliczona)",

    gruppeFotosIstZustandTitel: "Zdjęcia stanu obecnego",
    fotoInnenLabel: "Zdjęcie od wewnątrz",
    fotoAussenLabel: "Zdjęcie od zewnątrz",

    gruppeWunschTitel: "Wykonanie docelowe",
    wunschBilderLabel: "Zdjęcia referencyjne (np. zrzuty ekranu z konfiguratora)",
    wunschNotizLabel: "Życzenia dotyczące okna",
    wunschNotizPlaceholder: "np. 3 pola, środkowe uchylno-rozwierne, zewnętrzne rozwierne, kolor biały …",

    warnungBreite: "Szerokość okna jest większa niż otwór.",
    warnungHoehe: "Wysokość okna jest większa niż otwór.",

    btnFensterHinzufuegen: "Dodaj okno",
    btnAenderungSpeichern: "Zapisz zmianę",
    btnAbbrechen: "Anuluj",

    aufmasslisteTitel: "Lista pomiarów",
    btnPdfExport: "Eksportuj jako PDF",
    btnPdfWirdErstellt: "Tworzenie PDF…",
    btnHtmlExport: "Eksport dla producenta okien (HTML)",
    btnTextKopieren: "Kopiuj jako tekst",
    btnTextKopiert: "✓ Skopiowano",
    btnDateiSpeichern: "Zapisz plik",
    btnDateiLaden: "Wczytaj plik",
    leereListeHinweis: "Nie dodano jeszcze żadnego okna. Wprowadź powyżej pierwsze okno.",
    alertPdfFehler: "Nie udało się utworzyć pliku PDF. Spróbuj ponownie.",

    btnBearbeiten: "Edytuj",
    btnLoeschen: "Usuń",
    ohneBezeichnung: "Bez oznaczenia",
    tabelleAussparungInnen: "Otwór wewnątrz",
    tabelleAussparungAussen: "Otwór na zewnątrz",
    tabelleFensterelement: "Element okienny",
    tabelleFensterBautiefe: "Głębokość konstrukcyjna okna",
    tabelleRollladenraum: "Skrzynka roletowa",
    fotoInnenCaption: "Wewnątrz",
    fotoAussenCaption: "Na zewnątrz",
    wunschAusfuehrungCaption: "Wykonanie docelowe",
    wuenscheLabel: "Życzenia",

    fotoAufnehmenPlatzhalter: "+ Zrób zdjęcie\nlub wybierz",
    ersetzen: "Zamień",
    entfernen: "Usuń",
    fotoHinzufuegenKurz: "+ Zdjęcie",
    alertFotoFehler: "Nie można odczytać zdjęcia.",
    alertFotosFehler: "Nie można odczytać jednego ze zdjęć.",

    skizzePlatzhalter: "Szkic pojawi się, gdy zostaną wprowadzone szerokość i wysokość otworu w murze.",
    labelFenster: "Okno",
    labelAussparung: "Otwór",
    labelRollo: "Roleta",

    rollladenTiefeLabel: "Głębokość skrzynki roletowej",
    rollladenTiefeBeschreibung: "mierzona od krawędzi ściany w linii okna do wewnętrznej krawędzi muru (mur dwuwarstwowy)",
    fensterBautiefeLabel: "Głębokość konstrukcyjna okna",
    fensterBautiefeBeschreibung: "od krawędzi przedniej do tylnej elementu okiennego, mierzone w najgłębszym miejscu",

    legendeMauerwerk: "Mur (ściana)",
    legendeMaueraussparung: "Otwór w murze",
    legendeFensterelement: "Element okienny",
    legendeRollladenraum: "Skrzynka roletowa",

    reportTitel: "Pomiar okien",
    reportErstelltAm: "Utworzono {{datum}} · liczba okien: {{anzahl}} · wszystkie wymiary w mm",
    reportHinweisRollladenStark: "Uwaga dotycząca głębokości skrzynki roletowej:",
    reportHinweisRollladenText: "mierzona od krawędzi ściany w linii okna do wewnętrznej krawędzi muru (mur dwuwarstwowy). Wysokość skrzynki roletowej wynika z wysokości otworu minus wysokość okna.",
    reportAllgemeineHinweise: "Ogólne uwagi",
    reportFusszeile: "Aby wydrukować lub zapisać jako PDF: otwórz plik i użyj funkcji drukowania przeglądarki.",
    reportMaueraussparungInnen: "Otwór w murze wewnątrz",
    reportMaueraussparungAussen: "Otwór w murze na zewnątrz",
    reportFensterelementBestand: "Element okienny (stan istniejący)",
    reportFensterBautiefeTiefsteStelle: "Głębokość konstrukcyjna okna (najgłębsze miejsce)",
    reportRollladenraum: "Skrzynka roletowa",
    reportFotoAussenCaption: "Stan obecny – na zewnątrz",
    reportFotoInnenCaption: "Stan obecny – wewnątrz",
    reportWunschAusfuehrung: "Wykonanie docelowe",
    reportWuensche: "Życzenia",
    reportOhneBezeichnung: "Bez oznaczenia",

    fehlerDateiUngueltig: "Nie można odczytać pliku. Wybierz plik JSON zapisany przez tę aplikację.",
  },
};

export function t(lang, key, vars) {
  const vorlage = translations[lang]?.[key] ?? translations.de[key] ?? key;
  if (!vars) return vorlage;
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{{${k}}}`, v), vorlage);
}

# Tagesrapport-App · Schlosserei Menge

Web-App (PWA) für Mitarbeiter: Rapportkarte scannen, Arbeiten, Material, Stunden, Fotos und Unterschriften erfassen, Rapport als A4-PDF teilen.
Umsetzung von Variante **1a „Assistent“** aus dem Claude-Design-Entwurf (`project/Rapport Konzept.dc.html`, `project/Rapport App.dc.html`).

## Starten

```bash
npm install
npm run dev        # Entwicklung, http://localhost:5173
npm run build      # Produktion nach dist/
npm run preview    # gebaute Version ansehen
npm test           # Tests (Kartenerkennung)
```

Die Kamera funktioniert im Browser nur über **HTTPS** (oder `localhost`). Für den Einsatz `dist/` auf einen beliebigen statischen Webserver mit HTTPS legen. Auf dem Handy die Seite öffnen und **„Zum Startbildschirm hinzufügen“**: dann startet sie wie eine App und läuft auch offline.

## Veröffentlichen mit GitHub Pages

Der Workflow `.github/workflows/pages.yml` testet und baut die App bei jedem Push auf `main` und stellt sie unter `https://<github-name>.github.io/<repo>/` bereit.
Einmalig im Repository unter **Settings → Pages → Build and deployment → Source** „**GitHub Actions**“ wählen.

## Ablauf

1. **Start**: Datum, „Auftragskarte scannen“, „Ohne Karte beginnen“, die heute gesendeten Rapporte (antippen = PDF erneut teilen), angemeldeter Mitarbeiter (antippen = Name ändern). Ein angefangener Rapport erscheint als **Entwurf**.
2. **Scan**: Die Kamera sucht laufend den Code-39-Barcode der Rapportkarte. Wird er gefunden, wird ein Standbild per Texterkennung gelesen. Ohne Barcode (die Beispielkarte hat noch keinen): **„Karte lesen“** tippen. Ohne Kamera: Karte fotografieren oder ein Foto aus der Galerie wählen.
3. Sieben Schritte mit Fortschrittsbalken: Auftrag → Arbeiten → Material → Stunden → Fotos → Unterschrift → Rapport prüfen. Pflichtangaben werden vor „Weiter“ geprüft.
4. **Rapport senden** erzeugt das PDF und öffnet auf dem Handy das Teilen-Menü (Mail, Messenger, Drive …). Am PC wird es heruntergeladen. Danach steht der Rapport unter „Heute“.

## Kartenerkennung

- Barcode: ZXing (Code 39 / Code 128), liefert die **Position** (z. B. `A26333-01`). Der Auftrag ergibt sich aus der Position.
- Text: Tesseract (Deutsch) auf dem Gerät, ohne Server. `src/lib/cardParser.ts` liest Kunden-Nr., Kunde, Straße, PLZ/Ort, Telefon, Projekt, Auftrag + Bezeichnung und Position + Beschreibung anhand der Feldbeschriftungen und Spalten der Karte.
- Ergebnis immer prüfen: Der Hinweis „Aus Scan · Bitte prüfen“ bleibt stehen. Der Kundenname in der schmalen Spalte ist am fehleranfälligsten.
- Die OCR-Dateien (~5 MB) liegen unter `public/ocr` (`scripts/copy-ocr.mjs` kopiert sie vor `dev`/`build` aus `node_modules`). Sie werden beim ersten Scan geladen und danach für den Offline-Betrieb gespeichert.
- Tests mit dem OCR-Ergebnis der Beispielkarte (sauber, als Handyfoto, als Kamerabild) in `src/lib/cardParser.test.ts`.

## PDF

`src/lib/pdf.ts` (jsPDF), Layout nach der Rapportkarte: Logo, Rapport-Nr. `R-<Position>-<lfd. Nr.>`, Kunde/Projekt/Auftrag, Positionstabelle mit Code-39-Barcode, Arbeiten, Bemerkungen, Material und Stunden nebeneinander, Summe, Legende M/F/H, beide Unterschriften. Fotos kommen als Anhang auf eigene Seiten. Der gedruckte Barcode ist lesbar (mit ZXing geprüft), ein ausgedruckter Rapport lässt sich also wieder einscannen.

## Daten

Alles bleibt auf dem Gerät (IndexedDB): der Entwurf (auch Fotos und Unterschriften, übersteht Schließen und Neuladen), die gesendeten Rapporte der letzten 14 Tage und das Profil. Es gibt keinen Server.

## Offene Punkte

- **Materialstamm**: `src/data/katalog.ts` enthält Beispieldaten. Den echten Stamm dort eintragen (Nr., Bezeichnung, Einheit, Kategorie).
- **Barcode auf der Karte**: Die Beispielkarte hat ein leeres Barcode-Feld. Die Erkennung läuft dann nur per Text. Mit Barcode ist die Position sicherer.
- Gegenüber dem Entwurf ergänzt: Entwurf fortsetzen/verwerfen, Profil (Name, Qualifikation, Standort) statt fest „J. Keller“, Auslöser „Karte lesen“ und Galerie-Auswahl im Scan, „Heute“-Einträge erneut teilen, echtes Datum statt 20.10.2026.
- Weggelassen: Variante 1b „Übersicht“ (nicht gewählt) und die Spalte „Gehen“ (laut Chat entfallen).

## Aufbau

```
src/
  App.tsx              Zustand, Schrittfolge, Prüfung, Senden
  ds/                  Komponenten des Design-Systems (Port aus project/_ds)
  screens/             Start, Scan, Schritte 1–6, PDF-Vorschau, Bottom-Sheets
  lib/                 cardParser, ocr, pdf, code39, storage, format, types
  data/katalog.ts      Materialkatalog (Beispiel), Einheiten, Textbausteine
  styles/              Design-Tokens + App-CSS
project/               Design-Entwurf aus Claude Design (Referenz)
```

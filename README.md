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

Die Kamera funktioniert im Browser nur über **HTTPS** (oder `localhost`). Für den Einsatz `dist/` auf einen beliebigen statischen Webserver mit HTTPS legen. Auf dem Handy die Seite einmal mit Internet öffnen, „Offline bereit“ abwarten und **„Zum Startbildschirm hinzufügen“**: dann startet sie wie eine App und läuft ohne Netz.

## Veröffentlichen mit GitHub Pages

Der Workflow `.github/workflows/pages.yml` testet und baut die App bei jedem Push auf `main` und stellt sie unter `https://<github-name>.github.io/<repo>/` bereit.
Einmalig im Repository unter **Settings → Pages → Build and deployment → Source** „**GitHub Actions**“ wählen.

## Ablauf

1. **Start**: Datum, „Auftragskarte scannen“, „Ohne Karte beginnen“, die heute gesendeten Rapporte (antippen = PDF erneut teilen), angemeldeter Mitarbeiter (antippen = Name ändern). Ein angefangener Rapport erscheint als **Entwurf**.
2. **Scan**: Die Kamera sucht laufend den Code-39-Barcode der Rapportkarte. Wird er gefunden, wird ein Standbild per Texterkennung gelesen. Ohne Barcode (die Beispielkarte hat noch keinen): **„Karte lesen“** tippen. Ohne Kamera: Karte fotografieren oder ein Foto aus der Galerie wählen.
3. Acht Schritte mit Fortschrittsbalken. „Weiter“ geht erst, wenn die Pflichtangaben stimmen (`src/lib/pruefung.ts`):
   - **1 Auftrag:** Kunde, Straße mit Hausnummer, PLZ und Ort (4–5-stellige PLZ, auch CH/A), Auftrag, Position.
   - **2 Arbeiten:** Beschreibung der ausgeführten Arbeiten.
   - **3 Material:** mindestens eine Position oder „Kein Material benötigt“. Neue Positionen starten mit Menge 0. Die Menge lässt sich per Tastatur eingeben (Komma erlaubt) oder über +0,25 / +1 / +5 / +10, mit Rückgängig. Keine Position darf auf 0 stehen.
   - **4 Stunden:** mindestens ein Mitarbeiter mit Zeit. Zeit über +15 min / +30 min / +1 h mit Rückgängig. Art: Werkstatt oder Montage.
   - **5 Fahrt:** Fahrzeit (+15 min / +30 min / +1 h, Rückgängig) und Kilometer, jeweils Hin- und Rückfahrt, oder „Keine Fahrt“. Der Knopf „Route in Google Maps ansehen“ öffnet die Route Werkstatt → Kunde. Erst durch dieses Antippen geht die Kundenadresse an Google; die App selbst fragt nichts ab.
   - **6 Fotos:** mindestens 2 Fotos, jedes mit Bezeichnung (Kamera oder Galerie).
   - **7 Unterschrift:** Auftragnehmer, und Auftraggeber oder „nicht anwesend“.
4. **Rapport senden** erzeugt das PDF und öffnet auf dem Handy das Teilen-Menü (Mail, Messenger, Drive …). Am PC wird es heruntergeladen. Danach steht der Rapport unter „Heute“.

## Kartenerkennung

- Barcode: ZXing (Code 39 / Code 128), liefert die **Position** (z. B. `A26333-01`). Der Auftrag ergibt sich aus der Position.
- Text: Tesseract (Deutsch) auf dem Gerät, ohne Server. `src/lib/cardParser.ts` liest Kunden-Nr., Kunde, Straße, PLZ/Ort, Telefon, Projekt, Auftrag + Bezeichnung und Position + Beschreibung anhand der Feldbeschriftungen und Spalten der Karte.
- Ergebnis immer prüfen: Der Hinweis „Aus Scan · Bitte prüfen“ bleibt stehen. Der Kundenname in der schmalen Spalte ist am fehleranfälligsten.
- Die OCR-Dateien (~5 MB) liegen unter `public/ocr` (`scripts/copy-ocr.mjs` kopiert sie vor `dev`/`build` aus `node_modules`). Sie werden beim ersten Öffnen der App mitgespeichert.
- Tests mit dem OCR-Ergebnis der Beispielkarte (sauber, als Handyfoto, als Kamerabild) in `src/lib/cardParser.test.ts`.

## PDF

`src/lib/pdf.ts` (jsPDF), Layout nach der Rapportkarte: Logo, Rapport-Nr. `R-<Position>-<lfd. Nr.>`, Kunde/Projekt/Auftrag, Positionstabelle mit Code-39-Barcode, Arbeiten, Bemerkungen, dann untereinander die Tabellen Material, Stunden (mit Summe und Legende M/F/H) und Fahrt, beide Unterschriften. Fotos kommen als Anhang auf eigene Seiten. Der gedruckte Barcode ist lesbar (mit ZXing geprüft), ein ausgedruckter Rapport lässt sich also wieder einscannen.

## Datenschutz und Offline-Betrieb

- **Keine Kundendaten auf fremden Servern.** Kundendaten, Arbeiten, Stunden, Fotos und Unterschriften liegen nur im Browser des Handys (IndexedDB): Entwurf, gesendete Rapporte der letzten 14 Tage, Profil. Es gibt kein Backend, keine Analyse und keine externen Schriften oder CDNs.
- **Texterkennung und Barcode laufen auf dem Gerät.** Das Kamerabild wird nirgends hochgeladen.
- **Sicherheitsrichtlinie (CSP)** in der gebauten App: Der Browser darf nur Dateien vom eigenen Server laden und blockiert jede Verbindung zu anderen Adressen. Daten verlassen das Handy nur, wenn der Mitarbeiter das PDF selbst über „Teilen“ verschickt oder herunterlädt.
- **Komplett offline:** Beim ersten Öffnen (mit Internet) speichert die App alle Dateien inklusive Texterkennung (~10 MB) auf dem Gerät und meldet „Offline bereit“. Danach funktioniert alles ohne Netz: Start, Scan, alle Schritte, PDF. Mit Internet holt sie sich Updates automatisch.
- Der Webserver (z. B. GitHub Pages) liefert nur die App-Dateien aus und sieht keine Rapportdaten.

## Offene Punkte

- **Materialstamm**: `src/data/katalog.ts` enthält Beispieldaten. Den echten Stamm dort eintragen (Nr., Bezeichnung, Einheit, Kategorie).
- **Barcode auf der Karte**: Die Beispielkarte hat ein leeres Barcode-Feld. Die Erkennung läuft dann nur per Text. Mit Barcode ist die Position sicherer.
- Gegenüber dem Entwurf geändert: Textbausteine in Schritt 2 entfernt, Plus/Minus durch Schnellknöpfe mit Rückgängig ersetzt, Fotos mit Bezeichnung und als Pflicht.
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

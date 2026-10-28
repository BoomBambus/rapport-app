# Tagesrapport-App · Schlosserei Menge

Web-App (PWA) für Mitarbeiter: Rapportkarte scannen, Arbeiten, Material, Stunden, Fotos und Unterschriften erfassen, Rapport als Word-Dokument (A4, .docx) teilen.
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

1. **Start**: Datum, „Auftragskarte scannen“, „Ohne Karte beginnen“, die heute gesendeten Rapporte (antippen = Rapport erneut teilen), angemeldeter Mitarbeiter (antippen = Name ändern). Ein angefangener Rapport erscheint als **Entwurf**.
2. **Scan**: Die Kamera sucht laufend den Code-39-Barcode der Rapportkarte. Wird er gefunden, wird ein Standbild per Texterkennung gelesen. Ohne Barcode (die Beispielkarte hat noch keinen): **„Karte lesen“** tippen. Ohne Kamera: Karte fotografieren oder ein Foto aus der Galerie wählen.
3. Acht Schritte mit Fortschrittsbalken. „Weiter“ geht erst, wenn die Pflichtangaben stimmen (`src/lib/pruefung.ts`):
   - **1 Auftrag:** Kunde, Straße mit Hausnummer, PLZ und Ort (4–5-stellige PLZ, auch CH/A), Auftrag, Position.
   - **2 Arbeiten:** Beschreibung der ausgeführten Arbeiten.
   - **3 Material:** mindestens eine Position oder „Kein Material benötigt“. Neue Positionen starten mit Menge 0. Die Menge lässt sich per Tastatur eingeben (Komma erlaubt) oder über +0,25 / +1 / +5 / +10, mit Rückgängig. Keine Position darf auf 0 stehen.
   - **4 Stunden:** mindestens ein Mitarbeiter mit Zeit. Zeit über +15 min / +30 min / +1 h mit Rückgängig. Art: Werkstatt oder Montage.
   - **5 Fahrt:** Fahrzeit (+15 min / +30 min / +1 h, Rückgängig) und Kilometer, jeweils Hin- und Rückfahrt, oder „Keine Fahrt“. Der Knopf „Route in Google Maps ansehen“ öffnet die Route Werkstatt → Kunde. Erst durch dieses Antippen geht die Kundenadresse an Google; die App selbst fragt nichts ab.
   - **6 Fotos:** mindestens 2 Fotos, jedes mit Bezeichnung (Kamera oder Galerie).
   - **7 Unterschrift:** Auftragnehmer, und Auftraggeber oder „nicht anwesend“.
4. **Rapport senden** erzeugt das Word-Dokument und öffnet auf dem iPhone das Teilen-Menü (Mail, Messenger, Drive …). Android-Chrome lässt Word-Dateien nicht ins Teilen-Menü, dort und am PC wird die Datei heruntergeladen. Danach steht der Rapport unter „Heute“.

## Kartenerkennung

**Gestaltung der Karte:** Wie die Rapportkarte aussehen sollte, damit die Texterkennung zuverlässig funktioniert (Scanfeld, eine Angabe pro Zeile, Schwarz auf Weiß), steht in [`docs/Rapportkarte-Gestaltung.md`](docs/Rapportkarte-Gestaltung.md). Mit dem vorgeschlagenen Layout: 52 von 54 Feldern richtig, statt 44 mit der bisherigen Karte.

**Mit QR-Code (empfohlen):** Die Rapportkarte trägt einen QR-Code im Format `Kunde - … ; Straße - … ; PLZ Ort - … ; Auftragsnr - … ; Auftragsbez … ; Pos - … ; Posbez …`. Die App erkennt ihn ohne Antippen; ist `Pos` gefüllt, in unter einer Sekunde, sonst ergänzt die Texterkennung die fehlenden Felder. Alle Felder werden fehlerfrei übernommen, und Schritt 1 ist mit „QR-Code“ markiert. Format und Druckvorgaben für den Softwareanbieter stehen in [`docs/QR-Code-Rapportkarte.md`](docs/QR-Code-Rapportkarte.md).

**Ohne QR-Code (Texterkennung):**
- Strichcode (Code 39/128) wird automatisch erkannt und liefert die Position. Sonst „Karte lesen“ tippen.
- Ausgewertet wird nur der Sucherrahmen, und zwar das schärfste Kamerabild der letzten Sekunde (gegen Verwackeln).
- Das Bild wird aufbereitet (`src/lib/bild.ts`): vergrößern, Schatten herausrechnen, Tisch/Hand ausblenden, schärfen. Danach läuft Tesseract (Deutsch) auf dem Gerät.
- Bis zu drei Lesedurchgänge: aufbereitet und gerade gerichtet; bei fehlenden Pflichtfeldern das unbearbeitete Bild; bei fehlender Positionszeile im Streutext-Modus (findet Text neben dem Strichcode). Ergebnisse werden zusammengeführt.
- Kartenkopf 2026 („Kunde: 10868“ + Name, Adressblock „Anrede/Kunde/Straße/PLZ, Ort/Tel“, Strichcode „LA…“) wird unterstützt, siehe `docs/Rapportkarte-Gestaltung.md`.
- Neues Formular-Layout („Kunde: …“, „Straße: …“, eine Angabe pro Zeile) wird automatisch erkannt.
- `src/lib/cardParser.ts` richtet sich bei der bisherigen Karte an der PLZ aus und findet von dort Straße (darüber), Telefon (darunter) und Kunden-Nr. (links). Er funktioniert auch, wenn die kleine Beschriftung „Kunde:“ nicht lesbar ist.
- Schritt 1 zeigt das Scan-Bild zum Vergleichen (antippen = vergrößern). Es bleibt nur auf dem Gerät und kommt nicht in den Rapport.
- Taschenlampen-Knopf, wo das Handy ihn anbietet (Android).

Messung mit simulierten Handybildern (`scripts/bench/`): 41 von 54 Feldern richtig, vorher 19. Am schwierigsten bleiben stark verwackelte Bilder und der Kundenname in der schmalen Spalte. Beides erledigt der QR-Code.

Die OCR-Dateien liegen unter `public/ocr` (`scripts/copy-ocr.mjs` kopiert sie vor `dev`/`build` aus `node_modules`) und werden beim ersten Öffnen der App mitgespeichert.

## Word-Dokument

`src/lib/word.ts` (Bibliothek `docx`, läuft komplett im Browser), Layout nach der Rapportkarte: Logo, Rapport-Nr. `R-<Position>-<lfd. Nr.>`, Kunde/Projekt/Auftrag, Positionstabelle mit Code-39-Barcode, Arbeiten, Bemerkungen, dann untereinander die Tabellen Material, Stunden (mit Summe und Legende M/F/H/A) und Fahrt, beide Unterschriften. Fotos kommen als Anhang auf eine eigene Seite (zwei pro Zeile, mit Bezeichnung). Fußzeile mit „Seite X von Y“. Der gedruckte Barcode ist lesbar (mit ZXing geprüft), ein ausgedruckter Rapport lässt sich also wieder einscannen.

## Datenschutz und Offline-Betrieb

- **Keine Kundendaten auf fremden Servern.** Kundendaten, Arbeiten, Stunden, Fotos und Unterschriften liegen nur im Browser des Handys (IndexedDB): Entwurf, gesendete Rapporte der letzten 14 Tage, Profil. Es gibt kein Backend, keine Analyse und keine externen Schriften oder CDNs.
- **Texterkennung und Barcode laufen auf dem Gerät.** Das Kamerabild wird nirgends hochgeladen.
- **Sicherheitsrichtlinie (CSP)** in der gebauten App: Der Browser darf nur Dateien vom eigenen Server laden und blockiert jede Verbindung zu anderen Adressen. Daten verlassen das Handy nur, wenn der Mitarbeiter den Rapport selbst über „Teilen“ verschickt oder herunterlädt.
- **Komplett offline:** Beim ersten Öffnen (mit Internet) speichert die App alle Dateien inklusive Texterkennung (~10 MB) auf dem Gerät und meldet „Offline bereit“. Danach funktioniert alles ohne Netz: Start, Scan, alle Schritte, Rapport. Mit Internet holt sie sich Updates automatisch.
- Der Webserver (z. B. GitHub Pages) liefert nur die App-Dateien aus und sieht keine Rapportdaten.

## Offene Punkte

- **Materialstamm**: `src/data/katalog.ts` enthält Beispieldaten. Den echten Stamm dort eintragen (Nr., Bezeichnung, Einheit, Kategorie).
- **Rapportkarte anpassen**: beim Softwareanbieter anfragen – Layout nach `docs/Rapportkarte-Gestaltung.md`, am besten mit QR-Code nach `docs/QR-Code-Rapportkarte.md`. Bis dahin läuft die Erkennung per Text auf der bisherigen Karte.
- Gegenüber dem Entwurf geändert: Textbausteine in Schritt 2 entfernt, Plus/Minus durch Schnellknöpfe mit Rückgängig ersetzt, Fotos mit Bezeichnung und als Pflicht.
- Gegenüber dem Entwurf ergänzt: Entwurf fortsetzen/verwerfen, Profil (Name, Qualifikation, Standort) statt fest „J. Keller“, Auslöser „Karte lesen“ und Galerie-Auswahl im Scan, „Heute“-Einträge erneut teilen, echtes Datum statt 20.10.2026.
- Weggelassen: Variante 1b „Übersicht“ (nicht gewählt) und die Spalte „Gehen“ (laut Chat entfallen).

## Aufbau

```
src/
  App.tsx              Zustand, Schrittfolge, Prüfung, Senden
  ds/                  Komponenten des Design-Systems (Port aus project/_ds)
  screens/             Start, Scan, Schritte 1–6, Rapport-Vorschau, Bottom-Sheets
  lib/                 cardParser, ocr, word, rapport, code39, storage, format, types
  data/katalog.ts      Materialkatalog (Beispiel), Einheiten, Textbausteine
  styles/              Design-Tokens + App-CSS
project/               Design-Entwurf aus Claude Design (Referenz)
```

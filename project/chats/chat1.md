# Mobile app design brief

_Started 2026-10-20 12:39 UTC_

---

## User

Design a mobile app for

## Assistant



## Assistant

_[tool: ask_user]_

Ich warte noch auf Ihre Antworten im Formular – vor allem: Wofür soll die App sein?

## User

Answered — purpose: Mitarbeiter: Aufträge, Zeiterfassung, Baustellen-Doku; purpose_free: Die App soll einen Tagesrapport im PDF Format generieren.
Die Auftragskarte soll gescannt werden und einige Felder vorausfüllen.
Der Mitarbeiter kann dann Schritt für Schritt die Restlichen Informati…; platform: Egal; screens: Foto-Upload, Projektdetail, Zeiterfassung; fidelity: Beides; variations: 2–3 Varianten

## Assistant

Danke. Sie schreiben, dass Sie die Vorlage für den Tagesrapport noch schicken – ich warte darauf, damit Felder und PDF-Layout genau passen. Bitte laden Sie sie hier hoch (PDF, Foto oder Word). Ein Foto oder Scan einer typischen Auftragskarte wäre auch hilfreich, damit ich sehe, welche Felder sich vorausfüllen lassen.

## User

Nimm Das als Grobe Vorlage für den späteren Rapport.
Diese Vorlage ist auch die Arbeitskarte die der Mitarbeiter für die Auftragsinformationen zu beginn scannen kann.

## Assistant

_[tool: read_skill_prompt]_

_[tool: list_files]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I've built a clickable prototype of the Tagesrapport app in **Rapport Konzept** (the app itself is in **Rapport App**). A background check of the page is still running.

The page shows three phones you can click through, plus each step as a separate screen filled with example data:
- **1a Assistent:** a guided flow, one step at a time with a progress bar and checks before moving on.
- **1b Übersicht:** a list of sections the worker can fill in any order, each showing whether it's done.
- **1c:** the 1b list already filled in.

The main flow:
- **Scan:** the camera view is a placeholder. After a moment the barcode counts as read and the fields from your sample card are filled in automatically.
- **Material:** pick from a catalog with search and categories, or enter items by hand.
- **Stunden:** set Meister, Facharbeiter or Helfer and the type of work (Werkstatt, Montage or Intern), with plus and minus buttons for hours.
- **Fotos and signatures:** taking photos really uploads them, and there are signature fields for the customer and the worker.
- **PDF:** the preview follows the layout of your Rapportkarte.

Open points:
- **"Gehen" column:** I wasn't sure what this column on the card means, so I left it out. Is it a clock-out time or a fourth type of work?
- **Material catalog and worker names:** these are made-up examples. Send me your real item list and I'll put it in.
- **Real PDF:** the app doesn't create an actual file yet. The preview shows what it would look like.

## User

1a find ich gut

## Assistant



## Assistant

_[tool: ask_user]_

Gut, dann bauen wir 1a weiter aus. Ich warte auf Ihre Antworten im Formular, vor allem: Was bedeutet „Gehen“ auf der Karte, und was soll als Nächstes kommen?

## User

Answered — gehen: Kann weg; reihenfolge: So lassen; next: Echter PDF-Export; sonst: Den Materialstamm reiche ich nach

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: run_script]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

In 1a, „Rapport senden“ now creates a real A4 PDF and downloads it; „Teilen“ opens the share menu on a phone. I haven't checked the downloaded file myself yet; a check of the page is still running.

- **Layout:** follows your Rapportkarte, with logo, customer and order, a position table, work done, comments, material and hours side by side, a total, the M/F/H legend and both signatures.
- **Barcode:** the position number is printed as a barcode. Please scan a printout once to confirm it reads correctly.
- **Fotos:** they go on a second page.
- **„Gehen“:** removed as you said. The hours types are now Werkstatt, Montage and Intern.

Material and worker names are still example data until you send your list.


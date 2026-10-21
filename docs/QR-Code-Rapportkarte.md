# QR-Code auf der Rapportkarte

Anleitung für das Programm, das die Rapportkarte druckt (Warenwirtschaft / Auftragsbearbeitung).

Die Tagesrapport-App liest diesen QR-Code in unter einer Sekunde und übernimmt alle Auftragsdaten fehlerfrei. Ohne QR-Code muss sie den gedruckten Text per Texterkennung lesen, was bei schlechtem Licht oder schräger Haltung Fehler macht.

## Inhalt

Reiner Text, **UTF-8**, ein Feld pro Zeile im Format `SCHLÜSSEL=Wert`. Die erste Zeile `RAPPORT` ist optional, hilft aber beim Erkennen.

```
RAPPORT
KUNDENNR=10868
KUNDE=Mustermann GmbH
STRASSE=Niemandslandstr. 1
PLZ=68229
ORT=Mannheim
TEL=0621 / 4829-310
PROJEKT=
AUFTRAG=A26333
AUFTRAGTEXT=Testauftrag
POS=A26333-01
POSTEXT=Rapportposition Test
```

| Schlüssel | Inhalt | Pflicht |
|---|---|---|
| `KUNDENNR` | Kundennummer | empfohlen |
| `KUNDE` | Kundenname | ja |
| `STRASSE` | Straße und Hausnummer | ja |
| `PLZ` | Postleitzahl | ja |
| `ORT` | Ort | ja |
| `TEL` | Telefon | nein |
| `PROJEKT` | Projekt | nein |
| `AUFTRAG` | Auftragsnummer | ja (sonst aus `POS` abgeleitet) |
| `AUFTRAGTEXT` | Auftragsbezeichnung | nein |
| `POS` | Positionsnummer, z. B. `A26333-01` | ja |
| `POSTEXT` | Positionsbezeichnung | nein |

Die App ist tolerant:
- Groß-/Kleinschreibung der Schlüssel ist egal.
- `:` statt `=` geht.
- `;` statt Zeilenumbruch geht.
- `PLZ` und `ORT` dürfen auch zusammen in `ORT` stehen (`ORT=68229 Mannheim`).
- Alternativ geht JSON mit denselben Schlüsseln, z. B. `{"kundennr":"10868","kunde":"…"}`.

Leere Felder können wegfallen. Umlaute, `&`, `|` usw. sind erlaubt, solange der Code als UTF-8 erzeugt wird.

Fehlen Pflichtfelder (z. B. nur `POS=…`), liest die App den Rest zusätzlich per Texterkennung.

## Druck

- **Größe:** mindestens **30 × 30 mm**, besser 35 mm. Kleiner wird von Handys mit einfacher Kamera aus normalem Abstand nicht sicher erkannt.
- **Fehlerkorrektur:** Stufe **M** (Standard).
- **Ruhezone:** rundherum mindestens 4 Module weißer Rand, keine Linien oder Text im Rand.
- **Platz:** im Feld „Barcode“ rechts neben der Position. Der bisherige Code-39-Strichcode kann bleiben oder wegfallen.
- Schwarz auf Weiß, nicht auf farbigem Hintergrund.

## Beispiel zum Testen

![Beispiel-QR-Code](qr-beispiel.png)

`qr-beispiel.png` enthält genau den Beispielinhalt oben. Auf Papier ausgedruckt (≈ 35 mm) oder am Bildschirm gezeigt, sollte die App ihn sofort erkennen und Schritt 1 mit „QR-Code“ markiert ausfüllen.

Technische Umsetzung in der App: `src/lib/qr.ts` (Format) und `src/lib/scanner.ts` (Erkennung).

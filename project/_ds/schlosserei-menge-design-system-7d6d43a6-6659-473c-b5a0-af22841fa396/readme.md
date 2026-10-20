# Schlosserei Menge — Design System

Schlosserei Menge (Inhaber Fabian Menge, Weiherstr. 12, 78465 Konstanz-Dettingen) ist ein Familienbetrieb seit 1984 für Stahl- und Metallbau, zertifiziert nach EN 1090 seit 2013. Referenzbereiche: Stahlbau | Fassaden, Balkone | Geländer, Treppen | Geländer, Zäune | Toranlagen, Vordächer | Glasdächer, Sonderanfertigungen. Die Marke ist bewusst schlicht: **drei Farben und eine Haltung** — `menge-blau` als Fläche, `tiefschwarz` als Schrift, `signalrot` als einzelner Strich.

## Quellen
- Lokaler Ordner `schlosserei-menge-designsystem/` (read-only angehängt): `README.md` (Markenregeln), `LOGOS.md`, `tokens.json` (Farbwerte exakt aus dem Logo-PDF), `schlosserei-menge-logo.{svg,pdf,jpg}`.
- `tokens.json` liegt als Kopie unter `source/tokens.json`.
- Website https://www.schlosserei-menge.de (+ /contact.html), Webflow — Inhalte und Struktur gelesen; CSS und Bilddateien waren nicht abrufbar. → UI-Kit `ui_kits/website/`.
- Keine Codebasis / Figma / Folien. Komponenten wurden als schlanker Standardsatz neu entworfen (siehe „Intentional additions“).

## Index
- `styles.css` — Einstieg; nur `@import`s.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css` (inkl. Radius, Strich, Bewegung, Schatten), `base.css` (Body-Defaults + Typo-Klassen `.sm-wortmarke`, `.sm-sperrsatz`, `.sm-titel`, `.sm-zwischentitel`, `.sm-fliesstext`, `.sm-klein`).
- `guidelines/` — Spezimen-Karten (Colors, Type, Spacing, Brand).
- `components/` — React-Komponenten (s. u.).
- `ui_kits/website/` — klickbare Website-Nachbildung (Startseite, Kontakt/Datenschutz).
- `assets/` — Logo als SVG, PDF, JPG.
- `thumbnail.html`, `SKILL.md`.

## Components
- **brand/**: Logo, Band, Strich, Eyebrow
- **forms/**: Button, Input, Select, Checkbox, Radio, Switch
- **display/**: Card, Badge, Tabs
- **feedback/**: Dialog, Toast, Tooltip

### Intentional additions
Die Quelle definiert keine Komponenten. Alle oben genannten sind Neuentwürfe nach den Markenregeln. Ebenso ergänzt: Zustandsfarben (`--menge-blau-hover`, `--menge-blau-press`, `--tiefschwarz-hover`, `--overlay`), `--shadow-float` (nur für Dialog/Toast), Bewegungs-Tokens, `--stroke-klein` (4px für UI).

---

## CONTENT FUNDAMENTALS
- **Sprache:** Deutsch. Sachlich, handwerklich, konkret.
- **Anrede:** „Sie“ gegenüber Kunden; das Unternehmen spricht als „wir“. Live-Beispiele: „Familienbetrieb in Dettingen seit 1984. Maßarbeit aus Tradition und Leidenschaft!“, „Stets für Sie da!“
- **Überzeilen (Website):** kurz, warm, oft mit Auslassung oder Ausruf: „WIR FÜR SIE“, „unsere Arbeit“, „Nah bei Ihnen…“, „wir suchen SIE!“ — darunter eine sachliche Überschrift („Schlosserei Menge Konstanz“, „Referenzen“).
- **Kategorien** mit senkrechtem Strich getrennt: „Balkone | Geländer“. Weiterlinks mit „»“.
- **Vertrauen:** Qualität, Planung, Termintreue, Zertifizierung (EN 1090) werden konkret benannt.
- **Stellenanzeigen:** (m/w/d), direkte Fragen („Sind Sie Feuer und Flamme für Ihren Beruf…?“), Aufzählung mit •.
- **Sätze:** kurz, Leistung zuerst. Überschriften nennen das Produkt: „Geländer nach Maß“, „Treppen, Tore, Zäune“.
- **Schreibweise:** Satzanfang groß, normale deutsche Rechtschreibung. Die Wortmarke „menge“ steht klein; Rubriken im Sperrsatz versal („SCHLOSSEREI“, „LEISTUNGEN“).
- **Schaltflächen:** Verb oder Substantiv, knapp: „Angebot anfragen“, „Anfrage senden“, „Abbrechen“.
- **Fehlertexte:** höflich, mit Handlungsanweisung: „Bitte prüfen Sie die E-Mail-Adresse.“
- **Kleingedrucktes:** „Preise zzgl. MwSt.“ in `klein` / `tiefschwarz-gedaempft`.
- **Keine Emojis**, keine Ausrufezeichen-Werbung, keine Anglizismen wo es ein deutsches Wort gibt.

## VISUAL FOUNDATIONS
- **Farbe:** Viel Weiß und Blau, klare schwarze Schrift, Rot nur als Linie. `menge-blau #8dadd5` für große Flächen/Bänder, `blau-hell #e8eff8` für ruhige Kästen, `linie #c3d3e8` für dekorative Trenner. Text **immer** `tiefschwarz #231e20` — auch auf Blau (7,0:1). **Nie Weiß auf Blau** (2,3:1). Weiß nur auf Schwarz (Primärschaltfläche, Toast, Tooltip).
- **Der rote Strich (`signalrot #ed1b24`):** waagerecht, läuft von der linken Kante ins Bild; 16px bei großen Formaten, 4px in UI. Einmal pro Fläche. Keine roten Flächen, kein roter Fließtext. In UI dient er als aktiver Tab-Indikator, Fehlermarker unter Feldern und Dialog-Akzent.
- **Typografie:** ein humanistischer Grotesk in zwei Gesten — fett & dicht (Wortmarke, 900, Kleinschreibung) und versal weit gesperrt (Sperrsatz, 600, 0.5em). Texte: titel 40/44, zwischentitel 24/30, fliesstext 16/24, klein 13/18. Schrift: **Source Sans 3 als Ersatz** für die Logo-Schrift (Frutiger-artig).
- **Layout:** Seiten in **waagerechte, randabfallende Bänder** gegliedert — weißer Grund oben, `menge-blau`-Band darunter, wie im Logo. Seitenrand und Abschnittsabstand 48px; Blöcke 24px; Kasten-Innenabstand 16px; enge Elemente 8px.
- **Ecken:** Flächen, Bänder, Kästen, Karten, Dialoge eckig (0). Eingabefelder/Badges 2px; Schaltflächen 2px (max. 4px). Radios rund (Konvention).
- **Karten:** eckig, ohne Schatten. Drei Arten: weiß mit 1px `linie`-Rahmen, `blau-hell`-Fläche, `menge-blau`-Fläche. Klickbar: Rahmen wird schwarz, Titel unterstrichen.
- **Ränder:** Bedienelemente immer `tiefschwarz` (1px Felder, 2px Schaltflächen/Checkboxen). `linie` nur dekorativ.
- **Schatten / Tiefe:** flach. Keine Schatten außer `--shadow-float` für schwebende Ebenen (Dialog, Toast). Keine Verläufe, keine Transparenz-/Blur-Effekte; einzige Transparenz ist das Dialog-Overlay.
- **Hintergründe:** Volltonflächen. Keine Muster, Texturen oder Illustrationen. Bilder (falls vorhanden): echte Werkstatt-/Projektfotos, 3:2, randabfallend in Karten, max. 4px Rundung, natürliche Farben.
- **Hover:** Flächen dunkeln leicht ab (`menge-blau-hover`, `tiefschwarz-hover`), Kontur-Schaltflächen bekommen `blau-hell`, Text-Links verdicken die Unterstreichung.
- **Press:** 1px nach unten versetzt (translateY), keine Größenänderung.
- **Fokus:** 2px `tiefschwarz`-Outline mit 2px Abstand.
- **Animation:** zurückhaltend — nur Farbübergänge 120ms und Switch-Knopf 200ms, `cubic-bezier(.2,0,0,1)`. Keine Bounces, keine Einblend-Choreografien.
- **Logo:** immer als Datei. Bündig an eine Kante (Blau läuft nach rechts, Rot nach links) oder mit ≥48px Weißraum. Nie nachzeichnen, umfärben, verzerren. Keine einfarbige Variante vorhanden.

## ICONOGRAPHY
- Die Brand-Dateien enthalten keine Icons. Die **Website** nutzt einfache Flaticon/Freepik-PNG-Icons (Email, Phone, Pin, User, Checkmark-blue, Arrow-up) unter `https://www.schlosserei-menge.de/images/…` — im UI-Kit per Hotlink eingebunden (Download hier nicht möglich; bitte bei Bedarf Dateien liefern). Die Marke lebt sonst von Typografie, Farbband und Strich.
- In Komponenten werden nur minimale CSS-Formen genutzt (Select-Pfeil, Checkbox-Haken, „×“ als Schließen-Zeichen).
- Falls Icons nötig werden: **Ersatz-Empfehlung Lucide** (CDN `https://unpkg.com/lucide-static/`, Strich 2px, eckige Enden passen zum Charakter), in `tiefschwarz`, 20–24px. Dies ist eine Substitution, kein Markenbestandteil.
- Keine Emojis. Unicode nur für „×“, „·“ als Trenner und „→“ in Textlinks.

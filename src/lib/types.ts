export type Qualifikation = 'M' | 'F' | 'H' | 'A';
export type Art = 'Werkstatt' | 'Montage' | 'Intern';

/** Felder, die von der Rapportkarte kommen (Scan oder Hand). */
export interface Auftragsdaten {
  kundeNr: string;
  kunde: string;
  strasse: string;
  ort: string;
  tel: string;
  projekt: string;
  auftrag: string;
  auftragText: string;
  pos: string;
  posText: string;
}

export interface MaterialPos {
  id: string;
  nr: string;
  name: string;
  einheit: string;
  menge: number;
  quelle: 'Katalog' | 'Händisch';
}

export interface StundenPos {
  id: string;
  name: string;
  q: Qualifikation;
  datum: string; // TT.MM.JJJJ
  art: Art;
  std: number;
}

export interface Foto {
  id: string;
  /** Bezeichnung (Pflicht), z. B. „Pfosten unten links“ */
  name?: string;
  zeit: string; // HH:MM
  src: string; // JPEG-Data-URL, verkleinert
}

export interface Rapport extends Auftragsdaten {
  id: string;
  /** ISO-Datum (JJJJ-MM-TT) des Rapports. */
  datum: string;
  fromScan: boolean;
  /** Woher die Auftragsdaten stammen: QR-Code (verlässlich) oder Texterkennung (prüfen) */
  scanQuelle?: 'qr' | 'text';
  /** Kartenausschnitt des Scans zum Gegenprüfen (nur auf dem Gerät, nicht im Rapport) */
  scanBild?: string;
  arbeiten: string;
  bemerkungen: string;
  material: MaterialPos[];
  /** Ausdrücklich bestätigt: kein Material verbraucht */
  keinMaterial?: boolean;
  stunden: StundenPos[];
  /** Fahrzeit gesamt (Hin + Rück) in Stunden */
  fahrzeit?: number;
  /** Gefahrene Kilometer gesamt (Hin + Rück) */
  fahrKm?: number;
  /** Ausdrücklich bestätigt: keine Fahrt (z. B. Arbeit in der Werkstatt) */
  keineFahrt?: boolean;
  fotos: Foto[];
  sigAG: string | null;
  sigAN: string | null;
  agAbwesend: boolean;
}

export interface GesendeterRapport {
  id: string;
  gesendetAm: string; // ISO-Zeitstempel
  dateiname: string;
  rapport: Rapport;
}

export interface Profil {
  name: string;
  q: Qualifikation;
  standort: string;
}

export const QUALI_LANG: Record<Qualifikation, string> = { M: 'Meister', F: 'Facharbeiter', H: 'Helfer', A: 'Auszubildender' };
/** Auswahlknöpfe (kurze Beschriftung, passt zu viert in eine Zeile) */
export const QUALI_KNOEPFE: [Qualifikation, string][] = [
  ['M', 'Meister'],
  ['F', 'Facharb.'],
  ['H', 'Helfer'],
  ['A', 'Azubi'],
];
/** Legende im Rapport: „M = Meister, F = Facharbeiter, H = Helfer, A = Auszubildender“ */
export const QUALI_LEGENDE = (Object.keys(QUALI_LANG) as Qualifikation[]).map((k) => `${k} = ${QUALI_LANG[k]}`).join(', ');

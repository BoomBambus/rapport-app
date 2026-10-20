export type Qualifikation = 'M' | 'F' | 'H';
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
  zeit: string; // HH:MM
  src: string; // JPEG-Data-URL, verkleinert
}

export interface Rapport extends Auftragsdaten {
  id: string;
  /** ISO-Datum (JJJJ-MM-TT) des Rapports. */
  datum: string;
  fromScan: boolean;
  arbeiten: string;
  bemerkungen: string;
  material: MaterialPos[];
  stunden: StundenPos[];
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

export const QUALI_LANG: Record<Qualifikation, string> = { M: 'Meister', F: 'Facharbeiter', H: 'Helfer' };

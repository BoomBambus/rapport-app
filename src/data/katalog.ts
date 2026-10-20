// BEISPIELDATEN – der echte Materialstamm wird nachgereicht.
// Format je Artikel: Artikelnummer, Bezeichnung, Einheit, Kategorie.
export interface Artikel {
  nr: string;
  name: string;
  einheit: string;
  kat: string;
}

export const KATALOG: Artikel[] = [
  { nr: '100120', name: 'Flachstahl 40×5 S235', einheit: 'm', kat: 'Profile' },
  { nr: '100135', name: 'Winkelstahl 50×5 S235', einheit: 'm', kat: 'Profile' },
  { nr: '100210', name: 'Vierkantrohr 40×40×3', einheit: 'm', kat: 'Rohre' },
  { nr: '100224', name: 'Rundrohr 42,4×2,0', einheit: 'm', kat: 'Rohre' },
  { nr: '100260', name: 'Edelstahl-Handlauf Ø 42,4 V2A', einheit: 'm', kat: 'Rohre' },
  { nr: '100310', name: 'Blech 2 mm verzinkt', einheit: 'm²', kat: 'Bleche' },
  { nr: '100330', name: 'Tränenblech 5/7 mm', einheit: 'm²', kat: 'Bleche' },
  { nr: '200110', name: 'Sechskantschraube M10×30 8.8 verz.', einheit: 'Stk', kat: 'Befestigung' },
  { nr: '200140', name: 'Schwerlastanker M12×110', einheit: 'Stk', kat: 'Befestigung' },
  { nr: '200160', name: 'Injektionsmörtel 300 ml', einheit: 'Stk', kat: 'Befestigung' },
  { nr: '300110', name: 'Schweißdraht SG2 Ø 1,0', einheit: 'kg', kat: 'Verbrauch' },
  { nr: '300120', name: 'Trennscheibe 125×1,0', einheit: 'Stk', kat: 'Verbrauch' },
  { nr: '300150', name: 'Zinkstaubgrundierung', einheit: 'l', kat: 'Verbrauch' },
];

export const KATEGORIEN = ['Alle', 'Profile', 'Rohre', 'Bleche', 'Befestigung', 'Verbrauch'];
export const EINHEITEN = ['Stk', 'm', 'm²', 'kg', 'l', 'Psch'];

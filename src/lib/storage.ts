// Lokale Ablage im Browser (IndexedDB): Entwurf, gesendete Rapporte, Profil.
// Fotos und Unterschriften sind Data-URLs – deshalb IndexedDB statt localStorage.
import { createStore, get, set, del } from 'idb-keyval';
import type { GesendeterRapport, Profil, Rapport } from './types';

const store = createStore('rapport-app', 'kv');
const AUFBEWAHRUNG_TAGE = 14;

export const loadEntwurf = () => get<Rapport>('entwurf', store);
export const saveEntwurf = (r: Rapport | null) => (r ? set('entwurf', r, store) : del('entwurf', store));

export async function loadGesendet(): Promise<GesendeterRapport[]> {
  const list = (await get<GesendeterRapport[]>('gesendet', store)) ?? [];
  const grenze = Date.now() - AUFBEWAHRUNG_TAGE * 864e5;
  return list.filter((g) => new Date(g.gesendetAm).getTime() > grenze);
}
export const saveGesendet = (list: GesendeterRapport[]) => set('gesendet', list, store);

export const loadProfil = () => get<Profil>('profil', store);
export const saveProfil = (p: Profil) => set('profil', p, store);

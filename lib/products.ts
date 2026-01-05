import type { FelgaProdukt } from './felgi-data';

export interface Produkt {
  id: number;
  name: string;
  producent: string;
  kategoria: 'felgi' | 'opony' | 'akcesoria';
  rozmiar?: string;
  szerokosc?: string;
  srednica?: string;
  et?: string;
  otworow?: string;
  cena: number;
  cenaBazowa?: number;
  obrazek: string;
  typPojazdu: string;
  dostepnosc: boolean;
  opis?: string;
  parametry?: Record<string, string>;
  felgaData?: FelgaProdukt; // Dodatkowe dane dla felg z CSV
  felgaId?: string; // ID felgi z CSV do mapowania
}

export const produkty: Produkt[] = [];

export function getProduktById(id: number): Produkt | undefined {
  return produkty.find(p => p.id === id);
}

export function getProduktyByKategoria(kategoria: 'felgi' | 'opony' | 'akcesoria' | 'wszystkie'): Produkt[] {
  if (kategoria === 'wszystkie') {
    return produkty;
  }
  return produkty.filter(p => p.kategoria === kategoria);
}

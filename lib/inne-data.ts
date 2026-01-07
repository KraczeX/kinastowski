export interface OponaProdukt {
  id: string;
  indeks: string;
  kodProduktu: string;
  nazwa: string;
  producent: string;
  ilosc: number; // Ogólna ilość
  cenaBrutto: number;
  cenaNetto: number;
  srednica: string; // np. R17
  szerokosc: number;
  profil: number;
  sezon: string; // LETNIA, ZIMOWA, WIELOSEZONOWA
  indeksNosnosci: string;
  indeksPredkosci: string;
  klasa: string; // PREMIUM, MIDDLE, BUDGET
  model: string;
  przeznaczenie: string; // OSOBOWA / SUV, DOSTAWCZA
  ean?: string;
  waga?: number;
  rokProdukcji?: string;
  oponaBieznikowana?: string;
  oponaZWadaKosmetyczna?: string;
  oponaZDemontazu?: string;
  homologacja?: string;
  xl?: string; // XL-EXTRA LOAD
  dot?: string; // DOT2024
}

export interface FelgaInneProdukt {
  id: string;
  indeks: string;
  kodProduktu: string;
  nazwa: string;
  producent: string;
  ilosc: number; // Ogólna ilość
  cenaBrutto: number;
  cenaNetto: number;
  srednica: string; // np. 17"
  szerokosc: string; // np. 7"
  typ: string; // STALOWA, ALUMINIOWA
  model: string;
  przeznaczenie: string; // OSOBOWE
  rozstawSrub: string; // np. 5X108
  et: string; // np. ET46/65
  otworCentralny: string; // np. 65
  ean?: string;
  waga?: number;
}

// Funkcja do parsowania CSV z pliku inne.csv
export function parseInneCSV(csvContent: string): { opony: OponaProdukt[], felgi: FelgaInneProdukt[] } {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return { opony: [], felgi: [] };

  const headers = lines[0].split(';').map(h => h.trim());
  
  // Mapowanie indeksów kolumn
  const getIndex = (name: string) => headers.findIndex(h => h.includes(name));
  
  const lpIdx = getIndex('LP');
  const indeksIdx = getIndex('Indeks');
  const kodProduktuIdx = getIndex('Kod produktu');
  const nazwaIdx = getIndex('Nazwa');
  const iloscIdx = getIndex('Ilość');
  const cenaBruttoIdx = getIndex('Cena katalogowa brutto');
  const cenaNettoIdx = getIndex('Cena katalogowa netto');
  const asortymentIdx = getIndex('Asortyment');
  const producentIdx = getIndex('Producent');
  const srednicaIdx = getIndex('Średnica');
  const szerokoscIdx = getIndex('Szerokość');
  const profilIdx = getIndex('Profil');
  const sezonIdx = getIndex('Sezon');
  const indeksNosnosciIdx = getIndex('Indeks nośności');
  const indeksPredkosciIdx = getIndex('Indeks prędkości');
  const klasaIdx = getIndex('Klasa');
  const modelIdx = getIndex('Model');
  const przeznaczenieIdx = getIndex('Przeznaczenie');
  const rozstawSrubIdx = getIndex('Rozstaw śrub');
  const etIdx = getIndex('ET');
  const otworCentralnyIdx = getIndex('Otwór centralny');
  const eanIdx = getIndex('EAN1');
  const wagaIdx = getIndex('Waga');
  const rokProdukcjiIdx = getIndex('Rok produkcji');
  const oponaBieznikowanaIdx = getIndex('Opona bieżnikowana');
  const oponaZWadaKosmetycznaIdx = getIndex('Opona z wadą kosmetyczną');
  const oponaZDemontazuIdx = getIndex('Opona z demontażu');
  const homologacjaIdx = getIndex('Homologacja');
  const xlIdx = getIndex('Opona wzmacniana');
  const dotIdx = getIndex('Rok produkcji'); // DOT jest w kolumnie "Rok produkcji"

  const opony: OponaProdukt[] = [];
  const felgi: FelgaInneProdukt[] = [];

  // Funkcja pomocnicza do parsowania wartości CSV (obsługuje cudzysłowy)
  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ';' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  // Parsuj każdy wiersz
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    
    const parseNumber = (idx: number, def: number = 0) => {
      if (idx === -1 || idx >= values.length || !values[idx] || values[idx].trim() === '' || values[idx] === '-') return def;
      const val = values[idx].replace(',', '.').trim().replace(/^"|"$/g, '');
      const parsed = parseFloat(val);
      return isNaN(parsed) ? def : parsed;
    };

    const parseString = (idx: number) => {
      if (idx === -1 || idx >= values.length || !values[idx]) return '';
      return values[idx].trim().replace(/^"|"$/g, '');
    };
    
    const asortyment = parseString(asortymentIdx);
    const indeks = parseString(indeksIdx);
    const kodProduktu = parseString(kodProduktuIdx);
    const nazwa = parseString(nazwaIdx);
    const producent = parseString(producentIdx);
    const ilosc = parseNumber(iloscIdx);
    const cenaBrutto = parseNumber(cenaBruttoIdx);
    const cenaNetto = parseNumber(cenaNettoIdx);
    const srednica = parseString(srednicaIdx);
    const szerokosc = parseNumber(szerokoscIdx);
    const ean = parseString(eanIdx);
    const waga = parseNumber(wagaIdx);

    // Pomiń jeśli brakuje kluczowych danych
    if (!asortyment || !producent || !nazwa || ilosc === 0) continue;

    if (asortyment === 'OPONY') {
      const profil = parseNumber(profilIdx);
      const sezon = parseString(sezonIdx);
      const indeksNosnosci = parseString(indeksNosnosciIdx);
      const indeksPredkosci = parseString(indeksPredkosciIdx);
      const klasa = parseString(klasaIdx);
      const model = parseString(modelIdx);
      const przeznaczenie = parseString(przeznaczenieIdx);
      const rokProdukcji = parseString(rokProdukcjiIdx);
      const oponaBieznikowana = parseString(oponaBieznikowanaIdx);
      const oponaZWadaKosmetyczna = parseString(oponaZWadaKosmetycznaIdx);
      const oponaZDemontazu = parseString(oponaZDemontazuIdx);
      const homologacja = parseString(homologacjaIdx);
      const xl = parseString(xlIdx);
      
      // Sprawdź czy DOT jest w roku produkcji
      const dot = rokProdukcji && rokProdukcji.includes('DOT') ? rokProdukcji : '';

      opony.push({
        id: `${producent}_${model}_${srednica}_${szerokosc}_${profil}_${indeksNosnosci}_${indeksPredkosci}`.replace(/[^a-zA-Z0-9_]/g, '_'),
        indeks,
        kodProduktu,
        nazwa,
        producent,
        ilosc,
        cenaBrutto,
        cenaNetto,
        srednica,
        szerokosc,
        profil,
        sezon,
        indeksNosnosci,
        indeksPredkosci,
        klasa,
        model,
        przeznaczenie,
        ean: ean || undefined,
        waga: waga || undefined,
        rokProdukcji: rokProdukcji || undefined,
        oponaBieznikowana: oponaBieznikowana || undefined,
        oponaZWadaKosmetyczna: oponaZWadaKosmetyczna || undefined,
        oponaZDemontazu: oponaZDemontazu || undefined,
        homologacja: homologacja || undefined,
        xl: xl || undefined,
        dot: dot || undefined,
      });
    } else if (asortyment === 'FELGA') {
      const typ = parseString(getIndex('Typ'));
      const model = parseString(modelIdx);
      const przeznaczenie = parseString(przeznaczenieIdx);
      const rozstawSrub = parseString(rozstawSrubIdx);
      const et = parseString(etIdx);
      const otworCentralny = parseString(otworCentralnyIdx);
      
      // Parsuj średnicę i szerokość (mogą być w formacie "17""", "7""")
      const srednicaParsed = srednica.replace(/"/g, '').replace(/"/g, '');
      const szerokoscParsed = szerokosc > 0 ? szerokosc.toString().replace(/"/g, '') : parseString(szerokoscIdx).replace(/"/g, '');

      felgi.push({
        id: `${producent}_${model}_${srednicaParsed}_${szerokoscParsed}_${rozstawSrub}_${et}`.replace(/[^a-zA-Z0-9_]/g, '_'),
        indeks,
        kodProduktu,
        nazwa,
        producent,
        ilosc,
        cenaBrutto,
        cenaNetto,
        srednica: srednicaParsed,
        szerokosc: szerokoscParsed,
        typ,
        model,
        przeznaczenie,
        rozstawSrub,
        et,
        otworCentralny: otworCentralny.replace(',', '.'),
        ean: ean || undefined,
        waga: waga || undefined,
      });
    }
  }

  // Usuń duplikaty felg (te same parametry)
  const uniqueFelgi = new Map<string, FelgaInneProdukt>();
  felgi.forEach(felga => {
    const key = `${felga.producent}_${felga.model}_${felga.srednica}_${felga.szerokosc}_${felga.rozstawSrub}_${felga.et}_${felga.otworCentralny}`;
    if (!uniqueFelgi.has(key) || (uniqueFelgi.get(key)?.ilosc || 0) < felga.ilosc) {
      uniqueFelgi.set(key, felga);
    }
  });

  return {
    opony,
    felgi: Array.from(uniqueFelgi.values()),
  };
}


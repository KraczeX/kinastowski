export interface FelgaVariant {
  id: string; // @ID z CSV
  ean?: string;
  colorShort: string; // @COLOR_SHORT
  finishing: string; // @FINISHING (pełny opis koloru)
  stock1Day: number;
  stock4Days: number;
  price: number; // @SUGGESTED RETAIL PRICE GROSS
  b2bPricePLN: number; // @B2B PRICE PLN NET
  photo: string; // @PHOTO
  weight?: string; // @WEIGHT(grams)
  loading?: string; // @LOADING(kg)
  ballSeat?: string; // @BALL_SEAT (Kula/Stożek)
  rimConcavity?: string; // @RIM_CONCAVITY
}

export interface FelgaProdukt {
  id: string; // unikalne ID bazujące na modelu
  manufacturer: string; // @MANUFACTURER
  model: string; // @MODEL
  size: number; // @SIZE (średnica)
  width: number; // @WIDTH
  pcd: string; // @PCD (np. 5x112)
  pcd2?: string; // @PCD2
  et: number; // @ET
  cb: number; // @CB (średnica centrowania)
  variants: FelgaVariant[]; // warianty kolorów
  productionTechnology?: string; // @PRODUCTION_TECHNOLOGY
  oemCapFit?: string; // @OEM_CAP_FIT
  modelName: string; // @MODEL_NAME (pełna nazwa)
}

// Funkcja do parsowania CSV
export function parseCSV(csvContent: string): FelgaProdukt[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(';').map(h => h.trim());
  
  // Mapowanie indeksów kolumn
  const getIndex = (name: string) => headers.findIndex(h => h.includes(name));
  
  const idIdx = getIndex('@ID');
  const eanIdx = getIndex('@EAN');
  const manufacturerIdx = getIndex('@MANUFACTURER');
  const modelIdx = getIndex('@MODEL');
  const sizeIdx = getIndex('@SIZE');
  const widthIdx = getIndex('@WIDTH');
  const pcdIdx = getIndex('@PCD');
  const pcd2Idx = getIndex('@PCD2');
  const etIdx = getIndex('@ET');
  const cbIdx = getIndex('@CB');
  const colorShortIdx = getIndex('@COLOR_SHORT');
  const finishingIdx = getIndex('@FINISHING');
  const stock1DayIdx = getIndex('@STOCK_(1DAY)');
  const stock4DaysIdx = getIndex('@STOCK_(4DAYS)');
  const priceIdx = getIndex('@SUGGESTED RETAIL PRICE GROSS');
  const b2bPriceIdx = getIndex('@B2B PRICE PLN NET');
  const photoIdx = getIndex('@PHOTO');
  const weightIdx = getIndex('@WEIGHT');
  const loadingIdx = getIndex('@LOADING');
  const ballSeatIdx = getIndex('@BALL_SEAT');
  const rimConcavityIdx = getIndex('@RIM_CONCAVITY');
  const productionTechIdx = getIndex('@PRODUCTION_TECHNOLOGY');
  const oemCapFitIdx = getIndex('@OEM_CAP_FIT');
  const modelNameIdx = getIndex('@MODEL_NAME');

  const produktMap = new Map<string, FelgaProdukt>();

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

    const manufacturer = parseString(manufacturerIdx);
    const model = parseString(modelIdx);
    const size = parseNumber(sizeIdx);
    const width = parseNumber(widthIdx);
    const pcd = parseString(pcdIdx);
    const et = parseNumber(etIdx);
    const cb = parseNumber(cbIdx);
    const colorShort = parseString(colorShortIdx);
    const finishing = parseString(finishingIdx);
    const id = parseString(idIdx);
    const ean = parseString(eanIdx);
    const stock1Day = parseNumber(stock1DayIdx);
    const stock4Days = parseNumber(stock4DaysIdx);
    const price = parseNumber(priceIdx);
    const b2bPrice = parseNumber(b2bPriceIdx);
    const photo = parseString(photoIdx);
    const weight = parseString(weightIdx);
    const loading = parseString(loadingIdx);
    const ballSeat = parseString(ballSeatIdx);
    const rimConcavity = parseString(rimConcavityIdx);
    const productionTech = parseString(productionTechIdx);
    const oemCapFit = parseString(oemCapFitIdx);
    const modelName = parseString(modelNameIdx);

    // Pomiń jeśli brakuje kluczowych danych
    if (!manufacturer || !model || !size || !pcd) continue;

    // Klucz do grupowania - model + rozmiar + szerokość + PCD + ET + CB
    const groupKey = `${manufacturer}|${model}|${size}|${width}|${pcd}|${et}|${cb}`;

    if (!produktMap.has(groupKey)) {
      produktMap.set(groupKey, {
        id: groupKey.replace(/\|/g, '_').replace(/[^a-zA-Z0-9_]/g, '_'),
        manufacturer,
        model,
        size,
        width,
        pcd,
        pcd2: parseString(pcd2Idx) || undefined,
        et,
        cb,
        variants: [],
        productionTechnology: productionTech || undefined,
        oemCapFit: oemCapFit || undefined,
        modelName: modelName || `${manufacturer} ${model}`,
      });
    }

    const produkt = produktMap.get(groupKey)!;

    // Dodaj wariant
    produkt.variants.push({
      id,
      ean: ean || undefined,
      colorShort,
      finishing,
      stock1Day,
      stock4Days,
      price,
      b2bPricePLN: b2bPrice,
      photo,
      weight: weight || undefined,
      loading: loading || undefined,
      ballSeat: ballSeat || undefined,
      rimConcavity: rimConcavity || undefined,
    });
  }

  return Array.from(produktMap.values());
}

// Funkcje pomocnicze do filtrowania
export function getFelgiByManufacturer(felgi: FelgaProdukt[], manufacturer: string): FelgaProdukt[] {
  if (!manufacturer) return felgi;
  return felgi.filter(f => f.manufacturer.toLowerCase() === manufacturer.toLowerCase());
}

export function getFelgiBySize(felgi: FelgaProdukt[], size: number): FelgaProdukt[] {
  if (!size) return felgi;
  return felgi.filter(f => f.size === size);
}

export function getFelgiByPCD(felgi: FelgaProdukt[], pcd: string): FelgaProdukt[] {
  if (!pcd) return felgi;
  return felgi.filter(f => f.pcd === pcd);
}

export function getFelgiByET(felgi: FelgaProdukt[], et: number): FelgaProdukt[] {
  if (!et) return felgi;
  return felgi.filter(f => f.et === et);
}

export function getFelgiByPriceRange(felgi: FelgaProdukt[], min: number, max: number): FelgaProdukt[] {
  return felgi.filter(f => {
    const minPrice = Math.min(...f.variants.map(v => v.price));
    return minPrice >= min && minPrice <= max;
  });
}

export function searchFelgi(felgi: FelgaProdukt[], query: string): FelgaProdukt[] {
  if (!query) return felgi;
  const lowerQuery = query.toLowerCase();
  return felgi.filter(f => 
    f.manufacturer.toLowerCase().includes(lowerQuery) ||
    f.model.toLowerCase().includes(lowerQuery) ||
    f.modelName.toLowerCase().includes(lowerQuery)
  );
}


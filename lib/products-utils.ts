import { getProduktById as getProduktByIdStatic, type Produkt } from './products';
import type { FelgaProdukt } from './felgi-data';
import { getCommissionSettings } from './commission';
import { calculatePriceWithCustomCommission, getProductSetting } from './product-settings';

// Cache dla danych felg
let cachedFelgiData: FelgaProdukt[] | null = null;

async function loadFelgiData(): Promise<FelgaProdukt[]> {
  if (cachedFelgiData) {
    return cachedFelgiData;
  }

  try {
    const response = await fetch('/api/felgi');
    if (response.ok) {
      const data = await response.json();
      cachedFelgiData = Array.isArray(data) ? data : [];
      return cachedFelgiData;
    }
  } catch (error) {
    console.error('Błąd podczas ładowania danych felg:', error);
  }

  return [];
}

export async function getProduktById(id: number): Promise<Produkt | undefined> {
  // Produkty statyczne mają ID < 1000000
  if (id < 1000000) {
    return getProduktByIdStatic(id);
  }

  // Produkty z CSV mają ID >= 1000000
  const felgiData = await loadFelgiData();
  
  // Filtruj felgi z ceną > 0 i nie ukryte (tak samo jak w Sklep.tsx) - WAŻNE: ta sama kolejność!
  const felgiWithPrice = felgiData.filter(felga => {
    // Filtruj ukryte produkty
    const productSettings = getProductSetting(felga.id);
    if (productSettings.hidden) return false;
    
    // Filtruj produkty z ceną 0
    const cheapestVariant = felga.variants.reduce((prev, curr) => 
      prev.price < curr.price ? prev : curr
    );
    return cheapestVariant.price > 0;
  });
  
  const index = id - 1000000;
  
  if (index >= 0 && index < felgiWithPrice.length) {
    const felga = felgiWithPrice[index];
    const cheapestVariant = felga.variants.reduce((prev, curr) => 
      prev.price < curr.price ? prev : curr
    );
    const totalStock = felga.variants.reduce((sum, v) => sum + v.stock1Day + v.stock4Days, 0);
    const settings = getCommissionSettings();
    const basePrice = cheapestVariant.price;
    const priceWithCommission = calculatePriceWithCustomCommission(
      basePrice,
      felga.id,
      settings.globalCommission,
      settings.enabled
    );
    
    const productSettings = getProductSetting(felga.id);
    const isAvailable = productSettings.available !== false;

    return {
      id,
      name: `${felga.manufacturer} ${felga.model}`,
      producent: felga.manufacturer,
      kategoria: 'felgi' as const,
      rozmiar: `${felga.size}x${felga.width}`,
      szerokosc: felga.width.toString(),
      srednica: felga.size.toString(),
      et: `ET${felga.et}`,
      otworow: felga.pcd,
      cena: priceWithCommission,
      cenaBazowa: basePrice,
      obrazek: cheapestVariant.photo || '/felgi.jpg',
      typPojazdu: 'Osobowe',
      dostepnosc: isAvailable && totalStock > 0,
      opis: felga.modelName,
      parametry: {
        'CB': felga.cb.toString(),
        'Warianty kolorów': felga.variants.length.toString(),
      },
      felgaData: felga,
      felgaId: felga.id,
    };
  }

  return undefined;
}

export async function getProduktByFelgaId(felgaId: string): Promise<Produkt | undefined> {
  const felgiData = await loadFelgiData();
  
  // Next.js automatycznie dekoduje parametry URL, ale dla pewności spróbujmy oba
  const decodedId = decodeURIComponent(felgaId);
  
  // Znajdź felgę po ID - spróbuj najpierw z dekodowanym, potem bez
  let felga = felgiData.find(f => f.id === decodedId);
  
  if (!felga && decodedId !== felgaId) {
    felga = felgiData.find(f => f.id === felgaId);
  }
  
  if (!felga) {
    return undefined;
  }

  // Sprawdź czy ma cenę > 0
  const cheapestVariant = felga.variants.reduce((prev, curr) => 
    prev.price < curr.price ? prev : curr
  );
  
  if (cheapestVariant.price <= 0) {
    return undefined;
  }

  const totalStock = felga.variants.reduce((sum, v) => sum + v.stock1Day + v.stock4Days, 0);
  const settings = getCommissionSettings();
  const basePrice = cheapestVariant.price;
  const priceWithCommission = calculatePriceWithCustomCommission(
    basePrice,
    felga.id,
    settings.globalCommission,
    settings.enabled
  );
  
  const productSettings = getProductSetting(felga.id);
  const isAvailable = productSettings.available !== false;

  // Znajdź index w filtrowanej liście (dla spójności z getProduktById)
  const felgiWithPrice = felgiData.filter(f => {
    // Filtruj ukryte produkty
    const ps = getProductSetting(f.id);
    if (ps.hidden) return false;
    
    // Filtruj produkty z ceną 0
    const cheapest = f.variants.reduce((prev, curr) => 
      prev.price < curr.price ? prev : curr
    );
    return cheapest.price > 0;
  });
  const index = felgiWithPrice.findIndex(f => f.id === felgaId);
  const productId = index >= 0 ? 1000000 + index : 1000000;

  return {
    id: productId,
    name: `${felga.manufacturer} ${felga.model}`,
    producent: felga.manufacturer,
    kategoria: 'felgi' as const,
    rozmiar: `${felga.size}x${felga.width}`,
    szerokosc: felga.width.toString(),
    srednica: felga.size.toString(),
    et: `ET${felga.et}`,
    otworow: felga.pcd,
    cena: priceWithCommission,
    cenaBazowa: basePrice,
    obrazek: cheapestVariant.photo || '/felgi.jpg',
    typPojazdu: 'Osobowe',
    dostepnosc: isAvailable && totalStock > 0,
    opis: felga.modelName,
    parametry: {
      'CB': felga.cb.toString(),
      'Warianty kolorów': felga.variants.length.toString(),
    },
    felgaData: felga,
    felgaId: felga.id,
  };
}

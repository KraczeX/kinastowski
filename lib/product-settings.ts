export interface ProductSettings {
  customCommission?: number; // Custom prowizja w % (nadpisuje globalną)
  available?: boolean; // Dostępność produktu
  hidden?: boolean; // Czy produkt jest ukryty
}

export interface ProductSettingsMap {
  [productId: string]: ProductSettings;
}

const PRODUCT_SETTINGS_STORAGE_KEY = 'productSettings';

export function getProductSettings(): ProductSettingsMap {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const saved = localStorage.getItem(PRODUCT_SETTINGS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Błąd podczas ładowania ustawień produktów:', e);
  }

  return {};
}

export function getProductSetting(productId: string): ProductSettings {
  const allSettings = getProductSettings();
  return allSettings[productId] || {};
}

export function setProductSetting(productId: string, settings: ProductSettings): void {
  if (typeof window === 'undefined') return;

  try {
    const allSettings = getProductSettings();
    allSettings[productId] = { ...allSettings[productId], ...settings };
    localStorage.setItem(PRODUCT_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
    window.dispatchEvent(new Event('productSettingsChanged'));
  } catch (e) {
    console.error('Błąd podczas zapisywania ustawień produktu:', e);
  }
}

export function removeProductSetting(productId: string, key: keyof ProductSettings): void {
  if (typeof window === 'undefined') return;

  try {
    const allSettings = getProductSettings();
    if (allSettings[productId]) {
      delete allSettings[productId][key];
      // Jeśli obiekt jest pusty, usuń go całkowicie
      if (Object.keys(allSettings[productId]).length === 0) {
        delete allSettings[productId];
      }
      localStorage.setItem(PRODUCT_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
      window.dispatchEvent(new Event('productSettingsChanged'));
    }
  } catch (e) {
    console.error('Błąd podczas usuwania ustawień produktu:', e);
  }
}

export function calculatePriceWithCustomCommission(
  basePrice: number,
  productId: string,
  globalCommission: number,
  globalCommissionEnabled: boolean
): number {
  const productSettings = getProductSetting(productId);
  
  // Jeśli produkt ma customową prowizję, użyj jej
  if (productSettings.customCommission !== undefined) {
    return Math.round(basePrice * (1 + productSettings.customCommission / 100));
  }
  
  // W przeciwnym razie użyj globalnej
  if (globalCommissionEnabled && globalCommission > 0) {
    return Math.round(basePrice * (1 + globalCommission / 100));
  }
  
  return basePrice;
}



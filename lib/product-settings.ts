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

export async function setProductSetting(productId: string, settings: ProductSettings): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Najpierw zapisz do localStorage (dla szybkości)
    const allSettings = getProductSettings();
    allSettings[productId] = { ...allSettings[productId], ...settings };
    localStorage.setItem(PRODUCT_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
    window.dispatchEvent(new Event('productSettingsChanged'));

    // Potem zsynchronizuj z API (w tle)
    try {
      const response = await fetch('/api/settings/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, settings }),
      });
      if (!response.ok) {
        console.warn('Nie udało się zapisać ustawień do API, ale zapisano lokalnie');
      }
    } catch (error) {
      console.warn('Błąd podczas zapisywania ustawień do API, ale zapisano lokalnie:', error);
    }
  } catch (e) {
    console.error('Błąd podczas zapisywania ustawień produktu:', e);
  }
}

export async function removeProductSetting(productId: string, key: keyof ProductSettings): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Najpierw usuń z localStorage
    const allSettings = getProductSettings();
    if (allSettings[productId]) {
      delete allSettings[productId][key];
      if (Object.keys(allSettings[productId]).length === 0) {
        delete allSettings[productId];
      }
      localStorage.setItem(PRODUCT_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
      window.dispatchEvent(new Event('productSettingsChanged'));
    }

    // Potem zsynchronizuj z API (w tle)
    try {
      const response = await fetch(`/api/settings/product/${encodeURIComponent(productId)}?key=${key}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.warn('Nie udało się usunąć ustawień z API, ale usunięto lokalnie');
      }
    } catch (error) {
      console.warn('Błąd podczas usuwania ustawień z API, ale usunięto lokalnie:', error);
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

// Funkcja do synchronizacji z API (wywołana w komponentach przy starcie)
export async function syncProductSettingsFromAPI(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const response = await fetch('/api/settings/product', {
      cache: 'no-store',
    });
    if (response.ok) {
      const apiSettings = await response.json();
      // Zapisz do localStorage (merge z istniejącymi lokalnymi zmianami)
      const localSettings = getProductSettings();
      const merged = { ...apiSettings, ...localSettings };
      localStorage.setItem(PRODUCT_SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event('productSettingsChanged'));
    }
  } catch (error) {
    console.error('Błąd podczas synchronizacji ustawień z API:', error);
  }
}

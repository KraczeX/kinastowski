export interface CommissionSettings {
  globalCommission: number; // Prowizja w %
  enabled: boolean;
}

export function getCommissionSettings(): CommissionSettings {
  if (typeof window === 'undefined') {
    return { globalCommission: 0, enabled: false };
  }

  try {
    const saved = localStorage.getItem('globalCommission');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Błąd podczas ładowania ustawień prowizji:', e);
  }

  return { globalCommission: 0, enabled: false };
}

export async function setCommissionSettings(settings: CommissionSettings): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Najpierw zapisz do localStorage (dla szybkości)
    localStorage.setItem('globalCommission', JSON.stringify(settings));
    window.dispatchEvent(new Event('commissionSettingsChanged'));

    // Potem zsynchronizuj z API (w tle)
    try {
      const response = await fetch('/api/settings/commission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        console.warn('Nie udało się zapisać ustawień prowizji do API, ale zapisano lokalnie');
      }
    } catch (error) {
      console.warn('Błąd podczas zapisywania ustawień prowizji do API, ale zapisano lokalnie:', error);
    }
  } catch (e) {
    console.error('Błąd podczas zapisywania ustawień prowizji:', e);
  }
}

export function calculatePriceWithCommission(basePrice: number): number {
  if (typeof window === 'undefined') {
    return basePrice;
  }

  const settings = getCommissionSettings();
  if (!settings.enabled || settings.globalCommission === 0) {
    return basePrice;
  }

  return Math.round(basePrice * (1 + settings.globalCommission / 100));
}

// Funkcja do synchronizacji z API (wywołana w komponentach przy starcie)
export async function syncCommissionSettingsFromAPI(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const response = await fetch('/api/settings/commission', {
      cache: 'no-store',
    });
    if (response.ok) {
      const apiSettings = await response.json();
      // Zapisz do localStorage
      localStorage.setItem('globalCommission', JSON.stringify(apiSettings));
      window.dispatchEvent(new Event('commissionSettingsChanged'));
    }
  } catch (error) {
    console.error('Błąd podczas synchronizacji ustawień prowizji z API:', error);
  }
}

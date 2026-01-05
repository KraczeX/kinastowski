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



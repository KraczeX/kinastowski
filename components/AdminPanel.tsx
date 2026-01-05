'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { FelgaProdukt } from '@/lib/felgi-data';
import { getProductSetting, setProductSetting, calculatePriceWithCustomCommission, removeProductSetting } from '@/lib/product-settings';

interface CommissionSettings {
  globalCommission: number;
  enabled: boolean;
}

interface EditProductModalProps {
  product: FelgaProdukt | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  globalCommission: number;
  globalCommissionEnabled: boolean;
}

function EditProductModal({ product, isOpen, onClose, onSave, globalCommission, globalCommissionEnabled }: EditProductModalProps) {
  const [customCommission, setCustomCommission] = useState<string>('');
  const [available, setAvailable] = useState<boolean>(true);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      const settings = getProductSetting(product.id);
      setCustomCommission(settings.customCommission?.toString() || '');
      
      // Jeśli ustawienie available jest jawnie ustawione, użyj go
      // W przeciwnym razie sprawdź stan magazynowy (tak jak w tabeli)
      if (settings.available !== undefined) {
        setAvailable(settings.available);
      } else {
        const totalStock = product.variants.reduce((sum, v) => sum + v.stock1Day + v.stock4Days, 0);
        setAvailable(totalStock > 0); // Jeśli brak stanu, produkt jest niedostępny
      }
      
      setHidden(settings.hidden || false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = () => {
    // Obsługa customowej prowizji
    if (customCommission.trim() !== '') {
      const commissionValue = parseFloat(customCommission);
      if (!isNaN(commissionValue)) {
        // Zapisz customową prowizję
        setProductSetting(product.id, { customCommission: commissionValue });
      }
    } else {
      // Jeśli puste, usuń customową prowizję używając removeProductSetting
      const currentSettings = getProductSetting(product.id);
      if (currentSettings.customCommission !== undefined) {
        removeProductSetting(product.id, 'customCommission');
      }
    }
    
    // Zapisz dostępność i ukrycie - używamy setProductSetting które robi merge
    setProductSetting(product.id, {
      available: available,
      hidden: hidden,
    });
    
    // Wywołaj callback aby odświeżyć dane
    onSave();
    onClose();
  };

  const minPrice = Math.min(...product.variants.map(v => v.price));
  const currentPrice = customCommission.trim() !== '' && !isNaN(parseFloat(customCommission))
    ? calculatePriceWithCustomCommission(minPrice, product.id, globalCommission, globalCommissionEnabled)
    : calculatePriceWithCustomCommission(minPrice, product.id, globalCommission, globalCommissionEnabled);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edytuj produkt</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{product.manufacturer} {product.model}</h3>
              <p className="text-white/60 text-sm">
                Rozmiar: {product.size}" x {product.width} | PCD: {product.pcd} | ET: {product.et}
              </p>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">
                Customowa prowizja (%)
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  min="-100"
                  max="100"
                  step="0.1"
                  value={customCommission}
                  onChange={(e) => setCustomCommission(e.target.value)}
                  placeholder="Pozostaw puste aby użyć globalnej"
                  className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 w-full"
                />
                <p className="text-white/40 text-xs">
                  {customCommission.trim() === '' 
                    ? `Używana jest globalna prowizja (${globalCommissionEnabled ? globalCommission + '%' : 'wyłączona'})`
                    : `Nadpisuje globalną prowizję. Cena min: ${currentPrice} zł (bazowa: ${minPrice} zł)`
                  }
                </p>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/20"
                />
                <span>Produkt dostępny</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/20"
                />
                <span>Ukryj produkt w sklepie</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-white text-black hover:bg-white/90 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Zapisz
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [felgiData, setFelgiData] = useState<FelgaProdukt[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>({
    globalCommission: 0,
    enabled: false,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterManufacturer, setFilterManufacturer] = useState<string>('');
  const [filterSize, setFilterSize] = useState<string>('');
  const [filterAvailability, setFilterAvailability] = useState<string>(''); // 'all' | 'available' | 'unavailable' | 'hidden'
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingProduct, setEditingProduct] = useState<FelgaProdukt | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const productsPerPage = 50;

  useEffect(() => {
    const authStatus = localStorage.getItem('adminLoggedIn');
    if (authStatus !== 'true') {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);

    const savedCommission = localStorage.getItem('globalCommission');
    if (savedCommission) {
      try {
        const settings = JSON.parse(savedCommission);
        setCommissionSettings(settings);
      } catch (e) {
        console.error('Błąd podczas ładowania ustawień prowizji:', e);
      }
    }

    loadFelgiData();

    // Synchronizuj ustawienia z API przy starcie
    const syncSettings = async () => {
      const { syncCommissionSettingsFromAPI } = await import('@/lib/commission');
      const { syncProductSettingsFromAPI } = await import('@/lib/product-settings');
      await Promise.all([
        syncCommissionSettingsFromAPI(),
        syncProductSettingsFromAPI(),
      ]);
      // Po synchronizacji załaduj ustawienia prowizji
      const savedCommission = localStorage.getItem('globalCommission');
      if (savedCommission) {
        try {
          const settings = JSON.parse(savedCommission);
          setCommissionSettings(settings);
        } catch (e) {
          console.error('Błąd podczas ładowania ustawień prowizji:', e);
        }
      }
    };
    syncSettings();

    // Nasłuchuj zmian w ustawieniach produktów
    const handleProductSettingsChange = () => {
      loadFelgiData();
    };
    window.addEventListener('productSettingsChanged', handleProductSettingsChange);
    return () => window.removeEventListener('productSettingsChanged', handleProductSettingsChange);
  }, [router]);

  const loadFelgiData = async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/felgi');
      if (response.ok) {
        const data = await response.json();
        setFelgiData(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Błąd podczas ładowania danych felg:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  const handleSaveCommission = async () => {
    const { setCommissionSettings } = await import('@/lib/commission');
    await setCommissionSettings(commissionSettings);
    alert('Ustawienia prowizji zostały zapisane!');
  };

  // Unikalne wartości dla filtrów
  const uniqueManufacturers = useMemo(() => {
    return Array.from(new Set(felgiData.map(f => f.manufacturer))).sort();
  }, [felgiData]);

  const uniqueSizes = useMemo(() => {
    return Array.from(new Set(felgiData.map(f => `${f.size}" x ${f.width}`))).sort((a, b) => {
      const aMatch = a.match(/(\d+)"/);
      const bMatch = b.match(/(\d+)"/);
      if (aMatch && bMatch) {
        return parseInt(aMatch[1]) - parseInt(bMatch[1]);
      }
      return a.localeCompare(b);
    });
  }, [felgiData]);

  const filteredProducts = useMemo(() => {
    let filtered = felgiData;

    // Wyszukiwarka
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(felga => {
        const manufacturer = felga.manufacturer.toLowerCase();
        const model = felga.model.toLowerCase();
        const modelName = felga.modelName?.toLowerCase() || '';
        const size = `${felga.size}x${felga.width}`.toLowerCase();
        const pcd = felga.pcd.toLowerCase();
        
        return manufacturer.includes(query) ||
               model.includes(query) ||
               modelName.includes(query) ||
               size.includes(query) ||
               pcd.includes(query);
      });
    }

    // Filtrowanie po producencie
    if (filterManufacturer) {
      filtered = filtered.filter(felga => felga.manufacturer === filterManufacturer);
    }

    // Filtrowanie po rozmiarze
    if (filterSize) {
      const [size, width] = filterSize.split('" x ');
      filtered = filtered.filter(felga => 
        felga.size.toString() === size && felga.width.toString() === width
      );
    }

    // Filtrowanie po dostępności - używamy tej samej logiki co w sklepie
    if (filterAvailability && filterAvailability !== 'all') {
      filtered = filtered.filter(felga => {
        const productSettings = getProductSetting(felga.id);
        const totalStock = felga.variants.reduce((sum, v) => sum + v.stock1Day + v.stock4Days, 0);
        const isAvailable = productSettings.available !== false;
        const isActuallyAvailable = isAvailable && totalStock > 0 && !productSettings.hidden;
        
        switch (filterAvailability) {
          case 'available':
            return isActuallyAvailable;
          case 'unavailable':
            // Niedostępne: ukryte LUB dostępność false LUB brak stanu
            return productSettings.hidden || !isAvailable || totalStock === 0;
          case 'hidden':
            return productSettings.hidden === true;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [felgiData, searchQuery, filterManufacturer, filterSize, filterAvailability]);

  // Paginacja
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Resetuj stronę gdy zmieniają się filtry
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterManufacturer, filterSize, filterAvailability]);

  const handleEditProduct = (product: FelgaProdukt) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = () => {
    // Odśwież dane - wymuś re-render komponentu
    setFelgiData([...felgiData]);
    // Event już został wywołany przez setProductSetting, więc komponenty się odświeżą
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Panel Administracyjny</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Wyloguj
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-white/60 text-sm mb-2">Łączna liczba produktów</h3>
              <p className="text-4xl font-bold text-white">{felgiData.length.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-white/60 text-sm mb-2">Łączna liczba wariantów</h3>
              <p className="text-4xl font-bold text-white">
                {felgiData.reduce((sum, f) => sum + f.variants.length, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-white/60 text-sm mb-2">Znaleziono produktów</h3>
              <p className="text-4xl font-bold text-white">{filteredProducts.length.toLocaleString()}</p>
            </div>
          </div>

          {/* Commission Settings */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Globalne Prowizje</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={commissionSettings.enabled}
                    onChange={(e) =>
                      setCommissionSettings({
                        ...commissionSettings,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/20"
                  />
                  <span className="text-lg">Włącz globalną prowizję</span>
                </label>
              </div>

              {commissionSettings.enabled && (
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Prowizja (%)
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={commissionSettings.globalCommission}
                      onChange={(e) =>
                        setCommissionSettings({
                          ...commissionSettings,
                          globalCommission: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 w-32"
                    />
                    <span className="text-white/60">%</span>
                    <button
                      onClick={handleSaveCommission}
                      className="bg-white text-black hover:bg-white/90 px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Zapisz
                    </button>
                  </div>
                  <p className="text-sm text-white/60 mt-2">
                    Prowizja zostanie dodana do wszystkich cen produktów w sklepie (chyba że produkt ma customową prowizję).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold">Lista Produktów</h2>
                <div className="w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj produktu..."
                    className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 w-full sm:w-80"
                  />
                </div>
              </div>

              {/* Filtry */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Producent
                  </label>
                  <select
                    value={filterManufacturer}
                    onChange={(e) => setFilterManufacturer(e.target.value)}
                    className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 w-full"
                  >
                    <option value="">Wszyscy producenci</option>
                    {uniqueManufacturers.map(manufacturer => (
                      <option key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Rozmiar
                  </label>
                  <select
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
                    className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 w-full"
                  >
                    <option value="">Wszystkie rozmiary</option>
                    {uniqueSizes.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Dostępność
                  </label>
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value)}
                    className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 w-full"
                  >
                    <option value="all">Wszystkie</option>
                    <option value="available">Dostępne</option>
                    <option value="unavailable">Niedostępne</option>
                    <option value="hidden">Ukryte</option>
                  </select>
                </div>
              </div>

              {/* Przycisk wyczyść filtry */}
              {(filterManufacturer || filterSize || filterAvailability) && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setFilterManufacturer('');
                      setFilterSize('');
                      setFilterAvailability('');
                    }}
                    className="text-white/60 hover:text-white text-sm underline"
                  >
                    Wyczyść filtry
                  </button>
                </div>
              )}
            </div>

            {loadingData ? (
              <div className="text-center py-12 text-white/60">
                Ładowanie produktów...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                {searchQuery || filterManufacturer || filterSize || filterAvailability ? 'Nie znaleziono produktów' : 'Brak produktów'}
              </div>
            ) : (
              <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">
                        Producent
                      </th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">
                        Model
                      </th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">
                        Rozmiar
                      </th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">
                        Warianty
                      </th>
                      <th className="text-right py-3 px-4 text-white/60 text-sm font-semibold">
                        Cena min
                      </th>
                      <th className="text-right py-3 px-4 text-white/60 text-sm font-semibold">
                        Cena max
                      </th>
                      <th className="text-center py-3 px-4 text-white/60 text-sm font-semibold">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-white/60 text-sm font-semibold">
                        Akcje
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((felga) => {
                      const minPrice = Math.min(...felga.variants.map(v => v.price));
                      const maxPrice = Math.max(...felga.variants.map(v => v.price));
                      
                      const productSettings = getProductSetting(felga.id);
                      const minPriceWithCommission = calculatePriceWithCustomCommission(
                        minPrice,
                        felga.id,
                        commissionSettings.globalCommission,
                        commissionSettings.enabled
                      );
                      const maxPriceWithCommission = calculatePriceWithCustomCommission(
                        maxPrice,
                        felga.id,
                        commissionSettings.globalCommission,
                        commissionSettings.enabled
                      );

                      const hasCustomCommission = productSettings.customCommission !== undefined;
                      const totalStock = felga.variants.reduce((sum, v) => sum + v.stock1Day + v.stock4Days, 0);
                      const isAvailableSetting = productSettings.available !== false;
                      // Ta sama logika co w sklepie: dostępny = ustawienie OK + stan > 0 + nie ukryty
                      const isAvailable = isAvailableSetting && totalStock > 0 && !productSettings.hidden;
                      const isHidden = productSettings.hidden === true;

                      return (
                        <tr
                          key={felga.id}
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                            isHidden ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="py-3 px-4 text-white">{felga.manufacturer}</td>
                          <td className="py-3 px-4 text-white">{felga.model}</td>
                          <td className="py-3 px-4 text-white">
                            {felga.size}" x {felga.width}
                          </td>
                          <td className="py-3 px-4 text-white/80">
                            {felga.variants.length}
                          </td>
                          <td className="py-3 px-4 text-right text-white">
                            <div>
                              {hasCustomCommission && (
                                <div className="text-xs text-yellow-400 mb-1">
                                  Custom: {productSettings.customCommission}%
                                </div>
                              )}
                              <div className="line-through text-white/40 text-sm">
                                {minPrice} zł
                              </div>
                              <div className="font-semibold">
                                {minPriceWithCommission} zł
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-white">
                            <div>
                              <div className="line-through text-white/40 text-sm">
                                {maxPrice} zł
                              </div>
                              <div className="font-semibold">
                                {maxPriceWithCommission} zł
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col gap-1 items-center">
                              {isAvailable ? (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                  Dostępny
                                </span>
                              ) : (
                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                  Niedostępny
                                </span>
                              )}
                              {isHidden && (
                                <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                                  Ukryty
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleEditProduct(felga)}
                              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                            >
                              Edytuj
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginacja */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-white/60 text-sm">
                    Strona {currentPage} z {totalPages} ({filteredProducts.length} produktów)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Poprzednia
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                              currentPage === pageNum
                                ? 'bg-white text-black'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Następna
                    </button>
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        </div>
      </div>

      <EditProductModal
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProduct}
        globalCommission={commissionSettings.globalCommission}
        globalCommissionEnabled={commissionSettings.enabled}
      />
    </div>
  );
}

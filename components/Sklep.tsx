'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { produkty, getProduktyByKategoria, type Produkt } from '@/lib/products';
import { type FelgaProdukt } from '@/lib/felgi-data';
import { getCommissionSettings } from '@/lib/commission';
import { calculatePriceWithCustomCommission, getProductSetting } from '@/lib/product-settings';

type Kategoria = 'felgi' | 'opony' | 'akcesoria' | 'wszystkie';
type SortOption = 'cena-asc' | 'cena-desc' | 'nazwa-asc' | 'nazwa-desc' | 'producent-asc' | 'producent-desc';

interface SklepProps {
  kategoria?: string;
}

export default function Sklep({ kategoria: kategoriaProp }: SklepProps) {
  const pathname = usePathname();
  
  // Wyciągnij kategorię z URL
  const getKategoriaFromPath = (): Kategoria => {
    if (kategoriaProp) {
      return (kategoriaProp as Kategoria) || 'wszystkie';
    }
    
    const path = pathname || '';
    if (path === '/sklep') return 'wszystkie';
    if (path.startsWith('/sklep/felgi')) return 'felgi';
    if (path.startsWith('/sklep/opony')) return 'opony';
    if (path.startsWith('/sklep/akcesoria')) return 'akcesoria';
    return 'wszystkie';
  };

  const selectedKategoria = getKategoriaFromPath();
  
  // Funkcja do ładowania filtrów z sessionStorage
  const loadFiltersFromStorage = () => {
    if (typeof window === 'undefined') {
      return {
        selectedSrednica: '',
        selectedProducent: '',
        selectedTypPojazdu: '',
        selectedDostepnosc: '',
        selectedPcd: '',
        selectedCb: '',
        selectedEt: '',
        selectedWidth: '',
        priceRange: [0, 5000] as [number, number],
        priceInputs: ['', '5000'] as [string, string],
        sortBy: 'cena-asc' as SortOption,
      };
    }
    
    try {
      const saved = sessionStorage.getItem('sklep-filters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          selectedSrednica: parsed.selectedSrednica || '',
          selectedProducent: parsed.selectedProducent || '',
          selectedTypPojazdu: parsed.selectedTypPojazdu || '',
          selectedDostepnosc: parsed.selectedDostepnosc || '',
          selectedPcd: parsed.selectedPcd || '',
          selectedCb: parsed.selectedCb || '',
          selectedEt: parsed.selectedEt || '',
          selectedWidth: parsed.selectedWidth || '',
          priceRange: parsed.priceRange || [0, 5000],
          priceInputs: parsed.priceInputs || ['', '5000'],
          sortBy: parsed.sortBy || 'cena-asc',
        };
      }
    } catch (e) {
      console.error('Błąd podczas ładowania filtrów:', e);
    }
    
    return {
      selectedSrednica: '',
      selectedProducent: '',
      selectedTypPojazdu: '',
      selectedDostepnosc: '',
      selectedPcd: '',
      selectedCb: '',
      selectedEt: '',
      selectedWidth: '',
      priceRange: [0, 5000] as [number, number],
      priceInputs: ['', '5000'] as [string, string],
      sortBy: 'cena-asc' as SortOption,
    };
  };

  const initialFilters = loadFiltersFromStorage();
  const [selectedSrednica, setSelectedSrednica] = useState<string>(initialFilters.selectedSrednica);
  const [selectedProducent, setSelectedProducent] = useState<string>(initialFilters.selectedProducent);
  const [selectedTypPojazdu, setSelectedTypPojazdu] = useState<string>(initialFilters.selectedTypPojazdu);
  const [selectedDostepnosc, setSelectedDostepnosc] = useState<string>(initialFilters.selectedDostepnosc);
  const [selectedPcd, setSelectedPcd] = useState<string>(initialFilters.selectedPcd);
  const [selectedCb, setSelectedCb] = useState<string>(initialFilters.selectedCb);
  const [selectedEt, setSelectedEt] = useState<string>(initialFilters.selectedEt);
  const [selectedWidth, setSelectedWidth] = useState<string>(initialFilters.selectedWidth);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange);
  const [priceInputs, setPriceInputs] = useState<[string, string]>(initialFilters.priceInputs);
  const [sortBy, setSortBy] = useState<SortOption>(initialFilters.sortBy);
  const [showFilters, setShowFilters] = useState(false);
  const [felgiData, setFelgiData] = useState<FelgaProdukt[]>([]);
  const [loadingFelgi, setLoadingFelgi] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [commissionSettings, setCommissionSettings] = useState(getCommissionSettings());
  const productsPerPage = 24; // Liczba produktów na stronę

  // Zapisz filtry do sessionStorage przy każdej zmianie
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const filtersToSave = {
        selectedSrednica,
        selectedProducent,
        selectedTypPojazdu,
        selectedDostepnosc,
        selectedPcd,
        selectedCb,
        selectedEt,
        selectedWidth,
        priceRange,
        priceInputs,
        sortBy,
      };
      sessionStorage.setItem('sklep-filters', JSON.stringify(filtersToSave));
    } catch (e) {
      console.error('Błąd podczas zapisywania filtrów:', e);
    }
  }, [selectedSrednica, selectedProducent, selectedTypPojazdu, selectedDostepnosc, selectedPcd, selectedCb, selectedEt, selectedWidth, priceRange, priceInputs, sortBy]);

  // Synchronizuj ustawienia z API przy starcie
  useEffect(() => {
    const syncSettings = async () => {
      try {
        const { syncCommissionSettingsFromAPI } = await import('@/lib/commission');
        await syncCommissionSettingsFromAPI();
        setCommissionSettings(getCommissionSettings());
      } catch (error) {
        console.error('Błąd podczas synchronizacji ustawień:', error);
      }
    };
    syncSettings();
  }, []);

  // Nasłuchuj zmian w ustawieniach prowizji i produktów
  useEffect(() => {
    const handleStorageChange = () => {
      setCommissionSettings(getCommissionSettings());
    };

    const handleProductSettingsChange = () => {
      // Odśwież komponent gdy zmieniają się ustawienia produktów
      setCommissionSettings(getCommissionSettings());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productSettingsChanged', handleProductSettingsChange);
    window.addEventListener('commissionSettingsChanged', handleStorageChange);
    
    // Sprawdzaj też lokalnie (dla tej samej zakładki)
    const interval = setInterval(() => {
      const newSettings = getCommissionSettings();
      if (JSON.stringify(newSettings) !== JSON.stringify(commissionSettings)) {
        setCommissionSettings(newSettings);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productSettingsChanged', handleProductSettingsChange);
      window.removeEventListener('commissionSettingsChanged', handleStorageChange);
      clearInterval(interval);
    };
  }, [commissionSettings]);

  // Załaduj dane felg z CSV
  useEffect(() => {
    if (selectedKategoria === 'felgi' || selectedKategoria === 'wszystkie') {
      setLoadingFelgi(true);
      fetch('/api/felgi')
        .then(res => res.json())
        .then(data => {
          setFelgiData(Array.isArray(data) ? data : []);
          setLoadingFelgi(false);
        })
        .catch(err => {
          console.error('Błąd podczas ładowania felg:', err);
          setFelgiData([]);
          setLoadingFelgi(false);
        });
    }
  }, [selectedKategoria]);

  // Konwertuj FelgaProdukt na format Produkt dla kompatybilności
  const felgiAsProdukty: Produkt[] = useMemo(() => {
    const settings = getCommissionSettings();
    // WAŻNE: Najpierw filtrujemy, potem mapujemy, żeby indeksy się zgadzały z getProduktById
    return felgiData
      .filter(felga => {
        // Filtruj ukryte produkty
        const productSettings = getProductSetting(felga.id);
        if (productSettings.hidden) return false;
        
        // Filtruj produkty z ceną 0
        const cheapestVariant = felga.variants.reduce((prev, curr) => 
          prev.price < curr.price ? prev : curr
        );
        return cheapestVariant.price > 0;
      })
      .map((felga, index) => {
        const cheapestVariant = felga.variants.reduce((prev, curr) => 
          prev.price < curr.price ? prev : curr
        );
        const totalStock = felga.variants.reduce((sum, v) => sum + v.stock1Day + v.stock4Days, 0);
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
          id: 1000000 + index, // Używam dużych ID żeby uniknąć konfliktów - teraz index jest z przefiltrowanej listy
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
          felgaData: felga, // Przechowujemy oryginalne dane dla szczegółów
          felgaId: felga.id, // Przechowujemy ID felgi do mapowania
        };
      });
  }, [felgiData, commissionSettings]);

  const kategorieProdukty = useMemo(() => {
    const settings = getCommissionSettings();
    const applyCommission = (price: number) => {
      if (settings.enabled && settings.globalCommission > 0) {
        return Math.round(price * (1 + settings.globalCommission / 100));
      }
      return price;
    };

    if (selectedKategoria === 'felgi') {
      return felgiAsProdukty;
    } else if (selectedKategoria === 'wszystkie') {
      const otherProducts = getProduktyByKategoria('wszystkie')
        .filter(p => p.kategoria !== 'felgi')
        .map(p => ({
          ...p,
          cena: applyCommission(p.cena),
        }));
      return [...felgiAsProdukty, ...otherProducts];
    } else {
      return getProduktyByKategoria(selectedKategoria).map(p => ({
        ...p,
        cena: applyCommission(p.cena),
      }));
    }
  }, [selectedKategoria, felgiAsProdukty, commissionSettings]);

  const producenci = Array.from(new Set(kategorieProdukty.map(p => p.producent))).sort();
  const srednice = Array.from(new Set(kategorieProdukty.filter(p => p.srednica).map(p => p.srednica!))).sort((a, b) => parseInt(a) - parseInt(b));
  const typyPojazdow = Array.from(new Set(kategorieProdukty.map(p => p.typPojazdu)));

  // Unikalne wartości dla filtrów felg (tylko z felgiData)
  const uniquePcds = useMemo(() => {
    const pcds = new Set(felgiData.map(f => f.pcd));
    return Array.from(pcds).sort();
  }, [felgiData]);

  const uniqueCbs = useMemo(() => {
    const cbs = new Set(felgiData.map(f => f.cb));
    return Array.from(cbs).sort((a, b) => a - b);
  }, [felgiData]);

  const uniqueEts = useMemo(() => {
    const ets = new Set(felgiData.map(f => f.et));
    return Array.from(ets).sort((a, b) => a - b);
  }, [felgiData]);

  const uniqueWidths = useMemo(() => {
    const widths = new Set(felgiData.map(f => f.width));
    return Array.from(widths).sort((a, b) => a - b);
  }, [felgiData]);

  const filteredAndSortedProdukty = useMemo(() => {
    let filtered = [...kategorieProdukty].filter(p => p.cena > 0); // Wyklucz produkty z ceną 0

    if (selectedSrednica) {
      filtered = filtered.filter(p => p.srednica === selectedSrednica);
    }

    if (selectedProducent) {
      filtered = filtered.filter(p => p.producent === selectedProducent);
    }

    if (selectedTypPojazdu) {
      filtered = filtered.filter(p => p.typPojazdu === selectedTypPojazdu);
    }

    if (selectedDostepnosc) {
      if (selectedDostepnosc === 'dostepne') {
        filtered = filtered.filter(p => p.dostepnosc === true);
      } else if (selectedDostepnosc === 'niedostepne') {
        filtered = filtered.filter(p => p.dostepnosc === false);
      }
    }

    // Filtry dla felg (tylko produkty z felgaData)
    if (selectedPcd) {
      filtered = filtered.filter(p => p.felgaData?.pcd === selectedPcd);
    }

    if (selectedCb) {
      filtered = filtered.filter(p => p.felgaData?.cb === parseFloat(selectedCb));
    }

    if (selectedEt) {
      filtered = filtered.filter(p => p.felgaData?.et === parseFloat(selectedEt));
    }

    if (selectedWidth) {
      filtered = filtered.filter(p => p.felgaData?.width === parseFloat(selectedWidth));
    }

    filtered = filtered.filter(p => p.cena >= priceRange[0] && p.cena <= priceRange[1]);

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'cena-asc':
          return a.cena - b.cena;
        case 'cena-desc':
          return b.cena - a.cena;
        case 'nazwa-asc':
          return a.name.localeCompare(b.name);
        case 'nazwa-desc':
          return b.name.localeCompare(a.name);
        case 'producent-asc':
          return a.producent.localeCompare(b.producent);
        case 'producent-desc':
          return b.producent.localeCompare(a.producent);
        default:
          return 0;
      }
    });

    return filtered;
  }, [kategorieProdukty, selectedSrednica, selectedProducent, selectedTypPojazdu, selectedDostepnosc, selectedPcd, selectedCb, selectedEt, selectedWidth, priceRange, sortBy]);

  // Paginacja
  const totalPages = Math.ceil(filteredAndSortedProdukty.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProdukty = filteredAndSortedProdukty.slice(startIndex, endIndex);

  // Resetuj stronę gdy zmieniają się filtry
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSrednica, selectedProducent, selectedTypPojazdu, selectedDostepnosc, selectedPcd, selectedCb, selectedEt, selectedWidth, priceRange, sortBy, selectedKategoria]);

  // Przewiń do góry przy zmianie strony
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const clearFilters = () => {
    setSelectedSrednica('');
    setSelectedProducent('');
    setSelectedTypPojazdu('');
    setSelectedDostepnosc('');
    setSelectedPcd('');
    setSelectedCb('');
    setSelectedEt('');
    setSelectedWidth('');
    setPriceRange([0, 5000]);
    setPriceInputs(['', '5000']);
    setSortBy('cena-asc');
    
    // Wyczyść również sessionStorage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('sklep-filters');
      } catch (e) {
        console.error('Błąd podczas czyszczenia filtrów:', e);
      }
    }
  };

  const maxPrice = selectedKategoria === 'felgi' || selectedKategoria === 'wszystkie' ? 5000 : 3000;
  const hasActiveFilters = selectedSrednica || selectedProducent || selectedTypPojazdu || selectedDostepnosc || selectedPcd || selectedCb || selectedEt || selectedWidth || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-black via-black to-gray-900 min-h-screen">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Modern Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/60 font-medium">
              Wybierz idealne produkty
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Sklep
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
        </div>

        {/* Modern Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/sklep"
            className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
              selectedKategoria === 'wszystkie'
                ? 'bg-white text-black shadow-lg shadow-white/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-white/10'
            }`}
          >
            Wszystkie
          </Link>
          <Link
            href="/sklep/felgi"
            className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
              selectedKategoria === 'felgi'
                ? 'bg-white text-black shadow-lg shadow-white/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-white/10'
            }`}
          >
            Felgi
          </Link>
          <Link
            href="/sklep/opony"
            className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
              selectedKategoria === 'opony'
                ? 'bg-white text-black shadow-lg shadow-white/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-white/10'
            }`}
          >
            Opony
          </Link>
          <Link
            href="/sklep/akcesoria"
            className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
              selectedKategoria === 'akcesoria'
                ? 'bg-white text-black shadow-lg shadow-white/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-white/10'
            }`}
          >
            Akcesoria
          </Link>
        </div>

        {/* Modern Filter & Sort Bar */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtry
            {hasActiveFilters && (
              <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {[selectedSrednica, selectedProducent, selectedTypPojazdu, selectedDostepnosc, selectedPcd, selectedCb, selectedEt, selectedWidth, priceRange[0] > 0 || priceRange[1] < maxPrice].filter(Boolean).length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <label className="text-white/80 text-sm font-medium">Sortuj:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm font-medium cursor-pointer"
            >
              <option value="cena-asc">Cena: od najniższej</option>
              <option value="cena-desc">Cena: od najwyższej</option>
              <option value="nazwa-asc">Nazwa: A-Z</option>
              <option value="nazwa-desc">Nazwa: Z-A</option>
              <option value="producent-asc">Producent: A-Z</option>
              <option value="producent-desc">Producent: Z-A</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Modern Filters Sidebar */}
          <aside className={`w-full lg:w-72 xl:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24 shadow-xl shadow-black/20 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Filtry</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-white/60 hover:text-white text-sm font-medium underline transition-colors"
                  >
                    Wyczyść
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {producenci.length > 0 && (
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Producent</label>
                    <select
                      value={selectedProducent}
                      onChange={(e) => setSelectedProducent(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                    >
                      <option value="">Wszyscy producenci</option>
                      {producenci.map((producent) => (
                        <option key={producent} value={producent}>
                          {producent}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {srednice.length > 0 && (
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Średnica</label>
                    <div className="flex flex-wrap gap-2">
                      {srednice.map((srednica) => (
                        <button
                          key={srednica}
                          onClick={() => setSelectedSrednica(selectedSrednica === srednica ? '' : srednica)}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${
                            selectedSrednica === srednica
                              ? 'bg-white text-black border-white shadow-lg'
                              : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/10 hover:border-white/40'
                          }`}
                        >
                          {srednica}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {typyPojazdow.length > 0 && (
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Typ pojazdu</label>
                    <select
                      value={selectedTypPojazdu}
                      onChange={(e) => setSelectedTypPojazdu(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                    >
                      <option value="">Wszystkie typy</option>
                      {typyPojazdow.map((typ) => (
                        <option key={typ} value={typ}>
                          {typ}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Dostępność</label>
                  <select
                    value={selectedDostepnosc}
                    onChange={(e) => setSelectedDostepnosc(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                  >
                    <option value="">Wszystkie</option>
                    <option value="dostepne">Dostępne</option>
                    <option value="niedostepne">Niedostępne</option>
                  </select>
                </div>

                {(selectedKategoria === 'felgi' || selectedKategoria === 'wszystkie') && uniquePcds.length > 0 && (
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Rozstaw śrub (PCD)</label>
                    <select
                      value={selectedPcd}
                      onChange={(e) => setSelectedPcd(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                    >
                      <option value="">Wszystkie</option>
                      {uniquePcds.map((pcd) => (
                        <option key={pcd} value={pcd}>
                          {pcd}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedKategoria === 'felgi' || selectedKategoria === 'wszystkie') && uniqueCbs.length > 0 && (
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Otwór centrujący (CB) [mm]</label>
                    <select
                      value={selectedCb}
                      onChange={(e) => setSelectedCb(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                    >
                      <option value="">Wszystkie</option>
                      {uniqueCbs.map((cb) => (
                        <option key={cb} value={cb.toString()}>
                          {cb} mm
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedKategoria === 'felgi' || selectedKategoria === 'wszystkie') && uniqueEts.length > 0 && (
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">ET (Offset)</label>
                    <select
                      value={selectedEt}
                      onChange={(e) => setSelectedEt(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                    >
                      <option value="">Wszystkie</option>
                      {uniqueEts.map((et) => (
                        <option key={et} value={et.toString()}>
                          ET{et}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedKategoria === 'felgi' || selectedKategoria === 'wszystkie') && uniqueWidths.length > 0 && (
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Szerokość felgi [cal]</label>
                    <select
                      value={selectedWidth}
                      onChange={(e) => setSelectedWidth(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                    >
                      <option value="">Wszystkie</option>
                      {uniqueWidths.map((width) => (
                        <option key={width} value={width.toString()}>
                          {width}"
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    Cena
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-white/70 text-xs mb-1.5">Od</label>
                      <input
                        type="number"
                        min="0"
                        max={maxPrice}
                        step="100"
                        value={priceInputs[0]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPriceInputs([value, priceInputs[1]]);
                          if (value === '') {
                            setPriceRange([0, priceRange[1]]);
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue)) {
                              const clampedValue = Math.max(0, Math.min(maxPrice, numValue));
                              setPriceRange([clampedValue, priceRange[1]]);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '') {
                            setPriceInputs(['', priceInputs[1]]);
                          }
                        }}
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-white/70 text-xs mb-1.5">Do</label>
                      <input
                        type="number"
                        min="0"
                        max={maxPrice}
                        step="100"
                        value={priceInputs[1]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPriceInputs([priceInputs[0], value]);
                          if (value === '') {
                            setPriceRange([priceRange[0], maxPrice]);
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue)) {
                              const clampedValue = Math.max(0, Math.min(maxPrice, numValue));
                              setPriceRange([priceRange[0], clampedValue]);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '') {
                            setPriceInputs([priceInputs[0], maxPrice.toString()]);
                            setPriceRange([priceRange[0], maxPrice]);
                          }
                        }}
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm"
                        placeholder={maxPrice.toString()}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-2">
                    <span>0 zł</span>
                    <span>{maxPrice} zł</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Modern Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <p className="text-white/80 text-sm">
                Znaleziono <span className="text-white font-bold">{filteredAndSortedProdukty.length}</span> produktów
                {totalPages > 1 && (
                  <span className="text-white/60 ml-2">
                    (strona {currentPage} z {totalPages})
                  </span>
                )}
              </p>
            </div>

            {loadingFelgi && (selectedKategoria === 'felgi' || selectedKategoria === 'wszystkie') ? (
              <div className="text-center py-20">
                <div className="inline-block p-4 bg-white/5 rounded-full mb-6 animate-pulse">
                  <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-white/60 text-lg">Ładowanie produktów...</p>
              </div>
            ) : filteredAndSortedProdukty.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-block p-4 bg-white/5 rounded-full mb-6">
                  <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white/60 text-lg mb-6">Nie znaleziono produktów spełniających kryteria</p>
                <button
                  onClick={clearFilters}
                  className="bg-white text-black px-8 py-3 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg"
                >
                  Wyczyść filtry
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProdukty.map((produkt, index) => (
                  <div
                    key={produkt.id}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-white/10 to-black/20 overflow-hidden">
                      <Image
                        src={produkt.obrazek}
                        alt={produkt.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        loading={index < 6 ? "eager" : "lazy"}
                        quality={85}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wide">
                          {produkt.kategoria}
                        </span>
                      </div>

                      {/* Availability Badge */}
                      {produkt.dostepnosc ? (
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                            Dostępne
                          </span>
                        </div>
                      ) : (
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                            Niedostępne
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-white/90 transition-colors">
                          {produkt.name}
                        </h3>
                        <p className="text-white/60 text-sm">{produkt.producent}</p>
                      </div>
                      
                      {/* Quick Specs */}
                      <div className="space-y-2 mb-4 text-xs text-white/70">
                        {produkt.rozmiar && (
                          <div className="flex justify-between">
                            <span>Rozmiar:</span>
                            <span className="font-semibold text-white/90">{produkt.rozmiar}</span>
                          </div>
                        )}
                        {produkt.et && (
                          <div className="flex justify-between">
                            <span>ET:</span>
                            <span className="font-semibold text-white/90">{produkt.et}</span>
                          </div>
                        )}
                        {produkt.otworow && (
                          <div className="flex justify-between">
                            <span>Otwory:</span>
                            <span className="font-semibold text-white/90">{produkt.otworow}</span>
                          </div>
                        )}
                      </div>

                      {/* Price and Actions */}
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold text-white">{produkt.cena} zł</p>
                            {produkt.cenaBazowa && produkt.cenaBazowa < produkt.cena && (
                              <p className="text-white/50 text-xs mt-1">
                                Najniższa cena z ostatnich 30 dni: {produkt.cenaBazowa} zł
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <Link
                          href={`/sklep/produkt/${encodeURIComponent(produkt.felgaId || produkt.id.toString())}`}
                          className="block w-full bg-white hover:bg-white/90 text-black px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                        >
                          Zobacz szczegóły
                        </Link>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>

                {/* Paginacja */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/40 disabled:hover:bg-white/5"
                    >
                      ← Poprzednia
                    </button>
                    
                    <div className="flex gap-2 flex-wrap justify-center">
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                              currentPage === pageNum
                                ? 'bg-white text-black shadow-lg'
                                : 'bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 hover:border-white/40'
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
                      className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/40 disabled:hover:bg-white/5"
                    >
                      Następna →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

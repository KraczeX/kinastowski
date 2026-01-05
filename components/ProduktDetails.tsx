'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Produkt } from '@/lib/products';
import type { FelgaProdukt, FelgaVariant } from '@/lib/felgi-data';
import { getProduktById, getProduktByFelgaId } from '@/lib/products-utils';
import { getCommissionSettings } from '@/lib/commission';
import { calculatePriceWithCustomCommission, getProductSetting } from '@/lib/product-settings';

interface ProduktDetailsProps {
  produktId?: number;
  felgaId?: string;
}

export default function ProduktDetails({ produktId, felgaId }: ProduktDetailsProps) {
  const [produkt, setProdukt] = useState<Produkt | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [commissionSettings, setCommissionSettings] = useState(getCommissionSettings());

  useEffect(() => {
    setLoading(true);
    const loadProduct = async () => {
      try {
        let p: Produkt | undefined;
        if (felgaId) {
          p = await getProduktByFelgaId(felgaId);
        } else if (produktId !== undefined) {
          p = await getProduktById(produktId);
        }
        setProdukt(p);
      } catch (err) {
        console.error('Błąd podczas ładowania produktu:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [produktId, felgaId]);

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
      setCommissionSettings(getCommissionSettings());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productSettingsChanged', handleProductSettingsChange);
    window.addEventListener('commissionSettingsChanged', handleStorageChange);
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productSettingsChanged', handleProductSettingsChange);
      window.removeEventListener('commissionSettingsChanged', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-black min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white text-xl mt-4">Ładowanie produktu...</p>
        </div>
      </section>
    );
  }

  if (!produkt) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-black min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-2xl mb-6">Produkt nie został znaleziony</p>
          <Link 
            href="/sklep" 
            className="inline-block bg-white text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity font-semibold"
          >
            Powrót do sklepu
          </Link>
        </div>
      </section>
    );
  }

  const felgaData = produkt.felgaData as FelgaProdukt | undefined;
  const selectedVariant = felgaData && felgaData.variants.length > 0 
    ? felgaData.variants[selectedVariantIndex] 
    : null;
  const displayImage = selectedVariant?.photo || produkt.obrazek;
  const totalStock = selectedVariant 
    ? selectedVariant.stock1Day + selectedVariant.stock4Days
    : (produkt.dostepnosc ? 1 : 0);

  const productSettings = felgaData ? getProductSetting(felgaData.id) : {};
  const isAvailable = productSettings.available !== false;
  
  const finalPrice = selectedVariant 
    ? calculatePriceWithCustomCommission(
        selectedVariant.price,
        felgaData!.id,
        commissionSettings.globalCommission,
        commissionSettings.enabled
      )
    : produkt.cena;

  return (
    <section className="py-6 sm:py-8 md:py-10 bg-gradient-to-b from-black via-black to-gray-900 min-h-screen">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link 
            href="/sklep" 
            className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 text-sm group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Powrót do sklepu
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <Image
                src={displayImage}
                alt={produkt.name}
                fill
                className="object-cover"
                priority
                quality={90}
              />
              {totalStock > 0 && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Dostępne</span>
                </div>
              )}
            </div>
            
            {/* Variant thumbnails if multiple variants */}
            {felgaData && felgaData.variants.length > 1 && (
              <div>
                <p className="text-white/70 text-sm mb-2 font-medium">Wybierz wariant:</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {felgaData.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedVariantIndex === index
                          ? 'border-white shadow-lg shadow-white/20 scale-105'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                    >
                      {variant.photo ? (
                        <Image
                          src={variant.photo}
                          alt={variant.finishing}
                          fill
                          className="object-cover"
                          quality={75}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center">
                          <span className="text-white/50 text-xs">{variant.colorShort}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            {/* Title & Category */}
            <div className="mb-3">
              <span className="inline-block bg-white/10 text-white/80 text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-2">
                {produkt.kategoria}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                {produkt.name}
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-medium">{produkt.producent}</p>
            </div>

            {felgaData && felgaData.modelName && (
              <p className="text-white/90 text-base mb-4">{felgaData.modelName}</p>
            )}

            {/* Price - Compact */}
            <div className="mb-4">
              <p className="text-white/70 text-sm mb-2 font-medium">Cena</p>
              <div className="flex items-baseline gap-3 mb-4">
                {selectedVariant && finalPrice !== selectedVariant.price && (
                  <span className="line-through text-white/40 text-2xl">
                    {selectedVariant.price} zł
                  </span>
                )}
                {!selectedVariant && produkt.cenaBazowa && finalPrice !== produkt.cenaBazowa && (
                  <span className="line-through text-white/40 text-2xl">
                    {produkt.cenaBazowa} zł
                  </span>
                )}
                <span className="text-white text-4xl md:text-5xl font-black">
                  {finalPrice} zł
                </span>
              </div>

              {/* Availability */}
              {isAvailable && totalStock > 0 ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-400 font-bold text-sm">Dostępne na magazynie</p>
                    {selectedVariant && (
                      <p className="text-green-300 text-xs">
                        {selectedVariant.stock1Day > 0 
                          ? `Od ręki (${selectedVariant.stock1Day} szt.)`
                          : `W ciągu 4 dni (${selectedVariant.stock4Days} szt.)`
                        }
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-400 font-bold text-sm">Tymczasowo niedostępne</p>
                </div>
              )}

              {/* Primary CTA */}
              <a
                href="tel:575552835"
                className="block w-full bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white text-center px-6 py-4 font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-lg md:text-xl mb-2 group"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>575 552 835</span>
                </div>
              </a>

              <p className="text-white/60 text-xs text-center">
                * Kupno na miejscu. Zadzwoń, aby sprawdzić dostępność.
              </p>
            </div>

            {/* Key Specifications - Compact */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-5 mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-white rounded-full"></div>
                Specyfikacja
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {produkt.rozmiar && (
                  <div>
                    <p className="text-white/60 text-xs mb-1">Rozmiar</p>
                    <p className="text-white font-bold">{produkt.rozmiar}</p>
                  </div>
                )}
                {produkt.otworow && (
                  <div>
                    <p className="text-white/60 text-xs mb-1">PCD</p>
                    <p className="text-white font-bold">{produkt.otworow}</p>
                  </div>
                )}
                {produkt.et && (
                  <div>
                    <p className="text-white/60 text-xs mb-1">ET</p>
                    <p className="text-white font-bold">{produkt.et}</p>
                  </div>
                )}
                {felgaData && (
                  <div>
                    <p className="text-white/60 text-xs mb-1">CB</p>
                    <p className="text-white font-bold">{felgaData.cb} mm</p>
                  </div>
                )}
                {produkt.szerokosc && (
                  <div>
                    <p className="text-white/60 text-xs mb-1">Szerokość</p>
                    <p className="text-white font-bold">{produkt.szerokosc}"</p>
                  </div>
                )}
                {produkt.srednica && (
                  <div>
                    <p className="text-white/60 text-xs mb-1">Średnica</p>
                    <p className="text-white font-bold">{produkt.srednica}"</p>
                  </div>
                )}
              </div>
              {felgaData && (felgaData.productionTechnology || felgaData.oemCapFit) && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  {felgaData.productionTechnology && (
                    <div className="mb-2">
                      <p className="text-white/60 text-xs mb-1">Technologia</p>
                      <p className="text-white text-sm">{felgaData.productionTechnology}</p>
                    </div>
                  )}
                  {felgaData.oemCapFit && (
                    <div>
                      <p className="text-white/60 text-xs mb-1">OEM Cap Fit</p>
                      <p className="text-white text-sm">{felgaData.oemCapFit}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Variant Details (if single variant) */}
        {felgaData && selectedVariant && felgaData.variants.length === 1 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-5 mt-4">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">Szczegóły wariantu</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedVariant.ean && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">EAN</p>
                  <p className="text-white font-semibold text-sm">{selectedVariant.ean}</p>
                </div>
              )}
              {selectedVariant.weight && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">Waga</p>
                  <p className="text-white font-semibold">{selectedVariant.weight} g</p>
                </div>
              )}
              {selectedVariant.loading && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">Obciążenie</p>
                  <p className="text-white font-semibold">{selectedVariant.loading} kg</p>
                </div>
              )}
              {selectedVariant.ballSeat && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">Siedzenie</p>
                  <p className="text-white font-semibold text-sm">{selectedVariant.ballSeat}</p>
                </div>
              )}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-white/60 text-xs mb-1">Stan (1 dzień)</p>
                <p className={`font-semibold ${selectedVariant.stock1Day > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedVariant.stock1Day} szt.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-white/60 text-xs mb-1">Stan (4 dni)</p>
                <p className={`font-semibold ${selectedVariant.stock4Days > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedVariant.stock4Days} szt.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Variants (if multiple) */}
        {felgaData && felgaData.variants.length > 1 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-5 mt-4">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">Warianty kolorów</h2>
            <div className="space-y-3">
              {felgaData.variants.map((variant, index) => {
                const basePrice = variant.price;
                const priceWithCommission = calculatePriceWithCustomCommission(
                  basePrice,
                  felgaData.id,
                  commissionSettings.globalCommission,
                  commissionSettings.enabled
                );
                const totalStock = variant.stock1Day + variant.stock4Days;

                return (
                  <div 
                    key={variant.id} 
                    className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                      selectedVariantIndex === index
                        ? 'border-white bg-white/10 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={() => setSelectedVariantIndex(index)}
                  >
                    <div className="flex gap-4">
                      {variant.photo && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
                          <Image
                            src={variant.photo}
                            alt={variant.finishing}
                            fill
                            className="object-cover"
                            quality={75}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              {selectedVariantIndex === index && (
                                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              <div className="min-w-0">
                                <h3 className="text-white font-bold text-lg mb-1">{variant.finishing}</h3>
                                <p className="text-white/70 text-sm">{variant.colorShort}</p>
                              </div>
                            </div>
                            {(variant.weight || variant.loading) && (
                              <div className="flex flex-wrap gap-2">
                                {variant.weight && (
                                  <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded">
                                    {variant.weight} g
                                  </span>
                                )}
                                {variant.loading && (
                                  <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded">
                                    {variant.loading} kg
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="flex items-baseline gap-2 mb-2 justify-start sm:justify-end">
                              {priceWithCommission !== basePrice && (
                                <span className="line-through text-white/40 text-sm">
                                  {basePrice} zł
                                </span>
                              )}
                              <span className="text-white font-black text-2xl">
                                {priceWithCommission} zł
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className={`text-xs ${variant.stock1Day > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {variant.stock1Day > 0 ? '✓' : '✗'} 1 dzień: {variant.stock1Day} szt.
                              </div>
                              <div className={`text-xs ${variant.stock4Days > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {variant.stock4Days > 0 ? '✓' : '✗'} 4 dni: {variant.stock4Days} szt.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trust Signals - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-white font-bold text-sm mb-1">Gwarancja jakości</h3>
            <p className="text-white/70 text-xs">Oryginalne produkty</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-white font-bold text-sm mb-1">Szybka dostawa</h3>
            <p className="text-white/70 text-xs">Od ręki lub 4 dni</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-white font-bold text-sm mb-1">Montaż na miejscu</h3>
            <p className="text-white/70 text-xs">Profesjonalna obsługa</p>
          </div>
        </div>
      </div>
    </section>
  );
}

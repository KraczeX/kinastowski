'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Produkt } from '@/lib/products';

interface ProduktQuickViewProps {
  produkt: Produkt | null;
  onClose: () => void;
}

export default function ProduktQuickView({ produkt, onClose }: ProduktQuickViewProps) {
  useEffect(() => {
    if (produkt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [produkt]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (produkt) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [produkt, onClose]);

  if (!produkt) return null;

  return (
    <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-black border-2 border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity duration-300 z-10 p-2 bg-black/50 rounded-full"
          aria-label="Zamknij"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="relative aspect-square bg-white/5 rounded-xl overflow-hidden border-2 border-white/20">
            <Image
              src={produkt.obrazek}
              alt={produkt.name}
              fill
              className="object-cover"
              quality={90}
            />
          </div>

          {/* Details */}
          <div>
            <div className="mb-2">
              <span className="text-white/70 text-xs uppercase tracking-wide">{produkt.kategoria}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{produkt.name}</h2>
            <p className="text-white/70 mb-4">{produkt.producent}</p>

            {produkt.opis && (
              <p className="text-white/90 text-sm mb-6 leading-relaxed">{produkt.opis}</p>
            )}

            {/* Quick Specs */}
            <div className="bg-black border border-white/10 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                {produkt.rozmiar && (
                  <div className="flex justify-between text-white">
                    <span className="text-white/70">Rozmiar:</span>
                    <span className="font-semibold">{produkt.rozmiar}</span>
                  </div>
                )}
                {produkt.et && (
                  <div className="flex justify-between text-white">
                    <span className="text-white/70">ET:</span>
                    <span className="font-semibold">{produkt.et}</span>
                  </div>
                )}
                {produkt.otworow && (
                  <div className="flex justify-between text-white">
                    <span className="text-white/70">Otwory:</span>
                    <span className="font-semibold">{produkt.otworow}</span>
                  </div>
                )}
                <div className="flex justify-between text-white">
                  <span className="text-white/70">Typ pojazdu:</span>
                  <span className="font-semibold">{produkt.typPojazdu}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl md:text-4xl font-bold text-white mb-2">{produkt.cena} zł</p>
              {produkt.dostepnosc ? (
                <p className="text-green-400 text-sm">✓ Dostępne</p>
              ) : (
                <p className="text-red-400 text-sm">✗ Niedostępne</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/sklep/produkt/${produkt.id}`}
                className="flex-1 bg-white text-black text-center px-6 py-3 font-semibold rounded-lg hover:opacity-80 transition-opacity duration-300"
                onClick={onClose}
              >
                Zobacz szczegóły
              </Link>
              <a
                href="tel:575552835"
                className="flex-1 border-2 border-white text-white text-center px-6 py-3 font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300"
              >
                Zadzwoń
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Hero() {
  // Zdjęcie hero z folderu public
  const heroImage = '/hero.jpg';
  const [imageError, setImageError] = useState(false);

  return (
    <section id="home" className="bg-black min-h-screen flex items-center relative overflow-hidden scroll-mt-0">
      <div className="w-full flex flex-col md:flex-row">
        {/* Lewa sekcja - tekst (50% szerokości) */}
        <div className="w-full md:w-1/2 px-6 sm:px-8 md:px-16 pt-4 sm:pt-6 md:pt-8 pb-12 sm:pb-16 md:pb-24 flex flex-col justify-center relative z-10 order-2 md:order-1">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm uppercase tracking-wider text-white mb-4 sm:mb-6">
              PROFESJONALNA WULKANIZACJA
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Kompleksowa obsługa<br />opon i felg
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white mb-8 sm:mb-10 leading-relaxed">
              Profesjonalna wulkanizacja w Sycowie. Oferujemy wymianę opon, naprawę opon, 
              sprzedaż opon i felg oraz kompleksową obsługę TPMS.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a 
                href="tel:575552835" 
                className="bg-white text-black px-6 py-3 font-semibold hover:opacity-80 transition-opacity duration-300 inline-flex items-center justify-center gap-2 group rounded-lg text-sm md:text-base"
              >
                Skontaktuj się <span className="group-hover:translate-x-1 transition-transform duration-300">&gt;</span>
              </a>
              <a 
                href="/sklep" 
                className="border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-2 group rounded-lg text-sm md:text-base"
              >
                Sklep <span className="group-hover:translate-x-1 transition-transform duration-300">&gt;</span>
              </a>
              <a 
                href="tel:575552835" 
                className="flex items-center justify-center gap-2 text-white font-semibold hover:opacity-80 transition-opacity duration-300 text-sm sm:text-base"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                575 552 835
              </a>
            </div>
          </div>
        </div>
        
        {/* Prawa sekcja - zdjęcie (50% szerokości) */}
        <div className="w-full md:w-1/2 bg-black relative min-h-[300px] sm:min-h-[400px] md:min-h-screen flex items-start justify-center md:justify-end px-4 sm:px-8 md:pr-16 lg:pr-20 pt-20 sm:pt-4 md:pt-12 pb-4 sm:pb-8 md:pb-0 order-1 md:order-2">
          <div className="relative w-full sm:w-[90%] md:w-[85%] h-[300px] sm:h-[400px] md:h-[85%] max-w-full max-h-[85vh]">
            {!imageError ? (
              <>
                {/* Subtelny gradient overlay dla lepszego kontrastu */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent z-10 rounded-xl"></div>
                <Image
                  src={heroImage}
                  alt="Profesjonalna wulkanizacja"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-xl"
                  priority
                  quality={90}
                  onError={() => setImageError(true)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="text-6xl mb-4 text-white opacity-20">⚙</div>
                  <p className="text-sm text-white opacity-20">Dodaj zdjęcie hero.jpg</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


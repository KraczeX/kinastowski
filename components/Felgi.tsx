'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Felgi() {
  // Lista zdjęć felg
  const images = [
    '/felgi.jpg',
    '/felgi2.jpg',
    '/felgi3.jpg',
    '/felgi4.jpg',
    '/felgi5.jpg',
    '/felga.jpg',
  ];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Obsługa klawiatury
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => {
          if (prev === null) return null;
          return prev > 0 ? prev - 1 : images.length - 1;
        });
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => {
          if (prev === null) return null;
          return prev < images.length - 1 ? prev + 1 : 0;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  // Blokada scrollowania gdy lightbox jest otwarty
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-black min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            FELGI ALUMINIOWE
          </h1>
          <div className="w-20 sm:w-24 h-0.5 bg-white mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-4">
            Oferujemy szeroki wybór nowych felg aluminiowych dla każdego typu pojazdu. 
            Styl, jakość i bezpieczeństwo w jednym miejscu.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
            Pomagamy dobrać idealne felgi do Twojego samochodu, dostarczamy pełną gamę akcesoriów 
            oraz zapewniamy profesjonalny montaż. Odkryj naszą kolekcję i znajdź felgi swoich marzeń.
          </p>
        </div>

        {/* Services Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 max-w-6xl mx-auto">
          <div className="bg-white text-black p-6 sm:p-8 rounded-xl border-2 border-white hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                Szeroki Wybór
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                Setki modeli felg od najlepszych producentów
              </p>
            </div>
          </div>

          <div className="bg-white text-black p-6 sm:p-8 rounded-xl border-2 border-white hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                Pełne Wsparcie
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                Pomoc w doborze, akcesoria i profesjonalny montaż
              </p>
            </div>
          </div>

          <div className="bg-white text-black p-6 sm:p-8 rounded-xl border-2 border-white hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                Atrakcyjne Ceny
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                Konkurencyjne ceny i elastyczne formy płatności
              </p>
            </div>
          </div>
        </div>

        {/* Accessories Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
              Akcesoria i Kompleksowa Obsługa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Dystanse
                </h3>
                <p className="text-sm sm:text-base text-white/80">
                  Dystanse do zmiany offsetu felg
                </p>
              </div>
              <div className="text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Śruby i Nakrętki
                </h3>
                <p className="text-sm sm:text-base text-white/80">
                  Kompletne zestawy śrub mocujących
                </p>
              </div>
              <div className="text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Pierścienie Centrujące
                </h3>
                <p className="text-sm sm:text-base text-white/80">
                  Precyzyjne dopasowanie do piast
                </p>
              </div>
              <div className="text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Montaż i Wyważanie
                </h3>
                <p className="text-sm sm:text-base text-white/80">
                  Profesjonalny montaż i wyważanie kół
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
            Nasza Kolekcja Felg
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {images.map((src, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="relative aspect-square overflow-hidden rounded-xl border-2 border-white/20 hover:border-white transition-all duration-300 cursor-pointer group"
              >
                <Image
                  src={src}
                  alt={`Felgi ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </div>


        {/* CTA Section */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Zainteresowany?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8">
              Skontaktuj się z nami, aby dowiedzieć się więcej o dostępnych modelach i cenach. 
              Pomagamy dobrać idealne felgi do Twojego pojazdu.
            </p>
            <a
              href="tel:575552835"
              className="inline-block bg-white text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 font-semibold hover:opacity-80 transition-opacity duration-300 rounded-lg text-base sm:text-lg md:text-xl"
            >
              Zadzwoń: 575 552 835
            </a>
          </div>
        </div>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-white/70 transition-colors duration-300 z-10 p-2"
              aria-label="Zamknij"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={goToPrevious}
              className="absolute left-4 sm:left-6 text-white hover:text-white/70 transition-colors duration-300 z-10 p-2 bg-black/50 rounded-full"
              aria-label="Poprzednie"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 sm:right-6 text-white hover:text-white/70 transition-colors duration-300 z-10 p-2 bg-black/50 rounded-full"
              aria-label="Następne"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="relative max-w-7xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full h-full max-h-[90vh]">
                <Image
                  src={images[selectedIndex]}
                  alt={`Felgi ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm sm:text-base">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


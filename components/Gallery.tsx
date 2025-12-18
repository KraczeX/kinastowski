'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Gallery() {
  // Lista zdjęć z modelami aut
  const images = [
    '/audi.jpg',
    '/audia6.jpg',
    '/bus.jpg',
    '/cla.jpg',
    '/corvetta.jpg',
    '/eklasa.jpg',
    '/felga.jpg',
    '/gklasa.jpg',
    '/golfik.jpg',
    '/kia.jpg',
    '/mercedes4door.jpg',
    '/porshe.jpg',
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
    <section id="gallery" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            GALERIA
          </h2>
          <div className="w-20 sm:w-24 h-0.5 bg-white mx-auto mb-6 sm:mb-8"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12 sm:mb-16">
          {images.map((image, index) => (
            <div 
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden border border-white rounded-lg hover:opacity-80 transition-opacity duration-300 group cursor-pointer"
            >
              <Image
                src={image}
                alt={`Model auta ${index + 1}`}
                fill
                className="object-cover transition-all duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in overflow-hidden"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 text-white hover:opacity-70 transition-opacity duration-300 z-50 p-2"
              aria-label="Zamknij"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <div
              className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 md:-left-16 text-white hover:scale-110 transition-all duration-300 z-50 p-2 sm:p-3 md:p-4 lg:p-5 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/30 hover:border-white/50 shadow-lg"
                aria-label="Poprzednie zdjęcie"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 md:-right-16 text-white hover:scale-110 transition-all duration-300 z-50 p-2 sm:p-3 md:p-4 lg:p-5 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/30 hover:border-white/50 shadow-lg"
                aria-label="Następne zdjęcie"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="relative w-full h-full flex items-center justify-center animate-scale-in">
                <div className="relative w-full h-full max-w-[calc(100vw-5rem)] max-h-[calc(100vh-6rem)] sm:max-w-[calc(100vw-7rem)] sm:max-h-[calc(100vh-8rem)] md:max-w-7xl md:max-h-[90vh] flex items-center justify-center">
                  <Image
                    src={images[selectedIndex]}
                    alt={`Model auta ${selectedIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-2 sm:bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm md:text-base bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm z-50">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}

        {/* Facebook Section */}
        <div className="max-w-2xl mx-auto text-center border-2 border-white rounded-xl p-6 sm:p-8 md:p-12 bg-black">
          <div className="mb-4 sm:mb-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto text-white mb-3 sm:mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Więcej naszych prac
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed px-2">
            Zobacz więcej naszych realizacji na naszym profilu Facebook, który regularnie aktualizujemy o najnowsze prace i projekty.
          </p>
          <a
            href="https://www.facebook.com/profile.php?id=100071502295839&sk=photos&locale=pl_PL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 font-semibold hover:opacity-90 transition-all duration-300 rounded-lg group text-sm sm:text-base"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Odwiedź nasz Facebook</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">&gt;</span>
          </a>
        </div>
      </div>
    </section>
  );
}


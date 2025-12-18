'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik już zaakceptował cookies
    // Banner pokazuje się tylko jeśli użytkownik NIE zaakceptował (lub nie ma zapisu)
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent !== 'accepted') {
      // Pokaż banner po krótkim opóźnieniu dla lepszego UX
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    }
  }, []);

  const acceptCookies = () => {
    // Zapisujemy akceptację w localStorage - banner nie będzie się pokazywał ponownie
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    // Nie zapisujemy w localStorage - banner będzie się pokazywał za każdym razem
    // Możemy też usunąć ewentualny wcześniejszy zapis
    localStorage.removeItem('cookieConsent');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-black border-t-2 border-white/30 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs sm:text-sm md:text-base text-white leading-relaxed">
                Ta strona używa plików cookie, aby zapewnić najlepsze doświadczenie. Kontynuując przeglądanie, zgadzasz się na{' '}
                <Link href="/privacy" className="underline hover:opacity-80 transition-opacity">
                  politykę prywatności
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={rejectCookies}
                className="border-2 border-white text-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:bg-white hover:text-black transition-all duration-300 rounded-lg text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                Nie akceptuję
              </button>
              <button
                onClick={acceptCookies}
                className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:opacity-90 transition-opacity duration-300 rounded-lg text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                Akceptuję
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


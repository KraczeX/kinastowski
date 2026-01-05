'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isSklepPage = pathname?.startsWith('/sklep') || false;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blokada scrollowania gdy menu mobilne jest otwarte
  useEffect(() => {
    if (mobileMenuOpen) {
      // Zapisz aktualną pozycję scrollowania
      const scrollY = window.scrollY;
      
      // Zablokuj scrollowanie
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Zablokuj touchmove na mobile
      const preventDefault = (e: Event) => {
        e.preventDefault();
      };
      document.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        // Przywróć scrollowanie
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
        document.removeEventListener('touchmove', preventDefault);
      };
    }
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-black border-b border-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="relative flex items-center justify-between">
          {/* Logo po lewej */}
          <Link href="/#home" className="hover:opacity-80 transition-opacity duration-300 z-10" onClick={closeMobileMenu}>
            <Image
              src="/logo1.png"
              alt="Serwis Opon Kinastowski"
              width={300}
              height={100}
              className="h-16 sm:h-18 md:h-20 w-auto"
              priority
            />
          </Link>
          
          {/* Linki wyśrodkowane - Desktop */}
          <nav className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {isSklepPage ? (
              <>
                <Link 
                  href="/#home" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Strona Główna
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/sklep" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Sklep
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/#about" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  O nas
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/#contact" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Kontakt
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/#home" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Strona Główna
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/#about" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  O nas
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/#services" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Usługi
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/gallery" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Galeria
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/felgi" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Felgi
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/sklep" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Sklep
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/#contact" 
                  className="text-white text-lg hover:opacity-80 transition-all duration-300 relative group"
                >
                  Kontakt
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </nav>
          
          {/* Przycisk Skontaktuj się i ikona Facebooka po prawej - Desktop */}
          <div className="hidden md:flex items-center gap-4 z-10">
            <a 
              href="tel:575552835" 
              className="bg-white text-black px-6 py-3 font-semibold hover:opacity-80 transition-opacity duration-300 rounded-lg"
            >
              Skontaktuj się
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=100071502295839&sk=photos&locale=pl_PL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80 transition-opacity duration-300"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          {/* Mobile - Facebook i Hamburger */}
          <div className="flex md:hidden items-center gap-4 z-10">
            <a 
              href="https://www.facebook.com/profile.php?id=100071502295839&sk=photos&locale=pl_PL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80 transition-opacity duration-300"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* Hamburger Button */}
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 focus:outline-none"
              aria-label="Menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute top-0 left-0 w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 top-2.5' : ''}`}></span>
                <span className={`absolute top-2.5 left-0 w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`absolute top-5 left-0 w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 top-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden fixed inset-0 z-[100] ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100
          }}
        >
          {/* Tło - zawsze nieprzezroczyste gdy menu jest otwarte */}
          <div 
            className="absolute inset-0 bg-black"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000',
              opacity: mobileMenuOpen ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              pointerEvents: mobileMenuOpen ? 'auto' : 'none'
            }}
          ></div>
          {/* Zawartość menu */}
          <div className={`relative flex flex-col h-full pt-16 px-6 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Close Button */}
            <div className="flex justify-end mb-8">
              <button
                onClick={closeMobileMenu}
                className="text-white hover:opacity-70 transition-opacity duration-300 p-3 rounded-full border-2 border-white/30 hover:border-white/60 hover:bg-white/10"
                aria-label="Zamknij menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-6">
              {isSklepPage ? (
                <>
                  <Link 
                    href="/#home" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Strona Główna
                  </Link>
                  <Link 
                    href="/sklep" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Sklep
                  </Link>
                  <Link 
                    href="/#about" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    O nas
                  </Link>
                  <Link 
                    href="/#contact" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Kontakt
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/#home" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Strona Główna
                  </Link>
                  <Link 
                    href="/#about" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    O nas
                  </Link>
                  <Link 
                    href="/#services" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Usługi
                  </Link>
                  <Link 
                    href="/gallery" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Galeria
                  </Link>
                  <Link 
                    href="/felgi" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Felgi
                  </Link>
                  <Link 
                    href="/sklep" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Sklep
                  </Link>
                  <Link 
                    href="/#contact" 
                    onClick={closeMobileMenu}
                    className="text-white text-xl font-semibold hover:opacity-80 transition-opacity duration-300 py-3 border-b border-white/20"
                  >
                    Kontakt
                  </Link>
                </>
              )}
            </nav>
            <div className="mt-8 pt-8 border-t border-white/20">
              <a 
                href="tel:575552835" 
                onClick={closeMobileMenu}
                className="block bg-white text-black px-6 py-4 font-semibold text-center hover:opacity-80 transition-opacity duration-300 rounded-lg mb-4"
              >
                Skontaktuj się
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


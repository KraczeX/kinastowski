'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-white/20 mt-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Logo and Company Info */}
          <div className="lg:col-span-1">
            <Link href="/#home" className="inline-block mb-4 hover:opacity-80 transition-opacity duration-300">
              <Image
                src="/logo1.png"
                alt="Serwis Opon Kinastowski"
                width={300}
                height={100}
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto"
                loading="lazy"
                quality={85}
              />
            </Link>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Profesjonalna obsługa opon i felg. Zaufaj naszemu doświadczeniu i jakości.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Nawigacja</h3>
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/#home" 
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300"
              >
                Strona Główna
              </Link>
              <Link 
                href="/#about" 
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300"
              >
                O nas
              </Link>
              <Link 
                href="/#services" 
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300"
              >
                Usługi
              </Link>
              <Link 
                href="/gallery" 
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300"
              >
                Galeria
              </Link>
              <Link 
                href="/felgi" 
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300"
              >
                Felgi
              </Link>
              <Link 
                href="/#contact" 
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300"
              >
                Kontakt
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Kontakt</h3>
            <div className="flex flex-col space-y-4">
              <a 
                href="tel:575552835"
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300 flex items-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>575 552 835</span>
              </a>
              <a 
                href="mailto:kinastowskiopony@gmail.com"
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300 flex items-center gap-3 break-all"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>kinastowskiopony@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Social Media</h3>
            <div className="flex flex-col space-y-4">
              <a
                href="https://www.facebook.com/profile.php?id=100071502295839&sk=photos&locale=pl_PL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base text-white/70 hover:text-white hover:opacity-80 transition-all duration-300 flex items-center gap-3"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-xs sm:text-sm text-white/70">
              © {currentYear} Serwis Opon Kinastowski. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/70">
              <Link href="/privacy" className="hover:text-white hover:opacity-80 transition-all duration-300 underline">
                Polityka prywatności
              </Link>
              <span className="hidden sm:inline">|</span>
              <span>
                Strona wykonana przez{' '}
                <a 
                  href="https://synthit.pl/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-white/90 hover:text-white hover:opacity-80 transition-all duration-300 underline"
                >
                  SynthIT
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


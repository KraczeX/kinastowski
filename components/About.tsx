'use client';

import { useEffect, useRef } from 'react';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.fade-in-element');
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('opacity-100', 'translate-y-0');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-black relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 left-0 w-96 h-96 border border-white rounded-full"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] border border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-20 fade-in-element opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              DOŚWIADCZENIE<br />I PROFESJONALIZM
            </h2>
            <div className="w-20 sm:w-24 h-0.5 bg-white mx-auto mb-4 sm:mb-6"></div>
          </div>
          
          {/* Content - Two column layout on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-12 mb-6 sm:mb-8 md:mb-12">
            <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-700">
              <div className="text-white space-y-3 sm:space-y-4 md:space-y-6">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-center lg:text-left">
                  Od lat zajmujemy się kompleksową obsługą opon i felg, dbając o bezpieczeństwo oraz komfort jazdy naszych klientów. Każde zlecenie traktujemy indywidualnie - od sezonowej wymiany opon po precyzyjne wyważenie kół i regenerację felg.
                </p>
              </div>
            </div>
            
            <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
              <div className="text-white space-y-3 sm:space-y-4 md:space-y-6">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-center lg:text-left">
                  Stawiamy na rzetelną pracę i nowoczesny sprzęt, który pozwala nam działać dokładnie i bezpiecznie. Dzięki temu minimalizujemy ryzyko uszkodzeń i mamy pełną kontrolę nad jakością wykonania.
                </p>
              </div>
            </div>
          </div>

          {/* Full width paragraph */}
          <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-700 mb-6 sm:mb-8 md:mb-12" style={{ transitionDelay: '400ms' }}>
            <div className="max-w-4xl mx-auto">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed text-center px-2">
                Nasi klienci wracają do nas dzięki fachowej obsłudze, uczciwemu doradztwu i jasnym informacjom. To podejście buduje zaufanie i pozwala nam pracować na dobrą opinię każdego dnia.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-700 mb-8 sm:mb-12 md:mb-16" style={{ transitionDelay: '450ms' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto px-2 sm:px-0">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 text-center hover:bg-white/20 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px]">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-none">
                  15+
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 leading-tight whitespace-nowrap">
                  Lat Doświadczenia
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 text-center hover:bg-white/20 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px]">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-none">
                  1000+
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 leading-tight whitespace-nowrap">
                  Zadowolonych Klientów
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 text-center hover:bg-white/20 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px]">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-none">
                  2000+
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 leading-tight whitespace-nowrap">
                  Wykonanych Usług
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 text-center hover:bg-white/20 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px]">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-none">
                  98%
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 leading-tight whitespace-nowrap">
                  Satysfakcji Klientów
                </div>
              </div>
            </div>
          </div>

          {/* Wyróżnione informacje */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-12">
            {/* Certyfikat */}
            <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-700 bg-white text-black p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl border-2 border-white hover:scale-[1.02] md:hover:scale-105 transition-transform duration-300 shadow-lg" style={{ transitionDelay: '500ms' }}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-5">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-black/5 rounded-full">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                    Certyfikat Szkolenia
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                    Mamy ukończony certyfikat ukończenia szkolenia prostowania felg, co potwierdza nasze profesjonalne kwalifikacje w tej dziedzinie.
                  </p>
                </div>
              </div>
            </div>

            {/* Duży wybór felg */}
            <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-700 bg-white text-black p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl border-2 border-white hover:scale-[1.02] md:hover:scale-105 transition-transform duration-300 shadow-lg" style={{ transitionDelay: '600ms' }}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-5">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-black/5 rounded-full">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                    Duży Wybór Felg
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                    Mamy dość duży wybór nowych felg aluminiowych, dzięki czemu każdy klient znajdzie coś odpowiedniego dla swojego pojazdu.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center fade-in-element opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '700ms' }}>
            <a 
              href="/gallery" 
              className="inline-block border-2 border-white text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 font-semibold hover:bg-white hover:text-black transition-all duration-500 inline-flex items-center gap-2 group rounded-lg text-xs sm:text-sm md:text-base lg:text-lg"
            >
              Zobacz nasze prace 
              <span className="group-hover:translate-x-1 transition-transform duration-500">&gt;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}



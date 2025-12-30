'use client';

import { useEffect, useRef } from 'react';

// Ikony SVG
const TireIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" strokeWidth="2.5"/>
    <circle cx="12" cy="12" r="5.5" strokeWidth="2"/>
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const WrenchIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="6" r="1.5" fill="currentColor" opacity="0.8"/>
  </svg>
);

const WheelIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9.5" strokeWidth="2.5"/>
    <circle cx="12" cy="12" r="6" strokeWidth="2"/>
    <path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5.64 5.64l2.83 2.83M15.53 15.53l2.83 2.83M5.64 18.36l2.83-2.83M15.53 8.47l2.83-2.83" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2.5" strokeWidth="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

const StorageIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <rect x="3" y="6" width="18" height="15" rx="1.5" strokeWidth="2"/>
    <path d="M3 11h18M3 16h18M3 21h18" strokeWidth="1.5"/>
    <circle cx="7" cy="8.5" r="2" strokeWidth="1.5"/>
    <circle cx="12" cy="8.5" r="2" strokeWidth="1.5"/>
    <circle cx="17" cy="8.5" r="2" strokeWidth="1.5"/>
    <circle cx="7" cy="13.5" r="2" strokeWidth="1.5"/>
    <circle cx="12" cy="13.5" r="2" strokeWidth="1.5"/>
    <circle cx="17" cy="13.5" r="2" strokeWidth="1.5"/>
    <path d="M6 3v3M18 3v3" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('opacity-100', 'translate-y-0');
              }, index * 100);
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

  const services = [
    {
      title: 'Wymiana opon',
      description: 'Profesjonalna wymiana opon dla samochodów osobowych, dostawczych i motocykli. Doświadczony zespół i szybka obsługa - zadbamy o bezpieczeństwo Twojego pojazdu.',
      icon: TireIcon
    },
    {
      title: 'Naprawa opon',
      description: 'Kompleksowa wulkanizacja i naprawa opon. Naprawiamy przebicia i uszkodzenia - dzięki profesjonalnemu sprzętowi, Twoje opony będą jak nowe.',
      icon: WrenchIcon
    },
    {
      title: 'Sprzedaż felg aluminiowych',
      description: 'Szeroki wybór nowych felg aluminiowych oraz akcesoria: dystanse, śruby i pierścienie centrujące. Pomagamy dobrać idealne felgi do Twojego pojazdu.',
      icon: WheelIcon
    },
    {
      title: 'TPMS',
      description: 'Sprzedaż i montaż czujników TPMS. Zapewnij sobie pełne bezpieczeństwo dzięki ciągłemu monitorowaniu ciśnienia w oponach.',
      icon: WrenchIcon
    },
    {
      title: 'Prostowanie felg',
      description: 'Profesjonalne prostowanie felg aluminiowych przy użyciu nowoczesnych technologii. Posiadamy certyfikat - Twoje felgi wrócą do idealnego stanu.',
      icon: WrenchIcon
    },
    {
      title: 'Przechowywanie',
      description: 'Bezpieczne sezonowe przechowywanie kół i opon w odpowiednich warunkach. Zaoszczędź miejsce w domu i powierz opony profesjonalistom.',
      icon: StorageIcon
    }
  ];

  return (
    <section ref={sectionRef} id="services" className="py-20 md:py-32 bg-black relative scroll-mt-20 sm:scroll-mt-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            ZAKRES USŁUG
          </h2>
          <div className="w-20 h-0.5 bg-white mx-auto mb-4"></div>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            Profesjonalna obsługa opon i felg dla wszystkich typów pojazdów
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="service-card opacity-0 translate-y-8 bg-black border-2 border-white p-6 sm:p-8 md:p-10 rounded-xl group cursor-pointer relative overflow-hidden"
                style={{ 
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Background overlay for hover effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out -z-0"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-4 sm:mb-6 text-white group-hover:text-black transition-colors duration-200 ease-out">
                    <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200 ease-out inline-block">
                      <IconComponent />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-black mb-4 sm:mb-5 transition-colors duration-200 ease-out">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/90 group-hover:text-black/90 transition-colors duration-200 ease-out text-sm sm:text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

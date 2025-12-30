'use client';

import Image from 'next/image';

export default function Contact() {
  return (
    <section id="contact" className="bg-black text-white py-20 md:py-32 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 right-0 w-96 h-96 border border-white rounded-full"></div>
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] border border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Image and Title Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24 items-center">
            {/* Left - Logo */}
            <div className="order-2 lg:order-1 flex items-center justify-center">
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-black flex items-center justify-center p-4 sm:p-6 md:p-8">
                <Image
                  src="/logo1.png"
                  alt="Serwis Opon Kinastowski"
                  width={600}
                  height={200}
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                  quality={85}
                />
              </div>
            </div>

            {/* Right - Title and Description */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
                KONTAKT
              </h2>
              <div className="w-20 sm:w-24 h-0.5 bg-white mb-4 sm:mb-6 mx-auto lg:mx-0"></div>
              <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Zapraszamy do kontaktu. Jesteśmy do Twojej dyspozycji i chętnie odpowiemy na wszystkie pytania dotyczące naszych usług.
              </p>
            </div>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12">
            {/* Phone */}
            <div className="bg-black border-2 border-white/20 rounded-2xl p-6 sm:p-8 md:p-10 hover:border-white/50 hover:bg-white/5 transition-all duration-500 group text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/60 group-hover:scale-110 transition-all duration-500">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm uppercase tracking-wider text-white/70 mb-3 sm:mb-4">Telefon</h3>
              <a 
                href="tel:575552835" 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white hover:opacity-80 transition-opacity duration-300 block"
              >
                575 552 835
              </a>
            </div>

            {/* Email */}
            <div className="bg-black border-2 border-white/20 rounded-2xl p-6 sm:p-8 md:p-10 hover:border-white/50 hover:bg-white/5 transition-all duration-500 group text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/60 group-hover:scale-110 transition-all duration-500">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm uppercase tracking-wider text-white/70 mb-3 sm:mb-4">Email</h3>
              <a 
                href="mailto:kinastowskiopony@gmail.com" 
                className="text-base sm:text-lg md:text-xl text-white hover:opacity-80 transition-opacity duration-300 break-all block"
              >
                kinastowskiopony@gmail.com
              </a>
            </div>

            {/* Address */}
            <div className="bg-black border-2 border-white/20 rounded-2xl p-6 sm:p-8 md:p-10 hover:border-white/50 hover:bg-white/5 transition-all duration-500 group text-center sm:col-span-2 md:col-span-1">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/60 group-hover:scale-110 transition-all duration-500">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm uppercase tracking-wider text-white/70 mb-3 sm:mb-4">Adres</h3>
              <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed">
                56-500 Syców<br />
                ul. Kępińska 8
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a 
              href="tel:575552835" 
              className="inline-block bg-white text-black px-10 py-4 md:px-12 md:py-5 font-semibold hover:opacity-90 transition-opacity duration-300 rounded-lg text-base md:text-lg"
            >
              Skontaktuj się z nami
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


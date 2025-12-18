import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="bg-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              POLITYKA PRYWATNOŚCI
            </h1>
            <div className="w-24 h-0.5 bg-white mb-12"></div>

            <div className="space-y-8 text-base md:text-lg leading-relaxed">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">1. Informacje ogólne</h2>
                <p className="text-white/90">
                  Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z serwisu internetowego Serwis Opon Kinastowski.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">2. Administrator danych</h2>
                <p className="text-white/90">
                  Administratorem danych osobowych jest Serwis Opon Kinastowski z siedzibą przy ul. Kępińska 8, 56-500 Syców.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">3. Pliki cookie</h2>
                <p className="text-white/90">
                  Strona wykorzystuje pliki cookie w celu zapewnienia prawidłowego działania serwisu oraz w celach analitycznych. Pliki cookie są małymi plikami tekstowymi zapisywanymi na urządzeniu użytkownika. Możesz zarządzać ustawieniami plików cookie w swojej przeglądarce.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">4. Gromadzone dane</h2>
                <p className="text-white/90">
                  W związku z korzystaniem ze strony możemy gromadzić następujące dane: adres IP, typ przeglądarki, czas wizyty, odwiedzone podstrony. Dane kontaktowe przekazane przez formularz kontaktowy są przetwarzane wyłącznie w celu odpowiedzi na zapytanie.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Prawa użytkownika</h2>
                <p className="text-white/90">
                  Użytkownik ma prawo do dostępu do swoich danych, ich poprawiania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania danych.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">6. Kontakt</h2>
                <p className="text-white/90">
                  W sprawach dotyczących ochrony danych osobowych można kontaktować się pod adresem email: kinastowskiopony@gmail.com lub telefonicznie: 575 552 835.
                </p>
              </div>

              <div className="pt-8 border-t border-white/20">
                <p className="text-sm text-white/70">
                  Ostatnia aktualizacja: {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


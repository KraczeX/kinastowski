import Header from '@/components/Header';
import Footer from '@/components/Footer';

const faqData = [
  {
    question: "Jak mogę złożyć zamówienie?",
    answer: "Zamówienie można złożyć telefonicznie pod numerem 575 552 835 lub osobiście w naszej siedzibie w Sycowie. Możesz też skontaktować się z nami przez e-mail: kinastowskiopony@gmail.com."
  },
  {
    question: "Jakie formy płatności są dostępne?",
    answer: "Akceptujemy płatności gotówką przy odbiorze w siedzibie sklepu oraz przelewem bankowym. O innych formach płatności można uzgodnić telefonicznie."
  },
  {
    question: "Czy oferujecie dostawę do domu?",
    answer: "Tak, możliwość dostawy do wskazanego adresu istnieje. Koszty i warunki dostawy ustalamy indywidualnie. Szczegóły można uzgodnić telefonicznie."
  },
  {
    question: "Jak długo trwa realizacja zamówienia?",
    answer: "Czas realizacji zależy od dostępności produktu. Produkty dostępne na magazynie można odebrać od ręki lub w ciągu 4 dni roboczych. W przypadku produktów sprowadzanych czas realizacji może być dłuższy i ustalamy go indywidualnie."
  },
  {
    question: "Czy mogę zwrócić zakupiony produkt?",
    answer: "Tak, zgodnie z przepisami prawa konsument ma prawo odstąpić od umowy w ciągu 14 dni od dnia otrzymania produktu. Szczegóły dotyczące zwrotów znajdują się w Regulaminie. Produkty muszą być nieużywane, w oryginalnym opakowaniu."
  },
  {
    question: "Czy produkty mają gwarancję?",
    answer: "Tak, wszystkie produkty oferowane w naszym sklepie objęte są gwarancją producenta. Szczegóły gwarancji są podane w dokumentacji produktu. W przypadku wad zgłoszonych w okresie gwarancyjnym pomagamy w procesie reklamacji."
  },
  {
    question: "Czy mogę zarezerwować produkt?",
    answer: "Tak, możliwe jest zarezerwowanie produktu telefonicznie. Rezerwacja jest ważna przez określony czas, który ustalamy indywidualnie. W przypadku braku kontaktu rezerwacja może wygasnąć."
  },
  {
    question: "Czy oferujecie montaż opon i felg?",
    answer: "Tak, nasz serwis oferuje profesjonalny montaż opon i felg. Wykonujemy również wyważanie kół, naprawę opon oraz inne usługi wulkanizacyjne. Szczegóły dotyczące usług znajdują się w zakładce Usługi."
  },
  {
    question: "Jak mogę sprawdzić dostępność produktu?",
    answer: "Dostępność produktów można sprawdzić na naszej stronie internetowej - produkty dostępne są oznaczone odpowiednim statusem. Aby upewnić się co do aktualnej dostępności, najlepiej skontaktować się z nami telefonicznie lub mailowo."
  },
  {
    question: "Czy ceny na stronie są aktualne?",
    answer: "Staramy się na bieżąco aktualizować ceny na stronie, jednak z uwagi na zmienność cen u dostawców, ceny mogą ulec zmianie. Aktualną cenę zawsze można potwierdzić telefonicznie. Cena ostateczna jest ustalana w momencie zawarcia umowy."
  },
  {
    question: "Czy oferujecie usługi dla firm?",
    answer: "Tak, współpracujemy z firmami i oferujemy atrakcyjne warunki współpracy dla flot pojazdów. Dla stałych klientów biznesowych przygotowujemy indywidualne oferty. Zapraszamy do kontaktu w celu omówienia szczegółów współpracy."
  },
  {
    question: "Jak mogę skontaktować się ze sklepem?",
    answer: "Z nami można skontaktować się telefonicznie pod numerem 575 552 835, mailowo na adres kinastowskiopony@gmail.com lub osobiście w naszej siedzibie w Sycowie. Godziny otwarcia można sprawdzić w zakładce Kontakt."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="bg-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              NAJCZĘŚCIEJ ZADAWANE PYTANIA
            </h1>
            <div className="w-24 h-0.5 bg-white mb-12"></div>
            <p className="text-white/70 text-base md:text-lg mb-12">
              Znajdź odpowiedzi na najczęściej zadawane pytania. Jeśli nie znajdziesz odpowiedzi na swoje pytanie, 
              skontaktuj się z nami telefonicznie lub mailowo.
            </p>
            
            <div className="space-y-4 md:space-y-6">
              {faqData.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 hover:bg-white/10 transition-colors"
                >
                  <h2 className="text-lg md:text-xl font-bold mb-3 text-white">
                    {item.question}
                  </h2>
                  <p className="text-white/80 leading-relaxed text-base">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 md:mt-16 bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
                Nie znalazłeś odpowiedzi?
              </h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Skontaktuj się z nami - chętnie odpowiemy na wszystkie Twoje pytania.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:575552835"
                  className="bg-white text-black hover:bg-white/90 px-6 py-3 rounded-xl font-semibold transition-colors inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  575 552 835
                </a>
                <a
                  href="mailto:kinastowskiopony@gmail.com"
                  className="bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-xl font-semibold transition-colors inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Napisz do nas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


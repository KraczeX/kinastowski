import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Regulamin() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="bg-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              REGULAMIN
            </h1>
            <div className="w-24 h-0.5 bg-white mb-12"></div>
            <div className="space-y-8 text-base md:text-lg leading-relaxed">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">1. Postanowienia ogólne</h2>
                <p className="mb-4 text-white/90">
                  Niniejszy regulamin określa zasady korzystania ze sklepu internetowego Serwis Opon Kinastowski, 
                  dostępnego pod adresem kinastowski.pl (zwany dalej „Sklepem").
                </p>
                <p className="text-white/90">
                  Właścicielem Sklepu jest Serwis Opon Kinastowski z siedzibą w Sycowie.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">2. Definicje</h2>
                <ul className="list-disc list-inside space-y-2 ml-4 text-white/90">
                  <li><strong>Sklep</strong> - sklep internetowy dostępny pod adresem kinastowski.pl</li>
                  <li><strong>Klient</strong> - osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, która korzysta ze Sklepu</li>
                  <li><strong>Produkt</strong> - towar oferowany w Sklepie (opony, felgi, akcesoria)</li>
                  <li><strong>Zamówienie</strong> - deklaracja woli Klienta zmierzająca do zawarcia umowy kupna-sprzedaży</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">3. Zawarcie umowy</h2>
                <p className="mb-4 text-white/90">
                  Umowa sprzedaży zawierana jest między Klientem a Sprzedawcą w momencie potwierdzenia zamówienia 
                  przez Sprzedawcę lub dostarczenia towaru do Klienta.
                </p>
                <p className="text-white/90">
                  Ceny produktów podane w Sklepie są cenami brutto w złotych polskich (zł) i zawierają podatek VAT, 
                  o ile przepisy prawa tak stanowią.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">4. Formy płatności</h2>
                <p className="mb-4 text-white/90">
                  Płatność za zakupione produkty może być dokonana:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-white/90">
                  <li>Gotówką przy odbiorze w siedzibie Sklepu</li>
                  <li>Przelewem bankowym na rachunek bankowy Sklepu</li>
                  <li>Innymi formami płatności za zgodą Sprzedawcy</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Dostawa</h2>
                <p className="mb-4 text-white/90">
                  Produkty dostępne są do odbioru w siedzibie Sklepu w Sycowie. 
                  O możliwości dostawy do wskazanego adresu należy uzgodnić telefonicznie.
                </p>
                <p className="text-white/90">
                  Koszty dostawy ustalane są indywidualnie w zależności od wybranej formy dostawy 
                  i wagi/zagłębienia produktów.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">6. Prawo odstąpienia od umowy</h2>
                <p className="mb-4 text-white/90">
                  Zgodnie z przepisami ustawy o prawach konsumenta, Klient będący konsumentem ma prawo odstąpić od umowy 
                  w terminie 14 dni od dnia objęcia produktu w posiadanie, bez podania przyczyny.
                </p>
                <p className="mb-4 text-white/90">
                  Prawo odstąpienia nie przysługuje w przypadku produktów wykonanych na specjalne zamówienie Klienta 
                  lub dostosowanych do jego indywidualnych potrzeb.
                </p>
                <p className="text-white/90">
                  Aby skorzystać z prawa odstąpienia, Klient powinien poinformować Sprzedawcę o swojej decyzji 
                  za pomocą oświadczenia na piśmie lub maila.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Reklamacje</h2>
                <p className="mb-4 text-white/90">
                  Klient ma prawo złożyć reklamację w przypadku stwierdzenia wad fizycznych lub prawnych produktu.
                </p>
                <p className="mb-4 text-white/90">
                  Reklamację należy złożyć w ciągu 2 lat od dnia dostarczenia produktu, 
                  w siedzibie Sklepu lub na adres e-mail: kinastowskiopony@gmail.com.
                </p>
                <p className="text-white/90">
                  Reklamacja powinna zawierać: dane Klienta, opis wady, datę zakupu oraz oczekiwany sposób rozpatrzenia reklamacji.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">8. Ochrona danych osobowych</h2>
                <p className="text-white/90">
                  Szczegółowe informacje dotyczące przetwarzania danych osobowych znajdują się 
                  w <a href="/privacy" className="text-white underline hover:text-white/80">Polityce Prywatności</a>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">9. Własność intelektualna</h2>
                <p className="text-white/90">
                  Wszystkie treści zamieszczone w Sklepie, w tym teksty, grafiki, logo, są własnością Sklepu 
                  i podlegają ochronie prawnej. Zabronione jest ich kopiowanie, rozpowszechnianie lub wykorzystywanie 
                  bez zgody Sklepu.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">10. Postanowienia końcowe</h2>
                <p className="mb-4 text-white/90">
                  W sprawach nieuregulowanych w niniejszym Regulaminie mają zastosowanie przepisy prawa polskiego, 
                  w szczególności Kodeksu Cywilnego oraz ustawy o prawach konsumenta.
                </p>
                <p className="mb-4 text-white/90">
                  Sprzedawca zastrzega sobie prawo do wprowadzania zmian w Regulaminie. 
                  O zmianach Klienci będą informowani poprzez publikację nowego Regulaminu w Sklepie.
                </p>
                <p className="text-white/90">
                  Regulamin wchodzi w życie z dniem jego publikacji w Sklepie.
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

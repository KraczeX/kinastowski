import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sklep from '@/components/Sklep';

export default function SklepPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Sklep kategoria="wszystkie" />
      <Footer />
    </div>
  );
}


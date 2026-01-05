import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sklep from '@/components/Sklep';

export default function KategoriaPage({ params }: { params: { kategoria: string } }) {
  return (
    <div className="min-h-screen">
      <Header />
      <Sklep kategoria={params.kategoria} />
      <Footer />
    </div>
  );
}


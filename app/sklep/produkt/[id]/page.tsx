import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProduktDetails from '@/components/ProduktDetails';

export default async function ProduktPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNumericId = /^\d+$/.test(id);
  
  return (
    <div className="min-h-screen">
      <Header />
      <ProduktDetails 
        {...(isNumericId ? { produktId: parseInt(id) } : { felgaId: id })} 
      />
      <Footer />
    </div>
  );
}


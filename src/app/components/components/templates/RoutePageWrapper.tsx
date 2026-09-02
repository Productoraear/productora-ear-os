import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';

const RoutePageWrapper: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen font-body flex items-center justify-center">
      <div className="text-center max-w-2xl px-4 animate-fade-in">
        <div className="w-20 h-20 bg-ear-gold/10 border border-ear-gold/30 rounded-full flex items-center justify-center mx-auto mb-8">
           <Construction className="text-ear-gold" size={40} />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 uppercase">
          Área en <span className="text-ear-gold">Construcción</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed italic">
          "Estamos desplegando la infraestructura técnica para la ruta: <span className="text-white font-mono">{pathname}</span>. Vuelve pronto para descubrir el arsenal completo."
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-ear-gold transition-colors"
        >
          <ArrowLeft size={16} /> Volver al Centro de Comando
        </Link>
      </div>
    </div>
  );
};

export default RoutePageWrapper;

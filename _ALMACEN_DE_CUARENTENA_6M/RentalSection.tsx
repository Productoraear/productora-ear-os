
import React, { useState } from 'react';
import { Plus, Minus, Wrench, ArrowRight, Box, Cpu, Layers, Settings } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { RENTAL_PRODUCTS } from '../../data/rentals';

const RentalSection: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [cart, setCart] = useState<{id: number, qty: number}[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const categories = ['Todos', 'Pantallas LED', 'Monitores & TV', 'Sonido Profesional', 'Iluminación', 'Vídeo & IT', 'Escenarios'];
  
  const filteredProducts = filter === 'Todos' 
    ? RENTAL_PRODUCTS 
    : RENTAL_PRODUCTS.filter(p => p.category === filter);

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => {
    const product = RENTAL_PRODUCTS.find(p => p.id === item.id);
    return acc + (product ? product.price * item.qty : 0);
  }, 0);
  
  return (
    <div className="pt-20 bg-black min-h-screen font-body">
      
      {/* Header Estilo EAR */}
      <div className="relative py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auhref=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ear-gold/10 border border-ear-gold/30 text-ear-gold text-xs font-bold uppercase tracking-widest mb-6">
            <Box size={12} /> Infraestructura de Contexto 360
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 uppercase leading-tight">
            EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-ear-gold to-white">Arsenal Técnico</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Hemos absorbido las mejores capacidades técnicas para ofrecerte un despliegue sin fisuras bajo el dominio <strong className="text-white">productoraear.com</strong>. No alquilamos equipos, <strong className="text-white">construimos el entorno de tu éxito</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* CATALOG (Left Col) */}
        <div className="lg:col-span-8">
          
          <div className="flex flex-wrap gap-2 mb-10 sticky top-24 z-20 bg-black/95 backdrop-blur py-4 border-b border-white/10 lg:static lg:bg-transparent lg:border-0 lg:py-0">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)} 
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === cat 
                    ? 'bg-ear-gold text-black shadow-lg border-ear-gold' 
                    : 'bg-white/5 text-gray-500 border border-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden hover:border-ear-gold/40 transition-all group flex flex-col shadow-lg">
                <div className="h-64 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"/>
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                     productoraear.com/{product.slug}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <span className="text-[10px] text-ear-gold font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Cpu size={10} /> {product.category}
                  </span>
                  <h3 className="text-xl font-display font-bold text-white leading-tight mb-3 group-hover:text-ear-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 font-light">{product.desc}</p>

                  <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-6">
                     <div className="text-right w-full">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Inversión Base</p>
                        <p className="text-lg font-bold text-ear-gold">{product.price}€ <span className="text-xs text-gray-600 font-normal">{product.unit ? `/ ${product.unit}` : ''}</span></p>
                     </div>
                  </div>

                  <button 
                    onClick={() => addToCart(product.id)} 
                    className="mt-6 w-full py-4 bg-white/5 hover:bg-ear-gold hover:text-black text-white font-bold uppercase tracking-widest text-[10px] rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/10"
                  >
                    <Plus size={16}/> Añadir al Plano Técnico
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* CONFIGURATOR (Right Col) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            
            <div className="p-8 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                    <Layers className="text-ear-gold" size={24} /> 
                    Plano Técnico
                </h3>
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">Despliegue de Infraestructura Crítica</p>
            </div>

            <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                {cart.length === 0 ? (
                    <div className="text-center py-16 px-8 opacity-40">
                        <Settings size={32} className="mx-auto mb-4" />
                        <p className="text-white font-bold text-sm">Plano en Blanco</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.map(item => {
                            const product = RENTAL_PRODUCTS.find(p => p.id === item.id);
                            if (!product) return null;
                            return (
                                <div key={item.id} className="bg-white/5 p-4 rounded-xl border border-white/5 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-white text-xs font-bold uppercase tracking-wider">{product.name}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-400"><Wrench size={14}/></button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-ear-gold text-[10px] font-mono font-bold">{product.price}€ / ud</p>
                                        <span className="text-xs font-bold text-white">Cant: {item.qty}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-8 bg-white/5 border-t border-white/10">
                    <div className="flex justify-between text-white font-bold text-lg mb-6">
                        <span className="text-xs uppercase tracking-widest text-gray-500">Inversión Est.</span>
                        <span className="text-ear-gold">{subtotal.toFixed(0)}€</span>
                    </div>
                    <button 
                        onClick={() => setPaymentModalOpen(true)} 
                        className="w-full py-4 bg-ear-gold text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                        Validar Viabilidad Técnica <ArrowRight size={14}/>
                    </button>
                </div>
            )}
          </div>
        </div>

      </div>

      <PaymentModal 
        isOpen={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)}
        amount={subtotal} 
        concept="Reserva de Infraestructura Técnica EAR"
      />
    </div>
  );
};

export default RentalSection;

"use client";
import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, Twitter, Linkedin, Share2, Shield } from 'lucide-react';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';
import { ROUTES } from '@/lib/routes';
import { CENTRALITA } from '@/lib/phone-constants';

const Footer: React.FC = () => {
  const shareSite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'VIMUME OS - Ecosistema de Propósito',
        text: 'Arquitectura de Salud Cognitiva & Impacto Social Institucional.',
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const { role } = useSovereignRole();

  const menuItems = [
    { name: "Eventos", path: "/eventos", visible: true },
    { name: "Artistas", path: "/artistas", visible: true },
    { name: "Vimume", path: ROUTES.vimume, visible: true },
    { name: "Contacto", path: ROUTES.contacto, visible: true },
    { name: "Quiénes Somos", path: "/about", visible: true },
    { name: "Dossier VIMUME", path: "/dossier", visible: role !== 'ROLE_GUEST' },
    { name: "Panel", path: "/centro-mando", visible: role === 'ROLE_ADMIN' || role === 'ROLE_PROVIDER' || role === 'ROLE_AFFILIATE' },
  ];


  return (
    <footer className="bg-[#050505] pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* Brand & Socials */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
               <img 
                 src="https://lh3.googleusercontent.com/a/ACg8ocJF7O8ZaJG4WsLPfVaVe5f5Gmu80nOoea2teuOAs-s9sq53uNk=s288-c-no" 
                 alt="EAR OS Logo" 
                 className="w-12 h-12 rounded-xl object-cover border border-[#ecb613]/50 shadow-[0_0_20px_rgba(212,168,85,0.3)]"
               />
               <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-syne">
                 EAR <span className="text-[#ecb613]">OS V2</span>
               </h2>
            </div>
            <p className="text-white/40 font-body max-w-sm mb-10 leading-relaxed text-sm">
              Construyendo la infraestructura invisible de los eventos más memorables. Autoridad indiscutible en producción técnica y gestión artística de alto impacto.
            </p>
            
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ecb613]">Redes Operativas</span>
              <div className="flex space-x-4">
                {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => {
                  const names = ["Instagram", "Facebook", "Twitter", "Linkedin"];
                  return (
                    <a 
                      key={i} 
                      href={`https://${names[i].toLowerCase()}.com/productoraear`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`Visitar nuestro perfil de ${names[i]}`}
                      className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white hover:bg-[#ecb613] hover:text-black hover:border-[#ecb613] transition-all hover:-translate-y-1"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
                <button 
                  onClick={shareSite}
                  aria-label="Compartir Ecosistema EAR OS"
                  className="w-12 h-12 rounded-2xl border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] hover:bg-[#ecb613] hover:text-black transition-all"
                  title="Compartir Ecosistema"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Estructura</h4>
            <ul className="space-y-4 font-body text-sm text-white/40">
              {menuItems.filter(item => item.visible).map(item => (
                <li key={item.name}>
                  <Link href={item.path} className="hover:text-[#ecb613] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Contacto</h4>
            <ul className="space-y-6 font-body text-sm text-white/40">
              <li>
                <a href={CENTRALITA.tel} className="flex items-center gap-4 group cursor-pointer hover:text-[#ecb613] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#ecb613]/10 group-hover:text-[#ecb613] transition-colors">
                    <Phone size={18} />
                  </div>
                  <span>{CENTRALITA.display}</span>
                </a>
              </li>
              <li>
                <a href={CENTRALITA.email} className="flex items-center gap-4 group cursor-pointer hover:text-[#ecb613] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#ecb613]/10 group-hover:text-[#ecb613] transition-colors">
                    <Mail size={18} />
                  </div>
                  <span>{CENTRALITA.emailDisplay}</span>
                </a>
              </li>
              <li className="pt-6 border-t border-white/5 leading-relaxed text-[11px] uppercase font-black tracking-widest text-white/20">
                Sede Central: Méntrida, Toledo<br/>
                <span className="text-[#ecb613]/40 mt-1 block">Logística Global Activada</span>
              </li>
            </ul>
          </div>

        </div>
        
        {/* 🗺️ TERRITORIAL NETWORK (SEO INTERLINKING) */}
        <div className="border-t border-white/5 py-12">
          <h4 className="text-white/20 font-black uppercase tracking-[0.5em] text-[9px] mb-8 text-center">Nuestra Red de Dominancia Territorial</h4>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 opacity-30 hover:opacity-100 transition-opacity duration-1000">
            {["Alava", "Albacete", "Alicante", "Almeria", "Asturias", "Avila", "Badajoz", "Baleares", "Barcelona", "Burgos", "Caceres", "Cadiz", "Cantabria", "Castellon", "Ciudad-Real", "Cordoba", "Cuenca", "Gerona", "Granada", "Guadalajara", "Guipuzcoa", "Huelva", "Huesca", "Jaen", "Leon", "Lerida", "Lugo", "Madrid", "Malaga", "Murcia", "Navarra", "Orense", "Palencia", "Las-Palmas", "Pontevedra", "La-Rioja", "Salamanca", "Segovia", "Sevilla", "Soria", "Tarragona", "Tenerife", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"].map((prov) => (
              <Link 
                key={prov} 
                href={`/servicios/sonorizacion-eventos/${prov.toLowerCase()}`}
                className="text-[8px] font-bold uppercase tracking-widest hover:text-[#ecb613] transition-colors"
              >
                {prov}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">
          <p>&copy; {new Date().getFullYear()} VIMUME OS. Exit Code 0.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, Twitter, Linkedin, Share2, Shield } from 'lucide-react';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';

const Footer: React.FC = () => {
  const shareSite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'EAR OS - Ecosistema de Producción',
        text: 'Arquitectura de Eventos & Management Artístico S-Class.',
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const { role } = useSovereignRole();

  const menuItems = [
    { name: "Eventos", path: "/eventos", visible: true },
    { name: "Artistas", path: "/artistas", visible: true },
    { name: "Vimume", path: "/vimume", visible: true },
    { name: "Cotizador Premium", path: "/cotizador", visible: true },
    { name: "Quiénes Somos", path: "/about", visible: true },
    { name: "Dossier S-Class", path: "/dossier", visible: role !== 'ROLE_B2C' },
    { name: "Nexus", path: "/centro-mando", visible: role === 'ROLE_ADMIN' || role === 'ROLE_B2B' },
  ];


  return (
    <footer className="bg-[#050505] pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4a855]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* Brand & Socials */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-[#d4a855] rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,168,85,0.3)]">
                 <Shield size={24} />
               </div>
               <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                 EAR <span className="text-[#d4a855]">OS GOLD</span>
               </h2>
            </div>
            <p className="text-white/40 font-body max-w-sm mb-10 leading-relaxed text-sm">
              Construyendo la infraestructura invisible de los eventos más memorables. Autoridad indiscutible en producción técnica y gestión artística de alto impacto.
            </p>
            
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4a855]">Redes Operativas</span>
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
                      className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white hover:bg-[#d4a855] hover:text-black hover:border-[#d4a855] transition-all hover:-translate-y-1"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
                <button 
                  onClick={shareSite}
                  aria-label="Compartir Ecosistema EAR OS"
                  className="w-12 h-12 rounded-2xl border border-[#d4a855]/30 flex items-center justify-center text-[#d4a855] hover:bg-[#d4a855] hover:text-black transition-all"
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
                  <Link href={item.path} className="hover:text-[#d4a855] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4a855] opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#d4a855]/10 group-hover:text-[#d4a855] transition-colors">
                  <Phone size={18} />
                </div>
                <span>+34 693 693 048</span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#d4a855]/10 group-hover:text-[#d4a855] transition-colors">
                  <Mail size={18} />
                </div>
                <span>hola@productoraear.com</span>
              </li>
              <li className="pt-6 border-t border-white/5 leading-relaxed text-[11px] uppercase font-black tracking-widest text-white/20">
                Sede Central: Méntrida, Toledo<br/>
                <span className="text-[#d4a855]/40 mt-1 block">Logística Global Activada</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">
          <p>&copy; {new Date().getFullYear()} Productora EAR. Exit Code 0.</p>
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

import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Catálogo de Artistas S-Class | Productora EAR',
  description: 'Explora y contrata el catálogo exclusivo de artistas, mariachis, orquestas y grupos musicales de Productora EAR.',
};

export default function ArtistasPage() {
  const artistas = [
    {
      id: 'mariachi-bodas-madrid-solista',
      nombre: 'Mariachi Sol de Madrid',
      categoria: 'Mariachi / High-Ticket',
      rating: '4.9/5',
      shows: '450+ Eventos',
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrZgks4GsWmEDKFQNVrOB37mgl_-Duaigz_IKgADnLbVLPr_5lzctoYf3DMe2d70Yuinv4D1BcKTx0fpKoQ00HDxQNaxT5itANIpwjBL5i_eyzs2_HfyrmoTeXTOi5Vglb9I7qCcFi5Hy8IWlokBM7qP_2lbm8RhTEDxFS7BjZPOw9TR4jsHwIergb7oKT9mQ4d0RSfaspsMDfCwQCBR4yMwdlE2V0yz20cPo9-29pw0hf3EL6ahw6NU8VeYThQGd5pwAOL1_njA',
      leverage: 'ALTO LEVERAGE',
    },
    {
      id: 'mariachis-bodas-barcelona-gala',
      nombre: 'Gala Ranchera Barcelona',
      categoria: 'Mariachi / Ensamble Real',
      rating: '4.8/5',
      shows: '320+ Eventos',
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ6lzt-zlx09RLp8Bh3Q4Z9muNKrxNwbZj6lfnIL4nXiR5nAzoxSf8y3dlO91NWzsf5CCidqLF5JiCGboTydFg5iHb9q1ith5X6dFLoB8qapQ9FKPWCgwKA7NHIp7u43xCU_8v4eckjU1ho5y44DMo5nsSZWY9NYHRCnPvYckhhhD3OLqp_g0MtJ-19T-qgAjst6bXYjXjdUBAoSb5rSFT9eHQ6805naLvinPmeZq7lU94HanTSJZDZ2JRgltZZaWQdHBJ0Vgoog',
      leverage: 'STANDARD',
    },
    {
      id: 'mariachi-caballo-eventos-sevilla',
      nombre: 'Mariachi a Caballo Sevilla',
      categoria: 'Espectáculo Ecuestre',
      rating: '5.0/5',
      shows: '180+ Eventos',
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu6a-B5xc-O0dFkQD_dd2x2SWSnCrezUf0Pc1pNisJ21XE418p5E86YqJJ_7RH5NWDGU__-NjRwoFUjIsYuUKzdjv-CyIotOHAHYbXb6PEzvq6nWMV_buFkDgHMUB93IRBOOJ9L1vmabEEyobZ6jRKG7T2TvYCrMWBpJaKrxFNa9D_YeWWjdAqIod6aa1mFIwkMqobS0usYWzC3J__3CKN4g1koBAhtmEVvPz54GftzboDUEFvXEbD_6MADtpyhZjQniRI88GQyQ',
      leverage: 'ALTO LEVERAGE',
    },
  ];

  return (
    <div className="bg-[#050505] text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      {/* TOP NAVIGATION BAR */}
      <header className="bg-[#0A0A0A] border-b border-[#D4AF37]/10 flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-headline font-bold text-[#F2CA50] uppercase tracking-widest hover:opacity-80 transition-opacity">
            PRODUCTORA EAR
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-[#C6C6C6] font-label uppercase text-xs tracking-widest hover:text-[#F2CA50] transition-colors duration-100">
              Inicio
            </Link>
            <Link href="/artistas" className="text-[#F2CA50] border-b-2 border-[#F2CA50] pb-1 font-label uppercase text-xs tracking-widest">
              Catálogo Artistas
            </Link>
            <Link href="/presupuesto" className="text-[#C6C6C6] font-label uppercase text-xs tracking-widest hover:text-[#F2CA50] transition-colors duration-100">
              Cotizador
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 border border-primary/20 text-primary font-label text-[10px] tracking-widest bg-primary/5">
            ROSTER_STATUS: ACTIVE
          </div>
          <Link href="/presupuesto" className="bg-primary text-on-primary px-4 py-1.5 font-label text-xs uppercase tracking-wider font-bold hover:bg-primary-container transition-colors">
            CONTRATAR
          </Link>
        </div>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0A0A0A] border-r border-[#D4AF37]/5 flex flex-col pt-24 pb-8 z-40 hidden md:flex">
        <div className="px-6 mb-8">
          <h3 className="text-[#F2CA50] font-label font-bold text-xs tracking-[0.15rem] mb-1">EAR_ROSTER</h3>
          <p className="text-secondary opacity-60 font-label text-[9px] tracking-widest">V.2.0.0_CATALOG</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/artistas" className="text-[#F2CA50] bg-[#1C1B1B] border-l-2 border-[#F2CA50] px-6 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-sm">groups</span>
            <span className="font-label uppercase text-[10px] tracking-[0.15rem]">TODOS LOS ARTISTAS</span>
          </Link>
          <Link href="/artistas?categoria=mariachis" className="text-[#C6C6C6] opacity-60 px-6 py-3 flex items-center gap-3 hover:bg-[#1C1B1B] hover:text-[#E5E2E1] transition-all">
            <span className="material-symbols-outlined text-sm">music_note</span>
            <span className="font-label uppercase text-[10px] tracking-[0.15rem]">MARIACHIS</span>
          </Link>
          <Link href="/artistas?categoria=solistas" className="text-[#C6C6C6] opacity-60 px-6 py-3 flex items-center gap-3 hover:bg-[#1C1B1B] hover:text-[#E5E2E1] transition-all">
            <span className="material-symbols-outlined text-sm">person</span>
            <span className="font-label uppercase text-[10px] tracking-[0.15rem]">SOLISTAS & DJS</span>
          </Link>
          <Link href="/presupuesto" className="text-[#C6C6C6] opacity-60 px-6 py-3 flex items-center gap-3 hover:bg-[#1C1B1B] hover:text-[#E5E2E1] transition-all">
            <span className="material-symbols-outlined text-sm">calculate</span>
            <span className="font-label uppercase text-[10px] tracking-[0.15rem]">PRESUPUESTO RAPIDO</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT CANVAS */}
      <main className="ml-0 md:ml-64 pt-24 px-8 pb-12 min-h-screen relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* HERO TITLE SECTION */}
          <section className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#4D4635]/15 pb-6">
            <div>
              <h1 className="font-headline text-5xl italic tracking-tighter text-on-surface">Catálogo de Artistas S-Class</h1>
              <p className="font-label text-xs uppercase tracking-[0.3rem] text-primary mt-2">Formatos verificados // Auditoría de Integridad EAR</p>
            </div>
            <div className="mt-4 md:mt-0 font-label text-[0.65rem] text-secondary text-right">
              DISPONIBILIDAD: DIRECTA<br />FILTROS: ACTIVOS
            </div>
          </section>

          {/* ARTISTS GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistas.map((artista) => (
              <div key={artista.id} className="group bg-surface-container-low border border-outline-variant/20 overflow-hidden hover:border-primary transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={artista.imagen} 
                    alt={artista.nombre}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-primary-container text-on-primary-container font-label text-[0.6rem] px-2.5 py-0.5 font-bold tracking-wider">
                    {artista.leverage}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="font-label text-[0.65rem] text-primary tracking-widest uppercase mb-1">{artista.categoria}</p>
                    <h3 className="font-headline text-2xl italic text-on-surface">{artista.nombre}</h3>
                  </div>

                  <div className="flex justify-between items-center text-xs font-label text-secondary border-t border-outline-variant/10 pt-4">
                    <span>Valoración: <strong className="text-primary">{artista.rating}</strong></span>
                    <span>{artista.shows}</span>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Link 
                      href={`/artistas/${artista.id}`}
                      className="flex-1 text-center py-2.5 border border-primary/30 text-primary font-label text-[0.7rem] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
                    >
                      Ver Ficha
                    </Link>
                    <Link 
                      href="/presupuesto"
                      className="px-4 py-2.5 bg-surface-container-high border border-outline-variant/30 text-on-surface font-label text-[0.7rem] uppercase tracking-widest hover:border-primary transition-all"
                    >
                      Cotizar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

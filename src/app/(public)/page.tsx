import React from 'react';

export default function Home() {
  const mockSkills = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    version: `V.0.0.${i}`,
    title: `Skill Node ${100 + i}`
  }));

  return (
    <div className="bg-[#050505] text-on-surface font-body overflow-hidden h-screen flex flex-col">
      {/* Top Navigation Anchor */}
      <header className="flex justify-between items-center px-6 w-full h-16 border-b border-[#4D4635]/15 bg-[#050505] z-50">
        <div className="flex items-center gap-4">
          <span className="font-headline text-[#F2CA50] italic font-bold tracking-tighter text-2xl">FENIX v2.0</span>
          <div className="h-4 w-px bg-outline-variant/30 hidden md:block"></div>
          <span className="font-label text-[0.65rem] tracking-[0.2rem] text-secondary hidden md:block">COMMAND CENTER // S-CLASS</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-sm">search</span>
            <input 
              className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary text-xs font-label uppercase tracking-widest pl-10 pr-4 py-2 w-64" 
              placeholder="QUERY SYSTEM..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#C6C6C6] hover:text-[#F2CA50] transition-colors cursor-pointer" data-icon="terminal">terminal</span>
            <span className="material-symbols-outlined text-[#C6C6C6] hover:text-[#F2CA50] transition-colors cursor-pointer" data-icon="settings">settings</span>
            <img 
              alt="User Profile" 
              className="w-8 h-8 object-cover grayscale brightness-75" 
              data-alt="Close up portrait of a professional male strategist in dark clothing with sharp lighting against a black background" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrZgks4GsWmEDKFQNVrOB37mgl_-Duaigz_IKgADnLbVLPr_5lzctoYf3DMe2d70Yuinv4D1BcKTx0fpKoQ00HDxQNaxT5itANIpwjBL5i_eyzs2_HfyrmoTeXTOi5Vglb9I7qCcFi5Hy8IWlokBM7qP_2lbm8RhTEDxFS7BjZPOw9TR4jsHwIergb7oKT9mQ4d0RSfaspsMDfCwQCBR4yMwdlE2V0yz20cPo9-29pw0hf3EL6ahw6NU8VeYThQGd5pwAOL1_njA"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Left: Leverage Filter */}
        <aside className="flex flex-col h-full w-64 bg-[#0A0A0A] border-r border-[#4D4635]/15 z-40">
          <div className="p-6">
            <h2 className="font-label text-[0.75rem] uppercase tracking-[0.1rem] text-[#F2CA50] font-black">LEVERAGE FILTER</h2>
            <p className="font-label text-[0.6rem] text-secondary tracking-widest mt-1">S-CLASS SKILLS HUB</p>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            <a className="flex items-center gap-3 px-4 py-3 bg-[#2A2A2A] text-[#F2CA50] border-l-2 border-[#F2CA50] font-label text-[0.75rem] uppercase tracking-[0.1rem]" href="#">
              <span className="material-symbols-outlined text-sm" data-icon="priority_high">priority_high</span>
              High Leverage
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-[#C6C6C6] hover:bg-[#1C1B1B] transition-all font-label text-[0.75rem] uppercase tracking-[0.1rem]" href="#">
              <span className="material-symbols-outlined text-sm" data-icon="speed">speed</span>
              Medium Leverage
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-[#C6C6C6] hover:bg-[#1C1B1B] transition-all font-label text-[0.75rem] uppercase tracking-[0.1rem]" href="#">
              <span className="material-symbols-outlined text-sm" data-icon="layers">layers</span>
              Standard
            </a>
          </nav>
          <div className="mt-auto p-4 space-y-1 border-t border-[#4D4635]/10">
            <a className="flex items-center gap-3 px-4 py-2 text-[#C6C6C6] hover:bg-[#1C1B1B] transition-all font-label text-[0.65rem] uppercase tracking-[0.1rem]" href="#">
              <span className="material-symbols-outlined text-sm" data-icon="monitoring">monitoring</span>
              TELEMETRY
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-[#C6C6C6] hover:bg-[#1C1B1B] transition-all font-label text-[0.65rem] uppercase tracking-[0.1rem]" href="#">
              <span className="material-symbols-outlined text-sm" data-icon="code">code</span>
              LOGS
            </a>
          </div>
        </aside>

        {/* Central Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#050505] p-8 flex flex-col gap-12" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Hero Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#4D4635]/15 pb-6">
            <div>
              <h1 className="font-headline text-5xl italic tracking-tighter text-on-surface">Skill Repository</h1>
              <p className="font-label text-xs uppercase tracking-[0.3rem] text-primary mt-2">Accessing encrypted dossiers...</p>
            </div>
            <div className="mt-4 md:mt-0 font-label text-[0.65rem] text-secondary text-right">
              LATENCY: 14MS<br/>CONNECTION: SECURE
            </div>
          </div>

          {/* Skill Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* High Leverage Card 1 */}
            <div className="group relative bg-surface-container-low border border-primary-container p-5 transition-all duration-150 hover:bg-surface-container-high cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary-container text-on-primary-container font-label text-[0.6rem] px-2 py-0.5 tracking-tighter font-bold">ALTO LEVERAGE</span>
                <span className="font-label text-[0.65rem] text-secondary tracking-widest uppercase">V.1.1.0</span>
              </div>
              <p className="font-label text-[0.65rem] text-primary-container tracking-widest uppercase mb-1">High-Leverage Conversion</p>
              <h3 className="font-headline text-2xl italic text-on-surface mb-6">Copywriting Elite</h3>
              <div className="flex justify-between items-center mt-auto border-t border-outline-variant/20 pt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm" data-icon="database">database</span>
                  <span className="font-label text-xs font-bold tracking-widest">1,200</span>
                </div>
                <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-surface-container-low border border-outline-variant/20 p-5 transition-all duration-150 hover:bg-surface-container-high cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-surface-container-highest text-secondary font-label text-[0.6rem] px-2 py-0.5 tracking-tighter">STANDARD</span>
                <span className="font-label text-[0.65rem] text-secondary tracking-widest uppercase">V.0.9.4</span>
              </div>
              <p className="font-label text-[0.65rem] text-secondary tracking-widest uppercase mb-1">Traffic Optimization</p>
              <h3 className="font-headline text-2xl italic text-on-surface mb-6">SEO Archeology</h3>
              <div className="flex justify-between items-center mt-auto border-t border-outline-variant/20 pt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm" data-icon="database">database</span>
                  <span className="font-label text-xs font-bold tracking-widest">450</span>
                </div>
                <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-surface-container-low border border-primary-container p-5 transition-all duration-150 hover:bg-surface-container-high cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary-container text-on-primary-container font-label text-[0.6rem] px-2 py-0.5 tracking-tighter font-bold">ALTO LEVERAGE</span>
                <span className="font-label text-[0.65rem] text-secondary tracking-widest uppercase">V.2.0.1</span>
              </div>
              <p className="font-label text-[0.65rem] text-primary-container tracking-widest uppercase mb-1">Psychological Framing</p>
              <h3 className="font-headline text-2xl italic text-on-surface mb-6">Negotiation Prime</h3>
              <div className="flex justify-between items-center mt-auto border-t border-outline-variant/20 pt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm" data-icon="database">database</span>
                  <span className="font-label text-xs font-bold tracking-widest">2,500</span>
                </div>
                <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </div>

            {/* Generated Mock Cards */}
            {mockSkills.map((skill) => (
              <div key={skill.id} className="group relative bg-surface-container-low border border-outline-variant/10 p-5 transition-all duration-150 hover:bg-surface-container-high cursor-pointer opacity-40">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-surface-container-lowest text-secondary font-label text-[0.6rem] px-2 py-0.5 tracking-tighter">ARCHIVED</span>
                  <span className="font-label text-[0.65rem] text-secondary tracking-widest uppercase">{skill.version}</span>
                </div>
                <p className="font-label text-[0.65rem] text-secondary tracking-widest uppercase mb-1">Legacy System</p>
                <h3 className="font-headline text-2xl italic text-secondary mb-6">{skill.title}</h3>
                <div className="flex justify-between items-center mt-auto border-t border-outline-variant/10 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline-variant text-sm" data-icon="lock">lock</span>
                    <span className="font-label text-xs tracking-widest text-outline-variant">LOCKED</span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Expanded Detail Area (Focus on Copywriting Elite) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#4D4635]/15 border border-[#4D4635]/15">
            {/* Left Pane: Instructions */}
            <div className="bg-surface-container-low p-8">
              <h4 className="font-label text-[0.75rem] uppercase tracking-[0.2rem] text-primary mb-6">DEPLOYMENT PROTOCOL</h4>
              <div className="space-y-6">
                <div>
                  <h5 className="font-headline text-xl italic text-on-surface mb-2">Cómo usar esta skill...</h5>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    El copywriting de alto nivel no trata de palabras, sino de arquitectura psicológica. Implementa el framework <span className="text-primary font-bold">PAS+P+C</span> para maximizar la conversión en entornos de baja confianza.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-6 border-l border-primary">
                  <h5 className="font-headline text-lg italic text-on-surface mb-3">Ejemplo Práctico</h5>
                  <p className="text-on-surface-variant font-body italic text-sm">
                    "Mariachi para una boda high-ticket: No vendes música, vendes la <span className="underline decoration-primary/40 text-on-surface">eternización del momento</span>. La fatiga del evento se rompe con una entrada cinemática."
                  </p>
                </div>
              </div>
            </div>

            {/* Right Pane: Locked Content */}
            <div className="bg-[#0A0A0A] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <div className="relative z-20 space-y-4">
                <div className="flex justify-center mb-2">
                  <span className="material-symbols-outlined text-primary text-4xl animate-pulse" data-icon="lock" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <h4 className="font-label text-[0.75rem] uppercase tracking-[0.2rem] text-primary">NIVEL 3: MASTER ARCHITECT</h4>
                <div className="blur-sm select-none opacity-20 px-8">
                  <p className="font-label text-lg tracking-wider text-secondary">
                    Framework: Problema -&gt; Agitación -&gt; Solución -&gt; Prueba -&gt; CTA
                  </p>
                  <p className="mt-4 text-xs font-body text-secondary">
                    Contenido restringido. Requiere 5,000 puntos de reputación y activación del Protocolo EAR.
                  </p>
                </div>
                <button className="bg-primary text-on-primary px-8 py-3 font-label text-xs uppercase tracking-[0.15rem] font-bold hover:bg-primary-container transition-colors mt-6">
                  UNLOCK FULL FRAMEWORK
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Motto */}
          <footer className="pt-8 pb-12 text-center opacity-30">
            <p className="font-label text-[0.65rem] uppercase tracking-[0.5rem] text-secondary">
              33 Expertos en tu Bolsillo // El Blindaje EAR
            </p>
          </footer>
        </main>

        {/* Sidebar Right: Telemetry */}
        <aside className="hidden xl:flex flex-col w-72 bg-[#0A0A0A] border-l border-[#4D4635]/15 p-6 gap-8">
          <div>
            <h2 className="font-label text-[0.75rem] uppercase tracking-[0.15rem] text-primary mb-6">TOKEN CONSUMPTION</h2>
            <div className="space-y-2">
              <div className="flex justify-between font-label text-[0.6rem] text-secondary">
                <span>DATA THROUGHPUT</span>
                <span className="text-on-surface">450 / 1000 CR</span>
              </div>
              <div className="h-1 w-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-primary w-[45%]"></div>
              </div>
              <p className="font-label text-[0.5rem] text-outline text-right">SYSTEM STABLE</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <h3 className="font-label text-[0.65rem] uppercase tracking-[0.15rem] text-secondary">ACTIVE TELEMETRY</h3>
            {/* Mock Sparkline Items */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label text-[0.55rem] text-outline uppercase">Neural Load</p>
                <p className="font-label text-sm text-primary font-black">74.2%</p>
              </div>
              <div className="w-16 h-8 flex items-end gap-0.5">
                <div className="w-1 bg-primary/20 h-[30%]"></div>
                <div className="w-1 bg-primary/40 h-[50%]"></div>
                <div className="w-1 bg-primary/20 h-[40%]"></div>
                <div className="w-1 bg-primary/60 h-[70%]"></div>
                <div className="w-1 bg-primary h-[90%]"></div>
                <div className="w-1 bg-primary/40 h-[60%]"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-label text-[0.55rem] text-outline uppercase">Uptime</p>
                <p className="font-label text-sm text-secondary font-black">99.98%</p>
              </div>
              <div className="w-16 h-8 flex items-end gap-0.5">
                <div className="w-1 bg-secondary/20 h-[60%]"></div>
                <div className="w-1 bg-secondary/40 h-[60%]"></div>
                <div className="w-1 bg-secondary/20 h-[60%]"></div>
                <div className="w-1 bg-secondary/60 h-[60%]"></div>
                <div className="w-1 bg-secondary h-[60%]"></div>
                <div className="w-1 bg-secondary/40 h-[60%]"></div>
              </div>
            </div>

            <div className="border border-outline-variant/20 p-4 space-y-4">
              <h4 className="font-label text-[0.6rem] text-primary uppercase tracking-widest">LOG_FEED.v2</h4>
              <div className="space-y-2 font-label text-[0.55rem] leading-tight text-on-surface-variant">
                <p><span className="text-primary">[OK]</span> SESSION_START: 09:00:23</p>
                <p><span className="text-primary">[OK]</span> AUTH_SUCCESS: CID_9921</p>
                <p><span className="text-outline-variant">[..]</span> LOADING_SKILL_ELITE...</p>
                <p><span className="text-primary">[OK]</span> GRID_RENDER_COMPLETE</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full border border-primary/30 py-3 font-label text-[0.65rem] uppercase tracking-[0.2rem] text-primary hover:bg-primary hover:text-on-primary transition-all">
              BUY CREDITS
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

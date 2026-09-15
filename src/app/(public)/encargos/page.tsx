'use client';
import React, { useState } from 'react';
import {
  Music,
  Video,
  Heart,
  Send,
  Loader2,
  Clock,
  Mic2,
  Sparkles,
  Award,
  ShieldCheck,
  Disc3
} from 'lucide-react';
import { OccasionCategory, MusicalGenre, EmotionalTone } from '@/lib/types/digital-products';

const OCASIONES: { id: OccasionCategory; label: string; desc: string }[] = [
  { id: 'cumpleanos', label: '🎂 Cumpleaños de Impacto', desc: 'Para celebrar una edad clave con una dedicatoria inolvidable.' },
  { id: 'aniversario', label: '💍 Aniversario de Pareja', desc: 'Revive el camino recorrido y los momentos que os unieron.' },
  { id: 'boda_votos', label: '💒 Votos Nupciales Cantados', desc: 'Sorprende en el altar convirtiendo tus votos en una pieza lírica.' },
  { id: 'boda_baile', label: '💃 Primer Baile Nupcial', desc: 'Un tema exclusivo y único para abrir el vals de vuestra boda.' },
  { id: 'bodas_oro_plata', label: '👑 Bodas de Oro / Plata', desc: 'Homenaje a 25 o 50 años de trayectoria y familia.' },
  { id: 'pedida_mano', label: '💎 Pedida de Mano Sorpresa', desc: 'El preludio perfecto para una propuesta de matrimonio épica.' },
  { id: 'jubilacion', label: '🏆 Jubilación & Legado', desc: 'Agradecimiento de compañeros y familia a toda una vida laboral.' },
  { id: 'homenaje_padres', label: '❤️ Agradecimiento a Padres', desc: 'Palabras que nunca se dicen en el día a día, hechas música.' },
  { id: 'in_memoriam', label: '🕊️ Tributo a la Memoria', desc: 'Un homenaje respetuoso para recordar y honrar a quien ya no está.' },
  { id: 'agradecimiento', label: '🌟 Reconocimiento Especial', desc: 'Para mentores, amigos incondicionales o celebraciones únicas.' },
];

const GENEROS: { id: MusicalGenre; label: string; badge: string; desc: string }[] = [
  { id: 'crossover_lirico', label: 'Crossover Tenor Lírico', badge: 'Estilo Il Divo / Bocelli', desc: 'Arreglos de cuerda y voz de tenor lírico de máximo registro.' },
  { id: 'ranchera', label: 'Ranchera Imperial', badge: 'Mariachi de Gala', desc: 'Trompetas vivas, guitarrón y la bravura del mariachi de concierto.' },
  { id: 'bolero', label: 'Bolero Clásico', badge: 'Trío Romántico', desc: 'Guitarras íntimas y cadencia lenta para máxima emoción.' },
  { id: 'balada', label: 'Balada de Autor', badge: 'Piano & Acústica', desc: 'Producción melódica envolvente y foco absoluto en la poesía.' },
  { id: 'pop_acustico', label: 'Pop Acústico Moderno', badge: 'Voz & Guitarra', desc: 'Ritmo suave, fresco y contemporáneo para oídos jóvenes.' },
  { id: 'vals_matrimonial', label: 'Vals Matrimonial', badge: 'Sinfónico 3/4', desc: 'Compás tradicional de vals adaptado a orquestación moderna.' },
  { id: 'rumba_fiesta', label: 'Rumba & Fusión Festiva', badge: 'Celebración', desc: 'Ritmo alegre y desenfadado para celebrar bailando.' },
];

const TONOS: { id: EmotionalTone; label: string; desc: string }[] = [
  { id: 'lagrimas_emocion', label: '😭 Lágrimas de Emoción', desc: 'Directo al corazón. Diseñada para conmover desde el primer acorde.' },
  { id: 'intimo_profundo', label: '🕯️ Íntima y Reflexiva', desc: 'Poética, elegante y serena. Para escuchar en privado.' },
  { id: 'festivo_alegre', label: '🎉 Festiva y Llena de Vida', desc: 'Para corear en familia y convertir el momento en una fiesta.' },
  { id: 'epico_triunfal', label: '⚡ Épica e Inspiradora', desc: 'Crescendo orquestal para celebrar grandes logros y superaciones.' },
];

export default function EncargosStudioPage() {
  const [ocasion, setOcasion] = useState<OccasionCategory>('cumpleanos');
  const [genero, setGenero] = useState<MusicalGenre>('crossover_lirico');
  const [tono, setTono] = useState<EmotionalTone>('lagrimas_emocion');

  const [protagonista, setProtagonista] = useState('');
  const [quienRegala, setQuienRegala] = useState('');
  const [detalles, setDetalles] = useState('');

  const [videoUpsell, setVideoUpsell] = useState(true);
  const [expressUpsell, setExpressUpsell] = useState(false);
  const [karaokeUpsell, setKaraokeUpsell] = useState(false);

  const [loading, setLoading] = useState(false);

  const basePrice = 49;
  const totalPrice =
    basePrice +
    (videoUpsell ? 49 : 0) +
    (expressUpsell ? 29 : 0) +
    (karaokeUpsell ? 15 : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protagonista.trim() || !detalles.trim()) {
      alert('Por favor completa el nombre del homenajeado y los detalles de su historia.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout/digital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ocasion,
          genero,
          tono,
          protagonista,
          quienRegala,
          detalles,
          videoUpsell,
          expressUpsell,
          karaokeUpsell
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'No se pudo conectar con la pasarela.');
      }
    } catch {
      alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 py-16 px-4 md:px-8 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-4xl mx-auto space-y-10">

        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Estudio de Producción S-Class
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sans">
            Canciones de Autor <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Inmortales.</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Sin bases genéricas de sintetizador. Producción de estudio real con voz de tenor lírico y mezclas multipista para los momentos más determinantes de la vida.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-zinc-400 pt-2 font-mono">
            <span className="flex items-center gap-1.5"><Mic2 className="w-4 h-4 text-amber-400" /> Interpretación Solista de Élite</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> Entrega Masterizada en 48-72h</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Garantía de Propiedad Intelectual</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-[#0e0e12] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-10">

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Paso 1</span>
              <h2 className="text-sm md:text-base font-bold text-white">Selecciona el Motivo del Encargo</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OCASIONES.map(o => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => setOcasion(o.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all ${
                    ocasion === o.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm text-white">{o.label}</div>
                  <div className="text-xs text-zinc-400 mt-0.5 leading-snug">{o.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Paso 2</span>
              <h2 className="text-sm md:text-base font-bold text-white">Elige el Estilo y Orquestación</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {GENEROS.map(g => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setGenero(g.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all ${
                    genero === g.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div className="font-bold text-sm text-white">{g.label}</div>
                    <Music className={`w-4 h-4 shrink-0 ${genero === g.id ? 'text-amber-400' : 'text-zinc-600'}`} />
                  </div>
                  <span className="inline-block my-1 text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    {g.badge}
                  </span>
                  <div className="text-xs text-zinc-400 mt-1 leading-snug">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Paso 3</span>
              <h2 className="text-sm md:text-base font-bold text-white">Atmósfera y Tono Emocional</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TONOS.map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTono(t.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all ${
                    tono === t.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm text-white">{t.label}</div>
                  <div className="text-xs text-zinc-400 mt-0.5 leading-snug">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Paso 4</span>
              <h2 className="text-sm md:text-base font-bold text-white">Los Protagonistas y su Historia</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300">¿Para quién es la canción? *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Mi madre Elena / Mis abuelos Carmen y Manuel"
                  value={protagonista}
                  onChange={e => setProtagonista(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-amber-500 outline-none text-white placeholder-zinc-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300">¿De parte de quién? (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. De sus hijos / De toda la familia"
                  value={quienRegala}
                  onChange={e => setQuienRegala(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-amber-500 outline-none text-white placeholder-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono text-zinc-300">Detalles clave de la historia *</label>
                <span className="text-[11px] text-amber-400/80 font-mono">Guía para el compositor</span>
              </div>
              <textarea
                required
                rows={4}
                placeholder="Incluye anécdotas concretas: lugares significativos, años compartidos, apodos cariñosos, dificultades superadas o esa frase que siempre se repite en casa..."
                value={detalles}
                onChange={e => setDetalles(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm focus:ring-1 focus:ring-amber-500 outline-none text-white placeholder-zinc-600 leading-relaxed resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Paso 5</span>
              <h2 className="text-sm md:text-base font-bold text-white">Servicios y Formatos Adicionales</h2>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => setVideoUpsell(!videoUpsell)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  videoUpsell ? 'bg-indigo-500/10 border-indigo-500/80' : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${videoUpsell ? 'bg-indigo-500 text-white' : 'bg-white/5 text-zinc-400'}`}>
                  <Video className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">Videoclip Cinemático con Fotografías Familiares</h3>
                    <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                      +49,00 €
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Sincronización de hasta 15 fotografías, letra animada en pantalla y master de vídeo Full HD listo para proyectar en el evento o enviar por WhatsApp.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setExpressUpsell(!expressUpsell)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  expressUpsell ? 'bg-amber-500/10 border-amber-500/80' : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${expressUpsell ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-400'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">Entrega Urgente Prioritaria (24 Horas)</h3>
                    <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                      +29,00 €
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Pase preferente en cabina de grabación y mezcla para encargos de última hora.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setKaraokeUpsell(!karaokeUpsell)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  karaokeUpsell ? 'bg-emerald-500/10 border-emerald-500/80' : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${karaokeUpsell ? 'bg-emerald-500 text-black' : 'bg-white/5 text-zinc-400'}`}>
                  <Disc3 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">Pista Instrumental Adicional (Karaoke HD)</h3>
                    <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      +15,00 €
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    La misma base musical masterizada sin la voz solista para que podáis cantar encima durante la fiesta o celebración.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-zinc-400 block uppercase">Inversión Final de Producción</span>
                <span className="text-xs text-zinc-500">Audio Master 24-bit + Letra PDF oficial incluida</span>
              </div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {totalPrice.toFixed(2)} €
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !protagonista.trim() || !detalles.trim()}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:opacity-95 text-black font-extrabold text-sm md:text-base py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Preparando Pasarela Segura...' : `Formalizar Encargo de Autor (${totalPrice.toFixed(2)} €)`}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-mono text-zinc-500 text-center">
              <span>🔒 Pasarela Cifrada AES-256</span>
              <span>��️ Interpretación Humana en Estudio</span>
              <span>⚡ Entrega Digital Privada</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
